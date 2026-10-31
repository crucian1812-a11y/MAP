/* Волшебная камера для Леона: поздравление с четырёхлетием.
   Движок общий (../js/ar-engine.js): слои SVG, такты-классы, титры, звук.
   say — текст для озвучки Silero (дорожка leon-<id> в holiday/audio/kvest/).
   Герои нарисованы по мотивам любимых персонажей Леона, без настоящих логотипов. */

const SCENES = [];
const rep = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');

/* ---------- детали, общие для сцен ---------- */

// воздушные шары поднимаются снизу
const balloons = () => `<g class="lb-balloons">${[
  [110, 300, '#e5383b'], [250, 220, '#1f6fe0'], [400, 260, '#f7b801'], [550, 210, '#2fa84f'], [690, 290, '#9b5de5']
].map(([x, y, c], i) => `<g transform="translate(${x} ${y})"><g class="lb-balloon" style="--i:${i}">
  <path d="M0 70 q-8 60 6 120" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
  <ellipse cx="0" cy="0" rx="52" ry="64" fill="${c}"/>
  <ellipse cx="-18" cy="-24" rx="12" ry="20" fill="#fff" opacity=".35"/>
  <path d="M-8 62 h16 l-8 12 z" fill="${c}"/></g></g>`).join('')}</g>`;

// имя радугой
const NAME_COLORS = ['#e5383b', '#f7b801', '#2fa84f', '#1f6fe0'];
const nameTitle = () => `<g class="lb-name">
  ${'ЛЕОН'.split('').map((ch, i) => `<text x="${235 + i * 110}" y="330" text-anchor="middle" class="lb-letter" style="--i:${i};fill:${NAME_COLORS[i]}">${ch}</text>`).join('')}
  <text x="400" y="420" text-anchor="middle" class="lb-sub">с днём рождения!</text></g>`;

// синий ёжик-молния: колючий шар катится и собирает кольца
const speedBall = () => `
  <g class="lb-rings">${[160, 280, 400, 520, 640].map((x, i) => `<g transform="translate(${x} 600)"><g class="lb-ring" style="--d:${(.25 + i * .24).toFixed(2)}s">
    <circle r="26" fill="none" stroke="#ffd23f" stroke-width="9"/><circle r="26" fill="none" stroke="#fff6c2" stroke-width="3"/></g></g>`).join('')}</g>
  <g class="lb-ball"><g class="lb-trail">${rep(3, k => `<path d="M${-90 - k * 30} ${-30 + k * 30} h-${160 - k * 30}" stroke="#5aa9ff" stroke-width="${12 - k * 3}" stroke-linecap="round" opacity="${.8 - k * .2}"/>`)}</g>
    <g class="lb-spin">
      ${rep(8, k => `<path transform="rotate(${k * 45})" d="M-22 -50 L0 -96 L22 -50 Z" fill="#1747b8"/>`)}
      <circle r="62" fill="#1f5fd6"/>
      <path d="M-40 10 q40 40 80 0 q-10 30 -40 32 q-30 -2 -40 -32 z" fill="#f3c99a"/>
      <circle cx="-16" cy="-12" r="13" fill="#fff"/><circle cx="16" cy="-12" r="13" fill="#fff"/>
      <circle cx="-12" cy="-12" r="6" fill="#1a7a3a"/><circle cx="20" cy="-12" r="6" fill="#1a7a3a"/>
    </g></g>`;

// красная гоночная машина с молнией и номером 95
const raceCar = cls => `<g class="${cls}"><g class="lb-car-bob">
  <path d="M-185 -10 q0 -40 50 -48 l55 -38 q55 -14 120 -4 l60 40 q70 6 85 30 l4 30 h-374 z" fill="#d7262b"/>
  <path d="M-70 -92 q50 -12 110 -2 l40 38 h-190 z" fill="#e9f2ff"/>
  <ellipse cx="-24" cy="-62" rx="20" ry="17" fill="#fff"/><ellipse cx="24" cy="-62" rx="20" ry="17" fill="#fff"/>
  <circle cx="-18" cy="-60" r="9" fill="#2a6fd6"/><circle cx="30" cy="-60" r="9" fill="#2a6fd6"/>
  <circle cx="-16" cy="-62" r="4" fill="#111"/><circle cx="32" cy="-62" r="4" fill="#111"/>
  <path d="M-150 -30 l70 -6 l-20 14 l90 -8 l-70 26 l18 -14 z" fill="#ffd23f" stroke="#e98a00" stroke-width="2"/>
  <text x="70" y="-20" text-anchor="middle" class="lb-95">95</text>
  <path d="M150 0 q20 0 30 -6" stroke="#111" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M168 -14 q12 10 22 2" stroke="#7a1010" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${[-110, 110].map(x => `<g transform="translate(${x} 20)"><g class="lb-wheel"><circle r="34" fill="#151515"/><circle r="17" fill="#d7262b"/><path d="M-17 0 h34 M0 -17 v34" stroke="#ffd23f" stroke-width="4"/></g></g>`).join('')}
</g></g>`;

