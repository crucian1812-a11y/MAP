/* Карта: маршрут, метки точек, наша позиция. */

const WalkMap = (() => {
  let map, meMarker, meCircle, routeLine, doneLine;
  const markers = {};
  let onPick = null;
  let ready = false;      // без Leaflet карты нет, а остальной квест должен работать

  function pinIcon(point, state) {
    const cls = 'pin' + (state === 'done' ? ' pin--done' : state === 'next' ? ' pin--next' : '');
    return L.divIcon({
      className: '',
      html: `<div class="${cls}"><span>${point.badge.emoji}</span></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32]
    });
  }

  function init(handlers) {
    onPick = handlers.onPick;

    map = L.map('map', { zoomControl: false, attributionControl: true, tap: false })
      .setView([55.7735, 37.6420], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    routeLine = L.polyline(ROUTE_PATH, {
      color: '#6b4bd6', weight: 6, opacity: .75, dashArray: '1 12', lineCap: 'round'
    }).addTo(map);

    doneLine = L.polyline([], { color: '#2f8f5b', weight: 6, opacity: .9 }).addTo(map);

    POINTS.forEach((p, i) => {
      const m = L.marker(p.coords, { icon: pinIcon(p, 'idle'), draggable: false }).addTo(map);
      m.on('click', () => onPick && onPick(p.id));
      m.on('dragend', e => {
        const ll = e.target.getLatLng();
        p.coords = [+ll.lat.toFixed(5), +ll.lng.toFixed(5)];
        console.log(`${p.id}: [${p.coords[0]}, ${p.coords[1]}]`);
        handlers.onMoved && handlers.onMoved();
      });
      markers[p.id] = m;
      L.circle(p.coords, { radius: p.radius, color: '#6b4bd6', weight: 1, opacity: .35, fillOpacity: .06 }).addTo(map);
    });

    map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
    ready = true;
    return map;
  }

  function setStates(doneIds, nextId) {
    if (!ready) return;
    POINTS.forEach(p => {
      const state = doneIds.includes(p.id) ? 'done' : (p.id === nextId ? 'next' : 'idle');
      markers[p.id].setIcon(pinIcon(p, state));
    });
  }

  function showMe(pos, accuracy) {
    if (!ready) return;
    if (!meMarker) {
      meMarker = L.marker(pos, {
        icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        zIndexOffset: 1000
      }).addTo(map);
      meCircle = L.circle(pos, { radius: accuracy || 20, color: '#2a7de1', weight: 1, fillOpacity: .08 }).addTo(map);
    } else {
      meMarker.setLatLng(pos);
      meCircle.setLatLng(pos).setRadius(accuracy || 20);
    }
  }

  function traceDone(pos) {
    if (!ready) return;
    const pts = doneLine.getLatLngs();
    const last = pts[pts.length - 1];
    if (!last || Geo.distance([last.lat, last.lng], pos) > 8) doneLine.addLatLng(pos);
  }

  function follow(pos, zoom) {
    if (!ready) return; map.setView(pos, zoom || Math.max(map.getZoom(), 16)); }
  function flyToPoint(p) {
    if (!ready) return; map.setView(p.coords, 17); }
  function fitRoute() {
    if (!ready) return; map.fitBounds(routeLine.getBounds(), { padding: [40, 40] }); }

  function setCalibration(on) {
    if (!ready) return;
    Object.values(markers).forEach(m => {
      if (on) m.dragging.enable(); else m.dragging.disable();
    });
  }

  function exportCoords() {
    return POINTS.map(p => `  { id: '${p.id}', coords: [${p.coords[0]}, ${p.coords[1]}] }`).join(',\n');
  }

  function invalidate() {
    if (!ready) return; map && setTimeout(() => map.invalidateSize(), 60); }

  return { init, setStates, showMe, traceDone, follow, flyToPoint, fitRoute, setCalibration, exportCoords, invalidate };
})();
