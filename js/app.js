/* Логика прогулки: экраны, прогресс, геолокация, квест. */

(() => {
  const SAVE_KEY = 'walk-bauman-v1';

  const state = load();
  let pos = null, acc = null, gpsHeading = null, devHeading = null;
  let stopWatch = null, stopHeading = null, demoTimer = null, demoIdx = 0, demoFrac = 0;
  let currentPointId = null, autoOpened = {};

  function load() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); } catch (e) {}
    return Object.assign({ done: [], quiz: {}, name: '', radius: 0, autoOpen: true, demo: false }, s);
  }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- экраны ---------- */
  const screens = ['map', 'story', 'ar', 'list', 'badges', 'settings'];
  function show(name) {
    screens.forEach(s => document.getElementById('screen-' + s).classList.toggle('is-active', s === name));
    if (name === 'map') WalkMap.invalidate();
  }

  function toast(text, ms) {
    const t = document.getElementById('toast');
    t.textContent = text; t.hidden = false;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.hidden = true; }, ms || 2600);
  }

  /* ---------- звук и вибрация ---------- */
  let audioCtx = null;
  function chime(good) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = good ? [523, 659, 784] : [392, 330];
      notes.forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime + i * 0.11);
        g.gain.exponentialRampToValueAtTime(0.22, audioCtx.currentTime + i * 0.11 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.11 + 0.34);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + i * 0.11); o.stop(audioCtx.currentTime + i * 0.11 + 0.36);
      });
    } catch (e) {}
    if (navigator.vibrate) navigator.vibrate(good ? [40, 60, 40] : 60);
  }

  /* ---------- прогресс ---------- */
  const isDone = id => state.done.indexOf(id) >= 0;
  function nextPoint() { return POINTS.find(p => !isDone(p.id)) || POINTS[POINTS.length - 1]; }
  function markDone(id) {
    if (isDone(id)) return false;
    state.done.push(id); save(); refreshProgress(); return true;
  }
  function refreshProgress() {
    const n = state.done.length, total = POINTS.length;
    document.getElementById('progress-text').textContent = `${n} из ${total} точек`;
    document.getElementById('progress-bar').style.width = (n / total * 100) + '%';
    WalkMap.setStates(state.done, nextPoint().id);
  }

  /* ---------- нижняя карточка ---------- */
  const sheet = document.getElementById('sheet');
  const elName = document.getElementById('next-name');
  const elDist = document.getElementById('next-dist');
  const elHot  = document.getElementById('hotcold');
  const elOpen = document.getElementById('btn-open');
  const compass = document.getElementById('compass');
  const needle = compass.querySelector('.compass__needle');

  function radiusFor(p) { return state.radius > 0 ? state.radius : p.radius; }

  function updateSheet() {
    const p = nextPoint();
    elName.textContent = p.name;

    if (!pos) {
      elDist.textContent = 'Ищу спутники…';
      elHot.textContent = 'Включи геолокацию — и в путь';
      elHot.className = 'hotcold';
      elOpen.disabled = false;
      elOpen.textContent = 'Открыть точку';
      compass.classList.add('is-off');
      return;
    }

    const d = Geo.distance(pos, p.coords);
    const near = d <= radiusFor(p);
    elDist.textContent = near ? 'Ты на месте' : Geo.formatDistance(d) + ' до цели';

    const head = devHeading !== null ? devHeading : gpsHeading;
    if (head !== null) {
      compass.classList.remove('is-off');
      const rot = Geo.bearing(pos, p.coords) - head - 90;
      needle.style.transform = `rotate(${rot}deg)`;
    } else {
      compass.classList.add('is-off');
      needle.style.transform = 'rotate(-90deg)';
    }

    if (near) { elHot.textContent = '🔥 Пришли! Открывай историю'; elHot.className = 'hotcold is-hot'; }
    else if (d < 150) { elHot.textContent = '☀️ Уже тепло, совсем рядом'; elHot.className = 'hotcold is-warm'; }
    else if (d < 400) { elHot.textContent = '🙂 Идём в правильную сторону'; elHot.className = 'hotcold'; }
    else { elHot.textContent = '🧭 Держись фиолетовой линии'; elHot.className = 'hotcold'; }

    elOpen.textContent = near ? 'Мы на месте!' : 'Открыть заранее';

    if (near && state.autoOpen && !autoOpened[p.id] && !isDone(p.id)) {
      autoOpened[p.id] = true;
      chime(true);
      toast('Точка открылась: ' + p.name);
      openStory(p.id);
    }
  }

  /* ---------- история ---------- */
  function openStory(id) {
    const p = POINTS.find(x => x.id === id);
    if (!p) return;
    currentPointId = id;
    stopSpeech();

    document.getElementById('story-title').textContent = p.name;
    document.getElementById('story-sub').textContent = p.subtitle;

    const body = document.getElementById('story-body');
    const quizAnswered = state.quiz[p.id];
    body.innerHTML = `
      <div class="story__look"><b>Найди глазами</b>${p.look}</div>
      ${p.story.map(t => `<p>${t}</p>`).join('')}
      <div class="story__fact"><b>А ещё</b>${p.fact}</div>
      ${p.ar ? `<button class="btn btn--ar btn--wide" id="story-ar">📱 Включить дополненную реальность</button>` : ''}
      <div class="quiz">
        <h3>${p.quiz.q}</h3>
        <div id="quiz-opts">
          ${p.quiz.options.map((o, i) => `<button class="quiz__opt" data-i="${i}">${o}</button>`).join('')}
        </div>
        <div class="quiz__result" id="quiz-result"></div>
      </div>
      <button class="btn btn--primary btn--wide story__done" id="story-next">
        ${isDone(p.id) ? 'Назад к карте' : 'Готово, идём дальше'}
      </button>
    `;
    body.scrollTop = 0;

    if (quizAnswered) revealQuiz(p, quizAnswered.choice);

    body.querySelectorAll('.quiz__opt').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.quiz[p.id]) return;
        const i = +btn.dataset.i;
        const right = i === p.quiz.answer;
        state.quiz[p.id] = { choice: i, right }; save();
        revealQuiz(p, i);
        chime(right);
      });
    });

    const arBtn = document.getElementById('story-ar');
    if (arBtn) arBtn.addEventListener('click', () => AR.open(p, pos, () => show('story')));

    document.getElementById('story-next').addEventListener('click', () => {
      const isNew = markDone(p.id);
      show('map');
      if (isNew) {
        chime(true);
        toast(`Значок получен: ${p.badge.emoji} ${p.badge.title}`);
        if (state.done.length === POINTS.length) setTimeout(openBadges, 900);
      }
      updateSheet();
    });

    show('story');
  }

  function revealQuiz(p, choice) {
    const opts = document.querySelectorAll('#quiz-opts .quiz__opt');
    opts.forEach((b, i) => {
      if (i === p.quiz.answer) b.classList.add('is-right');
      else if (i === choice) b.classList.add('is-wrong');
    });
    const right = choice === p.quiz.answer;
    const res = document.getElementById('quiz-result');
    res.textContent = right ? p.quiz.ok : p.quiz.no;
    res.style.color = right ? '#2f8f5b' : '#c44c2a';
  }

  /* ---------- чтение вслух ---------- */
  let speaking = false;
  function stopSpeech() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    speaking = false;
    document.getElementById('btn-speak').textContent = '🔊';
  }
  function toggleSpeech() {
    if (!window.speechSynthesis) { toast('Браузер не умеет читать вслух'); return; }
    if (speaking) { stopSpeech(); return; }
    const p = POINTS.find(x => x.id === currentPointId);
    if (!p) return;
    const text = [p.look].concat(p.story).concat(['А ещё. ' + p.fact]).join(' ');
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU'; u.rate = 0.95; u.pitch = 1.05;
    u.onend = stopSpeech;
    speechSynthesis.speak(u);
    speaking = true;
    document.getElementById('btn-speak').textContent = '⏸';
  }

  /* ---------- список точек ---------- */
  function openList() {
    const body = document.getElementById('list-body');
    body.innerHTML = POINTS.map((p, i) => `
      <div class="item ${isDone(p.id) ? 'is-done' : ''}" data-id="${p.id}">
        <div class="item__num">${isDone(p.id) ? '✓' : i + 1}</div>
        <div class="item__txt"><b>${p.name}</b><span>${p.subtitle}</span></div>
      </div>`).join('');
    body.querySelectorAll('.item').forEach(el =>
      el.addEventListener('click', () => openStory(el.dataset.id)));
    show('list');
  }

  /* ---------- значки ---------- */
  function openBadges() {
    const body = document.getElementById('badges-body');
    body.innerHTML = POINTS.map(p => `
      <div class="badge ${isDone(p.id) ? 'is-on' : ''}">
        <span class="badge__emoji">${p.badge.emoji}</span>
        <span class="badge__title">${isDone(p.id) ? p.badge.title : '. . .'}</span>
      </div>`).join('');
    document.getElementById('badges-count').textContent = `${state.done.length} из ${POINTS.length}`;

    const dip = document.getElementById('diploma');
    const all = state.done.length === POINTS.length;
    dip.hidden = !all;
    if (all) {
      const rights = Object.values(state.quiz).filter(q => q.right).length;
      dip.innerHTML = `
        <h2>Маршрут пройден!</h2>
        <p><b>${state.name || 'Юный москвовед'}</b></p>
        <p>прошёл прогулку от проспекта Мира до сада имени Баумана,<br>
        собрал ${POINTS.length} значков и ответил правильно на ${rights} вопросов из ${POINTS.length}.</p>
        <p>🏅 Звание: знаток исчезнувшей Москвы</p>`;
    }
    show('badges');
  }

  /* ---------- настройки ---------- */
  function openSettings() {
    const body = document.getElementById('settings-body');
    body.innerHTML = `
      <div class="set">
        <h3>Имя для диплома</h3>
        <p>Напиши имя — оно появится на дипломе в конце.</p>
        <input type="text" id="set-name" placeholder="Например, Матвей" value="${state.name.replace(/"/g, '&quot;')}">
      </div>
      <div class="set">
        <h3>Как близко подходить</h3>
        <p>На каком расстоянии точка открывается сама. 0 — как задумано для каждой точки (60–90 м).</p>
        <input type="number" id="set-radius" min="0" max="300" step="10" value="${state.radius}">
      </div>
      <div class="set">
        <h3>Открывать истории самому</h3>
        <label class="switch"><input type="checkbox" id="set-auto" ${state.autoOpen ? 'checked' : ''}> Да, открывать при подходе</label>
      </div>
      <div class="set">
        <h3>Тренировка дома</h3>
        <p>Точка сама поедет по маршруту, чтобы проверить всё до прогулки.</p>
        <div class="row">
          <button class="btn" id="set-demo">${state.demo ? 'Остановить' : 'Запустить'}</button>
          <button class="btn" id="set-demo-reset">В начало</button>
        </div>
      </div>
      <div class="set">
        <h3>Калибровка точек</h3>
        <p>Если метка стоит не на том доме — включи и перетащи её. Новые координаты появятся ниже и в консоли браузера.</p>
        <label class="switch"><input type="checkbox" id="set-calib"> Разрешить перетаскивать метки</label>
        <pre id="calib-out" style="white-space:pre-wrap;font-size:12px;color:#4a5876;margin-top:10px"></pre>
      </div>
      <div class="set">
        <h3>Сбросить прогресс</h3>
        <p>Все значки и ответы исчезнут, маршрут начнётся заново.</p>
        <button class="btn" id="set-reset">Начать заново</button>
      </div>`;

    document.getElementById('set-name').addEventListener('input', e => { state.name = e.target.value; save(); });
    document.getElementById('set-radius').addEventListener('change', e => { state.radius = +e.target.value || 0; save(); updateSheet(); });
    document.getElementById('set-auto').addEventListener('change', e => { state.autoOpen = e.target.checked; save(); });
    document.getElementById('set-demo').addEventListener('click', e => {
      state.demo ? stopDemo() : startDemo();
      e.target.textContent = state.demo ? 'Остановить' : 'Запустить';
      show('map');
    });
    document.getElementById('set-demo-reset').addEventListener('click', () => { demoIdx = 0; demoFrac = 0; toast('Тренировка — с начала маршрута'); });
    document.getElementById('set-calib').addEventListener('change', e => {
      WalkMap.setCalibration(e.target.checked);
      toast(e.target.checked ? 'Метки можно двигать на карте' : 'Метки закреплены');
    });
    document.getElementById('set-reset').addEventListener('click', () => {
      state.done = []; state.quiz = {}; autoOpened = {}; save(); refreshProgress(); updateSheet();
      toast('Прогресс сброшен');
    });
    show('settings');
  }

  /* ---------- тренировочный режим ---------- */
  function startDemo() {
    state.demo = true; save();
    clearInterval(demoTimer);
    demoTimer = setInterval(() => {
      const a = ROUTE_PATH[demoIdx], b = ROUTE_PATH[Math.min(demoIdx + 1, ROUTE_PATH.length - 1)];
      demoFrac += 0.08;
      if (demoFrac >= 1) { demoFrac = 0; demoIdx = Math.min(demoIdx + 1, ROUTE_PATH.length - 1); }
      const p = [a[0] + (b[0] - a[0]) * demoFrac, a[1] + (b[1] - a[1]) * demoFrac];
      gpsHeading = Geo.bearing(a, b);
      handlePosition({ coords: p, accuracy: 8, heading: gpsHeading });
    }, 400);
    toast('Тренировка пошла: точка едет по маршруту');
  }
  function stopDemo() {
    state.demo = false; save();
    clearInterval(demoTimer); demoTimer = null;
    toast('Тренировка остановлена');
  }

  /* ---------- геолокация ---------- */
  function handlePosition(p) {
    pos = p.coords; acc = p.accuracy;
    if (p.heading !== null && p.heading !== undefined) gpsHeading = p.heading;
    WalkMap.showMe(pos, acc);
    WalkMap.traceDone(pos);
    if (AR.isActive()) AR.setPosition(pos);
    const hint = document.getElementById('gps-hint');
    if (acc > 60) {
      hint.hidden = false;
      hint.textContent = `Сигнал слабый (точность ±${Math.round(acc)} м). Выйди из-под арки или открой небо — или жми «Открыть заранее».`;
    } else hint.hidden = true;
    updateSheet();
  }

  function startGeo() {
    if (stopWatch) stopWatch();
    stopWatch = Geo.watch(handlePosition, err => {
      const hint = document.getElementById('gps-hint');
      hint.hidden = false;
      hint.textContent = 'Геолокация недоступна: ' + (err.message || 'браузер не разрешил') +
        '. Точки можно открывать вручную кнопкой «Открыть заранее».';
      updateSheet();
    });
  }

  /* ---------- запуск ---------- */
  function init() {
    AR.init();
    WalkMap.init({
      onPick: id => openStory(id),
      onMoved: () => {
        const out = document.getElementById('calib-out');
        if (out) out.textContent = WalkMap.exportCoords();
      }
    });
    refreshProgress();
    updateSheet();
    startGeo();

    document.getElementById('btn-menu').addEventListener('click', openSettings);
    document.getElementById('btn-badges').addEventListener('click', openBadges);
    document.getElementById('btn-list').addEventListener('click', openList);
    document.getElementById('btn-locate').addEventListener('click', () => {
      if (pos) WalkMap.follow(pos, 17);
      else toast('Пока не вижу, где мы. Проверь геолокацию');
    });
    document.getElementById('btn-fit').addEventListener('click', () => WalkMap.fitRoute());
    document.getElementById('btn-open').addEventListener('click', () => openStory(nextPoint().id));
    document.getElementById('story-back').addEventListener('click', () => { stopSpeech(); show('map'); });
    document.getElementById('btn-speak').addEventListener('click', toggleSpeech);
    document.getElementById('list-back').addEventListener('click', () => show('map'));
    document.getElementById('badges-back').addEventListener('click', () => show('map'));
    document.getElementById('settings-back').addEventListener('click', () => show('map'));

    document.getElementById('sheet-grip').addEventListener('click', () => sheet.classList.toggle('is-collapsed'));
    compass.addEventListener('click', async () => {
      const ok = await Geo.requestOrientationPermission();
      if (!ok) { toast('Компас не разрешили'); return; }
      if (stopHeading) stopHeading();
      stopHeading = Geo.watchHeading(h => { devHeading = h; updateSheet(); });
      toast('Компас включён: стрелка показывает на точку');
    });

    if (state.demo) startDemo();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // первое знакомство
    if (!state.done.length && !localStorage.getItem(SAVE_KEY + '-hello')) {
      localStorage.setItem(SAVE_KEY + '-hello', '1');
      setTimeout(() => toast('Нажми на компас, чтобы включить стрелку на точку', 4200), 900);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