// парад маленьких машинок
const smallCars = () => `<g class="lb-parade">${['#2fa84f', '#f7b801', '#1f6fe0', '#9b5de5', '#ff7a1a'].map((c, i) => `
  <g transform="translate(${i * 150} 0)"><g class="lb-car-bob" style="animation-delay:${i * .07}s">
    <path d="M-55 0 q0 -24 22 -28 l18 -22 h50 l20 22 q22 4 22 28 z" fill="${c}"/>
    <path d="M-10 -46 h24 l14 18 h-38 z" fill="#d8ecff"/>
    <circle cx="-30" cy="4" r="14" fill="#151515"/><circle cx="34" cy="4" r="14" fill="#151515"/></g></g>`).join('')}</g>`;

// паутина из углов и герой в красно-синей маске
const web = () => {
  const cx = 400, cy = 420, spokes = 10, R = [70, 150, 240, 340, 460];
  const pt = (r, k) => [cx + r * Math.cos(k / spokes * 2 * Math.PI), cy + r * Math.sin(k / spokes * 2 * Math.PI)].map(v => v.toFixed(0)).join(' ');
  return `<g class="lb-web">
    ${rep(spokes, k => `<path class="lb-thread" pathLength="100" style="--i:${k}" d="M${cx} ${cy} L${pt(620, k)}"/>`)}
    ${R.map((r, j) => `<path class="lb-thread lb-loop" pathLength="100" style="--i:${j + 4}" d="M${rep(spokes, k => `${k ? 'L' : ''}${pt(r, k)} `)}Z"/>`).join('')}
  </g>`;
};
const spiderMask = () => `<g class="lb-mask"><g transform="translate(400 420)">
  <ellipse rx="120" ry="150" fill="#d7262b"/>
  ${rep(6, k => `<path transform="rotate(${k * 30 - 75})" d="M0 0 L0 -160" stroke="#7a0d10" stroke-width="3"/>`)}
  <ellipse rx="60" ry="75" fill="none" stroke="#7a0d10" stroke-width="3"/><ellipse rx="100" ry="125" fill="none" stroke="#7a0d10" stroke-width="3"/>
  <path d="M-92 -30 q40 -40 78 10 q-36 34 -78 -10 z" fill="#fff" stroke="#111" stroke-width="7"/>
  <path d="M92 -30 q-40 -40 -78 10 q36 34 78 -10 z" fill="#fff" stroke="#111" stroke-width="7"/>
</g></g>`;
const spiderDrop = () => `<g class="lb-spider"><path d="M400 -200 V340" stroke="#fff" stroke-width="3"/>
  <g transform="translate(400 370)">${rep(4, k => `<path d="M0 0 q${-40 - k * 6} ${-30 + k * 22} ${-60 - k * 4} ${-10 + k * 30} M0 0 q${40 + k * 6} ${-30 + k * 22} ${60 + k * 4} ${-10 + k * 30}" stroke="#151515" stroke-width="6" fill="none"/>`)}
    <ellipse rx="30" ry="36" fill="#151515"/><circle cy="-38" r="20" fill="#151515"/>
    <circle cx="-7" cy="-42" r="5" fill="#fff"/><circle cx="7" cy="-42" r="5" fill="#fff"/></g></g>`;

