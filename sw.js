/* Кэш приложения: после первого захода сайт открывается и без сети.
   Тайлы карты не кэшируются — их слишком много, интернет на прогулке всё же нужен. */
const CACHE = 'walk-bauman-v2';
const FILES = [
  './', './index.html', './ar.html',
  './css/style.css', './css/ar.css',
  './js/data.js', './js/geo.js', './js/map.js', './js/app.js',
  './js/ar-particles.js', './js/ar-scenes.js', './js/ar-engine.js',
  './manifest.webmanifest', './icons/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.hostname.indexOf('tile.openstreetmap') >= 0) return;   // тайлы — мимо кэша
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (url.origin === location.origin && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
