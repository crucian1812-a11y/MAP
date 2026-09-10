/* Голос рассказчика. Если в audio/ лежат озвучки Piper — играем их,
   иначе читаем системным синтезом браузера. */

const Voice = (() => {
  const KEY = 'walk-voice';
  let manifest = null;          // { voices:[{id,title,tracks}] }
  let ready = null;             // промис загрузки
  let audio = null;             // текущий <audio>
  let speaking = false;
  let onStateChange = () => {};

  function load() {
    if (ready) return ready;
    ready = fetch('audio/manifest.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null)
      .then(m => { manifest = m && m.voices && m.voices.length ? m : null; return manifest; });
    return ready;
  }

  const voices = () => (manifest ? manifest.voices : []);

  function current() {
    const saved = localStorage.getItem(KEY);
    if (saved === 'system') return null;
    const list = voices();
    if (!list.length) return null;
    return list.find(v => v.id === saved) || list[0];
  }

  function setVoice(id) {
    localStorage.setItem(KEY, id || 'system');
    stop();
  }
  const currentId = () => (current() ? current().id : 'system');

  function trackUrl(trackId) {
    const v = current();
    return v && v.tracks[trackId] ? v.tracks[trackId] : null;
  }

  function stop() {
    if (audio) { audio.pause(); audio.src = ''; audio = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (speaking) { speaking = false; onStateChange(false); }
  }

  /* trackId — например 'point-suharev' или 'scene-vorota'.
     fallbackText — что прочитать системным голосом, если записи нет. */
  function play(trackId, fallbackText, opts = {}) {
    stop();
    const url = trackUrl(trackId);
    if (url) {
      audio = new Audio(url);
      audio.volume = opts.volume === undefined ? 1 : opts.volume;
      audio.onended = () => { speaking = false; onStateChange(false); };
      audio.onerror = () => { audio = null; systemSpeak(fallbackText, opts); };
      const p = audio.play();
      if (p && p.catch) p.catch(() => { audio = null; systemSpeak(fallbackText, opts); });
      speaking = true; onStateChange(true);
      return 'file';
    }
    return systemSpeak(fallbackText, opts) ? 'system' : 'none';
  }

  function systemSpeak(text, opts = {}) {
    if (!text || !window.speechSynthesis) return false;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = opts.rate || 0.95;
    u.pitch = opts.pitch || 1.05;
    u.onend = () => { speaking = false; onStateChange(false); };
    speechSynthesis.speak(u);
    speaking = true; onStateChange(true);
    return true;
  }

  return {
    load, voices, current, currentId, setVoice, play, stop,
    isSpeaking: () => speaking,
    has: trackId => !!trackUrl(trackId),
    onChange: fn => { onStateChange = fn; }
  };
})();
