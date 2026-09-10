/* Сцены дополненной реальности.
   Каждая сцена — несколько слоёв SVG, частицы, титры и звук.
   Слои двигаются с разной скоростью при наклоне телефона: получается глубина. */

/* мелкие помощники, чтобы не плодить копипасту */
const rep = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
const brickPattern = (id, c1, c2) => `
  <pattern id="${id}" width="28" height="16" patternUnits="userSpaceOnUse">
    <rect width="28" height="16" fill="${c1}"/>
    <rect x="0" y="0" width="26" height="6" rx="1" fill="${c2}"/>
    <rect x="14" y="9" width="26" height="6" rx="1" fill="${c2}"/>
    <rect x="-14" y="9" width="26" height="6" rx="1" fill="${c2}"/>
  </pattern>`;
const glowFilter = (id, blur, color) => `
  <filter id="${id}" x="-70%" y="-70%" width="240%" height="240%">
    <feGaussianBlur stdDeviation="${blur}" result="b"/>
    <feFlood flood-color="${color}" result="c"/>
    <feComposite in="c" in2="b" operator="in" result="g"/>
    <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;

const SCENES = [];

/* ============================================================
   1. СУХАРЕВА БАШНЯ
   ============================================================ */
SCENES.push({
  id: 'suharev',
  emoji: '🗼',
  title: 'Сухарева башня',
  place: 'Большая Сухаревская площадь',
  aim: 'Встань у выхода из метро «Сухаревская» и наведи камеру на пустую середину площади — туда, где Сретенка упирается в Садовое кольцо. Башня стояла ровно там, где сейчас едут машины.',
  lead: 'Шестьдесят метров, часы, Навигацкая школа и колдун в верхнем окне. Снесли в 1934-м.',
  tint: 'radial-gradient(120% 80% at 50% 30%, rgba(30,40,80,.45), rgba(10,14,30,.72))',
  fxBack: { type: 'dust', rate: 40 },
  layers: [
    { depth: .35, z: 1, html: `
      <svg class="fit" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <g class="sk-far" fill="#0d1730" opacity=".55">
          <path d="M0 900 v-150 h60 v-40 h50 v40 h70 v-90 h40 v90 h60 v-60 h80 v60 h70 v-120 h40 v120 h80 v-70 h60 v70 h60 v-40 h60 v40 h70 v190z"/>
          ${rep(9, i => `<rect x="${40 + i * 84}" y="${770 + (i % 3) * 14}" width="10" height="14" fill="#ffca62" opacity=".5"/>`)}
        </g>
      </svg>` },
    { depth: 1, z: 2, cls: 'sc-tower', html: `
      <svg class="fit" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${brickPattern('br-t', '#d9c7a8', '#c9b087')}
          ${brickPattern('br-t2', '#c2a882', '#b1946c')}
          ${glowFilter('gl-warm', 6, '#ffca62')}
          <linearGradient id="tw-shade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#000" stop-opacity=".35"/>
            <stop offset=".45" stop-color="#000" stop-opacity="0"/>
            <stop offset="1" stop-color="#000" stop-opacity=".28"/>
          </linearGradient>
        </defs>

        <!-- призрачный контур, который прочерчивается первым -->
        <path class="ghost-line"
          d="M60 880 L60 560 L92 560 L92 470 L130 470 L130 300 L160 300 L160 210 L200 60 L240 210 L240 300 L270 300 L270 470 L308 470 L308 560 L340 560 L340 880 Z"
          fill="none" stroke="#ffe6a8" stroke-width="3"/>

        <g class="tower-body">
          <!-- нижний ярус -->
          <rect x="60" y="560" width="280" height="320" fill="url(#br-t)"/>
          <rect x="60" y="548" width="280" height="18" rx="3" fill="#a8452f"/>
          ${rep(3, i => `
            <path d="M${96 + i * 92} 880 v-120 a26 26 0 0 1 52 0 v120z" fill="#2a2118"/>
            <path d="M${96 + i * 92} 880 v-120 a26 26 0 0 1 52 0 v120z" fill="none" stroke="#efe0c4" stroke-width="4"/>`)}
          ${rep(4, i => `<rect class="win" x="${80 + i * 68}" y="600" width="34" height="46" rx="4" fill="#3b3226"/>`)}

          <!-- средний ярус -->
          <rect x="92" y="470" width="216" height="92" fill="url(#br-t2)"/>
          <rect x="86" y="458" width="228" height="16" rx="3" fill="#a8452f"/>
          ${rep(3, i => `<rect class="win" x="${118 + i * 62}" y="492" width="34" height="48" rx="4" fill="#3b3226"/>`)}

          <!-- ярус с часами -->
          <rect x="130" y="300" width="140" height="176" fill="url(#br-t)"/>
          <rect x="124" y="290" width="152" height="16" rx="3" fill="#a8452f"/>
          <g class="clock">
            <circle cx="200" cy="360" r="42" fill="#f6efe0" stroke="#3b3226" stroke-width="5"/>
            ${rep(12, i => `<rect x="199" y="322" width="2.5" height="8" fill="#3b3226"
                 transform="rotate(${i * 30} 200 360)"/>`)}
            <line class="hand-h" x1="200" y1="360" x2="200" y2="336" stroke="#3b3226" stroke-width="5" stroke-linecap="round"/>
            <line class="hand-m" x1="200" y1="360" x2="200" y2="326" stroke="#a8452f" stroke-width="3" stroke-linecap="round"/>
            <circle cx="200" cy="360" r="4" fill="#3b3226"/>
          </g>
          <rect class="win win--bruce" x="176" y="228" width="48" height="58" rx="6" fill="#3b3226"/>

          <!-- верхний ярус и шатёр -->
          <rect x="160" y="210" width="80" height="84" fill="url(#br-t2)"/>
          <path d="M200 60 L160 214 h80z" fill="#a8452f"/>
          <path d="M200 60 L160 214 h80z" fill="none" stroke="#7d3222" stroke-width="3"/>
          ${rep(5, i => `<path d="M200 ${86 + i * 26} l-${13 + i * 6.5} ${26} h${26 + i * 13}z" fill="#8f3a28" opacity=".55"/>`)}
          <rect x="196" y="18" width="8" height="46" fill="#e8b93b"/>
          <path class="flag" d="M204 22 l46 12 l-46 12z" fill="#e2603b"/>
          <circle cx="200" cy="14" r="7" fill="#ffd166" filter="url(#gl-warm)"/>

          <rect x="60" y="60" width="280" height="820" fill="url(#tw-shade)"/>
        </g>

        <!-- свет из окна Брюса -->
        <g class="bruce-beam">
          <path d="M200 258 L60 20 L340 20 Z" fill="url(#beam-g)" opacity=".0"/>
          <defs><linearGradient id="beam-g" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stop-color="#ffe6a8" stop-opacity=".55"/>
            <stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/>
          </linearGradient></defs>
        </g>
      </svg>` },
    { depth: 1.5, z: 3, html: `
      <svg class="fit" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        ${rep(5, i => `
        <g class="crow" style="animation-delay:${i * 1.4}s;--r:${90 + i * 34}px">
          <g class="crow__wing">
            <path d="M0 0 q-13 -12 -26 -3 q14 3 26 3z" fill="#0e1526"/>
            <path d="M0 0 q13 -12 26 -3 q-14 3 -26 3z" fill="#0e1526"/>
            <ellipse cx="0" cy="2" rx="8" ry="4" fill="#0e1526"/>
          </g>
        </g>`)}
      </svg>` }
  ],
  beats: [
    { t: 2600, cls: 'is-lit' },
    { t: 7600, cls: 'is-stars', fxFront: { type: 'stars', rate: 26 } },
    { t: 13500, cls: 'is-fade', fxBack: { type: 'dust', rate: 90 } }
  ],
  captions: [
    { t: 400, text: '1695 год', big: true, hold: 2600 },
    { t: 3200, text: 'Шестьдесят метров. Выше всего вокруг.' },
    { t: 7800, text: 'Наверху Навигацкая школа: тут учили водить корабли по звёздам', hold: 4200 },
    { t: 11200, text: 'В верхнем окне всю ночь горит свеча колдуна Брюса', hold: 4200 },
    { t: 15600, text: '1934 — башню разобрали за одну зиму', big: true, hold: 4000 }
  ],
  sound: [{ t: 200, s: 'rumble' }, { t: 2700, s: 'bells' }, { t: 7900, s: 'chime' }, { t: 13600, s: 'wind' }]
});

/* ============================================================
   2. КРАСНЫЕ ВОРОТА
   ============================================================ */
SCENES.push({
  id: 'vorota',
  emoji: '🎺',
  title: 'Красные Ворота',
  place: 'Площадь Красные Ворота',
  aim: 'Встань у красного вестибюля метро «Красные Ворота» и наведи камеру на площадь, в сторону Садового кольца. Арка стояла посреди проезжей части.',
  lead: 'Триумфальная арка Ухтомского: красная, с золотой Славой на крыше. Снесли в 1927-м.',
  tint: 'radial-gradient(120% 90% at 50% 40%, rgba(60,20,20,.35), rgba(12,10,24,.6))',
  fxBack: { type: 'dust', rate: 22 },
  layers: [
    { depth: 1, z: 2, cls: 'sc-arch', html: `
      <svg class="fit" viewBox="0 -120 560 980" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-gold', 7, '#ffcf5c')}
          <linearGradient id="red-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#d1523a"/><stop offset="1" stop-color="#9e3423"/>
          </linearGradient>
          <linearGradient id="gold-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#e8b93b"/><stop offset="1" stop-color="#b8862a"/>
          </linearGradient>
          <linearGradient id="stone-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fbf3e4"/><stop offset="1" stop-color="#ded0b8"/>
          </linearGradient>
        </defs>

        <g class="arch-body">
          <rect x="60" y="250" width="440" height="600" fill="url(#red-g)"/>
          <path d="M280 330 a110 110 0 0 1 110 110 v410 h-220 v-410 a110 110 0 0 1 110 -110z" fill="#120c18"/>
          <path d="M280 330 a110 110 0 0 1 110 110 v410" fill="none" stroke="url(#gold-g)" stroke-width="7"/>
          <path d="M280 330 a110 110 0 0 0 -110 110 v410" fill="none" stroke="url(#gold-g)" stroke-width="7"/>

          <!-- колонны -->
          ${rep(4, i => `
          <g transform="translate(${i < 2 ? 74 + i * 46 : 394 + (i - 2) * 46},0)">
            <rect x="0" y="276" width="34" height="560" fill="url(#stone-g)"/>
            ${rep(9, j => `<rect x="4" y="${300 + j * 60}" width="4" height="44" rx="2" fill="#c9b89a" opacity=".8"/>`)}
            <rect x="-6" y="262" width="46" height="20" rx="4" fill="#fdf7ea"/>
            <rect x="-6" y="830" width="46" height="20" rx="4" fill="#fdf7ea"/>
          </g>`)}

          <!-- антаблемент и фронтон -->
          <rect x="44" y="228" width="472" height="34" rx="4" fill="url(#stone-g)"/>
          <rect x="60" y="196" width="440" height="34" rx="4" fill="url(#red-g)"/>
          <path d="M100 196 L280 96 L460 196z" fill="url(#red-g)"/>
          <path d="M100 196 L280 96 L460 196z" fill="none" stroke="url(#stone-g)" stroke-width="9"/>
          <circle cx="280" cy="166" r="24" fill="url(#gold-g)" filter="url(#gl-gold)"/>
          ${rep(7, i => `<circle cx="${140 + i * 47}" cy="245" r="6" fill="url(#gold-g)"/>`)}

          <!-- фигуры в нишах -->
          ${rep(2, i => `
          <g transform="translate(${i ? 404 : 116},430)" opacity=".9">
            <rect x="0" y="0" width="40" height="120" rx="20" fill="#7d2c1f"/>
            <circle cx="20" cy="26" r="13" fill="url(#stone-g)"/>
            <path d="M6 44 q14 -10 28 0 l6 74 h-40z" fill="url(#stone-g)"/>
          </g>`)}
        </g>

        <!-- Слава спускается сверху и трубит -->
        <g transform="translate(0,-108)"><g class="glory">
          <g filter="url(#gl-gold)">
            <path class="glory__wing-l" d="M266 58 q-74 -6 -112 -58 q60 2 112 28z" fill="url(#gold-g)" opacity=".9"/>
            <path class="glory__wing-r" d="M294 58 q74 -6 112 -58 q-60 2 -112 28z" fill="url(#gold-g)" opacity=".9"/>
            <path d="M262 48 q18 -14 36 0 l12 92 q-30 12 -60 0z" fill="url(#gold-g)"/>
            <path d="M252 138 q-28 34 -16 72 q24 -26 32 -50z" fill="url(#gold-g)" opacity=".85"/>
            <circle cx="280" cy="28" r="16" fill="url(#gold-g)"/>
            <path d="M292 28 l84 -36 l-8 26 l14 20 l-18 8 l-14 -20 l-58 20z" fill="url(#gold-g)"/>
            <path d="M268 12 q12 -14 24 0 q-12 -6 -24 0z" fill="#fff4cf" opacity=".8"/>
          </g>
        </g></g>
      </svg>` },
    { depth: 1.7, z: 3, html: `
      <svg class="fit" viewBox="0 -120 560 980" preserveAspectRatio="xMidYMax meet">
        <g class="ribbon">
          <path d="M40 700 q240 -70 480 0 q-240 44 -480 0z" fill="#a8452f" opacity=".9"/>
          <text x="280" y="706" text-anchor="middle" font-size="42" font-family="Georgia,serif" fill="#ffe9a8">1757</text>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 3000, cls: 'is-lit' },
    { t: 5200, cls: 'is-trumpet', fxFront: { type: 'sparks', rate: 150, x: .5, y: .12 } },
    { t: 11000, cls: 'is-fade', fxFront: { type: 'dust', rate: 120 } }
  ],
  captions: [
    { t: 500, text: '«Красный» значило «красивый»', big: true, hold: 3000 },
    { t: 3400, text: 'Первые ворота — деревянные, 1709 год. Встречали войска после Полтавы.', hold: 4000 },
    { t: 7600, text: 'Каменные построил Дмитрий Ухтомский. Наверху — Слава с трубой.', hold: 4000 },
    { t: 12000, text: '1927 — арку снесли, чтобы расширить улицу', big: true, hold: 4200 }
  ],
  sound: [{ t: 300, s: 'rumble' }, { t: 5300, s: 'fanfare' }, { t: 11200, s: 'crack' }]
});

