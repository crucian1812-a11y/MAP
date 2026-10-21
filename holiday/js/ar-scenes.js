/* Сцены дополненной реальности для каникул: по одной на день.
   Движок общий с прогулкой (../js/ar-engine.js): слои SVG с параллаксом,
   частицы, такты-классы, титры, звук. Поле say — текст для озвучки Silero. */

const rep = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
const glow = (id, blur, color) => `
  <filter id="${id}" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="${blur}" result="b"/>
    <feFlood flood-color="${color}" result="c"/>
    <feComposite in="c" in2="b" operator="in" result="g"/>
    <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>`;

/* силуэт коня с всадником, смотрит вправо; bogatyr — копьё, шлем-шишак */
const rider = (fill, spear = true) => `
  <path fill="${fill}" d="M8 70 q6-24 38-28 h44 q12-16 26-30 l9 4 q-2 10 -12 22 q16 4 20 18 l-7 5
    q-8-9-19-9 l-3 24 l8 36 h-9 l-10-32 h-40 l-12 32 h-9 l5-34 q-20-4-29-28 z"/>
  <path fill="${fill}" d="M58 44 q-2-26 10-34 q12 8 10 34 z"/>
  <circle cx="68" cy="6" r="9" fill="${fill}"/>
  <path fill="${fill}" d="M62 0 l6 -16 l6 16 z"/>
  ${spear ? `<path stroke="${fill}" stroke-width="3.5" d="M40 52 L130 -30"/><path fill="${fill}" d="M128 -38 l10 2 l-6 8 z"/>` : ''}`;

const SCENES = [];

/* ============================================================
   ПН. МИЛЛИОННЫЙ МОСТ — Ростокинский акведук
   ============================================================ */
