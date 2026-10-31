/* Волшебная камера для Леона: поздравление с четырёхлетием.
   Движок общий (../js/ar-engine.js): слои SVG, такты-классы, титры, звук.
   say — текст для озвучки Silero (дорожка leon-<id> в holiday/audio/kvest/).
   Соник, Человек-паук, Веном и Халк — картинки из img/ с вырезанным фоном, остальное нарисовано. */

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

/* ---------- герои с картинок (img/, фон вырезан) ---------- */
const sonicPic = () => `<g class="lb-sonic"><image href="img/sonic.webp" x="262" y="230" width="276" height="358"/></g>`;
const spiderPortal = () => `<g class="lb-portal">
  <path d="M400 -400 V150" stroke="#fff" stroke-width="5"/>
  <defs><clipPath id="lbSpClip"><circle cx="400" cy="400" r="240"/></clipPath></defs>
  <circle cx="400" cy="400" r="252" fill="#1f4fbf"/>
  <image href="img/spider.webp" x="140" y="140" width="520" height="520" clip-path="url(#lbSpClip)"/>
  <circle cx="400" cy="400" r="246" fill="none" stroke="#e5383b" stroke-width="12"/>
  ${rep(12, k => `<path transform="rotate(${k * 30} 400 400)" d="M400 140 L400 100" stroke="#fff" stroke-width="4"/>`)}
</g>`;
const venomPic = () => `<g class="lb-venom"><image href="img/venom.webp" x="170" y="150" width="460" height="555"/></g>`;
// два угощения — по одному в каждую руку Халка
const donut = (x, y, i) => `<g transform="translate(${x} ${y})"><g class="lb-treat" style="--i:${i}">
  <circle r="44" fill="none" stroke="#d9904a" stroke-width="36"/>
  <circle r="44" fill="none" stroke="#ff70a6" stroke-width="26"/>
  ${rep(9, k => `<rect transform="rotate(${k * 40}) translate(0 -44) rotate(${k * 23})" x="-6" y="-2" width="12" height="4" rx="2" fill="${NAME_COLORS[k % 4]}"/>`)}
</g></g>`;
const lollipop = (x, y, i) => `<g transform="translate(${x} ${y})"><g class="lb-treat" style="--i:${i}">
  <path d="M0 40 V150" stroke="#fff" stroke-width="10" stroke-linecap="round"/>
  <circle r="54" fill="#fff"/>
  <path d="M0 0 m0 -6 a6 6 0 1 1 0 12 a12 12 0 1 1 0 -24 a18 18 0 1 1 0 36 a24 24 0 1 1 0 -48 a30 30 0 1 1 0 60 a36 36 0 1 1 0 -72 a42 42 0 1 1 0 84" fill="none" stroke="#e5383b" stroke-width="9"/>
</g></g>`;
const hulkPic = () => `<g class="lb-hulk">
  <image href="img/hulk.webp" x="196" y="118" width="408" height="598"/>
  ${donut(244, 506, 0)}${lollipop(552, 500, 1)}
  <text x="400" y="86" text-anchor="middle" class="lb-big lb-rule">2 руки — 2 вкусняшки!</text>
</g>`;

/* ============================================================
   БОЛЬШОЕ ПОЗДРАВЛЕНИЕ — все герои по очереди
   ============================================================ */
