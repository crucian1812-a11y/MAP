#!/usr/bin/env node
/* Собирает тексты для озвучки: истории точек квеста и рассказ к каждой AR-сцене.
   Кладёт .txt в audio/scripts/ — дальше их читает scripts/tts.py. */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'audio', 'scripts');
fs.mkdirSync(outDir, { recursive: true });

/* оба файла — обычные скрипты для браузера, поэтому просто выполняем их */
const sandbox = { window: {}, location: { href: 'https://example.org/' } };
global.window = sandbox.window;
global.location = sandbox.location;
eval(fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8') + ';global.__POINTS = POINTS;');
eval(fs.readFileSync(path.join(root, 'js', 'ar-scenes.js'), 'utf8') + ';global.__SCENES = SCENES;');

const clean = s => String(s)
  .replace(/«|»/g, '"')
  .replace(/\s+/g, ' ')
  .replace(/ —/g, ',')      // Piper проглатывает тире, запятая звучит естественнее
  .trim();

let n = 0;
for (const p of global.__POINTS) {
  const text = [p.name + '.', p.look, ...p.story, 'А ещё. ' + p.fact].map(clean).join('\n\n');
  fs.writeFileSync(path.join(outDir, `point-${p.id}.txt`), text + '\n');
  n++;
}

for (const s of global.__SCENES) {
  const lines = [s.title + '.', s.lead];
  (s.captions || []).forEach(c => lines.push(c.text));
  fs.writeFileSync(path.join(outDir, `scene-${s.id}.txt`), lines.map(clean).join('\n\n') + '\n');
  n++;
}

console.log('готово, файлов:', n, '→', path.relative(root, outDir));