// чёрная капля-симбиот поднимается снизу, открывает глаза и становится цифрой 4
const venomGoo = () => `<g class="lb-goo">
  <path class="lb-goo-body" d="M0 1300 V620 q60 -90 120 -20 q40 -120 110 -40 q50 -150 170 -30 q60 -110 120 0 q60 -80 110 20 q40 -40 70 10 q50 -60 100 -10 V1300 H0 Z" fill="#0d0d12"/>
  <path d="M120 680 q20 -30 40 -6 M470 640 q30 -40 60 -4" stroke="#4a4a66" stroke-width="6" fill="none" opacity=".7"/>
  <g class="lb-eyes">
    <path d="M250 640 q60 -80 130 -40 q-30 70 -130 40 z" fill="#fff"/>
    <path d="M550 640 q-60 -80 -130 -40 q30 70 130 40 z" fill="#fff"/>
  </g></g>
  <g class="lb-four"><text x="400" y="560" text-anchor="middle" class="lb-four-t">4</text></g>`;

// торт с четырьмя свечами
const cake = () => `<g class="lb-cake"><g transform="translate(400 700)">
  <rect x="-200" y="-90" width="400" height="120" rx="20" fill="#f6c6d8"/>
  <path d="M-200 -70 q25 30 50 0 q25 30 50 0 q25 30 50 0 q25 30 50 0 q25 30 50 0 q25 30 50 0 q25 30 50 0 q25 30 50 0" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
  <rect x="-140" y="-190" width="280" height="105" rx="18" fill="#7fc8f8"/>
  <path d="M-140 -170 q20 22 40 0 q20 22 40 0 q20 22 40 0 q20 22 40 0 q20 22 40 0 q20 22 40 0 q20 22 40 0" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
  ${[-90, -30, 30, 90].map((x, i) => `<g transform="translate(${x} -190)">
    <rect x="-8" y="-70" width="16" height="70" rx="4" fill="${NAME_COLORS[i]}"/>
    <g class="lb-flame lb-f${i}"><path d="M0 -112 q18 22 0 40 q-18 -18 0 -40 z" fill="#ffb02e"/><path d="M0 -100 q8 12 0 24 q-8 -10 0 -24 z" fill="#fff4b0"/></g>
    <g class="lb-smoke lb-s${i}"><circle cy="-100" r="10" fill="#ddd"/></g>
    <text y="-150" text-anchor="middle" class="lb-num lb-n${i}">${i + 1}</text></g>`).join('')}
</g></g>`;

/* ============================================================
   БОЛЬШОЕ ПОЗДРАВЛЕНИЕ — все герои по очереди
   ============================================================ */
