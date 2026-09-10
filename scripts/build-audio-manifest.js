#!/usr/bin/env node
/* Смотрит, какие озвучки лежат в audio/, и пишет audio/manifest.json.
   Сайт читает его и показывает список голосов; нет файла — читает системным. */

const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'audio');

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /\.mp3$|\.wav$/i.test(f)) : [];
const voices = {};
for (const f of files) {
  const m = f.match(/^(.+?)--(.+)\.(mp3|wav)$/);   // point-suharev--ru_RU-dmitri-medium.mp3
  if (!m) continue;
  const [, id, voice] = m;
  (voices[voice] = voices[voice] || {})[id] = 'audio/' + f;
}

const HUMAN = {
  'ru_RU-dmitri-medium': 'Дмитрий',
  'ru_RU-denis-medium': 'Денис',
  'ru_RU-ruslan-medium': 'Руслан',
  'ru_RU-irina-medium': 'Ирина'
};

const manifest = {
  updated: new Date().toISOString().slice(0, 10),
  voices: Object.keys(voices).sort().map(v => ({
    id: v,
    title: HUMAN[v] || v.replace(/^ru_RU-|-medium$/g, ''),
    tracks: voices[v]
  }))
};

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('голосов:', manifest.voices.length,
  '| дорожек:', manifest.voices.reduce((a, v) => a + Object.keys(v.tracks).length, 0));