/* ============================================================
   3. ВЫСОТКА У КРАСНЫХ ВОРОТ
   ============================================================ */
SCENES.push({
  id: 'vysotka',
  emoji: '🧊',
  title: 'Высотка, которую построили криво',
  place: 'Садовая-Спасская, 21',
  aim: 'Наведи камеру на высотку со шпилем — она прямо над выходом из метро. Смотри снизу вверх, чтобы в кадр влез шпиль.',
  lead: 'Грунт заморозили, дом построили с наклоном, лёд растаял — и дом выпрямился сам.',
  tint: 'radial-gradient(120% 90% at 50% 20%, rgba(20,50,90,.4), rgba(8,14,30,.68))',
  fxBack: { type: 'frost', rate: 26 },
  layers: [
    { depth: .9, z: 2, cls: 'sc-vys', html: `
      <svg class="fit" viewBox="0 0 520 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-ice', 8, '#9fd8ff')}
          <linearGradient id="wall-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#8f8a7c"/><stop offset=".35" stop-color="#d9d2c2"/>
            <stop offset=".72" stop-color="#b9b2a2"/><stop offset="1" stop-color="#7d7768"/>
          </linearGradient>
          <linearGradient id="ice-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#bfe8ff" stop-opacity=".9"/>
            <stop offset="1" stop-color="#6fa8d8" stop-opacity=".35"/>
          </linearGradient>
        </defs>

        <!-- подземная часть: тоннель метро и трубы заморозки -->
        <g class="underground">
          <rect x="0" y="742" width="520" height="158" fill="#2a2318"/>
          <rect class="ice-soil" x="0" y="742" width="520" height="158" fill="url(#ice-g)"/>
          <ellipse cx="260" cy="820" rx="120" ry="52" fill="#0e1220"/>
          <ellipse cx="260" cy="820" rx="120" ry="52" fill="none" stroke="#8aa6c0" stroke-width="5"/>
          ${rep(9, i => `<rect class="pipe" x="${28 + i * 54}" y="748" width="7" height="140" rx="3" fill="#7fc7f5" style="animation-delay:${i * .12}s"/>`)}
          <text x="260" y="828" text-anchor="middle" font-size="26" fill="#8aa6c0" font-family="Georgia,serif">метро</text>
        </g>

        <!-- сам дом, наклонён и потом выпрямляется -->
        <g class="building">
          <rect x="120" y="470" width="280" height="280" fill="url(#wall-g)"/>
          <rect x="60" y="600" width="400" height="150" fill="#b3ac9c"/>
          <rect x="170" y="230" width="180" height="250" fill="url(#wall-g)"/>
          <rect x="196" y="150" width="128" height="90" fill="#c9c2b2"/>
          <path d="M260 44 L196 156 h128z" fill="#9c9484"/>
          <path d="M260 44 L252 76 h16z" fill="#e8b93b"/>
          <rect x="256" y="-30" width="8" height="76" fill="#e8b93b"/>
          <g class="star" transform="translate(260,-38)" filter="url(#gl-ice)">
            <path d="M0 -16 L4.7 -4.9 L16 -4.9 L6.6 2.5 L10.6 14 L0 7 L-10.6 14 L-6.6 2.5 L-16 -4.9 L-4.7 -4.9z" fill="#ffe9a8"/>
          </g>
          ${rep(24, i => `<rect class="win" x="${186 + (i % 4) * 42}" y="${258 + Math.floor(i / 4) * 34}" width="26" height="20" rx="2" fill="#3d4452"/>`)}
          ${rep(18, i => `<rect class="win" x="${134 + (i % 6) * 42}" y="${496 + Math.floor(i / 6) * 40}" width="26" height="22" rx="2" fill="#3d4452"/>`)}
          ${rep(14, i => `<rect class="win" x="${74 + (i % 7) * 52}" y="${630 + Math.floor(i / 7) * 44}" width="28" height="24" rx="2" fill="#3d4452"/>`)}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 3400, cls: 'is-frozen' },
    { t: 7200, cls: 'is-melt', fxBack: { type: 'drops', rate: 34 } },
    { t: 9200, cls: 'is-straight' },
    { t: 12000, cls: 'is-lit', fxFront: { type: 'stars', rate: 12 } }
  ],
  captions: [
    { t: 400, text: 'Внизу — мокрый плывущий грунт', hold: 3000 },
    { t: 3500, text: 'Трубы с холодным рассолом. Земля превращается в лёд.', hold: 3600 },
    { t: 7300, text: 'Дом построили заранее наклонённым — на 16 сантиметров', hold: 3800 },
    { t: 9400, text: 'Лёд растаял, земля осела, дом выпрямился ровно', big: true, hold: 4000 },
    { t: 13600, text: '1953 — так и стоит', hold: 3400 }
  ],
  sound: [{ t: 3500, s: 'steam' }, { t: 7300, s: 'crack' }, { t: 9400, s: 'rumble' }, { t: 12200, s: 'chime' }]
});

/* ============================================================
   4. АПТЕКАРСКИЙ ОГОРОД
   ============================================================ */
SCENES.push({
  id: 'ogorod',
  emoji: '🌿',
  title: 'Аптекарский огород',
  place: 'Проспект Мира, 26с1',
  aim: 'Наведи камеру на кованые ворота сада или вглубь, на деревья за забором. Лучше всего встать так, чтобы в кадре было побольше неба над деревьями.',
  lead: 'Пётр сажает лиственницу, она вырастает, и над ней проносятся все четыре времени года.',
  tint: 'radial-gradient(120% 90% at 50% 60%, rgba(20,60,40,.28), rgba(10,20,20,.5))',
  fxBack: { type: 'pollen', rate: 22 },
  layers: [
    { depth: .4, z: 1, html: `
      <svg class="fit" viewBox="0 0 900 900" preserveAspectRatio="xMidYMax meet">
        <g opacity=".5" fill="#0f2a22">
          <path d="M0 900 v-90 h900 v90z"/>
          ${rep(7, i => `<g transform="translate(${60 + i * 130},810)">
            <rect x="-4" y="-70" width="8" height="70" fill="#123227"/>
            <circle cy="-86" r="34" fill="#14382a"/></g>`)}
          <path d="M700 810 v-190 q0 -60 60 -60 h100 q60 0 60 60 v190z" fill="#12291f"/>
          ${rep(4, i => `<rect x="${716 + i * 40}" y="${600 + (i % 2) * 20}" width="26" height="60" rx="12" fill="#1c4534"/>`)}
        </g>
      </svg>` },
    { depth: 1, z: 2, cls: 'sc-garden', html: `
      <svg class="fit" viewBox="0 0 700 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-sun', 10, '#ffe9a8')}
          <filter id="leafy" x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="9" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <radialGradient id="crown-g" cx=".4" cy=".35">
            <stop offset="0" stop-color="var(--leaf-hi,#7fc25f)"/>
            <stop offset="1" stop-color="var(--leaf,#3f8a4d)"/>
          </radialGradient>
          <linearGradient id="bark-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#5c3a1c"/><stop offset=".4" stop-color="#8a5a2c"/><stop offset="1" stop-color="#4a2e14"/>
          </linearGradient>
        </defs>

        <ellipse cx="360" cy="866" rx="300" ry="34" fill="rgba(0,0,0,.35)"/>

        <!-- дерево растёт из саженца -->
        <g class="tree">
          <path class="trunk" d="M360 866 C352 700 348 600 356 500 C362 430 372 380 364 300"
                stroke="url(#bark-g)" stroke-width="46" stroke-linecap="round" fill="none"/>
          <g class="branches" stroke="url(#bark-g)" stroke-linecap="round" fill="none">
            <path d="M358 640 C300 600 250 580 190 566" stroke-width="20"/>
            <path d="M356 560 C420 520 470 500 540 486" stroke-width="18"/>
            <path d="M356 470 C300 430 260 410 216 392" stroke-width="14"/>
            <path d="M360 396 C410 360 450 344 496 330" stroke-width="12"/>
            <path d="M362 330 C330 300 310 286 286 268" stroke-width="10"/>
          </g>
          <g class="crown" filter="url(#leafy)">
            ${rep(16, i => {
              const cx = [190, 250, 300, 540, 480, 430, 216, 270, 320, 496, 450, 400, 286, 330, 380, 360][i];
              const cy = [566, 540, 520, 486, 462, 452, 392, 372, 358, 330, 316, 306, 268, 250, 240, 200][i];
              const r  = [86, 74, 66, 84, 72, 64, 70, 62, 58, 66, 58, 54, 56, 50, 46, 44][i];
              return `<circle class="leaf" cx="${cx}" cy="${cy}" r="${r}" fill="url(#crown-g)" style="animation-delay:${1.1 + i * .13}s"/>`;
            })}
          </g>
        </g>

        <!-- Пётр с лопатой -->
        <g class="peter" transform="translate(96,672)">
          <ellipse cx="52" cy="196" rx="60" ry="12" fill="rgba(0,0,0,.3)"/>
          <path d="M22 194 L34 96 h40 l14 98z" fill="#1d3a63"/>
          <path d="M30 100 h56 l-6 -34 h-44z" fill="#27508a"/>
          <rect x="38" y="42" width="30" height="40" rx="12" fill="#f0c9a4"/>
          <path d="M36 44 q18 -16 36 0 q-6 -22 -18 -22 q-12 0 -18 22z" fill="#2b1c10"/>
          <path d="M12 40 q42 -30 84 0 q-42 -14 -84 0z" fill="#15233c"/>
          <path d="M40 62 q6 6 14 0" stroke="#2b1c10" stroke-width="2.5" fill="none"/>
          <g class="peter__arm">
            <path d="M72 108 l34 30" stroke="#f0c9a4" stroke-width="13" stroke-linecap="round"/>
            <path d="M104 136 l30 52" stroke="#8a5a2c" stroke-width="8" stroke-linecap="round"/>
            <path d="M128 180 l24 42 l-22 12 l-22 -44z" fill="#b9c2ca"/>
          </g>
        </g>

        <!-- солнце пробивается сквозь крону -->
        <g class="sun" opacity="0">
          <g class="sun__rays">
            ${rep(12, i => `<path d="M560 92 v-46" stroke="#ffe9a8" stroke-width="9" stroke-linecap="round"
                 transform="rotate(${i * 30} 560 180)" opacity=".75"/>`)}
          </g>
          <circle cx="560" cy="180" r="52" fill="#ffe9a8" filter="url(#gl-sun)"/>
        </g>
      </svg>` },
    { depth: 1.8, z: 3, html: `
      <svg class="fit" viewBox="0 0 900 900" preserveAspectRatio="xMidYMax meet">
        ${rep(4, i => `
        <g class="fly" style="animation-delay:${i * 2.1}s;--y:${120 + i * 150}px">
          <g class="fly__body">
            <path d="M0 0 q-26 -26 -3 -32 q12 -3 3 32z" fill="#ffd166" opacity=".95"/>
            <path d="M0 0 q26 -26 3 -32 q-12 -3 -3 32z" fill="#ffb84d" opacity=".95"/>
            <rect x="-2" y="-6" width="4" height="16" rx="2" fill="#6b4a2c"/>
          </g>
        </g>`)}
      </svg>` }
  ],
  beats: [
    { t: 1000, cls: 'is-grow' },
    { t: 6000, cls: 'is-sun' },
    { t: 8000, cls: 'is-autumn', fxBack: { type: 'leaves', rate: 16 } },
    { t: 11000, cls: 'is-winter', fxBack: { type: 'snow', rate: 40 } },
    { t: 14000, cls: 'is-spring', fxBack: { type: 'pollen', rate: 26 } }
  ],
  captions: [
    { t: 400, text: '1706 год. Указ Петра: разбить огород для лекарственных трав.', hold: 3600 },
    { t: 4200, text: 'Говорят, эту лиственницу он посадил своими руками', hold: 3400 },
    { t: 8200, text: 'Осень', big: true, hold: 2200 },
    { t: 11200, text: 'Зима', big: true, hold: 2200 },
    { t: 14200, text: 'И снова весна. Дереву больше двухсот лет.', hold: 4000 }
  ],
  sound: [{ t: 900, s: 'grow' }, { t: 6100, s: 'chime' }, { t: 11100, s: 'wind' }, { t: 14300, s: 'sparkle' }]
});

/* ============================================================
   5. СТРАННОПРИИМНЫЙ ДОМ ШЕРЕМЕТЕВА
   ============================================================ */
SCENES.push({
  id: 'sheremetev',
  emoji: '🎭',
  title: 'Странноприимный дом',
  place: 'Большая Сухаревская площадь, 3',
  aim: 'Наведи камеру на полукруглую колоннаду Склифа — она смотрит прямо на площадь. Постарайся поймать в кадр весь купол.',
  lead: 'Граф, крепостная актриса и больница, которую он построил в память о ней.',
  tint: 'radial-gradient(120% 90% at 50% 45%, rgba(40,26,60,.4), rgba(10,8,22,.68))',
  fxBack: { type: 'fog', rate: 2 },
  layers: [
    { depth: .8, z: 1, cls: 'sc-sher', html: `
      <svg class="fit" viewBox="120 70 660 700" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-win', 7, '#ffca62')}
          <linearGradient id="fac-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f6ecdc"/><stop offset="1" stop-color="#cfc0a6"/>
          </linearGradient>
          <linearGradient id="dome-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#dfe8f2"/><stop offset="1" stop-color="#9aa9bd"/>
          </linearGradient>
        </defs>

        <rect x="40" y="400" width="820" height="330" fill="url(#fac-g)"/>
        <path d="M450 120 a250 250 0 0 1 250 280 h-500 a250 250 0 0 1 250 -280z" fill="#e6d9c2"/>
        <path d="M450 150 a132 132 0 0 1 132 132 h-264 a132 132 0 0 1 132 -132z" fill="url(#dome-g)"/>
        <rect x="446" y="96" width="8" height="56" fill="#c9a25a"/>
        <circle cx="450" cy="92" r="9" fill="#e8b93b"/>

        <!-- колоннада полукругом -->
        ${rep(11, i => {
          const a = Math.PI * (0.06 + i * 0.088);
          const x = 450 - Math.cos(a) * 300;
          const y = 400 - Math.sin(a) * 44;
          return `<g transform="translate(${x.toFixed(1)},0)">
            <rect x="-13" y="${y.toFixed(1)}" width="26" height="${(724 - y).toFixed(1)}" fill="#fdf8ee"/>
            <rect x="-19" y="${(y - 16).toFixed(1)}" width="38" height="18" rx="4" fill="#fff"/>
            <rect x="-19" y="708" width="38" height="18" rx="4" fill="#efe5d2"/>
          </g>`;
        })}

        ${rep(12, i => `<rect class="win" x="${72 + i * 66}" y="470" width="38" height="58" rx="5" fill="#3a3428"/>`)}
        ${rep(12, i => `<rect class="win" x="${72 + i * 66}" y="576" width="38" height="46" rx="5" fill="#3a3428" style="animation-delay:${i * .1}s"/>`)}
        <rect class="win win--door" x="420" y="620" width="60" height="106" rx="6" fill="#3a3428"/>
      </svg>` },
    { depth: 1.3, z: 2, html: `
      <svg class="fit" viewBox="120 70 660 700" preserveAspectRatio="xMidYMax meet">
        <g class="carriage">
          <ellipse cx="120" cy="726" rx="130" ry="14" fill="rgba(0,0,0,.32)"/>
          <!-- лошадь -->
          <g transform="translate(196,596)">
            <path d="M0 84 q6 -66 56 -70 q52 -4 62 40 l8 52 h-16 l-10 -38 h-88 l-12 40 h-16z" fill="#4a3524"/>
            <path d="M112 54 q26 -22 34 -52 q-2 30 -12 46z" fill="#3a2819"/>
            <circle cx="146" cy="8" r="17" fill="#4a3524"/>
            <path d="M140 -6 l-6 -18 l14 10z" fill="#3a2819"/>
            <circle cx="152" cy="6" r="2.4" fill="#0f0b06"/>
            <g class="legs">
              <path class="leg leg--1" d="M22 78 l-8 60" stroke="#4a3524" stroke-width="10" stroke-linecap="round"/>
              <path class="leg leg--2" d="M52 82 l6 56" stroke="#42301f" stroke-width="10" stroke-linecap="round"/>
              <path class="leg leg--3" d="M92 82 l-6 56" stroke="#4a3524" stroke-width="10" stroke-linecap="round"/>
              <path class="leg leg--4" d="M118 78 l10 60" stroke="#42301f" stroke-width="10" stroke-linecap="round"/>
            </g>
          </g>
          <!-- карета -->
          <g transform="translate(30,592)">
            <rect x="0" y="20" width="150" height="86" rx="14" fill="#2a1c12"/>
            <rect x="14" y="34" width="52" height="42" rx="8" fill="#ffca62" class="cab-win"/>
            <rect x="82" y="34" width="52" height="42" rx="8" fill="#ffca62" class="cab-win"/>
            <path d="M150 60 l52 -14" stroke="#4a3524" stroke-width="7"/>
            <circle class="wheel" cx="34" cy="122" r="26" fill="none" stroke="#6b4a2c" stroke-width="7"/>
            <circle class="wheel" cx="122" cy="122" r="26" fill="none" stroke="#6b4a2c" stroke-width="7"/>
            <circle cx="10" cy="24" r="9" fill="#ffd166" filter="url(#gl-win)"/>
          </g>
        </g>
      </svg>` },
    { depth: 1.9, z: 3, cls: 'wide', html: `
      <svg class="fit" viewBox="0 0 900 760" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="curt-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#5e1420"/><stop offset="1" stop-color="#9b2436"/>
          </linearGradient>
          <linearGradient id="curt-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stop-color="#5e1420"/><stop offset="1" stop-color="#9b2436"/>
          </linearGradient>
          <radialGradient id="spot-g" cx=".5" cy=".2">
            <stop offset="0" stop-color="#fff6dd" stop-opacity=".55"/>
            <stop offset="1" stop-color="#fff6dd" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <g class="curtain curtain--l">
          <rect x="-40" y="-40" width="520" height="840" fill="url(#curt-l)"/>
          ${rep(9, i => `<rect x="${-30 + i * 56}" y="-40" width="12" height="840" fill="#4a0f19" opacity=".5"/>`)}
        </g>
        <g class="curtain curtain--r">
          <rect x="420" y="-40" width="520" height="840" fill="url(#curt-r)"/>
          ${rep(9, i => `<rect x="${440 + i * 56}" y="-40" width="12" height="840" fill="#4a0f19" opacity=".5"/>`)}
        </g>
        <g class="diva">
          <path d="M372 0 L450 330 L528 0z" fill="url(#spot-g)" style="mix-blend-mode:screen"/>
          <g transform="translate(450,300) scale(1.25)">
            <path d="M-58 300 q0 -170 58 -180 q58 10 58 180z" fill="#1a1424" opacity=".92"/>
            <circle cy="-38" r="30" fill="#1a1424"/>
            <path d="M-30 -46 q30 -40 60 0 q-6 -46 -30 -46 q-24 0 -30 46z" fill="#120e1a"/>
            <path d="M-58 120 q58 -26 116 0" stroke="#e8b93b" stroke-width="4" fill="none" opacity=".8"/>
          </g>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 1200, cls: 'is-curtain', fxFront: { type: 'notes', rate: 6, x: .5, y: .55 } },
    { t: 6400, cls: 'is-lit' },
    { t: 8200, cls: 'is-carriage', fxBack: { type: 'dust', rate: 30 } }
  ],
  captions: [
    { t: 600, text: 'Прасковья Жемчугова, крепостная актриса', hold: 3600 },
    { t: 4600, text: 'Слушать её приезжала сама императрица', hold: 3200 },
    { t: 8000, text: 'Граф женился на ней тайно', hold: 3600 },
    { t: 12400, text: 'В память о ней он построил тут больницу', big: true, hold: 4600 }
  ],
  sound: [{ t: 1300, s: 'chime' }, { t: 4700, s: 'bells' }, { t: 8300, s: 'hooves' }]
});

