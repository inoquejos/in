#!/usr/bin/env node
/**
 * Gera os ícones do PWA (192x192, 512x512 e uma versão maskable 512x512)
 * sem depender de nenhuma lib externa (sem canvas/sharp/imagemagick).
 *
 * Desenha um "donut" com as 5 fatias dos cofres (mesmas cores usadas na UI)
 * sobre um fundo sólido, e escreve o PNG manualmente (IHDR/IDAT/IEND).
 *
 * Uso: node tools/generate-icons.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Mesma paleta usada em js/vaults.js — mantenha em sincronia.
const SLICES = [
  { percent: 50, color: [239, 108, 97] },  // Despesas
  { percent: 20, color: [76, 159, 112] },  // Investimentos
  { percent: 10, color: [201, 162, 39] },  // Dízimo
  { percent: 10, color: [74, 127, 193] },  // Responsabilidade Social
  { percent: 10, color: [139, 95, 191] },  // Fundo de Emergência
];

const BG = [11, 31, 58, 255]; // #0B1F3A

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function buildPNG(width, height, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = a;
    }
  }

  const idatData = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function mix(c1, c2, t) {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

// desenha o donut centralizado, com raio outer/inner relativos ao tamanho do canvas
function makeIconPixelFn(size, { safeZone = 0 } = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * (0.42 - safeZone);
  const innerR = outerR * 0.55;

  // pré-computa os ângulos acumulados das fatias (começando no topo, sentido horário)
  let acc = 0;
  const boundaries = SLICES.map((s) => {
    const start = acc;
    acc += (s.percent / 100) * 360;
    return { start, end: acc, color: s.color };
  });

  return (x, y) => {
    const dx = x + 0.5 - cx;
    const dy = y + 0.5 - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > outerR + 1) return BG;
    if (dist < innerR - 1) return BG;

    // anti-aliasing simples nas bordas do anel
    let alphaEdge = 1;
    if (dist > outerR - 1) alphaEdge = Math.max(0, outerR + 1 - dist) / 2;
    if (dist < innerR + 1) alphaEdge = Math.min(alphaEdge, Math.max(0, dist - (innerR - 1)) / 2);

    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = topo, horário
    if (angle < 0) angle += 360;

    const slice = boundaries.find((b) => angle >= b.start && angle < b.end) || boundaries[boundaries.length - 1];
    const rgb = mix(BG, slice.color, alphaEdge);
    return [rgb[0], rgb[1], rgb[2], 255];
  };
}

function writeIcon(file, size, opts) {
  const pixelFn = makeIconPixelFn(size, opts);
  const png = buildPNG(size, size, pixelFn);
  fs.writeFileSync(file, png);
  console.log('gerado', file, `${size}x${size}`);
}

const outDir = path.join(__dirname, '..', 'icons');
fs.mkdirSync(outDir, { recursive: true });

writeIcon(path.join(outDir, 'icon-192.png'), 192, {});
writeIcon(path.join(outDir, 'icon-512.png'), 512, {});
// maskable: android recorta ~10% das bordas, então deixamos uma margem de segurança maior
writeIcon(path.join(outDir, 'icon-maskable-512.png'), 512, { safeZone: 0.1 });
