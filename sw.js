/* Кэш приложения: после первого захода сайт открывается и без сети.
   Тайлы карты не кэшируются — их слишком много, интернет на прогулке всё же нужен. */
const CACHE = 'walk-bauman-v9';
const FILES = [
  './', './index.html', './ar.html',
  './css/style.css', './css/ar.css',
  './js/data.js', './js/geo.js', './js/map.js', './js/app.js',
  './js/voice.js', './js/ar-particles.js', './js/ar-scenes.js', './js/ar-engine.js',
  './assets/bauman-haze.webp', './assets/bauman-thumb.webp', './assets/bauman.webp',
  './assets/narkomzem-haze.webp', './assets/narkomzem-scheme-haze.webp', './assets/narkomzem-scheme-thumb.webp',
  './assets/narkomzem-scheme.webp', './assets/narkomzem-thumb.webp', './assets/narkomzem.webp',
  './assets/ogorod-haze.webp', './assets/ogorod-thumb.webp', './assets/ogorod.webp',
  './assets/petropavel-haze.webp', './assets/petropavel-thumb.webp', './assets/petropavel.webp',
  './assets/sakharov-haze.webp', './assets/sakharov-thumb.webp', './assets/sakharov.webp',
  './assets/sheremetev-haze.webp', './assets/sheremetev-thumb.webp', './assets/sheremetev.webp',
  './assets/suharev-haze.webp', './assets/suharev-thumb.webp', './assets/suharev.webp',
  './assets/suharev2-haze.webp', './assets/suharev2-thumb.webp', './assets/suharev2.webp',
  './assets/ulan-haze.webp', './assets/ulan-thumb.webp', './assets/ulan.webp',
  './assets/vorota2-haze.webp', './assets/vorota2-thumb.webp', './assets/vorota2.webp',
  './assets/vysotka2-haze.webp', './assets/vysotka2-thumb.webp', './assets/vysotka2.webp',
  './manifest.webmanifest', './icons/icon.svg', './icons/icon-180.png'
];

/* Появляются со временем: локальный Leaflet кладёт один воркфлоу, озвучку — другой.
   Их отсутствие не должно ронять установку кэша. */
const OPTIONAL = [
  './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css',
  './audio/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES).then(() =>
        Promise.all(OPTIONAL.map(u => c.add(u).catch(() => {})))))
      .then(() => self.skipWaiting())
  );
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