SCENES.push({
  id: 'prazdnik',
  title: 'Леону 4 года!',
  place: 'Где угодно: дома, за столом, на празднике',
  aim: 'Наведи камеру на Леона или переверни её кнопкой 🔄, чтобы он увидел себя.',
  lead: 'Шары и имя радугой, Соник с кольцами, «Ка-чау!», гонка машинок, Человек-паук на паутине, Веном, Халк с двумя вкусняшками и торт с четырьмя свечами.',
  say: 'Внимание! Волшебная камера включена. С днём рождения, Леон! Сегодня тебе четыре года! Смотри, кто пришёл тебя поздравить. Синий ёжик Соник мчится быстрее ветра и собирает для тебя золотые кольца! А вот и Молния Маккуин: ка-чау! За ним целая гонка маленьких машинок. Человек-паук прилетел на паутине! А вот и Веном, он тоже хочет сказать: с днём рождения! Ого, это же Халк! Халк говорит: если у тебя две руки, значит, в каждой надо держать что-нибудь вкусненькое! А теперь задуваем четыре свечки. Раз, два, три, четыре! Ура, Леон!',
  tint: 'linear-gradient(180deg, rgba(20,10,40,.18), rgba(8,4,20,.45))',
  layers: [
    { depth: .6, z: 1, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${balloons()}${web()}</svg>` },
    { depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
      ${nameTitle()}${speedBall()}${sonicPic()}
      <g transform="translate(0 640)">${raceCar('lb-car lb-car--pass')}</g>
      <g transform="translate(0 640)">${smallCars()}</g>
      ${spiderPortal()}${venomGoo()}${venomPic()}${hulkPic()}${cake()}
      <text x="400" y="300" text-anchor="middle" class="lb-big lb-kachow">КА-ЧАУ!</text>
      <text x="400" y="260" text-anchor="middle" class="lb-big lb-ura">УРА, ЛЕОН!</text>
    </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-hello', fxFront: { type: 'sparks', rate: 20 } },
    { t: 9700, cls: 'is-speed', fxFront: { type: 'coins', rate: 26 } }, { t: 11500, cls: 'is-sonic' },
    { t: 14000, cls: 'is-race', fxFront: { type: 'sparks', rate: 12 } },
    { t: 16800, cls: 'is-cars' },
    { t: 19300, cls: 'is-web' }, { t: 19500, cls: 'is-swing' },
    { t: 21500, cls: 'is-venom' }, { t: 22300, cls: 'is-leap' },
    { t: 25300, cls: 'is-hulk' }, { t: 26000, cls: 'is-boom' },
    { t: 29000, cls: 'is-treats', fxFront: { type: 'sparks', rate: 18 } },
    { t: 32100, cls: 'is-cake', fxFront: { type: 'stars', rate: 14 } },
    { t: 34400, cls: 'is-b0' }, { t: 34900, cls: 'is-b1' }, { t: 35400, cls: 'is-b2' }, { t: 35900, cls: 'is-b3' },
    { t: 36300, cls: 'is-ura', fxBack: { type: 'fireworks' }, fxFront: { type: 'sparks', rate: 40 } }
  ],
  captions: [
    { t: 1800, text: 'С днём рождения, Леон!', big: true, hold: 4200 },
    { t: 9800, text: 'Соник собирает кольца!', hold: 3600 },
    { t: 14100, text: 'Молния Маккуин: ка-чау!', big: true, hold: 2300 },
    { t: 16900, text: 'Гонка маленьких машинок', hold: 2000 },
    { t: 19400, text: 'Человек-паук прилетел!', hold: 1900 },
    { t: 21600, text: 'Веном тоже поздравляет!', hold: 3500 },
    { t: 25400, text: 'Ого! Это же Халк!', big: true, hold: 2500 },
    { t: 28100, text: 'Две руки — в каждой по вкусняшке!', big: true, hold: 3800 },
    { t: 32200, text: 'Задуваем четыре свечки!', big: true, hold: 2000 },
    { t: 36400, text: 'Ура! Леону 4 года!', big: true, hold: 5000 }
  ],
  sound: [
    { t: 300, s: 'fanfare' }, { t: 9700, s: 'sparkle' }, { t: 10300, s: 'sparkle' }, { t: 11500, s: 'chime' },
    { t: 14000, s: 'rumble' }, { t: 15400, s: 'crack' }, { t: 16800, s: 'hooves' }, { t: 19300, s: 'grow' }, { t: 19500, s: 'lift' },
    { t: 21500, s: 'rumble' }, { t: 22300, s: 'crack' }, { t: 26000, s: 'boom' }, { t: 26100, s: 'rumble' }, { t: 29000, s: 'sparkle' },
    { t: 34400, s: 'chime' }, { t: 34900, s: 'chime' }, { t: 35400, s: 'chime' }, { t: 35900, s: 'chime' },
    { t: 36300, s: 'salute' }, { t: 36400, s: 'fanfare' }
  ]
});

/* ============================================================
   КОРОТКИЕ СЦЕНЫ — по одной на любимого героя
   ============================================================ */
SCENES.push({
  id: 'sonik', title: 'Золотые кольца', place: 'Где угодно',
  aim: 'Наведи камеру на пол или на стол: по нему промчится синий ёжик.',
  lead: 'Синий колючий шар разгоняется, собирает кольца, а потом Соник выпрыгивает и показывает «класс!».',
  say: 'Леон, смотри! Синий ёжик Соник разгоняется. Раз, два, три! И он уже мчится быстрее ветра! Лови золотые кольца! А теперь давай ещё раз, это так быстро! Соник поздравляет тебя с днём рождения!',
  tint: 'linear-gradient(180deg, rgba(10,30,80,.2), rgba(4,10,30,.5))',
  layers: [{ depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${speedBall()}${sonicPic()}</svg>` }],
  beats: [{ t: 5700, cls: 'is-speed', fxFront: { type: 'coins', rate: 26 } }, { t: 9500, cls: 'is-again' }, { t: 12000, cls: 'is-sonic', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 2200, text: 'Соник разгоняется…', hold: 1900 }, { t: 4300, text: 'Раз, два, три!', big: true, hold: 1300 }, { t: 5900, text: 'Быстрее ветра!', big: true, hold: 3200 }, { t: 9600, text: 'Ещё разок!', hold: 2200 }, { t: 12100, text: 'Соник: с днём рождения, Леон!', big: true, hold: 4000 }],
  sound: [{ t: 4300, s: 'chime' }, { t: 5700, s: 'sparkle' }, { t: 6200, s: 'sparkle' }, { t: 9500, s: 'sparkle' }, { t: 12000, s: 'salute' }]
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
  beats: [{ t: 2400, cls: 'is-park', fxFront: { type: 'sparks', rate: 18 } }, { t: 4600, cls: 'is-race' }, { t: 8100, cls: 'is-cars' }, { t: 12200, cls: 'is-flag', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 600, text: 'Внимание, гонка!', big: true, hold: 1800 }, { t: 4700, text: 'Ка-чау!', big: true, hold: 2600 }, { t: 8200, text: 'Гонка маленьких машинок!', hold: 2300 }, { t: 10700, text: 'Кто приедет первым?', hold: 1400 }, { t: 12300, text: 'Победитель — Леон!', big: true, hold: 4000 }],
  sound: [{ t: 2400, s: 'rumble' }, { t: 4600, s: 'crack' }, { t: 8100, s: 'hooves' }, { t: 12200, s: 'fanfare' }]
});

