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


/* Фото-слой: вырезанная реконструкция и всё, что её оживляет.
   --img нужен для масок: свет, блики и осколки рисуются строго по силуэту объекта. */
const assetUrl = file => new URL('assets/' + file, location.href).href;   // в CSS-переменной путь должен быть абсолютным

const photoLayer = (file, ar, pins = [], extra = '') => `
  <div class="photo ${extra}" style="--ar:${ar};--img:url('${assetUrl(file)}')">
    <div class="photo__rays"></div>
    <div class="photo__shadow"></div>
    <div class="photo__wrap">
      <img class="photo__img" src="assets/${file}" alt="">
      <div class="fx fx--glow"></div>
      <div class="fx fx--shine"></div>
      <div class="fx fx--scan"></div>
      ${rep(4, i => `<div class="shard" style="--i:${i}"></div>`)}
    </div>
    ${pins.map(pin => `
      <div class="pin pin--${pin.side || 'l'}" style="left:${pin.x}%;top:${pin.y}%;--d:${pin.t || 0}s">
        <span class="pin__dot"></span><span class="pin__line"></span>
        <span class="pin__label">${pin.text}</span>
      </div>`).join('')}
  </div>`;

const photoHaze = (file, ar) => `
  <div class="photo photo--haze" style="--ar:${ar}">
    <div class="photo__wrap"><img class="photo__img" src="assets/${file}" alt=""></div>
  </div>`;

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
    { depth: .45, z: 1, html: photoHaze('suharev.webp', 0.869) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('suharev.webp', 0.869, [
      { x: 38, y: 17, text: 'Обсерватория', side: 'r', t: 3.2 },
      { x: 42, y: 34, text: 'Часы', t: 4.6 },
      { x: 34, y: 58, text: 'Навигацкая школа', side: 'r', t: 8.4 }
    ]) },
    { depth: 1.6, z: 3, html: `
      <svg class="fit" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        ${rep(5, i => `
        <g class="crow" style="animation-delay:${i * 1.4}s;--r:${90 + i * 34}px">
          <g class="crow__wing">
            <path d="M0 0 q-13 -12 -26 -3 q14 3 26 3z" fill="#2b3550"/>
            <path d="M0 0 q13 -12 26 -3 q-14 3 -26 3z" fill="#2b3550"/>
            <ellipse cx="0" cy="2" rx="8" ry="4" fill="#2b3550"/>
          </g>
        </g>`)}
      </svg>` }
  ],
  beats: [
    { t: 2600, cls: 'is-lit' },
    { t: 7600, cls: 'is-stars', fxFront: { type: 'stars', rate: 22 } },
    { t: 13500, cls: 'is-fade', fxBack: { type: 'dust', rate: 120 } }
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
  lead: 'Триумфальная арка Ухтомского: красная, с золотом и гербом. Снесли в 1927-м.',
  tint: 'radial-gradient(120% 90% at 50% 40%, rgba(60,20,20,.35), rgba(12,10,24,.6))',
  fxBack: { type: 'dust', rate: 22 },
  layers: [
    { depth: .45, z: 1, html: photoHaze('vorota2.webp', 0.804) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('vorota2.webp', 0.804, [
      { x: 50, y: 5, text: 'Слава с трубой', side: 'r', t: 3.4 },
      { x: 50, y: 31, text: 'Барельеф', t: 6.0 },
      { x: 26, y: 63, text: 'Колонны', side: 'r', t: 8.6 }
    ]) }
  ],
  beats: [
    { t: 3000, cls: 'is-lit' },
    { t: 5200, cls: 'is-trumpet', fxFront: { type: 'sparks', rate: 130, x: .5, y: .18 } },
    { t: 11000, cls: 'is-fade', fxFront: { type: 'dust', rate: 140 } }
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
    { depth: .45, z: 1, html: photoHaze('vysotka2.webp', 1.092) },
    { depth: 1.05, z: 2, cls: 'sc-photo sc-vys', html: photoLayer('vysotka2.webp', 1.092, [
      { x: 52, y: 4, text: 'Шпиль со звездой', t: 3.0 },
      { x: 24, y: 60, text: 'Боковые крылья', t: 10.2 }
    ]) }
  ],
  beats: [
    { t: 3400, cls: 'is-frozen', fxBack: { type: 'frost', rate: 34 } },
    { t: 7200, cls: 'is-melt', fxBack: { type: 'drops', rate: 38 } },
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
  lead: 'Пальмовая оранжерея и пруд с кувшинками. Над садом проносятся все четыре времени года.',
  tint: 'radial-gradient(120% 90% at 50% 60%, rgba(20,60,40,.28), rgba(10,20,20,.5))',
  fxBack: { type: 'pollen', rate: 22 },
  layers: [
    { depth: .45, z: 1, html: photoHaze('ogorod.webp', 1.091) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('ogorod.webp', 1.091, [
      { x: 46, y: 13, text: 'Пальмовая оранжерея', side: 'r', t: 3.2 },
      { x: 16, y: 46, text: 'Лекарственные травы', side: 'r', t: 6.4 },
      { x: 44, y: 88, text: 'Пруд с карпами', t: 12.4 }
    ]) }
  ],
  beats: [
    { t: 1200, cls: 'is-lit' },
    { t: 6000, cls: 'is-sun', fxBack: { type: 'pollen', rate: 26 } },
    { t: 8600, cls: 'is-autumn', fxBack: { type: 'leaves', rate: 18 } },
    { t: 11400, cls: 'is-winter', fxBack: { type: 'snow', rate: 44 } },
    { t: 14200, cls: 'is-spring', fxBack: { type: 'pollen', rate: 30 } }
  ],
  captions: [
    { t: 400, text: '1706 год. Указ Петра: разбить огород для лекарственных трав.', hold: 3600 },
    { t: 4200, text: 'Заболел солдат — лекарство привозили отсюда', hold: 3400 },
    { t: 8800, text: 'Осень', big: true, hold: 2200 },
    { t: 11600, text: 'Зима', big: true, hold: 2200 },
    { t: 14400, text: 'И снова весна. Саду больше трёхсот лет.', hold: 4200 }
  ],
  sound: [{ t: 900, s: 'grow' }, { t: 6100, s: 'chime' }, { t: 11500, s: 'wind' }, { t: 14500, s: 'sparkle' }]
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
  lead: 'Граф, крепостная актриса и больница, которую он построил в память о ней. Она работает до сих пор.',
  tint: 'radial-gradient(120% 90% at 50% 45%, rgba(40,26,60,.4), rgba(10,8,22,.68))',
  fxBack: { type: 'fog', rate: 2 },
  layers: [
    { depth: .45, z: 1, html: photoHaze('sheremetev.webp', 1.460) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('sheremetev.webp', 1.460, [
      { x: 50, y: 9, text: 'Купол', side: 'r', t: 3.4 },
      { x: 60, y: 44, text: 'Колоннада', t: 7.6 },
      { x: 22, y: 70, text: 'Ограда', side: 'r', t: 11.0 }
    ]) }
  ],
  beats: [
    { t: 1400, cls: 'is-old', fxFront: { type: 'notes', rate: 5, x: .5, y: .5 } },
    { t: 6400, cls: 'is-dusk' },
    { t: 8200, cls: 'is-lit', fxBack: { type: 'fog', rate: 2 } }
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
    { depth: .45, z: 1, html: photoHaze('ulan.webp', 1.089) },
    { depth: 1.1, z: 2, cls: 'sc-photo sc-ride', html: photoLayer('ulan.webp', 1.089, [
      { x: 44, y: 12, text: 'Уланский переулок', side: 'r', t: 3.0 },
      { x: 53, y: 22, text: 'Кивер с султаном', side: 'r', t: 7.2 }
    ]) }
  ],
  beats: [
    { t: 1500, cls: 'is-ride', fxBack: { type: 'dust', rate: 60 } },
    { t: 8000, cls: 'is-lit' },
    { t: 13000, cls: 'is-old' }
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
  aim: 'Наведи камеру вдоль проспекта Сахарова. Чем больше неба в кадре, тем выше поднимутся голуби.',
  lead: 'Атом, вспышка и стая голубей: физик, который придумал бомбу и всю жизнь мешал её применить.',
  tint: 'radial-gradient(120% 90% at 50% 35%, rgba(16,28,54,.42), rgba(6,10,22,.66))',
  fxBack: { type: 'stars', rate: 18 },
  layers: [
    { depth: .45, z: 1, html: photoHaze('sakharov.webp', 1.532) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('sakharov.webp', 1.532, [
      { x: 20, y: 24, text: 'Андрей Сахаров', side: 'r', t: 3.0 },
      { x: 62, y: 30, text: 'Модель атома', side: 'r', t: 6.4 }
    ]) },
    { depth: 1.7, z: 3, html: `
      <svg class="fit" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
        <g class="doves">
          ${rep(7, i => `
          <g class="dove" style="animation-delay:${i * .34}s;--x:${(i - 3) * 96}px;--sx:${(i - 3) * 46}px;--d:${4 + (i % 3) * .7}s;scale:${(.6 + (i % 3) * .2).toFixed(2)}">
            <path d="M4 6 q30 -26 66 -16 q24 -20 44 -6 q-14 8 -18 20 q26 16 2 32 q-42 20 -76 -8 q-22 -10 -18 -22z" fill="#f6f9ff"/>
            <circle cx="112" cy="8" r="3.4" fill="#16233c"/>
            <path d="M120 12 l14 4 l-14 5z" fill="#e2a03b"/>
            <path class="dove__wing" d="M34 10 q22 -40 62 -34 q-18 26 -30 44z" fill="#dfe8f7"/>
          </g>`)}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 4200, cls: 'is-boom', fxFront: { type: 'sparks', rate: 220, x: .5, y: .42 } },
    { t: 6000, cls: 'is-doves', fxFront: { type: 'stars', rate: 20 } },
    { t: 11000, cls: 'is-lit' }
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
    { depth: .45, z: 1, html: photoHaze('petropavel.webp', 1.113) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('petropavel.webp', 1.113, [
      { x: 40, y: 13, text: 'Купол короной', side: 'r', t: 3.2 },
      { x: 79, y: 17, text: 'Колокольня', t: 7.0 },
      { x: 88, y: 56, text: 'Новая Басманная, 11', t: 11.4 }
    ]) },
    { depth: 1.7, z: 3, html: `
      <svg class="fit" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">
        <g class="belfry" transform="translate(600,220)">
          ${rep(3, i => `<circle class="ring" cx="0" cy="0" r="${60 + i * 50}" fill="none" stroke="#ffe9a8" stroke-width="3" style="animation-delay:${i * .5}s"/>`)}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 3200, cls: 'is-lit' },
    { t: 6400, cls: 'is-ring', fxFront: { type: 'sparks', rate: 40, x: .75, y: .2 } },
    { t: 9000, cls: 'is-bake', fxFront: { type: 'embers', rate: 22 } },
    { t: 13500, cls: 'is-dusk' }
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
  aim: 'Наведи камеру на кованые ворота сада со стороны Старой Басманной. Хорошо, если в кадр попадут деревья над воротами — по ним побегут гирлянды.',
  lead: 'Ворота сада, гирлянды над аллеей и салют. Конец маршрута.',
  tint: 'radial-gradient(120% 90% at 50% 70%, rgba(20,26,60,.36), rgba(6,8,24,.66))',
  fxBack: { type: 'fog', rate: 2 },
  layers: [
    { depth: .45, z: 1, html: photoHaze('bauman.webp', 1.197) },
    { depth: 1.1, z: 2, cls: 'sc-photo', html: photoLayer('bauman.webp', 1.197, [
      { x: 47, y: 19, text: 'Сад имени Баумана', side: 'r', t: 3.0 },
      { x: 36, y: 56, text: 'Памятник Бауману', side: 'r', t: 7.4 },
      { x: 62, y: 60, text: 'Беседка и фонтан', t: 11.0 }
    ]) },
    { depth: 1.7, z: 3, html: `
      <svg class="fit" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMax meet">
        <g class="garland">
          ${rep(4, i => `
          <path d="M${-40 + i * 280} 120 q140 90 280 0" fill="none" stroke="rgba(60,50,30,.5)" stroke-width="3"/>
          ${rep(9, j => {
            const t = j / 8, x = -40 + i * 280 + 280 * t;
            const y = 120 + 90 * 2 * t * (1 - t);
            return `<circle class="bulb" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="7"
                     fill="${['#ffd166', '#ff8f6b', '#8fd0ff', '#a8e6b0'][(i + j) % 4]}"
                     style="animation-delay:${((i * 9 + j) % 12) * .16}s"/>`;
          })}`)}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 1800, cls: 'is-lit' },
    { t: 4000, cls: 'is-dusk', fxBack: { type: 'pollen', rate: 16 } },
    { t: 5600, cls: 'is-salute', fxFront: { type: 'fireworks' } }
  ],
  captions: [
    { t: 600, text: 'Двести лет назад это был частный сад Голицыных', hold: 3400 },
    { t: 4200, text: 'В 1920 году сад открыли для всех', hold: 3600 },
    { t: 8200, text: 'Назвали в честь Николая Баумана', hold: 3400 },
    { t: 12000, text: 'Маршрут пройден!', big: true, hold: 5000 }
  ],
  sound: [{ t: 1900, s: 'chime' }, { t: 4100, s: 'fanfare' }, { t: 5700, s: 'salute' }, { t: 12100, s: 'bells' }]
});