SCENES.push({
  id: 'most',
  day: 'Пн 26',
  title: 'Миллионный мост',
  place: 'Ростокинский акведук над Яузой',
  aim: 'Встань на берегу Яузы так, чтобы акведук был виден сбоку, и наведи камеру на арки. Мост должен занять нижнюю половину экрана.',
  lead: 'Мост снова наполняется водой, арки загораются по одной, а по берегу едет водовоз с бочкой.',
  say: 'Смотри внимательно. Двести лет назад по этому мосту текла вода. Её вели от мытищинских родников до самой Москвы, без единого насоса. Посчитай арки вместе со мной. А пока воду не провели в дома, её развозили в бочках. Мост стоил больше миллиона рублей. Поэтому его и прозвали Миллионным.',
  tint: 'radial-gradient(120% 80% at 50% 30%, rgba(20,50,90,.25), rgba(6,16,34,.55))',
  fxBack: { type: 'dust', rate: 14 },
  layers: [
    { depth: .6, z: 1, html: `
      <svg class="fit hm-most" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glow('hmGold', 5, '#ffcf5a')}
          ${glow('hmBlue', 6, '#5ec8ff')}
          <linearGradient id="hmWater" x1="0" x2="1">
            <stop offset="0" stop-color="#2f8fd8"/><stop offset=".5" stop-color="#8fe0ff"/><stop offset="1" stop-color="#2f8fd8"/>
          </linearGradient>
        </defs>
        <g class="hm-measure">
          <path d="M30 450 H770" stroke="#ffe7a8" stroke-width="2" stroke-dasharray="8 8"/>
          <path d="M30 440 v20 M770 440 v20" stroke="#ffe7a8" stroke-width="3"/>
          <text x="400" y="434" text-anchor="middle" class="hm-label">356 метров</text>
        </g>
        <g class="hm-channel">
          <rect x="20" y="494" width="760" height="26" rx="6" fill="url(#hmWater)" filter="url(#hmBlue)" opacity=".9"/>
          <path class="hm-flow" d="M20 507 H780" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="18 34" opacity=".85"/>
        </g>
        <g class="hm-arches" filter="url(#hmGold)" fill="none" stroke="#ffd36a" stroke-width="5" stroke-linejoin="round">
          <path d="M20 520 H780 M20 490 H780" style="--len:1600"/>
          ${rep(7, i => {
            const x = 20 + i * 108.6, c = x + 54.3;
            return `<path style="--len:640;animation-delay:${(.15 + i * .18).toFixed(2)}s"
              d="M${x + 8} 860 V640 A46 46 0 0 1 ${x + 100.6} 640 V860"/>
              <circle class="hm-arch-glow" cx="${c}" cy="660" r="40" style="--i:${i}"/>`;
          })}
        </g>
        <g class="hm-nums">
          ${rep(7, i => `<text x="${74 + i * 108.6}" y="716" text-anchor="middle" style="--i:${i}">${i + 1}</text>`)}
        </g>
        <g class="hm-badge">
          <rect x="300" y="360" width="200" height="56" rx="28" fill="rgba(10,20,40,.8)" stroke="#ffd36a" stroke-width="2"/>
          <text x="400" y="398" text-anchor="middle">21 арка</text>
        </g>
      </svg>` },
    { depth: 1.25, z: 2, cls: 'wide', html: `
      <svg class="fit hm-cart" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hm-vodovoz">
          <g class="hm-trot">${rider('#2a1d12', false)}</g>
          <g transform="translate(-150 40)">
            <rect x="0" y="20" width="120" height="58" rx="26" fill="#6b4524"/>
            <path d="M14 20 v58 M40 20 v58 M80 20 v58 M106 20 v58" stroke="#3a2412" stroke-width="5"/>
            <circle cx="30" cy="96" r="20" fill="none" stroke="#2a1d12" stroke-width="6"/>
            <circle cx="92" cy="96" r="20" fill="none" stroke="#2a1d12" stroke-width="6"/>
            <path d="M118 50 H160" stroke="#2a1d12" stroke-width="5"/>
          </g>
        </g>
      </svg>` },
    { depth: 1.7, z: 3, html: `
      <svg class="fit hm-stamp" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          <radialGradient id="hmMedal" cx=".4" cy=".35"><stop offset="0" stop-color="#fff2b0"/><stop offset=".55" stop-color="#e8b93b"/><stop offset="1" stop-color="#9b6a17"/></radialGradient>
        </defs>
        <g class="hm-medal">
          <circle cx="400" cy="160" r="96" fill="url(#hmMedal)" stroke="#fff4c4" stroke-width="4"/>
          <circle cx="400" cy="160" r="79" fill="none" stroke="#8a5d12" stroke-width="2" stroke-dasharray="4 6"/>
          <text x="400" y="134" text-anchor="middle" class="hm-medal-top">Е II</text>
          <text x="400" y="188" text-anchor="middle" class="hm-medal-year">1804</text>
          <text x="400" y="218" text-anchor="middle" class="hm-medal-sub">МИЛЛИОН РУБЛЕЙ</text>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-draw' },
    { t: 3800, cls: 'is-flow', fxBack: { type: 'spray', rate: 70, y: .5, x0: .05, x1: .95 } },
    { t: 7600, cls: 'is-count' },
    { t: 11800, cls: 'is-old', tint: 'linear-gradient(180deg, rgba(120,84,40,.38), rgba(60,40,20,.5))' },
    { t: 17500, cls: 'is-stamp', fxFront: { type: 'coins', rate: 18 }, tint: 'radial-gradient(120% 80% at 50% 30%, rgba(60,44,10,.3), rgba(16,12,4,.55))' }
  ],
  captions: [
    { t: 500, text: 'Миллионный мост', big: true, hold: 2800 },
    { t: 4000, text: 'Двести лет назад по нему текла вода — из Мытищ в Москву' },
    { t: 7800, text: 'Считаем арки! Здесь видно семь, а всего их двадцать одна', hold: 3600 },
    { t: 12000, text: 'До водопровода воду развозили по домам в бочках' },
    { t: 17800, text: '1804 год · больше миллиона рублей', big: true, hold: 4200 }
  ],
  sound: [
    { t: 3800, s: 'water' }, { t: 6000, s: 'water' },
    { t: 7800, s: 'chime' }, { t: 9200, s: 'chime' },
    { t: 12000, s: 'hooves' },
    { t: 17500, s: 'fanfare' }, { t: 18200, s: 'sparkle' }
  ]
});

/* ============================================================
   ВТ. СКАЗОЧНЫЙ ТЕРЕМ — фасад Третьяковки
   ============================================================ */
SCENES.push({
  id: 'terem',
  day: 'Вт 27',
  title: 'Сказочный терем',
  place: 'Третьяковская галерея, Лаврушинский переулок',
  aim: 'Встань в Лаврушинском переулке напротив входа и наведи камеру на фасад с острым кокошником над дверью.',
  lead: 'Фасад вспыхивает золотом, мимо скачут три богатыря, а следом плывёт Царевна-Лебедь.',
  say: 'Этот сказочный фасад нарисовал Виктор Васнецов. Тот самый, что написал «Богатырей». Смотри, они выезжают в дозор! А за ними плывёт Царевна-Лебедь из сказки Пушкина. Сегодня ты найдёшь их всех на картинах. Сказка начинается прямо у входа.',
  tint: 'radial-gradient(120% 80% at 50% 25%, rgba(70,20,30,.22), rgba(20,8,14,.55))',
  fxBack: { type: 'pollen', rate: 16 },
  layers: [
    { depth: .55, z: 1, html: `
      <svg class="fit ht-terem" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>${glow('htGold', 6, '#ffc94a')}</defs>
        <g fill="none" stroke="#ffd46a" stroke-width="5" filter="url(#htGold)" stroke-linejoin="round">
          <path class="ht-line" style="--len:1500" d="M220 640 V380 Q220 300 300 260 Q370 220 400 120 Q430 220 500 260 Q580 300 580 380 V640"/>
          <path class="ht-line" style="--len:900;animation-delay:.6s" d="M280 640 V420 Q280 360 340 330 Q390 300 400 240 Q410 300 460 330 Q520 360 520 420 V640"/>
          <path class="ht-line" style="--len:1700;animation-delay:1s" d="M60 640 H740 M60 670 H740"/>
          <path class="ht-line" style="--len:300;animation-delay:1.4s" d="M400 120 V70 M386 84 H414"/>
        </g>
        <g class="ht-orn">
          ${rep(17, i => `<path d="M${84 + i * 38} 655 l12 -12 l12 12 l-12 12 z" style="--i:${i}"/>`)}
        </g>
        <g class="ht-george">
          <circle cx="400" cy="420" r="46" fill="rgba(255,210,110,.18)" stroke="#ffe39a" stroke-width="3"/>
          <g transform="translate(352 392) scale(.62)">${rider('#ffe7a6')}</g>
        </g>
      </svg>` },
    { depth: 1.3, z: 2, cls: 'wide', html: `
      <svg class="fit ht-ride" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs>${glow('htRide', 4, '#ffb347')}</defs>
        <g class="ht-heroes" filter="url(#htRide)">
          <g class="ht-hero" style="--d:0s"><g class="ht-bob">${rider('#1c1410')}</g></g>
          <g class="ht-hero" style="--d:.15s" transform="translate(-170 8) scale(1.12)"><g class="ht-bob">${rider('#120d0a')}</g></g>
          <g class="ht-hero" style="--d:.3s" transform="translate(-340 0)"><g class="ht-bob">${rider('#1c1410')}</g></g>
        </g>
      </svg>` },
    { depth: 1.8, z: 3, cls: 'wide', html: `
      <svg class="fit ht-swanl" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs>${glow('htSwan', 9, '#bfe4ff')}</defs>
        <g class="ht-swan" filter="url(#htSwan)">
          <path fill="#fbfdff" d="M0 60 q40 30 110 20 q40 -6 60 -40 q-30 10 -54 4 q-30 -10 -24 -40 q4 -20 22 -24
            q16 -2 18 12 l14 -4 q-12 -26 -34 -22 q-34 6 -36 46 q0 22 16 36 q-40 6 -92 12 z"/>
          <path fill="#ffd36a" d="M86 -46 l6 -14 l6 10 l6 -12 l6 12 l6 -10 l4 14 z"/>
          <path fill="#ffd36a" d="M126 -10 l16 4 l-14 6 z"/>
          <path class="ht-swan-ripple" d="M-20 92 q100 14 200 0" stroke="#d8f0ff" stroke-width="3" fill="none" opacity=".6"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-draw' },
    { t: 3600, cls: 'is-lit', fxFront: { type: 'sparks', rate: 30 } },
    { t: 6800, cls: 'is-ride' },
    { t: 13500, cls: 'is-swan', fxFront: { type: 'stars', rate: 20 }, tint: 'radial-gradient(120% 80% at 50% 30%, rgba(20,40,80,.3), rgba(6,10,26,.6))' }
  ],
  captions: [
    { t: 500, text: 'Сказочный терем', big: true, hold: 2800 },
    { t: 3800, text: 'Этот фасад нарисовал Виктор Васнецов, автор «Богатырей»' },
    { t: 7000, text: 'Три богатыря выезжают в дозор!' },
    { t: 13700, text: 'А за ними — Царевна-Лебедь из сказки Пушкина', hold: 3600 },
    { t: 18000, text: 'Сказка начинается у входа', big: true, hold: 3600 }
  ],
  sound: [
    { t: 3600, s: 'bells' }, { t: 7000, s: 'hooves' }, { t: 9800, s: 'hooves' },
    { t: 13600, s: 'sparkle' }, { t: 18000, s: 'chime' }
  ]
});

/* ============================================================
   СР. ПОДВОДНЫЙ МИР — аквапарк
   ============================================================ */
SCENES.push({
  id: 'voda',
  day: 'Ср 28',
  title: 'Подводный мир',
  place: 'Аквапарк или ванна дома',
  aim: 'Стоя у бортика, наведи камеру на воду бассейна. Телефон в воду не берём! Дома так же можно навести камеру на ванну.',
  lead: 'Вода светится солнечной сеткой, проплывает стая рыб, а из глубины показывается кит.',
  say: 'Ныряем! Видишь, по дну бегает солнечная сетка? Это свет преломляется в волнах. Вот проплывает стая рыб. А из глубины поднимается кит. Он огромный, но в воде ему легко: вода выталкивает его вверх. Это закон Архимеда. Сегодня ты проверишь его сам.',
  tint: 'linear-gradient(180deg, rgba(0,90,130,.32), rgba(0,30,70,.6))',
  fxFront: { type: 'bubbles', rate: 18 },
  layers: [
    { depth: .4, z: 1, cls: 'wide', html: `<div class="hv-caustic"></div>` },
    { depth: .7, z: 2, cls: 'wide', html: `
      <svg class="fit hv-deep" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hv-whale">
          <path fill="#0b3550" opacity=".85" d="M0 120 q60 -90 220 -90 q120 0 200 60 q40 -40 90 -60 q-20 50 -10 80 q-10 30 10 80
            q-50 -20 -90 -60 q-70 60 -200 60 q-160 0 -220 -70 z"/>
          <circle cx="70" cy="104" r="6" fill="#bfe8ff"/>
          <path d="M40 150 q60 30 160 20" stroke="#2f6f96" stroke-width="5" fill="none"/>
        </g>
      </svg>` },
    { depth: 1.2, z: 3, cls: 'wide', html: `
      <svg class="fit hv-mid" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs>${glow('hvGlow', 7, '#ff8fd8')}</defs>
        <g class="hv-school">
          ${rep(11, i => {
            const x = (i % 4) * 46 + (i % 2) * 18, y = Math.floor(i / 4) * 34 + (i % 3) * 8;
            const c = ['#ffb347', '#ffd36a', '#ff8a5c'][i % 3];
            return `<g transform="translate(${x} ${y})"><g class="hv-fish" style="--i:${i}">
              <ellipse cx="0" cy="0" rx="18" ry="9" fill="${c}"/>
              <path d="M-16 0 l-14 -10 v20 z" fill="${c}"/>
              <circle cx="9" cy="-2" r="2.4" fill="#10222e"/></g></g>`;
          })}
        </g>
        ${rep(2, i => `
        <g transform="translate(${i ? 330 : 70} ${i ? 560 : 660})"><g class="hv-jelly" style="--i:${i}" filter="url(#hvGlow)">
          <path d="M-34 0 q0 -42 34 -42 q34 0 34 42 q-8 -6 -17 0 q-8 -6 -17 0 q-8 -6 -17 0 q-9 -6 -17 0z" fill="rgba(255,170,230,.75)"/>
          ${rep(4, k => `<path class="hv-tent" d="M${-24 + k * 16} 2 q6 22 -2 44 q-6 20 2 40" stroke="rgba(255,190,240,.7)" stroke-width="3" fill="none"/>`)}
        </g></g>`)}
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-in' },
    { t: 3500, cls: 'is-fish' },
    { t: 9000, cls: 'is-whale' },
    { t: 16500, cls: 'is-up', fxFront: { type: 'bubbles', rate: 60 } }
  ],
  captions: [
    { t: 500, text: 'Подводный мир', big: true, hold: 2800 },
    { t: 3700, text: 'Солнечная сетка на дне — это свет преломляется в волнах', hold: 3600 },
    { t: 9200, text: 'Из глубины поднимается кит' },
    { t: 13200, text: 'Вода выталкивает его вверх — закон Архимеда', hold: 3600 },
    { t: 16800, text: 'Твоя очередь: проверь сам!', big: true, hold: 3600 }
  ],
  sound: [
    { t: 400, s: 'bubbles' }, { t: 3600, s: 'water' }, { t: 9200, s: 'whale' },
    { t: 12500, s: 'whale' }, { t: 16600, s: 'bubbles' }
  ]
});

/* ============================================================
   ЧТ. ЖИВЫЕ ДИНОЗАВРЫ — оранжерея
   ============================================================ */
SCENES.push({
  id: 'dzhungli',
  day: 'Чт 29',
  title: 'Живые динозавры',
  place: 'Фондовая оранжерея Ботанического сада',
  aim: 'В оранжерее наведи камеру на пальмы и саговники, чтобы листья были по краям экрана. Дома подойдёт любой большой цветок.',
  lead: 'По краям вырастают лианы, летают бабочки, а за листьями проходит брахиозавр.',
  say: 'Тише, мы в джунглях. Смотри, лианы оживают, а вокруг летают бабочки. Слышишь шаги? Саговники, которые растут здесь, видели настоящих динозавров. Вот один из них, брахиозавр. Он ел листья с самых высоких деревьев. Найди саговник, и ты увидишь растение старше динозавров.',
  tint: 'radial-gradient(120% 80% at 50% 40%, rgba(20,70,30,.2), rgba(6,26,12,.55))',
  fxBack: { type: 'fog', rate: 6 },
  layers: [
    { depth: .45, z: 1, cls: 'wide', html: `
      <svg class="fit hd-back" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hd-dino">
          <g class="hd-step">
            <ellipse cx="180" cy="200" rx="112" ry="56" fill="#16331f"/>
            <path fill="#16331f" d="M250 176 q40 -40 64 -110 q8 -26 30 -32 q26 -4 30 14 q2 12 -14 16 q-20 2 -26 22 q-20 70 -60 116 z"/>
            <ellipse class="hd-head" cx="356" cy="30" rx="26" ry="13" fill="#16331f"/>
            <circle class="hd-eye" cx="366" cy="26" r="3" fill="#ffe28a"/>
            <path fill="#16331f" d="M76 196 q-70 10 -150 50 q90 -16 156 -26 z"/>
            <rect class="hd-leg" x="110" y="230" width="26" height="90" rx="10" fill="#122a19"/>
            <rect class="hd-leg hd-leg--b" x="150" y="230" width="26" height="90" rx="10" fill="#16331f"/>
            <rect class="hd-leg" x="220" y="226" width="26" height="94" rx="10" fill="#122a19"/>
            <rect class="hd-leg hd-leg--b" x="252" y="226" width="26" height="94" rx="10" fill="#16331f"/>
          </g>
        </g>
      </svg>` },
    { depth: 1.3, z: 2, cls: 'wide', html: `
      <svg class="fit hd-vines" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g fill="none" stroke="#2f7a3a" stroke-width="9" stroke-linecap="round">
          <path class="hd-vine" style="--len:1400" d="M-10 0 C60 160 0 300 60 420 S20 700 80 900"/>
          <path class="hd-vine" style="--len:1400;animation-delay:.5s" d="M410 0 C340 180 410 320 340 460 S400 700 330 900"/>
          <path class="hd-vine" style="--len:900;animation-delay:1s" d="M-10 620 C70 600 100 700 170 680"/>
        </g>
        ${[[40, 120], [26, 230], [56, 330], [60, 440], [40, 560], [70, 690], [84, 820], [356, 140], [380, 250], [350, 370], [340, 480], [372, 600], [338, 740],
           [110, 640], [160, 672]].map(([x, y], i) => `
          <g transform="rotate(${i % 2 ? 32 : -28} ${x} ${y})"><ellipse class="hd-leaf" style="--i:${i}" cx="${x}" cy="${y}" rx="34" ry="14" fill="${i % 2 ? '#4fa84a' : '#3a8f3e'}"/></g>`).join('')}
        ${[[56, 330], [350, 370], [70, 690]].map(([x, y], i) => `
          <circle class="hd-flower" style="--i:${i}" cx="${x + 20}" cy="${y - 18}" r="11" fill="#ff5f8a"/>`).join('')}
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-grow' },
    { t: 4200, cls: 'is-fly', fxFront: { type: 'butterflies', rate: 1.4 } },
    { t: 8200, cls: 'is-dino' },
    { t: 17500, cls: 'is-roar', fxFront: { type: 'pollen', rate: 40 } }
  ],
  captions: [
    { t: 500, text: 'Живые динозавры', big: true, hold: 2800 },
    { t: 4400, text: 'Лианы оживают, а вокруг летают бабочки' },
    { t: 8400, text: 'Слышишь шаги? Это брахиозавр' },
    { t: 12600, text: 'Саговники росли на Земле ещё при динозаврах', hold: 3800 },
    { t: 17700, text: 'Найди саговник — он старше динозавров!', big: true, hold: 3800 }
  ],
  sound: [
    { t: 400, s: 'birds' }, { t: 4300, s: 'birds' },
    { t: 8400, s: 'rumble' }, { t: 10600, s: 'rumble' }, { t: 12800, s: 'rumble' },
    { t: 17600, s: 'grow' }
  ]
});

/* ============================================================
   ПТ. ОРГАН ПОЁТ — собор святого Андрея
   ============================================================ */
SCENES.push({
  id: 'organ',
  day: 'Пт 30',
  title: 'Орган поёт',
  place: 'Англиканский собор, Вознесенский переулок, 8',
  aim: 'До концерта встань напротив собора и наведи камеру на острые окна. Во время концерта камеру не включаем: там слушают.',
  lead: 'Загорается витраж-роза, из земли поднимаются трубы органа, и звучит начало Токкаты Баха. А в конце — секретное слово.',
  say: 'Видишь острые окна? Это готика. Сейчас загорится витраж. А теперь из земли растут трубы органа. Каждая труба поёт одну ноту: большие гудят низко, маленькие свистят высоко. Слушай, это начало Токкаты Баха. Сегодня вечером ты услышишь настоящий орган. Помнишь секретное слово?',
  tint: 'radial-gradient(120% 80% at 50% 25%, rgba(40,20,70,.25), rgba(10,6,24,.62))',
  fxBack: { type: 'dust', rate: 10 },
  layers: [
    { depth: .5, z: 1, html: `
      <svg class="fit ho-rose" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          ${glow('hoGlow', 10, '#ffd27a')}
          <linearGradient id="hoRay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffe7a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <g class="ho-rays">
          <path d="M330 230 L120 900 H330 Z" fill="url(#hoRay)"/>
          <path d="M400 240 L330 900 H470 Z" fill="url(#hoRay)"/>
          <path d="M470 230 L680 900 H470 Z" fill="url(#hoRay)"/>
        </g>
        <g transform="translate(400 210)"><g class="ho-window" filter="url(#hoGlow)">
          ${rep(12, i => {
            const c = ['#e2463b', '#3b7fe2', '#e8b93b', '#3fae6a'][i % 4];
            return `<path class="ho-petal" style="--i:${i}" transform="rotate(${i * 30})" d="M0 0 L-28 -100 Q0 -126 28 -100 Z" fill="${c}" stroke="#2a1a10" stroke-width="3"/>`;
          })}
          <circle r="30" fill="#ffd36a" stroke="#2a1a10" stroke-width="3"/>
          <circle r="118" fill="none" stroke="#ffe7a8" stroke-width="5"/>
        </g></g>
        <path class="ho-gothic" style="--len:1300" d="M230 520 V360 Q230 230 400 150 Q570 230 570 360 V520" fill="none" stroke="#ffe7a8" stroke-width="4" filter="url(#hoGlow)"/>
      </svg>` },
    { depth: 1.15, z: 2, html: `
      <svg class="fit ho-organ" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="hoPipe" x1="0" x2="1">
            <stop offset="0" stop-color="#8a6420"/><stop offset=".45" stop-color="#ffe7a0"/><stop offset="1" stop-color="#9b7024"/>
          </linearGradient>
        </defs>
        ${rep(15, i => {
          const d = Math.abs(i - 7), h = 380 - d * 40 + (i % 2) * 20, x = 70 + i * 44;
          return `<g class="ho-pipe" style="--i:${d}">
            <rect x="${x}" y="${880 - h}" width="34" height="${h}" rx="6" fill="url(#hoPipe)" stroke="#5a3e12" stroke-width="2"/>
            <path d="M${x + 6} ${880 - h + 40} h22 l-11 16 z" fill="#3a2810"/>
          </g>`;
        })}
        <g class="ho-word">
          ${['О', 'Р', 'Г', 'А', 'Н'].map((L, i) => `<text x="${200 + i * 100}" y="420" text-anchor="middle" style="--i:${i}">${L}</text>`).join('')}
        </g>
      </svg>` },
    { depth: 1.6, z: 3, cls: 'wide', html: `
      <svg class="fit ho-candles" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs>${glow('hoFlame', 6, '#ffb347')}</defs>
        ${[34, 86, 314, 366].map((x, i) => `
          <g transform="translate(${x} 790)">
            <rect x="-10" y="0" width="20" height="110" rx="4" fill="#f6ecd6"/>
            <path class="ho-flame" style="--i:${i}" d="M0 -34 q12 16 8 26 q-4 10 -8 10 q-4 0 -8 -10 q-4 -10 8 -26z" fill="#ffcf5a" filter="url(#hoFlame)"/>
          </g>`).join('')}
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-draw' },
    { t: 3400, cls: 'is-lit' },
    { t: 7200, cls: 'is-pipes' },
    { t: 10400, cls: 'is-play', fxFront: { type: 'notes', rate: 8, x: .5, y: .55 } },
    { t: 17600, cls: 'is-word', fxFront: { type: 'sparks', rate: 40 } }
  ],
  captions: [
    { t: 500, text: 'Орган поёт', big: true, hold: 2800 },
    { t: 3600, text: 'Острые окна и витраж-роза — это готика' },
    { t: 7400, text: 'Каждая труба поёт одну ноту: большие — низко, маленькие — высоко', hold: 3600 },
    { t: 10800, text: 'Слушай: начало «Токкаты ре минор» Баха', hold: 4200 },
    { t: 17800, text: 'Секретное слово экспедиции', big: true, hold: 4200 }
  ],
  sound: [
    { t: 3400, s: 'chime' }, { t: 7200, s: 'grow' },
    { t: 10600, s: 'organ' }, { t: 17600, s: 'bells' }
  ]
});

if (typeof module !== 'undefined') module.exports = { SCENES };
