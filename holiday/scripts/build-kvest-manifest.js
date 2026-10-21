#!/usr/bin/env node
/* Список озвученных дорожек для страницы квестов: какие есть, каким голосом.
   Страница показывает кнопку «слушать» только там, где дорожка нашлась.

     node holiday/scripts/build-kvest-manifest.js eugene 0.92
*/
const fs = require('fs');
const path = require('path');

const DIR = path.resolve(__dirname, '..', 'audio', 'kvest');
const [speaker = '', tempo = ''] = process.argv.slice(2);
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith('.mp3')).sort() : [];
const manifest = { speaker, tempo: Number(tempo) || 1, tracks: files.map(f => f.replace(/\.mp3$/, '')) };
fs.writeFileSync(path.join(DIR, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`дорожек в списке: ${files.length}`);