SCENES.push({
  id: 'pauk', title: 'Паутина', place: 'Где угодно',
  aim: 'Наведи камеру на стену или в угол комнаты: там появится паутина.',
  lead: 'Из углов растёт паутина, по нитке спускается паучок, а потом на паутине прилетает Человек-паук.',
  say: 'Тссс! Кто это плетёт паутину? Нитка за ниткой, по всей комнате! А вот и маленький паучок спускается по ниточке. Человек-паук передаёт привет и поздравляет Леона с днём рождения!',
  tint: 'linear-gradient(180deg, rgba(10,20,60,.22), rgba(4,6,24,.5))',
  layers: [{ depth: .7, z: 1, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${web()}</svg>` },
    { depth: 1.1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${spiderDrop()}${spiderPortal()}</svg>` }],
  beats: [{ t: 500, cls: 'is-web' }, { t: 5600, cls: 'is-drop' }, { t: 8600, cls: 'is-mask' }, { t: 8700, cls: 'is-swing', fxFront: { type: 'sparks', rate: 20 } }],
  captions: [{ t: 700, text: 'Кто плетёт паутину?', hold: 3800 }, { t: 5700, text: 'Паучок спускается по нитке', hold: 2700 }, { t: 8800, text: 'Человек-паук поздравляет Леона!', big: true, hold: 4200 }],
  sound: [{ t: 500, s: 'grow' }, { t: 5600, s: 'lift' }, { t: 8600, s: 'fanfare' }]
});

