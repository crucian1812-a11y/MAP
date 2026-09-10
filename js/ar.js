/* Дополненная реальность: картинка поверх камеры, привязанная к сторонам света.
   Компас говорит, куда смотрит телефон; мы считаем азимут на объект и сдвигаем
   картинку по экрану так, будто она стоит на своём месте. */

const AR = (() => {
  const FOV = 62;          // примерный угол обзора камеры телефона по горизонтали
  const EDGE = FOV / 2 + 8;

  let screenEl, videoEl, stageEl, tipEl, hintEl, hintArrow, hintText;
  let stream = null, stopHeading = null, objEl = null;
  let target = null, myPos = null, heading = null, pitch = 90;
  let active = false, raf = 0, onExit = null;

  function init() {
    screenEl  = document.getElementById('screen-ar');
    videoEl   = document.getElementById('ar-video');
    stageEl   = document.getElementById('ar-stage');
    tipEl     = document.getElementById('ar-tip');
    hintEl    = document.getElementById('ar-hint');
    hintArrow = document.getElementById('ar-hint-arrow');
    hintText  = document.getElementById('ar-hint-text');
    document.getElementById('ar-close').addEventListener('click', () => close());
  }

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
        audio: false
      });
      videoEl.srcObject = stream;
      await videoEl.play().catch(() => {});
      return true;
    } catch (e) {
      videoEl.style.background = 'linear-gradient(180deg,#20304f 0%,#41597f 55%,#6b7f5a 100%)';
      return false;
    }
  }

  function stopCamera() {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    videoEl.srcObject = null;
  }

  /* point — точка маршрута, pos — где мы сейчас (может быть null) */
  async function open(point, pos, exitCb) {
    if (!Scenes.has(point.ar)) return;
    target = point; myPos = pos; onExit = exitCb || null;
    heading = null; pitch = 90;

    screenEl.classList.add('is-active');
    active = true;

    const cam = await startCamera();
    const compassOk = await Geo.requestOrientationPermission();

    stageEl.innerHTML = '';
    objEl = Scenes.build(point.ar);
    stageEl.appendChild(objEl);

    tipEl.textContent = cam
      ? (compassOk ? Scenes.tip(point.ar) : 'Компас не отвечает — показываю прямо перед тобой')
      : 'Камера недоступна, но картинку покажу';

    if (compassOk) {
      stopHeading = Geo.watchHeading((h, e) => {
        heading = h;
        if (typeof e.beta === 'number') pitch = e.beta;
      });
    }
    loop();
  }

  function setPosition(pos) { myPos = pos; }

  function loop() {
    if (!active) return;
    raf = requestAnimationFrame(loop);
    if (!objEl) return;

    const W = window.innerWidth, H = window.innerHeight;
    const pxPerDeg = W / FOV;

    let dx = 0, scale = 1, visible = true, delta = 0;

    if (heading !== null && myPos && target) {
      const dist = Geo.distance(myPos, target.coords);
      const brg = Geo.bearing(myPos, target.coords);
      delta = Geo.angleDiff(brg, heading);
      dx = delta * pxPerDeg;
      visible = Math.abs(delta) < EDGE;
      // чем ближе объект, тем крупнее; но не даём ему стать гигантским
      scale = Math.max(0.55, Math.min(1.7, 70 / Math.max(dist, 12)));
    } else {
      // без компаса — просто держим объект перед носом
      dx = 0; visible = true; scale = 1;
    }

    // вертикаль: наклон телефона. 90° — держим прямо перед собой
    const dy = (pitch - 90) * (H / 90) * 0.6;

    objEl.style.transform =
      `translate(-50%,-50%) translate(${dx.toFixed(1)}px, ${(dy + H * 0.12).toFixed(1)}px) scale(${scale.toFixed(2)})`;
    objEl.style.opacity = visible ? '1' : '0';

    if (heading !== null && !visible) {
      hintEl.hidden = false;
      hintArrow.textContent = delta < 0 ? '←' : '→';
      hintText.textContent = delta < 0 ? 'Поверни телефон левее' : 'Поверни телефон правее';
    } else {
      hintEl.hidden = true;
    }
  }

  function close() {
    active = false;
    cancelAnimationFrame(raf);
    if (stopHeading) { stopHeading(); stopHeading = null; }
    stopCamera();
    stageEl.innerHTML = '';
    objEl = null;
    screenEl.classList.remove('is-active');
    if (onExit) onExit();
  }

  return { init, open, close, setPosition, isActive: () => active };
})();
