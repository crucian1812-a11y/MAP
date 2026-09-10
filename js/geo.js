/* Геометрия и геолокация: расстояния, азимуты, слежение за позицией. */

const Geo = (() => {
  const R = 6371000;
  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;

  /* Расстояние между двумя точками в метрах. */
  function distance(a, b) {
    const dLat = rad(b[0] - a[0]);
    const dLon = rad(b[1] - a[1]);
    const la1 = rad(a[0]), la2 = rad(b[0]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  /* Азимут из точки a в точку b: 0 — на север, 90 — на восток. */
  function bearing(a, b) {
    const la1 = rad(a[0]), la2 = rad(b[0]), dLon = rad(b[1] - a[1]);
    const y = Math.sin(dLon) * Math.cos(la2);
    const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
    return (deg(Math.atan2(y, x)) + 360) % 360;
  }

  /* Разница углов в диапазоне от -180 до 180. */
  function angleDiff(a, b) {
    return ((a - b + 540) % 360) - 180;
  }

  function formatDistance(m) {
    if (m < 1000) return Math.round(m / 5) * 5 + ' м';
    return (m / 1000).toFixed(1).replace('.', ',') + ' км';
  }

  /* Точка на ломаной, ближайшая к позиции, и пройденная доля маршрута. */
  function progressAlong(path, pos) {
    let best = { dist: Infinity, index: 0 };
    for (let i = 0; i < path.length; i++) {
      const d = distance(path[i], pos);
      if (d < best.dist) best = { dist: d, index: i };
    }
    return best;
  }

  /* Слежение за геолокацией. onUpdate({coords:[lat,lng], accuracy, heading, speed}) */
  function watch(onUpdate, onError) {
    if (!('geolocation' in navigator)) {
      onError && onError({ code: 0, message: 'Браузер не умеет геолокацию' });
      return () => {};
    }
    const id = navigator.geolocation.watchPosition(
      p => onUpdate({
        coords: [p.coords.latitude, p.coords.longitude],
        accuracy: p.coords.accuracy,
        heading: (typeof p.coords.heading === 'number' && !isNaN(p.coords.heading)) ? p.coords.heading : null,
        speed: p.coords.speed
      }),
      e => onError && onError(e),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }

  /* Компас телефона. Возвращает функцию остановки. */
  function watchHeading(onHeading) {
    let handler = e => {
      let h = null;
      if (typeof e.webkitCompassHeading === 'number') {
        h = e.webkitCompassHeading;              // iOS: уже градусы от севера
      } else if (e.absolute && typeof e.alpha === 'number') {
        h = (360 - e.alpha) % 360;               // Android с абсолютной ориентацией
      } else if (typeof e.alpha === 'number') {
        h = (360 - e.alpha) % 360;
      }
      if (h !== null) onHeading(h, e);
    };
    const evt = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(evt, handler, true);
    return () => window.removeEventListener(evt, handler, true);
  }

  /* На iOS доступ к компасу спрашивают по нажатию кнопки. */
  async function requestOrientationPermission() {
    const D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === 'function') {
      try { return (await D.requestPermission()) === 'granted'; }
      catch (e) { return false; }
    }
    return true;
  }

  return { distance, bearing, angleDiff, formatDistance, progressAlong, watch, watchHeading, requestOrientationPermission };
})();
