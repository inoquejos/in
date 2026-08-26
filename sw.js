/**
 * Service Worker — cacheia o "app shell" para o app funcionar 100% offline
 * depois da primeira visita, e permite instalação no celular.
 *
 * IMPORTANTE: ao adicionar/renomear arquivos estáticos, atualize APP_SHELL
 * abaixo e suba a versão do cache (CACHE_NAME) para forçar atualização.
 */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `cofres-shell-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/storage.js',
  './js/util.js',
  './js/vaults.js',
  './js/transactions.js',
  './js/reports.js',
  './js/charts.js',
  './js/ui.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached || caches.match('./index.html'));

      // cache-first: responde rápido do cache se existir, mas atualiza em segundo plano
      return cached || network;
    })
  );
});