SCENES.push({
  id: 'prazdnik',
  title: 'Леону 4 года!',
  place: 'Где угодно: дома, за столом, на празднике',
  aim: 'Наведи камеру на Леона или переверни её кнопкой 🔄, чтобы он увидел себя.',
  lead: 'Шары и имя радугой, синий ёжик собирает кольца, «Ка-чау!», гонка машинок, паутина, чёрная капля с глазами и торт с четырьмя свечами.',
  say: 'Внимание! Волшебная камера включена. С днём рождения, Леон! Сегодня тебе четыре года! Смотри, кто пришёл тебя поздравить. Синий ёжик Соник мчится быстрее ветра и собирает для тебя золотые кольца! А вот и Молния Маккуин: ка-чау! За ним целая гонка маленьких машинок. Человек-паук плетёт паутину, а Веном тоже хочет сказать: с днём рождения! А теперь задуваем четыре свечки. Раз, два, три, четыре! Ура, Леон!',
  tint: 'linear-gradient(180deg, rgba(20,10,40,.18), rgba(8,4,20,.45))',
  layers: [
    { depth: .6, z: 1, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${balloons()}${web()}</svg>` },
    { depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
      ${nameTitle()}${speedBall()}
      <g transform="translate(0 640)">${raceCar('lb-car lb-car--pass')}</g>
      <g transform="translate(0 640)">${smallCars()}</g>
      ${spiderMask()}${venomGoo()}${cake()}
      <text x="400" y="300" text-anchor="middle" class="lb-big lb-kachow">КА-ЧАУ!</text>
      <text x="400" y="260" text-anchor="middle" class="lb-big lb-ura">УРА, ЛЕОН!</text>
    </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-hello', fxFront: { type: 'sparks', rate: 20 } },
    { t: 7600, cls: 'is-speed', fxFront: { type: 'coins', rate: 26 } },
    { t: 12300, cls: 'is-race', fxFront: { type: 'sparks', rate: 12 } },
    { t: 15300, cls: 'is-cars' },
    { t: 17800, cls: 'is-web' }, { t: 18700, cls: 'is-mask' },
    { t: 20400, cls: 'is-venom' },
    { t: 24200, cls: 'is-cake', fxFront: { type: 'stars', rate: 14 } },
    { t: 26400, cls: 'is-b0' }, { t: 27200, cls: 'is-b1' }, { t: 28000, cls: 'is-b2' }, { t: 28800, cls: 'is-b3' },
    { t: 29600, cls: 'is-ura', fxBack: { type: 'fireworks' }, fxFront: { type: 'sparks', rate: 40 } }
  ],
  captions: [
    { t: 1800, text: 'С днём рождения, Леон!', big: true, hold: 4200 },
    { t: 7800, text: 'Соник собирает кольца!', hold: 3800 },
    { t: 12500, text: 'Молния Маккуин: ка-чау!', big: true, hold: 2600 },
    { t: 15400, text: 'Гонка маленьких машинок', hold: 2300 },
    { t: 17900, text: 'Человек-паук плетёт паутину', hold: 2400 },
    { t: 20500, text: 'Веном тоже поздравляет!', hold: 3400 },
    { t: 24300, text: 'Задуваем четыре свечки!', big: true, hold: 2000 },
    { t: 29800, text: 'Ура! Леону 4 года!', big: true, hold: 5000 }
  ],
  sound: [
    { t: 300, s: 'fanfare' }, { t: 7600, s: 'sparkle' }, { t: 8200, s: 'sparkle' }, { t: 12300, s: 'rumble' }, { t: 12900, s: 'crack' },
    { t: 15300, s: 'hooves' }, { t: 17800, s: 'grow' }, { t: 20400, s: 'rumble' },
    { t: 26400, s: 'chime' }, { t: 27200, s: 'chime' }, { t: 28000, s: 'chime' }, { t: 28800, s: 'chime' },
    { t: 29600, s: 'salute' }, { t: 29700, s: 'fanfare' }
  ]
});

/* ============================================================
   КОРОТКИЕ СЦЕНЫ — по одной на любимого героя
   ============================================================ */
SCENES.push({
  id: 'sonik', title: 'Золотые кольца', place: 'Где угодно',
  aim: 'Наведи камеру на пол или на стол: по нему промчится синий ёжик.',
  lead: 'Синий колючий шар разгоняется, собирает пять колец, и из колец вспыхивает цифра 4.',
  say: 'Леон, смотри! Синий ёжик Соник разгоняется. Раз, два, три! И он уже мчится быстрее ветра! Лови золотые кольца! А теперь давай ещё раз, это так быстро! Соник поздравляет тебя с днём рождения!',
  tint: 'linear-gradient(180deg, rgba(10,30,80,.2), rgba(4,10,30,.5))',
  layers: [{ depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
    ${speedBall()}<g class="lb-four lb-four--gold"><text x="400" y="460" text-anchor="middle" class="lb-four-t">4</text></g></svg>` }],
  beats: [{ t: 2600, cls: 'is-speed', fxFront: { type: 'coins', rate: 26 } }, { t: 8000, cls: 'is-again' }, { t: 11000, cls: 'is-four', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 600, text: 'Раз, два, три…', big: true, hold: 2000 }, { t: 2800, text: 'Быстрее ветра!', big: true, hold: 3000 }, { t: 8100, text: 'Ещё разок!', hold: 2400 }, { t: 11200, text: 'Леону — 4!', big: true, hold: 4000 }],
  sound: [{ t: 600, s: 'chime' }, { t: 2600, s: 'sparkle' }, { t: 3100, s: 'sparkle' }, { t: 8000, s: 'sparkle' }, { t: 11000, s: 'salute' }]
});

