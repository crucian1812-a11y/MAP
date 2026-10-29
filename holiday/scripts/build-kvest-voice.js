#!/usr/bin/env node
/* Тексты для озвучки квестов: берёт данные дней прямо из holiday/kvest.html,
   чтобы озвучка не расходилась со страницей. На каждый день — вступление,
   на каждое задание — вопрос и ответ, на каждую AR-сцену — рассказ. Пишет .txt в holiday/audio/kvest-text/.

     node holiday/scripts/build-kvest-voice.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'audio', 'kvest-text');
const html = fs.readFileSync(path.join(ROOT, 'kvest.html'), 'utf8');

// Данные дней — обычный литерал в скрипте страницы, вычисляем только его
const src = html.slice(html.indexOf('const DAYS = ['), html.indexOf('const AQUA = {'));
const DAYS = new Function(src + '; return DAYS;')();

const NAMES = { mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг', fri: 'Пятница' };
const ORD = ['первое', 'второе', 'третье', 'четвёртое', 'пятое', 'шестое', 'седьмое', 'восьмое', 'девятое', 'десятое'];

// То, что глазом читается, а синтез произнёс бы криво
const EAR = [
  [/(\d+)–(\d+) км/g, '$1–$2 километров'],
  [/7,5 метра/g, 'семь с половиной метров'],
  [/в 15:30/g, 'в пятнадцать тридцать'],
  [/ · /g, '. '],
  [/Б-396/g, 'Бэ триста девяносто шесть'],
];
const ear = s => EAR.reduce((t, [re, to]) => t.replace(re, to), s);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const put = (id, text) => fs.writeFileSync(path.join(OUT, id + '.txt'), ear(text).trim() + '\n');

put('start', 'Привет, путешественник! Начинается экспедиция «Каникулы». Пять дней, пять заданий. ' +
  'За каждый день ты получишь печать с буквой. Соберёшь все пять — сложишь из них секретное слово.');
put('finale', 'Ура! Ты собрал слово «орган». Сегодня вечером ты услышишь его вживую. Экспедиция выполнена!');

for (const d of DAYS) {
  put(`${d.id}-intro`, `${NAMES[d.id]}. ${d.title}. ${d.intro}`);
  d.tasks.forEach((t, i) => {
    put(`${d.id}-t${i}`, `Задание ${ORD[i]}. ${t.t}. ${t.q}`);
    put(`${d.id}-a${i}`, `Ответ. ${t.a}`);
  });
}
// рассказ к сценам волшебной камеры (holiday/ar.html)
const { SCENES } = require(path.join(ROOT, 'js', 'ar-scenes.js'));
for (const sc of SCENES) if (sc.say) put(`ar-${sc.id}`, sc.say);

// тихий Китай-город и восемь картин Третьяковки (kitay.html, gtg.html)
const { KITAY_STOPS } = require(path.join(ROOT, 'js', 'kitay.js'));
for (const st of KITAY_STOPS) put(`kit-${st.id}`, st.say);
const { GTG_PAINTINGS } = require(path.join(ROOT, 'js', 'gtg.js'));
for (const pt of GTG_PAINTINGS) put(`gtg-${pt.id}`, `${pt.title}. ${pt.artist}. ${pt.say}`);

// велопоход в Алтуфьево (altufyevo.html)
const { ALT_STOPS } = require(path.join(ROOT, 'js', 'altufyevo.js'));
for (const st of ALT_STOPS) put(`alt-${st.id}`, st.say);

// аудиоэкскурсия по подлодке Б-396 (holiday/b396.html)
const { B396_STOPS } = require(path.join(ROOT, 'js', 'b396.js'));
for (const st of B396_STOPS) put(`b396-${st.id}`, st.say);

console.log(`текстов для озвучки: ${fs.readdirSync(OUT).length} → ${path.relative(process.cwd(), OUT)}`);