/* ============================================================
   6. ПАТЕРНОСТЕР В ДОМЕ НАРКОМЗЕМА
   ============================================================ */
SCENES.push({
  id: 'narkomzem',
  emoji: '🛗',
  title: 'Лифт, который не останавливается',
  place: 'Садовая-Спасская, 11/1',
  aim: 'Наведи камеру на большой серый дом с круглой башней на углу — он стоит вдоль Садового кольца. Сцена «разрежет» фасад и покажет, что внутри.',
  lead: 'Патерностер: кабинки без дверей едут по кругу, запрыгивать надо на ходу.',
  tint: 'radial-gradient(120% 90% at 50% 40%, rgba(20,30,40,.34), rgba(8,12,18,.6))',
  fxBack: null,
  layers: [
    { depth: 1, z: 2, cls: 'sc-pater', html: `
      <svg class="fit" viewBox="0 0 620 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-lamp', 6, '#ffd98a')}
          <linearGradient id="conc-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#9aa0a6"/><stop offset=".5" stop-color="#cfd4d8"/><stop offset="1" stop-color="#8d949a"/>
          </linearGradient>
        </defs>

        <!-- шахта внутри -->
        <g class="shaft">
          <rect x="120" y="120" width="380" height="740" fill="#1a2029"/>
          ${rep(9, i => `<g>
            <rect x="120" y="${150 + i * 78}" width="380" height="4" fill="#2f3a46"/>
            <text x="132" y="${176 + i * 78}" font-size="20" fill="#59677a" font-family="Georgia,serif">${9 - i}</text>
          </g>`)}
          <rect x="296" y="120" width="8" height="740" fill="#2f3a46"/>
          ${rep(8, i => `
            <g class="cabin" style="animation-delay:${-i * 1.75}s">
              <rect x="150" y="700" width="130" height="120" rx="8" fill="#f0d9a0"/>
              <rect x="150" y="700" width="130" height="120" rx="8" fill="none" stroke="#c9a25a" stroke-width="4"/>
              <circle cx="176" cy="712" r="7" fill="#ffd98a" filter="url(#gl-lamp)"/>
              <g transform="translate(196,724)" opacity="${i % 3 === 0 ? 1 : 0}">
                <circle cx="18" cy="14" r="13" fill="#3b4a5e"/>
                <path d="M2 74 q0 -46 16 -46 q16 0 16 46z" fill="#3b4a5e"/>
              </g>
            </g>`)}
        </g>

        <!-- фасад, который разъезжается и открывает шахту -->
        <g class="facade facade--l">
          <rect x="0" y="60" width="310" height="820" fill="url(#conc-g)"/>
          ${rep(9, i => `<rect x="24" y="${110 + i * 84}" width="262" height="40" rx="4" fill="#4a545e"/>`)}
          <rect x="0" y="40" width="310" height="26" rx="4" fill="#b6bcc2"/>
        </g>
        <g class="facade facade--r">
          <rect x="310" y="60" width="310" height="820" fill="url(#conc-g)"/>
          ${rep(9, i => `<rect x="334" y="${110 + i * 84}" width="262" height="40" rx="4" fill="#4a545e"/>`)}
          <rect x="310" y="40" width="310" height="26" rx="4" fill="#b6bcc2"/>
          <path d="M560 880 v-560 a60 60 0 0 1 60 -60 v620z" fill="#b9bfc5"/>
        </g>

        <!-- цепь патерностера -->
        <g class="chain" opacity="0">
          <path d="M215 780 L215 200 A28 28 0 0 1 243 172 L373 172 A28 28 0 0 1 401 200 L401 780 A28 28 0 0 1 373 808 L243 808 A28 28 0 0 1 215 780z"
                fill="none" stroke="#5c6875" stroke-width="6" stroke-dasharray="14 12"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 2200, cls: 'is-open' },
    { t: 5200, cls: 'is-run-lift' },
    { t: 11000, cls: 'is-lit' }
  ],
  captions: [
    { t: 500, text: 'Дом Наркомзема, архитектор Щусев, 1933 год', hold: 3200 },
    { t: 2600, text: 'Внутри — патерностер: кабинки без дверей', hold: 3400 },
    { t: 6200, text: 'Лифт едет по кругу и никогда не останавливается. Заходить надо на ходу.', big: true, hold: 4600 },
    { t: 11200, text: '«Патерностер» значит «Отче наш»: кабинки как чётки', hold: 4400 }
  ],
  sound: [{ t: 2300, s: 'crack' }, { t: 5300, s: 'lift' }, { t: 11200, s: 'chime' }]
});

/* ============================================================
   7. УЛАНЫ В ПЕРЕУЛКЕ
   ============================================================ */
SCENES.push({
  id: 'ulan',
  emoji: '🐎',
  title: 'Уланы',
  place: 'Уланский переулок',
  aim: 'Встань в начале Уланского переулка и наведи камеру вдоль него — так, чтобы в кадре была сама улица, уходящая вдаль.',
  lead: 'Из тумана выезжает эскадрон: пики, флажки-флюгеры, пыль из-под копыт.',
  tint: 'radial-gradient(120% 90% at 50% 55%, rgba(30,40,60,.4), rgba(10,14,24,.62))',
  fxBack: { type: 'fog', rate: 3 },
  layers: [
    { depth: .5, z: 1, html: `
      <svg class="fit" viewBox="0 0 900 760" preserveAspectRatio="xMidYMax meet">
        <g opacity=".45" fill="#101a2c">
          <rect x="0" y="380" width="240" height="380"/>
          <rect x="250" y="330" width="200" height="430"/>
          <rect x="460" y="410" width="180" height="350"/>
          <rect x="650" y="350" width="250" height="410"/>
          ${rep(20, i => `<rect x="${24 + (i % 10) * 88}" y="${420 + Math.floor(i / 10) * 90}" width="28" height="40" fill="#ffca62" opacity=".22"/>`)}
        </g>
      </svg>` },
    { depth: 1.15, z: 2, cls: 'sc-ulan', html: `
      <svg class="fit" viewBox="0 0 620 700" preserveAspectRatio="xMidYMax meet">
        ${rep(3, i => {
          const s = [1.05, 1.35, 1.7][i];
          const y = [330, 450, 600][i];
          const dl = [0, 2.6, 5.2][i];
          const coat = ['#2a4d8f', '#22406e', '#3560a8'][i];
          const hide = ['#7a5636', '#6b4a2c', '#8a6440'][i];
          return `
          <g class="rider" style="animation-delay:${dl}s;--s:${s}">
            <g transform="translate(0,${y}) scale(${s})">
              <ellipse cx="150" cy="150" rx="140" ry="16" fill="rgba(0,0,0,.3)"/>
              <!-- конь -->
              <path d="M40 130 q10 -84 76 -88 q70 -4 84 52 l12 66 h-20 l-14 -48 h-118 l-16 50 h-20z" fill="${hide}"/>
              <path d="M40 130 q10 -84 76 -88 q70 -4 84 52" fill="none" stroke="#e8c48a" stroke-width="3" opacity=".55"/>
              <path d="M196 90 q30 -28 40 -62 q0 36 -14 56z" fill="#48311d"/>
              <circle cx="238" cy="26" r="21" fill="${hide}"/>
              <path d="M230 8 l-8 -22 l18 12z" fill="#48311d"/>
              <circle cx="246" cy="24" r="3" fill="#0f0b06"/>
              <path d="M252 40 q12 6 8 18" stroke="#3a2819" stroke-width="3" fill="none"/>
              <g class="legs">
                <path class="leg leg--1" d="M60 122 l-14 76" stroke="${hide}" stroke-width="13" stroke-linecap="round"/>
                <path class="leg leg--2" d="M100 128 l8 72" stroke="#4e3520" stroke-width="13" stroke-linecap="round"/>
                <path class="leg leg--3" d="M162 128 l-8 72" stroke="${hide}" stroke-width="13" stroke-linecap="round"/>
                <path class="leg leg--4" d="M198 122 l16 76" stroke="#4e3520" stroke-width="13" stroke-linecap="round"/>
              </g>
              <!-- улан -->
              <g class="rider__body">
                <path d="M96 46 q30 -34 62 -4 l10 46 h-78z" fill="${coat}"/>
                <path d="M104 88 l-12 44 h72 l-10 -44z" fill="${coat}"/>
                <circle cx="128" cy="18" r="16" fill="#f0c9a4"/>
                <path d="M108 6 h40 l6 -18 h-52z" fill="#16233c"/>
                <rect x="106" y="-16" width="44" height="8" fill="#16233c" transform="rotate(-4 128 -12)"/>
                <path d="M150 62 L300 -76" stroke="#c9a25a" stroke-width="6" stroke-linecap="round"/>
                <path class="pennon" d="M282 -60 l44 -12 l-18 24 l14 16z" fill="#c9573f"/>
              </g>
            </g>
          </g>`;
        })}
      </svg>` }
  ],
  beats: [
    { t: 1500, cls: 'is-ride', fxBack: { type: 'dust', rate: 70 } },
    { t: 9000, cls: 'is-fade' }
  ],
  captions: [
    { t: 600, text: 'Уланы — лёгкая кавалерия. Тут стояли их казармы.', hold: 3600 },
    { t: 4200, text: 'Главное оружие — пика с флажком-флюгером', hold: 3400 },
    { t: 7800, text: 'Флажок не для красоты: по нему в дыму узнавали своих', big: true, hold: 4400 },
    { t: 12400, text: 'Мясницкая, Басманная, Скатертный: город подписан профессиями', hold: 4400 }
  ],
  sound: [{ t: 1400, s: 'hooves' }, { t: 4400, s: 'wind' }, { t: 8000, s: 'hooves' }]
});

/* ============================================================
   8. АКАДЕМИК САХАРОВ
   ============================================================ */
SCENES.push({
  id: 'sakharov',
  emoji: '🕊',
  title: 'Академик Сахаров',
  place: 'Проспект Академика Сахарова',
  aim: 'Наведи камеру вдоль проспекта — на широкую улицу и небо над ней. Чем больше неба в кадре, тем лучше.',
  lead: 'Атом, вспышка и стая голубей: физик, который придумал бомбу и всю жизнь мешал её применить.',
  tint: 'radial-gradient(120% 90% at 50% 35%, rgba(16,28,54,.42), rgba(6,10,22,.66))',
  fxBack: { type: 'stars', rate: 18 },
  layers: [
    { depth: 1, z: 2, cls: 'sc-sakh', html: `
      <svg class="fit" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
        <defs>
          ${glowFilter('gl-atom', 9, '#8fd0ff')}
          ${glowFilter('gl-flash', 26, '#fff6dd')}
          <radialGradient id="core-g"><stop offset="0" stop-color="#fff6dd"/><stop offset="1" stop-color="#ffb44d"/></radialGradient>
          <radialGradient id="boom-g"><stop offset="0" stop-color="#fff6dd" stop-opacity=".95"/><stop offset="1" stop-color="#ff9a4d" stop-opacity="0"/></radialGradient>
        </defs>

        <g class="atom" transform="translate(400,380)" filter="url(#gl-atom)">
          ${rep(3, i => `
          <g class="orbit orbit--${i + 1}" transform="rotate(${i * 60})">
            <ellipse rx="210" ry="76" fill="none" stroke="${['#8fd0ff', '#a8e6b0', '#ffb4a1'][i]}" stroke-width="5" opacity=".85"/>
            <circle class="electron" cx="210" cy="0" r="14" fill="${['#8fd0ff', '#a8e6b0', '#ffb4a1'][i]}"/>
          </g>`)}
          <circle class="core" r="40" fill="url(#core-g)"/>
        </g>

        <circle class="flash" cx="400" cy="380" r="200" fill="url(#boom-g)"/>

        <g class="doves">
          ${rep(9, i => `
          <g class="dove" style="animation-delay:${i * .34}s;--x:${(i - 4) * 96}px;--sx:${(i - 4) * 42}px;--d:${4 + (i % 3) * .7}s;scale:${(.7 + (i % 3) * .22).toFixed(2)}">
            <path d="M4 6 q30 -26 66 -16 q24 -20 44 -6 q-14 8 -18 20 q26 16 2 32 q-42 20 -76 -8 q-22 -10 -18 -22z" fill="#f6f9ff"/>
            <circle cx="112" cy="8" r="3.4" fill="#16233c"/>
            <path d="M120 12 l14 4 l-14 5z" fill="#e2a03b"/>
            <path class="dove__wing" d="M34 10 q22 -40 62 -34 q-18 26 -30 44z" fill="#dfe8f7"/>
          </g>`)}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 4200, cls: 'is-boom', fxFront: { type: 'sparks', rate: 240, x: .5, y: .47 } },
    { t: 6000, cls: 'is-doves', fxFront: { type: 'stars', rate: 20 } }
  ],
  captions: [
    { t: 500, text: 'Андрей Сахаров стал академиком в 32 года', hold: 3400 },
    { t: 4300, text: 'Он придумал самое мощное оружие в истории', big: true, hold: 3400 },
    { t: 7800, text: 'А потом посчитал, что будет, если его применят', hold: 3600 },
    { t: 11600, text: 'И всю жизнь добивался, чтобы его не применили', hold: 4600 }
  ],
  sound: [{ t: 600, s: 'chime' }, { t: 4300, s: 'boom' }, { t: 6200, s: 'sparkle' }, { t: 11800, s: 'bells' }]
});

