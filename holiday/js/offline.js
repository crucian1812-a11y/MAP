/* Офлайн для экспедиции: одна кнопка складывает страницы, скрипты и всю озвучку
   в кэш браузера. Потом звук играет из кэша через blob-ссылки — так он работает
   и без сети, и на iPhone, которому не нравится звук, отданный сервис-воркером.
   Работает только на GitHub Pages: внутри Claude кэш браузера недоступен. */

const Offline = (() => {
  const CACHE = 'holiday-offline-v1';
  const host = location.hostname;
  const ok = 'caches' in window && (/github\.io$/.test(host) || host === 'localhost' || host === '127.0.0.1');

  const FILES = [
    './', 'kvest.html', 'b396.html', 'kitay.html', 'gtg.html', 'altufyevo.html', 'ar.html',
    'css/ar-holiday.css', 'css/tour.css',
    'js/offline.js', 'js/tour.js', 'js/ar-scenes.js', 'js/b396.js', 'js/kitay.js', 'js/gtg.js', 'js/altufyevo.js',
    '../css/ar.css', '../js/ar-engine.js', '../js/ar-particles.js', '../icons/icon.svg', '../sw.js',
    'audio/kvest/manifest.json', 'manifest.webmanifest', '../icons/icon-180.png', 'index.html'
  ];
  const abs = u => new URL(u, location.href).href;
  const blobs = new Map();

  /* Ссылка для <audio>: blob из кэша, если дорожка скачана, иначе обычный путь */
  const srcSync = path => blobs.get(abs(path)) || path;

  async function prime() {
    if (!ok) return 0;
    try {
      const c = await caches.open(CACHE);
      const keys = (await c.keys()).filter(r => /\.mp3$/.test(r.url) && !blobs.has(r.url));
      await Promise.all(keys.map(async r => {
        const res = await c.match(r);
        if (res) blobs.set(r.url, URL.createObjectURL(await res.blob()));
      }));
      return blobs.size;
    } catch (e) { return 0; }
  }

  async function list() {
    const m = await fetch('audio/kvest/manifest.json', { cache: 'no-cache' }).then(r => r.json());
    return FILES.concat((m.tracks || []).map(t => `audio/kvest/${t}.mp3`));
  }

  async function download(onStep) {
    const urls = await list();
    const c = await caches.open(CACHE);
    let done = 0, fail = 0, i = 0;
    async function worker() {
      while (i < urls.length) {
        const u = abs(urls[i++]);
        try {
          const r = await fetch(u, { cache: 'no-cache' });
          if (r.ok) await c.put(u, r); else fail++;
        } catch (e) { fail++; }
        done++;
        if (onStep) onStep(done, urls.length, fail);
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);
    await prime();
    try { localStorage.setItem('holiday-offline-at', new Date().toISOString()); } catch (e) {}
    return { total: urls.length, fail };
  }

  async function count() {
    if (!ok) return 0;
    try { return (await (await caches.open(CACHE)).keys()).length; } catch (e) { return 0; }
  }

  function register() {
    if (ok && 'serviceWorker' in navigator && /github\.io$/.test(host)) {
      navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
    }
  }

  /* Плашка с кнопкой: вставляется в любой элемент страницы */
  function widget(el) {
    if (!el) return;
    if (!ok) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `<button type="button" class="off-btn">Скачать звук и страницы на телефон</button>
      <span class="off-note">Около 9 МБ. Нужно сделать один раз, пока есть интернет.</span>`;
    const btn = el.querySelector('.off-btn'), note = el.querySelector('.off-note');
    const paint = async () => {
      const n = await count();
      let at = '';
      try { at = localStorage.getItem('holiday-offline-at') || ''; } catch (e) {}
      if (n > 20) {
        note.textContent = `Скачано: ${n} файлов${at ? ', ' + new Date(at).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''}. Звук работает без интернета.`;
        btn.textContent = 'Обновить скачанное';
      }
    };
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        const r = await download((d, t) => { btn.textContent = `Скачиваю… ${d} из ${t}`; });
        btn.textContent = r.fail ? `Готово, но ${r.fail} не скачалось — повтори` : 'Готово! Можно без интернета';
      } catch (e) {
        btn.textContent = 'Не получилось — проверь интернет и нажми ещё раз';
      }
      btn.disabled = false;
      paint();
    });
    paint();
  }

  register();
  const ready = prime();
  return { ok, srcSync, prime, ready, download, count, widget };
})();