SCENES.push({
  id: 'makvin', title: 'Ка-чау!', place: 'Где угодно',
  aim: 'Наведи камеру на пол или на дорожку из машинок.',
  lead: 'Гоночная машина с молнией влетает, тормозит, подмигивает фарами, а за ней мчится гонка маленьких машинок.',
  say: 'Внимание, гонка! На старт выезжает Молния Маккуин. Ка-чау! Он приехал поздравить Леона с днём рождения! А вот и маленькие машинки, целая гонка. Кто приедет первым? Конечно, Леон!',
  tint: 'linear-gradient(180deg, rgba(60,20,10,.18), rgba(20,6,4,.45))',
  layers: [{ depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
    <path d="M0 700 H800" stroke="#fff" stroke-width="6" stroke-dasharray="40 30" opacity=".7"/>
    <g transform="translate(0 640)">${raceCar('lb-car lb-car--park')}</g>
    <g transform="translate(0 640)">${smallCars()}</g>
    <text x="400" y="300" text-anchor="middle" class="lb-big lb-kachow">КА-ЧАУ!</text>
    <g class="lb-flag"><g transform="translate(400 160)">${rep(16, k => `<rect x="${(k % 4) * 40 - 80}" y="${Math.floor(k / 4) * 30}" width="40" height="30" fill="${(k + Math.floor(k / 4)) % 2 ? '#111' : '#fff'}"/>`)}</g></g>
  </svg>` }],
  beats: [{ t: 2400, cls: 'is-park', fxFront: { type: 'sparks', rate: 18 } }, { t: 4600, cls: 'is-race' }, { t: 9200, cls: 'is-cars' }, { t: 13500, cls: 'is-flag', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 600, text: 'Внимание, гонка!', big: true, hold: 1800 }, { t: 4700, text: 'Ка-чау!', big: true, hold: 2600 }, { t: 9300, text: 'Кто приедет первым?', hold: 3400 }, { t: 13600, text: 'Победитель — Леон!', big: true, hold: 4000 }],
  sound: [{ t: 2400, s: 'rumble' }, { t: 4600, s: 'crack' }, { t: 9200, s: 'hooves' }, { t: 13500, s: 'fanfare' }]
});

SCENES.push({
  id: 'pauk', title: 'Паутина', place: 'Где угодно',
  aim: 'Наведи камеру на стену или в угол комнаты: там появится паутина.',
  lead: 'Из углов растёт паутина, по нитке спускается паучок, а потом появляется маска героя.',
  say: 'Тссс! Кто это плетёт паутину? Нитка за ниткой, по всей комнате! А вот и маленький паучок спускается по ниточке. Человек-паук передаёт привет и поздравляет Леона с днём рождения!',
  tint: 'linear-gradient(180deg, rgba(10,20,60,.22), rgba(4,6,24,.5))',
  layers: [{ depth: .7, z: 1, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${web()}</svg>` },
    { depth: 1.1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${spiderDrop()}${spiderMask()}</svg>` }],
  beats: [{ t: 500, cls: 'is-web' }, { t: 5200, cls: 'is-drop' }, { t: 10000, cls: 'is-mask', fxFront: { type: 'sparks', rate: 20 } }],
  captions: [{ t: 700, text: 'Кто плетёт паутину?', hold: 3800 }, { t: 5400, text: 'Паучок спускается по нитке', hold: 3800 }, { t: 10200, text: 'Человек-паук поздравляет Леона!', big: true, hold: 4200 }],
  sound: [{ t: 500, s: 'grow' }, { t: 5200, s: 'lift' }, { t: 10000, s: 'fanfare' }]
});

SCENES.push({
  id: 'venom', title: 'Чёрная капля', place: 'Где угодно',
  aim: 'Наведи камеру на пол или на диван: оттуда что-то вылезет!',
  lead: 'Снизу поднимается чёрная блестящая капля, открывает белые глаза и превращается в цифру 4.',
  say: 'Ой! Что это за чёрная капля? Она растёт и растёт! Смотри, у неё глаза! Это Веном. Не бойся, он пришёл на праздник. Веном превращается… в цифру четыре! С днём рождения, Леон!',
  tint: 'linear-gradient(180deg, rgba(20,10,30,.25), rgba(4,2,8,.55))',
  layers: [{ depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${venomGoo()}</svg>` }],
  beats: [{ t: 400, cls: 'is-venom' }, { t: 9000, cls: 'is-four', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 600, text: 'Ой! Что это?', big: true, hold: 2600 }, { t: 4200, text: 'У капли есть глаза!', hold: 3200 }, { t: 9200, text: 'Веном стал цифрой 4!', big: true, hold: 4200 }],
  sound: [{ t: 400, s: 'rumble' }, { t: 4000, s: 'crack' }, { t: 9000, s: 'salute' }]
});

if (typeof module !== 'undefined') module.exports = { SCENES };
