/* Движок сцен: камера, слои с параллаксом, частицы, титры и звук.
   Геолокация тут не нужна — сцена запускается кнопкой и играет сама. */

const Stage = (() => {

  let el = {}, scene = null, stream = null;
  let stopBack = null, stopFront = null, timers = [], stopTilt = null;
  let soundOn = localStorage.getItem('ar-sound') !== 'off';

  /* ---------------- звук ---------------- */
  const Sound = (() => {
    let ctx = null;
    const ac = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());

    function env(node, t0, a, d, peak) {
      const g = ac().createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
      node.connect(g); g.connect(ac().destination);
      return g;
    }
    function tone(freq, t0, dur, type, peak) {
      const o = ac().createOscillator();
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
      env(o, t0, 0.02, dur, peak || 0.16);
      o.start(t0); o.stop(t0 + dur + 0.1);
      return o;
    }
    function noise(t0, dur, filterHz, peak, q) {
      const a = ac(), len = Math.ceil(a.sampleRate * dur);
      const buf = a.createBuffer(1, len, a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = a.createBufferSource(); src.buffer = buf;
      const f = a.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = filterHz; f.Q.value = q || 1;
      src.connect(f);
      env(f, t0, 0.03, dur, peak || 0.12);
      src.start(t0);
      return src;
    }

    const LIB = {
      bells(t) {                       // колокол с обертонами
        [1, 2.01, 2.98, 4.2].forEach((m, i) =>
          tone(196 * m, t, 3.4 - i * 0.5, 'sine', 0.12 / (i + 1)));
      },
      chime(t) { [784, 988, 1319].forEach((f, i) => tone(f, t + i * 0.09, 1.1, 'sine', 0.1)); },
      fanfare(t) {
        [[523, 0], [659, .18], [784, .36], [1047, .54], [784, .86], [1047, 1.02]]
          .forEach(([f, dt]) => { tone(f, t + dt, .5, 'triangle', .13); tone(f * 2, t + dt, .35, 'sine', .05); });
      },
      hooves(t) { for (let i = 0; i < 16; i++) noise(t + i * 0.17 + (i % 2 ? 0.05 : 0), .1, 220, .1, .8); },
      wind(t) { for (let i = 0; i < 6; i++) noise(t + i * 1.4, 2.4, 420 + i * 60, .05, .5); },
      rumble(t) {
        const o = ac().createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(28, t + 2.6);
        env(o, t, .3, 2.4, .22); o.start(t); o.stop(t + 3);
        noise(t, 2.2, 120, .1, .4);
      },
      crack(t) { noise(t, .5, 900, .16, 2); tone(120, t, .4, 'square', .07); },
      sparkle(t) { for (let i = 0; i < 10; i++) tone(1200 + Math.random() * 1600, t + i * .07, .3, 'sine', .05); },
      boom(t) {
        const o = ac().createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(40, t + .5);
        env(o, t, .01, .6, .3); o.start(t); o.stop(t + .8);
        noise(t + .01, .7, 300, .2, .3);
      },
      salute(t) { for (let i = 0; i < 6; i++) LIB.boom(t + i * 1.1 + Math.random() * .4); },
      grow(t) {
        const o = ac().createOscillator(); o.type = 'triangle';
        o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(660, t + 2.6);
        env(o, t, .4, 2.4, .09); o.start(t); o.stop(t + 3.2);
      },
      lift(t) { for (let i = 0; i < 8; i++) tone(330 + i * 40, t + i * .22, .2, 'square', .05); },
      steam(t) { noise(t, 1.6, 1400, .09, .7); }
    };

    return {
      play(name, delayMs) {
        if (!soundOn || !LIB[name]) return;
        try { LIB[name](ac().currentTime + (delayMs || 0) / 1000); } catch (e) {}
      },
      resume() { try { ac().resume(); } catch (e) {} }
    };
  })();

  /* ---------------- камера ---------------- */
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      el.cam.srcObject = stream;
      await el.cam.play().catch(() => {});
      el.stage.classList.remove('no-cam');
      return true;
    } catch (e) {
      el.stage.classList.add('no-cam');
      return false;
    }
  }
  function stopCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    el.cam.srcObject = null;
  }

  /* ---------------- наклон телефона: лёгкий параллакс ---------------- */
  function startTilt() {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const layers = () => el.layers.querySelectorAll('.layer');

    function onOrient(e) {
      if (typeof e.gamma === 'number') tx = Math.max(-28, Math.min(28, e.gamma)) / 28;
      if (typeof e.beta === 'number') ty = Math.max(-20, Math.min(20, e.beta - 90)) / 20;
    }
    function onMove(e) {
      tx = (e.clientX / window.innerWidth - .5) * 2;
      ty = (e.clientY / window.innerHeight - .5) * 2;
    }
    function frame() {
      raf = requestAnimationFrame(frame);
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      layers().forEach(l => {
        const d = +l.dataset.depth || 1;
        l.style.setProperty('--px', (-cx * 46 * d).toFixed(1) + 'px');
        l.style.setProperty('--py', (-cy * 26 * d).toFixed(1) + 'px');
      });
    }
    window.addEventListener('deviceorientation', onOrient, true);
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('deviceorientation', onOrient, true);
      window.removeEventListener('pointermove', onMove);
    };
  }

  async function askTilt() {
    const D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === 'function') {
      try { await D.requestPermission(); } catch (e) {}
    }
  }

  /* ---------------- сцена ---------------- */
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

  function render() {
    clearTimers();
    if (stopBack) stopBack();
    if (stopFront) stopFront();

    el.stage.dataset.scene = scene.id;
    el.layers.className = 'stage__layers layers';   // сбрасываем биты прошлой сцены
    el.layers.innerHTML = scene.layers.map(l =>
      `<div class="layer ${l.cls || ''}" data-depth="${l.depth}" style="z-index:${l.z || 1}">${l.html}</div>`
    ).join('');
    el.caption.innerHTML = '';
    el.tint.style.background = scene.tint || 'transparent';
    el.tint.style.opacity = scene.tint ? '1' : '0';

    void el.layers.offsetWidth;   // перезапуск CSS-анимаций

    stopBack = scene.fxBack ? Particles.start(el.fxBack, scene.fxBack) : null;
    stopFront = scene.fxFront ? Particles.start(el.fxFront, scene.fxFront) : null;

    (scene.beats || []).forEach(b => at(b.t, () => {
      el.layers.classList.add(b.cls);
      if (b.fxFront) { if (stopFront) stopFront(); stopFront = Particles.start(el.fxFront, b.fxFront); }
      if (b.fxBack) { if (stopBack) stopBack(); stopBack = Particles.start(el.fxBack, b.fxBack); }
      if (b.tint !== undefined) { el.tint.style.background = b.tint; el.tint.style.opacity = b.tint ? '1' : '0'; }
    }));

    (scene.captions || []).forEach(c => at(c.t, () => {
      const d = document.createElement('div');
      d.className = 'cap' + (c.big ? ' cap--big' : '');
      d.textContent = c.text;
      el.caption.appendChild(d);
      setTimeout(() => d.classList.add('is-out'), c.hold || 3200);
      setTimeout(() => d.remove(), (c.hold || 3200) + 900);
    }));

    (scene.sound || []).forEach(s => at(s.t, () => Sound.play(s.s)));
  }

  async function open(id) {
    scene = SCENES.find(s => s.id === id);
    if (!scene) return;
    location.hash = id;
    el.stage.hidden = false;
    document.body.classList.add('stage-open');
    el.title.textContent = scene.title;
    el.aim.innerHTML = `<b>Куда наводить камеру</b>${scene.aim}`;
    el.aim.classList.remove('is-hidden');

    Sound.resume();
    await askTilt();
    if (stopTilt) stopTilt();
    stopTilt = startTilt();
    await startCamera();
    render();
    at(5500, () => el.aim.classList.add('is-hidden'));   // после render, иначе таймер сотрётся
  }

  function close() {
    clearTimers();
    if (stopBack) { stopBack(); stopBack = null; }
    if (stopFront) { stopFront(); stopFront = null; }
    if (stopTilt) { stopTilt(); stopTilt = null; }
    stopCamera();
    el.layers.innerHTML = '';
    el.stage.hidden = true;
    document.body.classList.remove('stage-open');
    if (location.hash) history.replaceState(null, '', location.pathname);
    scene = null;
  }

  function init() {
    el = {
      stage: document.getElementById('stage'),
      cam: document.getElementById('cam'),
      tint: document.getElementById('tint'),
      fxBack: document.getElementById('fx-back'),
      fxFront: document.getElementById('fx-front'),
      layers: document.getElementById('layers'),
      caption: document.getElementById('stage-caption'),
      aim: document.getElementById('stage-aim'),
      title: document.getElementById('stage-title')
    };
    document.getElementById('stage-close').addEventListener('click', close);
    document.getElementById('stage-replay').addEventListener('click', () => { Sound.resume(); render(); });
    document.getElementById('stage-aim').addEventListener('click', e => e.currentTarget.classList.add('is-hidden'));

    const sb = document.getElementById('stage-sound');
    const paint = () => { sb.textContent = soundOn ? '🔊' : '🔇'; sb.classList.toggle('is-off', !soundOn); };
    sb.addEventListener('click', () => {
      soundOn = !soundOn;
      localStorage.setItem('ar-sound', soundOn ? 'on' : 'off');
      paint();
      if (soundOn) Sound.resume();
    });
    paint();

    window.addEventListener('keydown', e => { if (e.key === 'Escape' && !el.stage.hidden) close(); });
  }

  return { init, open, close, isOpen: () => !el.stage.hidden };
})();
