// Deterministic gradient "poster art" palette used in place of external image
// assets — keeps the app fast, offline-friendly, and licensing-free while
// still giving every title a distinct, cinematic identity.

export interface PaletteDef {
  id: string;
  from: string;
  via: string;
  to: string;
  glow: string;
}

export const PALETTES: Record<string, PaletteDef> = {
  crimson: { id: "crimson", from: "#3a0308", via: "#7a0c14", to: "#1a0102", glow: "#e50914" },
  midnight: { id: "midnight", from: "#050a1f", via: "#132a54", to: "#01030a", glow: "#3b82f6" },
  violet: { id: "violet", from: "#1c0630", via: "#5b1a8c", to: "#0a0212", glow: "#a855f7" },
  emerald: { id: "emerald", from: "#02170f", via: "#0b5c3c", to: "#010b07", glow: "#22c55e" },
  amber: { id: "amber", from: "#2a1502", via: "#8a4c05", to: "#160a01", glow: "#f59e0b" },
  teal: { id: "teal", from: "#021a1c", via: "#0a5e63", to: "#010c0d", glow: "#2dd4bf" },
  rose: { id: "rose", from: "#2a0416", via: "#8c1552", to: "#12010a", glow: "#fb7185" },
  slate: { id: "slate", from: "#0c0e14", via: "#2b3348", to: "#05060a", glow: "#94a3b8" },
  copper: { id: "copper", from: "#2a0d02", via: "#8a3a12", to: "#160601", glow: "#fb923c" },
  indigo: { id: "indigo", from: "#0a0630", via: "#2f1c8c", to: "#040212", glow: "#818cf8" },
};

const PALETTE_KEYS = Object.keys(PALETTES);

export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function paletteFor(key: string): PaletteDef {
  const idx = hashString(key) % PALETTE_KEYS.length;
  return PALETTES[PALETTE_KEYS[idx]];
}

export function gradientCss(p: PaletteDef, angle = 145): string {
  return `linear-gradient(${angle}deg, ${p.from} 0%, ${p.via} 55%, ${p.to} 100%)`;
}