/* ============================================================
   9. ХРАМ ПЕТРА И ПАВЛА И БАСМАННЫЙ ХЛЕБ
   ============================================================ */
SCENES.push({
  id: 'petropavel',
  emoji: '🍞',
  title: 'Храм Петра и Павла',
  place: 'Новая Басманная, 11',
  aim: 'Наведи камеру на храм за оградой — на высокую колокольню и купол в форме короны.',
  lead: 'Чертёж прямо в воздухе превращается в храм, а внизу пекарь ставит клеймо на хлеб.',
  tint: 'radial-gradient(120% 90% at 50% 40%, rgba(14,30,60,.42), rgba(6,10,22,.64))',
  fxBack: { type: 'stars', rate: 10 },
  layers: [
    { depth: 1, z: 2, cls: 'sc-temple', html: `
      <svg class="fit" viewBox="0 0 700 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-blue', 8, '#7fc7f5')}
          ${glowFilter('gl-gold2', 7, '#ffcf5c')}
          <linearGradient id="temp-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#e8dcc6"/><stop offset=".45" stop-color="#faf3e6"/><stop offset="1" stop-color="#d6c8ae"/>
          </linearGradient>
          <linearGradient id="roof-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#5c8fb0"/><stop offset="1" stop-color="#2f5f80"/>
          </linearGradient>
        </defs>

        <!-- синька: чертёж прочерчивается линиями -->
        <g class="blueprint" fill="none" stroke="#7fc7f5" stroke-width="3" filter="url(#gl-blue)">
          <path class="bp" d="M120 860 v-330 h190 v330z"/>
          <path class="bp" d="M120 530 h190"/>
          <path class="bp" d="M215 530 q95 -70 95 -150 q0 -80 -95 -80 q-95 0 -95 80 q0 80 95 150z"/>
          <path class="bp" d="M420 860 v-520 h150 v520z"/>
          <path class="bp" d="M495 340 L420 344"/>
          <path class="bp" d="M495 120 L420 344 h150z"/>
          <path class="bp" d="M495 60 v60"/>
          <path class="bp" d="M120 700 h190 M420 700 h150 M120 620 h190 M420 620 h150"/>
        </g>

        <!-- сам храм -->
        <g class="temple">
          <rect x="120" y="530" width="190" height="330" fill="url(#temp-g)"/>
          <path d="M215 380 q95 60 95 150 h-190 q0 -90 95 -150z" fill="url(#roof-g)"/>
          <path d="M215 300 q46 34 46 78 q0 -22 -46 -44 q-46 22 -46 44 q0 -44 46 -78z" fill="#c9a25a"/>
          <rect x="211" y="252" width="8" height="52" fill="#e8b93b"/>
          <path d="M198 268 h34" stroke="#e8b93b" stroke-width="6"/>
          <circle cx="215" cy="246" r="8" fill="#ffd166" filter="url(#gl-gold2)"/>
          ${rep(3, i => `<rect class="win" x="${146 + i * 58}" y="596" width="34" height="74" rx="17" fill="#3a3428"/>`)}
          <rect class="win win--door" x="188" y="760" width="54" height="100" rx="26" fill="#3a3428"/>

          <rect x="420" y="340" width="150" height="520" fill="url(#temp-g)"/>
          <path d="M495 120 L420 348 h150z" fill="url(#roof-g)"/>
          <rect x="491" y="66" width="8" height="58" fill="#e8b93b"/>
          <circle cx="495" cy="60" r="9" fill="#ffd166" filter="url(#gl-gold2)"/>
          <g class="belfry">
            <rect x="440" y="380" width="110" height="120" rx="8" fill="#2a2318"/>
            <g class="bell">
              <path d="M470 400 q25 0 25 40 v22 h-50 v-22 q0 -40 25 -40z" fill="#c9a25a"/>
              <circle cx="495" cy="470" r="7" fill="#8a6a2c"/>
            </g>
            ${rep(3, i => `<circle class="ring" cx="495" cy="440" r="${70 + i * 46}" fill="none" stroke="#ffe9a8" stroke-width="3" style="animation-delay:${i * .5}s"/>`)}
          </g>
          ${rep(4, i => `<rect class="win" x="${446 + (i % 2) * 62}" y="${560 + Math.floor(i / 2) * 120}" width="36" height="76" rx="18" fill="#3a3428"/>`)}
        </g>
      </svg>` },
    { depth: 1.7, z: 3, html: `
      <svg class="fit" viewBox="0 0 700 900" preserveAspectRatio="xMidYMax meet">
        <g class="baker" transform="translate(360,600)">
          <!-- печь -->
          <path d="M-40 300 v-120 q0 -60 80 -60 h180 q80 0 80 60 v120z" fill="#5a4634"/>
          <path d="M20 300 v-90 q0 -40 60 -40 h100 q60 0 60 40 v90z" fill="#1d1108"/>
          <path class="fire" d="M60 300 q20 -70 70 -90 q-16 40 6 46 q26 8 34 -32 q40 44 20 76z" fill="#ff9a3c"/>
          <!-- каравай и клеймо -->
          <g transform="translate(130,326)">
            <ellipse rx="96" ry="42" fill="#c98a44"/>
            <ellipse ry="38" rx="96" cy="-8" fill="#e8b268"/>
            <g class="stamp">
              <rect x="-16" y="-160" width="32" height="90" rx="6" fill="#6b4a2c"/>
              <circle cy="-46" r="30" fill="#8a5a2c"/>
              <circle cy="-46" r="22" fill="#b3762f"/>
              <path d="M-10 -46 h20 M0 -56 v20" stroke="#e8b268" stroke-width="5"/>
            </g>
          </g>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 3200, cls: 'is-built' },
    { t: 6400, cls: 'is-ring' },
    { t: 9000, cls: 'is-bake', fxFront: { type: 'embers', rate: 26 } }
  ],
  captions: [
    { t: 500, text: 'Говорят, чертёж набросал сам Пётр I', hold: 3200 },
    { t: 3400, text: '1705 год. Купол не луковкой, а короной.', hold: 3400 },
    { t: 6600, text: 'Колокольню достроили только через сорок лет', hold: 3200 },
    { t: 9200, text: 'А улица — Басманная, по пекарям', big: true, hold: 3400 },
    { t: 12800, text: 'Басма — клеймо на буханке', big: true, hold: 4200 }
  ],
  sound: [{ t: 600, s: 'sparkle' }, { t: 3300, s: 'rumble' }, { t: 6500, s: 'bells' }, { t: 9300, s: 'steam' }]
});

/* ============================================================
   10. САД ИМЕНИ БАУМАНА — ФИНАЛ
   ============================================================ */
SCENES.push({
  id: 'bauman',
  emoji: '🎆',
  title: 'Финал: сад имени Баумана',
  place: 'Старая Басманная, 15',
  aim: 'Зайди в сад, найди в глубине каменный грот и наведи камеру на него. Хорошо, если в кадр попадут деревья над гротом — по ним побегут гирлянды.',
  lead: 'Гирлянды, оркестр в гроте и салют над садом. Конец маршрута.',
  tint: 'radial-gradient(120% 90% at 50% 70%, rgba(20,26,60,.36), rgba(6,8,24,.66))',
  fxBack: { type: 'fog', rate: 2 },
  layers: [
    { depth: .45, z: 1, html: `
      <svg class="fit" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMax meet">
        <g fill="#0d2019" opacity=".7">
          ${rep(8, i => `<g transform="translate(${60 + i * 128},760)">
            <rect x="-7" y="-120" width="14" height="120" fill="#12291f"/>
            <circle cy="-150" r="${52 + (i % 3) * 12}" fill="#0f2a20"/>
          </g>`)}
        </g>
        <g class="garland">
          ${rep(4, i => `
          <path d="M${-40 + i * 280} 130 q140 90 280 0" fill="none" stroke="#3a3a2a" stroke-width="3"/>
          ${rep(9, j => {
            const t = j / 8, x = -40 + i * 280 + 280 * t;
            const y = 130 + 90 * 2 * t * (1 - t);
            return `<circle class="bulb" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="7"
                     fill="${['#ffd166', '#ff8f6b', '#8fd0ff', '#a8e6b0'][(i + j) % 4]}"
                     style="animation-delay:${((i * 9 + j) % 12) * .16}s"/>`;
          })}`)}
        </g>
      </svg>` },
    { depth: 1, z: 2, cls: 'sc-bauman', html: `
      <svg class="fit" viewBox="0 0 900 800" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glowFilter('gl-grot', 12, '#ffca62')}
          <linearGradient id="stone2-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#9c9484"/><stop offset="1" stop-color="#5f594c"/>
          </linearGradient>
          <radialGradient id="grot-light" cx=".5" cy=".8">
            <stop offset="0" stop-color="#ffca62" stop-opacity=".85"/>
            <stop offset="1" stop-color="#ffca62" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <path d="M120 780 v-230 q0 -180 330 -180 q330 0 330 180 v230z" fill="url(#stone2-g)"/>
        ${rep(22, i => `<ellipse cx="${150 + (i % 11) * 60}" cy="${420 + Math.floor(i / 11) * 90 + (i % 3) * 18}"
             rx="${22 + (i % 4) * 6}" ry="${16 + (i % 3) * 5}" fill="#7d7668" opacity=".55"/>`)}

        <path class="grot-mouth" d="M450 780 v-250 q-130 0 -130 150 v100z M450 780 v-250 q130 0 130 150 v100z" fill="#120f0c"/>
        <path class="grot-glow" d="M450 790 v-260 q-140 0 -140 160 v100z M450 790 v-260 q140 0 140 160 v100z" fill="url(#grot-light)" opacity="0"/>

        <!-- оркестр в глубине грота -->
        <g class="band">
          ${rep(3, i => `
          <g transform="translate(${396 + i * 54},640)">
            <g class="player" style="animation-delay:${i * .3}s">
              <circle cy="-16" r="12" fill="#1b1710"/>
              <path d="M-14 60 q0 -46 14 -46 q14 0 14 46z" fill="#1b1710"/>
              <path d="M12 6 l26 -22" stroke="#c9a25a" stroke-width="5"/>
            </g>
          </g>`)}
        </g>

        <g class="lamps">
          ${rep(2, i => `
          <g transform="translate(${i ? 760 : 140},560)">
            <rect x="-5" y="0" width="10" height="220" fill="#2a2a24"/>
            <path d="M-20 0 h40 l-8 -34 h-24z" fill="#3a3a30"/>
            <circle cy="-18" r="12" fill="#ffd166" filter="url(#gl-grot)"/>
          </g>`)}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 1800, cls: 'is-lit' },
    { t: 4000, cls: 'is-band' },
    { t: 5600, cls: 'is-salute', fxFront: { type: 'fireworks' } }
  ],
  captions: [
    { t: 600, text: 'Двести лет назад это был частный сад Голицыных', hold: 3400 },
    { t: 4200, text: 'Грот остался ещё от усадьбы: в жару в нём прятались от солнца', hold: 3800 },
    { t: 8200, text: 'В 1920 году сад открыли для всех', hold: 3400 },
    { t: 12000, text: 'Маршрут пройден!', big: true, hold: 5000 }
  ],
  sound: [{ t: 1900, s: 'chime' }, { t: 4100, s: 'fanfare' }, { t: 5700, s: 'salute' }, { t: 12100, s: 'bells' }]
});