SCENES.push({
  id: 'venom', title: 'Чёрная капля', place: 'Где угодно',
  aim: 'Наведи камеру на пол или на диван: оттуда что-то вылезет!',
  lead: 'Снизу поднимается чёрная блестящая капля, открывает глаза, из неё выпрыгивает Веном и превращается в цифру 4.',
  say: 'Ой! Что это за чёрная капля? Она растёт и растёт! Смотри, у неё глаза! Это Веном. Не бойся, он пришёл на праздник. Веном превращается… в цифру четыре! С днём рождения, Леон!',
  tint: 'linear-gradient(180deg, rgba(20,10,30,.25), rgba(4,2,8,.55))',
  layers: [{ depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${venomGoo()}${venomPic()}</svg>` }],
  beats: [{ t: 400, cls: 'is-venom' }, { t: 4900, cls: 'is-eyes' }, { t: 7500, cls: 'is-leap' }, { t: 11600, cls: 'is-four', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 600, text: 'Ой! Что это?', big: true, hold: 2600 }, { t: 5000, text: 'У капли есть глаза!', hold: 2400 }, { t: 7600, text: 'Это Веном. Не бойся!', hold: 3200 }, { t: 11800, text: 'Веном стал цифрой 4!', big: true, hold: 4200 }],
  sound: [{ t: 400, s: 'rumble' }, { t: 4900, s: 'crack' }, { t: 7500, s: 'boom' }, { t: 11600, s: 'salute' }]
});

SCENES.push({
  id: 'halk', title: 'Правило Халка', place: 'Где угодно',
  aim: 'Наведи камеру на Леона или на праздничный стол.',
  lead: 'Земля трясётся, сверху приземляется Халк, а в руках у него появляются пончик и леденец.',
  say: 'Земля трясётся! Бум! Бум! Это Халк, самый сильный герой! Он пришёл на день рождения к Леону и говорит важное правило: если у тебя две руки, значит, в каждой надо держать что-нибудь вкусненькое! Вот пончик, а вот леденец. С днём рождения, Леон!',
  tint: 'linear-gradient(180deg, rgba(10,40,10,.22), rgba(4,14,4,.5))',
  layers: [{ depth: 1, z: 2, html: `<svg class="fit lb-up" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">${hulkPic()}</svg>` }],
  beats: [{ t: 3000, cls: 'is-hulk' }, { t: 3700, cls: 'is-boom' }, { t: 13500, cls: 'is-treats', fxFront: { type: 'sparks', rate: 22 } }, { t: 15400, cls: 'is-party', fxBack: { type: 'fireworks' } }],
  captions: [{ t: 500, text: 'Земля трясётся! Бум! Бум!', big: true, hold: 3000 }, { t: 3800, text: 'Это Халк — самый сильный герой!', hold: 2000 }, { t: 6000, text: 'Правило Халка:', big: true, hold: 3200 }, { t: 9400, text: 'Две руки — в каждой по вкусняшке!', big: true, hold: 4000 }, { t: 13500, text: 'Вот пончик, а вот леденец!', hold: 1800 }, { t: 15500, text: 'С днём рождения, Леон!', big: true, hold: 3800 }],
  sound: [{ t: 2300, s: 'boom' }, { t: 3000, s: 'boom' }, { t: 3700, s: 'boom' }, { t: 3800, s: 'rumble' }, { t: 13500, s: 'sparkle' }, { t: 14100, s: 'chime' }, { t: 15400, s: 'salute' }]
});

if (typeof module !== 'undefined') module.exports = { SCENES };
