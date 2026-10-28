/* Движок экскурсии: ленточка остановок, карточка текущей остановки с озвучкой,
   задания с отметками. Используют kitay.html и gtg.html.

     Tour({ key, items, prefix: 'kit', kind: 'walk' | 'art', summary: fn })
*/
function Tour(cfg) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
  const STOP = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>';
  const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '';
  const items = cfg.items;
  // камера работает только на GitHub Pages
  const AR = /github\.io$/.test(location.hostname) ? 'ar.html' : 'https://crucian1812-a11y.github.io/MAP/holiday/ar.html';

  let S = { at: 0, done: {}, fav: null };
  try { Object.assign(S, JSON.parse(localStorage.getItem(cfg.key) || '{}')); } catch (e) {}
  if (!items[S.at]) S.at = 0;
  const save = () => { try { localStorage.setItem(cfg.key, JSON.stringify(S)); } catch (e) {} };

  let TRACKS = new Set();
  const audio = new Audio();
  const track = it => `${cfg.prefix}-${it.id}`;
  const src = it => {
    const p = `audio/kvest/${track(it)}.mp3`;
    return typeof Offline !== 'undefined' ? Offline.srcSync(p) : p;
  };

  function chips() {
    document.getElementById('chips').innerHTML = items.map((it, i) =>
      `<button data-go="${i}" aria-current="${i === S.at}" class="${S.done[it.id] ? 'done' : ''}">${it.n}. ${esc(it.title.split(':')[0])}</button>`).join('');
  }

  function card() {
    const it = items[S.at], i = S.at;
    const has = TRACKS.has(track(it));
    const meta = cfg.kind === 'art' ? `${esc(it.artist)} · ${esc(it.year)}` : esc(it.where);
    const cam = it.cam ? `<a class="btn fill" href="${AR}#${it.cam}"${AR === 'ar.html' ? '' : ' target="_blank" rel="noopener"'}>Волшебная камера ▸</a>` : '';
    const map = cfg.kind === 'walk'
      ? `<div class="links">${cam}<a class="btn" href="https://yandex.ru/maps/?pt=${it.lon},${it.lat}&z=17&l=map" target="_blank" rel="noopener">Точка на карте</a></div>` : '';
    const tags = it.tags ? `<div class="tags">${it.tags.map(t => `<span class="${/площадк/.test(t) ? 'kid' : ''}">${esc(t)}</span>`).join('')}</div>` : '';
    const look = it.look || it.see;
    document.getElementById('stop').innerHTML = `
      <div class="head"><div class="num">${it.n}</div><div><h2>${esc(it.title)}</h2><div class="meta">${meta}</div></div></div>
      ${tags}${map}
      ${has ? `<div class="player"><button class="play" id="play" aria-label="Слушать рассказ">${PLAY}</button>
        <div class="bar"><i id="bar"></i></div><small id="time">слушать</small></div>` : ''}
      <p class="say">${esc(it.say)}</p>
      <div class="sec"><h3>${cfg.kind === 'art' ? 'Найди на картине' : 'Найди глазами'}</h3><ul>${look.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>
      ${it.trick ? `<div class="sec"><h3>Как это сделано</h3><p>${esc(it.trick)}</p></div>` : ''}
      ${it.talk ? `<div class="sec talk"><h3>Поговорите</h3><p>${esc(it.talk)}</p></div>` : ''}
      <div class="task"><label for="task-${it.id}"><input type="checkbox" id="task-${it.id}" data-task="${it.id}" ${S.done[it.id] ? 'checked' : ''}>
        <span>${esc(it.task.q)}</span></label>
        <details><summary>Ответ для папы</summary>${esc(it.task.a)}</details></div>
      ${cfg.kind === 'art' ? `<div class="fav"><button class="btn" data-fav="${it.id}" aria-pressed="${S.fav === it.id}">${S.fav === it.id ? '★ Моя любимая картина' : '☆ Сделать любимой'}</button></div>` : ''}
      <div class="nav">
        <button class="btn" data-go="${Math.max(0, i - 1)}" ${i === 0 ? 'disabled' : ''}>← Назад</button>
        ${i < items.length - 1
          ? `<button class="btn fill" data-go="${i + 1}">Дальше: ${esc(items[i + 1].title.split(':')[0])} →</button>`
          : `<a class="btn fill" href="#summary">Итог →</a>`}
      </div>`;
    chips();
    if (cfg.summary) cfg.summary(S, items);
    paint();
  }

  function go(i) {
    audio.pause();
    S.at = i; save(); card();
    document.getElementById('stop').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function paint() {
    const btn = document.getElementById('play'); if (!btn) return;
    const mine = audio.dataset.id === items[S.at].id, on = mine && !audio.paused;
    btn.innerHTML = on ? STOP : PLAY; btn.setAttribute('aria-label', on ? 'Пауза' : 'Слушать рассказ');
    if (mine && audio.duration) {
      document.getElementById('bar').style.width = (100 * audio.currentTime / audio.duration) + '%';
      document.getElementById('time').textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    }
  }
  ['play', 'pause', 'timeupdate', 'ended', 'loadedmetadata'].forEach(ev => audio.addEventListener(ev, paint));

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g && !g.disabled) { go(+g.dataset.go); return; }
    if (e.target.closest('#play')) {
      const it = items[S.at];
      if (!audio.paused && audio.dataset.id === it.id) { audio.pause(); return; }
      if (audio.dataset.id !== it.id) { audio.src = src(it); audio.dataset.id = it.id; }
      audio.play().catch(() => {});
      return;
    }
    const f = e.target.closest('[data-fav]');
    if (f) { S.fav = S.fav === f.dataset.fav ? null : f.dataset.fav; save(); card(); }
  });
  document.addEventListener('change', e => {
    const id = e.target.dataset && e.target.dataset.task;
    if (!id) return;
    if (e.target.checked) S.done[id] = true; else delete S.done[id];
    save(); chips(); if (cfg.summary) cfg.summary(S, items);
  });

  card();
  fetch('audio/kvest/manifest.json', { cache: 'no-cache' })
    .then(r => r.ok ? r.json() : null)
    .then(m => { if (m && Array.isArray(m.tracks)) { TRACKS = new Set(m.tracks); card(); } })
    .catch(() => {});
  if (typeof Offline !== 'undefined') Offline.ready.then(n => { if (n) card(); });
}
