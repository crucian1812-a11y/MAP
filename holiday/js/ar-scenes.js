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
   ПН. БОТИК ПЕТРА — Серебряно-Виноградный пруд в Измайлове
   ============================================================ */
const ship = (x, y, k) => `
  <g class="hb-ship" transform="translate(${x} ${y}) scale(${k})">
    <path d="M0 40 H120 L104 62 H14 Z" fill="#1d2633"/>
    ${[24, 60, 96].map(m => `<rect x="${m}" y="-40" width="3" height="80" fill="#1d2633"/>
      <rect x="${m - 14}" y="-30" width="31" height="20" fill="#2c3a4c"/><rect x="${m - 12}" y="-4" width="27" height="18" fill="#2c3a4c"/>`).join('')}
  </g>`;

SCENES.push({
  id: 'botik',
  day: 'Пн 26',
  title: 'Ботик Петра',
  place: 'Измайлово, пруд у Мостовой башни',
  aim: 'Встань у моста к Мостовой башне и наведи камеру на воду пруда. Вода должна занять нижнюю половину экрана.',
  lead: 'По пруду плывёт маленький ботик, на горизонте вырастает флот, а небо загорается потешными огнями.',
  say: 'Смотри на воду. В тысяча шестьсот восемьдесят восьмом году юный Пётр нашёл здесь, в Измайлове, в старом амбаре маленькую английскую лодку с парусом. Мастер Тиммерман починил её и научил Петра ходить под парусом, даже против ветра. Пётр так увлёкся, что потом построил целый флот. А этот ботик теперь называют дедушкой русского флота. Пётр очень любил потешные огни. Вот такой праздник он мог устроить в честь новой победы!',
  tint: 'linear-gradient(180deg, rgba(20,40,70,.18), rgba(8,22,40,.5))',
  fxBack: { type: 'dust', rate: 10 },
  layers: [
    { depth: .55, z: 1, cls: 'wide', html: `
      <svg class="fit hb-far" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hb-fleet">${ship(-10, 500, .55)}${ship(150, 488, .45)}${ship(290, 505, .6)}</g>
        <g fill="none" stroke="rgba(205,236,255,.75)" stroke-width="2.5" stroke-linecap="round">
          ${rep(8, i => `<path class="hb-ripple" style="animation-delay:${(-i * .3).toFixed(1)}s"
            d="M-30 ${590 + i * 38} q25 -${6 + i} 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0"/>`)}
        </g>
      </svg>` },
    { depth: 1.25, z: 2, cls: 'wide', html: `
      <svg class="fit hb-near" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hb-boat"><g class="hb-bob">
          <ellipse cx="75" cy="104" rx="86" ry="10" fill="rgba(0,0,0,.25)"/>
          <path d="M0 60 L150 60 L130 92 Q75 104 20 92 Z" fill="#6b4524"/>
          <path d="M6 70 H144" stroke="#e8b93b" stroke-width="4"/>
          <rect x="72" y="-84" width="5" height="146" fill="#3a2410"/>
          <path class="hb-sail" d="M78 -72 L78 52 L142 52 Q124 -8 78 -72 Z" fill="#f6edd8"/>
          <path class="hb-sail" d="M70 -62 L70 48 L12 52 Q32 0 70 -62 Z" fill="#efe2c2"/>
          <rect x="77" y="-98" width="28" height="5" fill="#ffffff"/>
          <rect x="77" y="-93" width="28" height="5" fill="#2a5db0"/>
          <rect x="77" y="-88" width="28" height="5" fill="#d6312b"/>
        </g></g>
      </svg>` },
    { depth: 1.7, z: 3, html: `
      <svg class="fit hb-top" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>
          <radialGradient id="hbMedal" cx=".4" cy=".35"><stop offset="0" stop-color="#fff2b0"/><stop offset=".55" stop-color="#e8b93b"/><stop offset="1" stop-color="#9b6a17"/></radialGradient>
        </defs>
        <g class="hb-medal">
          <circle cx="400" cy="96" r="84" fill="url(#hbMedal)" stroke="#fff4c4" stroke-width="4"/>
          <circle cx="400" cy="96" r="69" fill="none" stroke="#8a5d12" stroke-width="2" stroke-dasharray="4 6"/>
          <text x="400" y="114" text-anchor="middle" class="hm-medal-year">1688</text>
          <text x="400" y="142" text-anchor="middle" class="hm-medal-sub">ДЕДУШКА ФЛОТА</text>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-in' },
    { t: 2600, cls: 'is-sail' },
    { t: 9000, cls: 'is-wind', fxFront: { type: 'leaves', rate: 8 } },
    { t: 13000, cls: 'is-fleet' },
    { t: 17200, cls: 'is-fire', fxBack: { type: 'fireworks' }, tint: 'linear-gradient(180deg, rgba(8,10,30,.55), rgba(4,8,22,.7))' }
  ],
  captions: [
    { t: 500, text: 'Ботик Петра', big: true, hold: 2600 },
    { t: 2900, text: 'В 1688 году юный Пётр нашёл в измайловском амбаре старую английскую лодку', hold: 4600 },
    { t: 9200, text: 'Мастер Тиммерман научил его ходить под парусом — даже против ветра', hold: 3600 },
    { t: 13200, text: 'С маленького ботика начался большой русский флот', hold: 3600 },
    { t: 17400, text: 'Дедушка русского флота', big: true, hold: 4200 }
  ],
  sound: [
    { t: 400, s: 'water' }, { t: 2700, s: 'wind' }, { t: 9100, s: 'wind' },
    { t: 13200, s: 'fanfare' }, { t: 17300, s: 'salute' }
  ]
});

/* ============================================================
   ПН. МИЛЛИОННЫЙ МОСТ — Ростокинский акведук
   ============================================================ */
SCENES.push({
  id: 'most',
  day: 'Бонус · у дома',
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
   ВТ. ПОГРУЖЕНИЕ — подводная лодка Б-396 в Северном Тушине
   ============================================================ */
SCENES.push({
  id: 'glubina',
  day: 'Вт 27',
  title: 'Погружение',
  place: 'Подлодка Б-396, Химкинское водохранилище',
  aim: 'Встань на набережной напротив лодки и наведи камеру на её рубку. Можно и внутри, в центральном посту.',
  lead: 'Опускается перископ, пищит сонар, глубиномер считает метры до 246, вылетает торпеда, а потом — «Продуть балласт!»',
  say: 'Внимание, юнга! Поднимаем перископ и осматриваем горизонт. Слышишь писк? Это сонар: он посылает звук в воду и слушает эхо. Так лодка видит в темноте. Срочное погружение! Цистерны заполняются водой, и мы уходим вниз: шестьдесят метров, сто двадцать, сто восемьдесят. Рабочая глубина этой лодки двести сорок шесть метров. Торпедный аппарат номер один — пуск! А теперь продуть балласт: воду выдуваем сжатым воздухом, и лодка всплывает.',
  tint: 'linear-gradient(180deg, rgba(10,30,50,.2), rgba(4,14,26,.45))',
  layers: [
    { depth: .4, z: 1, cls: 'wide', html: `
      <svg class="fit hg-sea" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs><linearGradient id="hgWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2a8fb8" stop-opacity=".55"/><stop offset="1" stop-color="#03162a" stop-opacity=".92"/>
        </linearGradient></defs>
        <rect class="hg-water" x="-60" y="0" width="520" height="900" fill="url(#hgWater)"/>
      </svg>` },
    { depth: .9, z: 2, cls: 'wide', html: `
      <svg class="fit hg-mid" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hg-sonar">${rep(3, i => `<circle cx="200" cy="430" r="22" style="--i:${i}"/>`)}</g>
        <g class="hg-fish">
          ${rep(6, i => `<g transform="translate(${(i % 3) * 40} ${Math.floor(i / 3) * 30 + (i % 2) * 8})">
            <ellipse rx="14" ry="6" fill="#9fd6e8"/><path d="M-12 0 l-10 -7 v14 z" fill="#9fd6e8"/></g>`)}
        </g>
        <g class="hg-torpedo">
          <path d="M0 0 h110 q22 0 22 9 q0 9 -22 9 h-110 z" fill="#c9d3d8"/>
          <path d="M0 -6 v30 M-8 9 h10" stroke="#8a979d" stroke-width="4"/>
          ${rep(6, k => `<circle cx="${-18 - k * 22}" cy="${9 + (k % 2 ? 6 : -6)}" r="${7 - k}" fill="none" stroke="rgba(220,245,255,.8)" stroke-width="2"/>`)}
        </g>
      </svg>` },
    { depth: .15, z: 3, cls: 'wide', html: `
      <svg class="fit hg-scope" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hg-lens">
          <path fill="rgba(3,8,14,.93)" fill-rule="evenodd" d="M-80 -80 H480 V980 H-80 Z M30 430 a170 170 0 1 0 340 0 a170 170 0 1 0 -340 0 Z"/>
          <circle cx="200" cy="430" r="170" fill="none" stroke="#3a5566" stroke-width="10"/>
          <path d="M40 430 H175 M225 430 H360 M200 270 V405 M200 455 V590" stroke="#9effc4" stroke-width="2" opacity=".85"/>
          ${rep(9, k => `<path d="M${80 + k * 30} 424 v12" stroke="#9effc4" stroke-width="2" opacity=".7"/>`)}
          <text x="200" y="250" text-anchor="middle" class="hg-hud">000°</text>
          <text x="60" y="250" class="hg-hud hg-small">ПЕРИСКОП</text>
        </g>
        <g class="hg-gauge">
          <rect x="268" y="120" width="112" height="70" rx="10" fill="rgba(3,10,18,.85)" stroke="#9effc4" stroke-width="2"/>
          <text x="324" y="142" text-anchor="middle" class="hg-hud hg-small">ГЛУБИНА</text>
          ${['0', '60', '120', '180', '246', '0'].map((v, k) => `<text x="324" y="178" text-anchor="middle" class="hg-hud hg-d hg-d${k}">${v} м</text>`).join('')}
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-scope' },
    { t: 3400, cls: 'is-sonar' },
    { t: 6600, cls: 'is-dive', tint: 'linear-gradient(180deg, rgba(4,30,56,.45), rgba(2,10,22,.7))' },
    { t: 7400, cls: 'is-d1' }, { t: 9200, cls: 'is-d2' }, { t: 11000, cls: 'is-d3' },
    { t: 12600, cls: 'is-d4', fxFront: { type: 'bubbles', rate: 16 } },
    { t: 14800, cls: 'is-torpedo' },
    { t: 18200, cls: 'is-up', fxFront: { type: 'bubbles', rate: 90 }, tint: 'linear-gradient(180deg, rgba(10,30,50,.15), rgba(4,14,26,.35))' }
  ],
  captions: [
    { t: 500, text: 'Погружение', big: true, hold: 2600 },
    { t: 3500, text: 'Сонар посылает звук в воду и слушает эхо' },
    { t: 6800, text: 'Срочное погружение! Цистерны заполняются водой', hold: 3400 },
    { t: 12700, text: 'Рабочая глубина — 246 метров, как дом в 80 этажей', hold: 3400 },
    { t: 14900, text: 'Торпедный аппарат номер один — пуск!', hold: 3000 },
    { t: 18400, text: 'Продуть балласт! Всплываем', big: true, hold: 4000 }
  ],
  sound: [
    { t: 3500, s: 'sonar' }, { t: 5000, s: 'sonar' }, { t: 6700, s: 'water' },
    { t: 9300, s: 'sonar' }, { t: 12700, s: 'bubbles' },
    { t: 14900, s: 'steam' }, { t: 15100, s: 'boom' },
    { t: 18300, s: 'bubbles' }, { t: 18600, s: 'water' }, { t: 19400, s: 'fanfare' }
  ]
});

/* ============================================================
   ВТ. СКАЗОЧНЫЙ ТЕРЕМ — фасад Третьяковки
   ============================================================ */
SCENES.push({
  id: 'terem',
  day: 'Ср 28',
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
  day: 'Бонус · аквапарк',
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
  day: 'Бонус · оранжерея',
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

/* ============================================================
   СР. ТИХИЙ КИТАЙ-ГОРОД — четыре сцены по остановкам экскурсии
   ============================================================ */
const KG = 'Ср 28 · Китай-город';

/* 1. Ильинский сквер: откуда имя */
SCENES.push({
  id: 'kita',
  day: KG,
  title: 'Откуда имя',
  place: 'Ильинский сквер, часовня героям Плевны',
  aim: 'Встань в начале Ильинского сквера и наведи камеру на аллею, чтобы часовня была в середине экрана.',
  lead: 'С неба падают плетёные корзины-«кита» и складываются в вал, вырастает каменная стена с башней, а потом часовня загорается золотом.',
  say: 'Откуда имя «Китай-город»? Есть версия, что от старинного слова «кита». Так называли плетёные корзины, которые набивали землёй и ставили друг на друга. Получался вал — первая защита города. А потом, почти пятьсот лет назад, здесь поставили каменную стену с башнями и бойницами. Стена окружала торговый город рядом с Кремлём. А часовня перед тобой — памятник героям, погибшим в бою за болгарский город Плевну. Её построили на деньги их товарищей.',
  tint: 'linear-gradient(180deg, rgba(40,30,20,.18), rgba(20,14,8,.45))',
  fxBack: { type: 'dust', rate: 14 },
  layers: [
    { depth: .6, z: 1, cls: 'wide', html: `
      <svg class="fit hk-wall" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hk-stone">
          <rect x="-20" y="560" width="440" height="200" fill="#b9865a" stroke="#6b4a2c" stroke-width="3"/>
          ${rep(12, i => `<path d="M${-20 + i * 38} 560 v-30 h12 l7 10 l7 -10 h12 v30 z" fill="#b9865a" stroke="#6b4a2c" stroke-width="2"/>`)}
          ${rep(9, i => `<rect x="${i * 46 - 6}" y="${600 + (i % 2) * 70}" width="34" height="14" rx="2" fill="#2c1d10" opacity=".6"/>`)}
          <rect x="150" y="430" width="100" height="330" fill="#a87447" stroke="#6b4a2c" stroke-width="3"/>
          <path d="M140 432 L200 330 L260 432 Z" fill="#2f6a4a" stroke="#1c3f2b" stroke-width="3"/>
          <rect x="182" y="480" width="36" height="52" rx="18" fill="#2c1d10" opacity=".7"/>
        </g>
        <g class="hk-baskets">
          ${rep(18, i => {
            const x = (i % 6) * 70 - 10, y = 700 - Math.floor(i / 6) * 70;
            return `<g transform="translate(${x} ${y})"><g class="hk-basket" style="--i:${i}">
              <rect x="0" y="0" width="64" height="64" rx="10" fill="#c9a46a" stroke="#7a5a2c" stroke-width="3"/>
              ${rep(4, k => `<path d="M${8 + k * 15} 2 v60" stroke="#7a5a2c" stroke-width="2"/>`)}
              ${rep(3, k => `<path d="M2 ${14 + k * 18} h60" stroke="#8d6a36" stroke-width="2" stroke-dasharray="6 5"/>`)}
            </g></g>`;
          })}
        </g>
      </svg>` },
    { depth: 1.3, z: 2, html: `
      <svg class="fit hk-chapel" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>${glow('hkGold', 6, '#ffcf5a')}</defs>
        <g fill="none" stroke="#ffd36a" stroke-width="5" filter="url(#hkGold)" stroke-linejoin="round">
          <path class="hk-line" style="--len:1200" d="M330 820 V560 L360 520 H440 L470 560 V820 Z"/>
          <path class="hk-line" style="--len:700;animation-delay:.4s" d="M360 520 L400 330 L440 520"/>
          <path class="hk-line" style="--len:200;animation-delay:.8s" d="M400 330 V280 M384 296 H416"/>
          <path class="hk-line" style="--len:600;animation-delay:1s" d="M360 560 V820 M400 560 V820 M440 560 V820"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 400, cls: 'is-drop' },
    { t: 7600, cls: 'is-stone', tint: 'linear-gradient(180deg, rgba(30,24,16,.25), rgba(14,10,6,.5))' },
    { t: 13600, cls: 'is-draw', fxFront: { type: 'sparks', rate: 26 } },
    { t: 17000, cls: 'is-lit' }
  ],
  captions: [
    { t: 500, text: 'Откуда имя «Китай-город»?', big: true, hold: 2800 },
    { t: 3400, text: 'Есть версия: «кита» — плетёные корзины с землёй', hold: 3800 },
    { t: 7800, text: 'Потом здесь встала каменная стена с башнями', hold: 3800 },
    { t: 13800, text: 'А это часовня героям Плевны', hold: 3200 },
    { t: 17300, text: 'Китай-город', big: true, hold: 3800 }
  ],
  sound: [
    ...[600, 1400, 2200, 3000, 3800, 4600, 5400].map(t => ({ t, s: 'crack' })),
    { t: 7600, s: 'rumble' }, { t: 13600, s: 'chime' }, { t: 17000, s: 'bells' }
  ]
});

/* 2. Хохловская площадь: стена Белого города встаёт и превращается в бульвар */
SCENES.push({
  id: 'stena',
  day: KG,
  title: 'Стена Белого города',
  place: 'Хохловская площадь, амфитеатр у старой стены',
  aim: 'Встань у ограды над раскопом и наведи камеру на старые белые камни внизу.',
  lead: 'Из камней фундамента вырастает белая стена с зубцами и башней, по ней ходит дозорный, а потом стена тает и на её месте вырастает бульвар.',
  say: 'Видишь белые камни внизу? Это фундамент стены Белого города. Её построил мастер Фёдор Конь в конце шестнадцатого века. Стена была из белого камня, с зубцами, башнями и воротами, и окружала половину Москвы. По ней ходили дозорные. Прошло двести лет, город вырос, и стена стала не нужна. Её разобрали, а на её месте посадили деревья. Так появилось Бульварное кольцо. Покровский бульвар рядом с нами — это след той самой стены.',
  tint: 'linear-gradient(180deg, rgba(30,40,60,.15), rgba(10,14,24,.45))',
  fxBack: { type: 'dust', rate: 10 },
  layers: [
    { depth: .7, z: 1, cls: 'wide', html: `
      <svg class="fit hs-wall" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs><linearGradient id="hsStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3efe4"/><stop offset="1" stop-color="#cfc6b2"/></linearGradient></defs>
        <g class="hs-rise">
          <rect x="-20" y="470" width="440" height="330" fill="url(#hsStone)" stroke="#8f8670" stroke-width="3"/>
          ${rep(11, i => `<path d="M${-20 + i * 42} 470 v-34 h14 l7 12 l7 -12 h14 v34 z" fill="#efe9db" stroke="#8f8670" stroke-width="2"/>`)}
          ${rep(16, i => `<rect x="${(i % 8) * 54 - 10 + (Math.floor(i / 8) % 2) * 27}" y="${520 + Math.floor(i / 8) * 70}" width="44" height="22" fill="none" stroke="#b4ab95" stroke-width="2"/>`)}
          <rect x="250" y="330" width="120" height="470" fill="url(#hsStone)" stroke="#8f8670" stroke-width="3"/>
          <path d="M240 334 L310 210 L380 334 Z" fill="#7a3b2a" stroke="#4a2218" stroke-width="3"/>
          ${rep(3, i => `<rect x="${268 + i * 34}" y="390" width="14" height="30" rx="7" fill="#3b352a"/>`)}
          <rect x="40" y="600" width="80" height="200" rx="40" fill="#3b352a" opacity=".75"/>
        </g>
        <g class="hs-guard"><circle cx="0" cy="-28" r="9" fill="#2a2620"/><path d="M-9 -18 h18 l4 40 h-26 z" fill="#2a2620"/><path d="M12 -50 V22" stroke="#2a2620" stroke-width="3"/><path d="M6 -56 l6 -10 l6 10 z" fill="#2a2620"/></g>
        <g class="hs-ruin">
          ${rep(9, i => `<rect x="${i * 46 - 6}" y="${770 + (i % 3) * 6}" width="${40 - (i % 2) * 8}" height="${30 - (i % 3) * 4}" rx="4" fill="#e8e2d2" stroke="#8f8670" stroke-width="2"/>`)}
        </g>
      </svg>` },
    { depth: 1.2, z: 2, cls: 'wide', html: `
      <svg class="fit hs-trees" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        ${rep(5, i => `<g transform="translate(${20 + i * 90} 780)"><g class="hs-tree" style="--i:${i}">
          <rect x="-6" y="-120" width="12" height="120" fill="#5a3d25"/>
          <circle cx="0" cy="-150" r="52" fill="${['#d8a13a', '#c46a2a', '#e0b957', '#8fae43', '#d8a13a'][i]}"/>
          <circle cx="-30" cy="-120" r="30" fill="${['#c46a2a', '#e0b957', '#8fae43', '#d8a13a', '#c46a2a'][i]}"/>
          <circle cx="32" cy="-124" r="32" fill="${['#e0b957', '#d8a13a', '#c46a2a', '#e0b957', '#8fae43'][i]}"/>
        </g></g>`)}
        <path class="hs-path" d="M-20 820 H420" stroke="#c9b896" stroke-width="26"/>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-in' },
    { t: 3600, cls: 'is-rise', fxBack: { type: 'dust', rate: 50 } },
    { t: 8600, cls: 'is-guard' },
    { t: 13200, cls: 'is-gone', fxFront: { type: 'leaves', rate: 16 } },
    { t: 16600, cls: 'is-trees' }
  ],
  captions: [
    { t: 500, text: 'Стена Белого города', big: true, hold: 2800 },
    { t: 3800, text: '1585–1593 годы: мастер Фёдор Конь строит стену из белого камня', hold: 4200 },
    { t: 8800, text: 'По стене ходили дозорные', hold: 3400 },
    { t: 13400, text: 'Через двести лет стену разобрали…', hold: 3000 },
    { t: 16800, text: '…и посадили деревья. Так появилось Бульварное кольцо', big: true, hold: 4400 }
  ],
  sound: [
    { t: 3600, s: 'rumble' }, { t: 5200, s: 'rumble' }, { t: 8800, s: 'bells' },
    { t: 13300, s: 'wind' }, { t: 16700, s: 'birds' }, { t: 17600, s: 'grow' }
  ]
});

/* 3. Палаты Украинцева: посол плывёт к султану */
SCENES.push({
  id: 'posol',
  day: KG,
  title: 'Посол на корабле',
  place: 'Хохловский переулок, Палаты Украинцева',
  aim: 'Встань напротив старинного дома с узорными окнами и наведи камеру на него.',
  lead: 'По морю идёт 46-пушечный корабль «Крепость», на горизонте вырастают купола и минареты, а в конце — свиток с печатью «1700 · мир».',
  say: 'В этом доме жил дьяк Емельян Украинцев, посол Петра Первого. В тысяча шестьсот девяносто девятом году он поплыл к турецкому султану на большом корабле «Крепость» с сорока шестью пушками. Это был первый русский корабль, который пришёл в Константинополь. Помнишь ботик Петра? Прошло всего одиннадцать лет, и у России уже были такие корабли. Переговоры шли почти год, и в тысяча семисотом году Украинцев заключил с Турцией мир.',
  tint: 'linear-gradient(180deg, rgba(20,40,70,.2), rgba(6,16,34,.5))',
  layers: [
    { depth: .5, z: 1, cls: 'wide', html: `
      <svg class="fit hp-far" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hp-city" fill="#26324a">
          <path d="M60 560 q30 -70 60 0 z"/><rect x="60" y="560" width="60" height="40"/>
          <rect x="128" y="470" width="8" height="130"/><path d="M126 470 l6 -20 l6 20 z"/>
          <path d="M170 560 q45 -95 90 0 z"/><rect x="170" y="560" width="90" height="40"/>
          <rect x="272" y="450" width="8" height="150"/><path d="M270 450 l6 -22 l6 22 z"/>
          <path d="M300 570 q25 -55 50 0 z"/><rect x="300" y="570" width="50" height="30"/>
          <rect x="-20" y="598" width="440" height="10"/>
        </g>
        <g fill="none" stroke="rgba(205,236,255,.7)" stroke-width="2.5" stroke-linecap="round">
          ${rep(7, i => `<path class="hb-ripple" style="animation-delay:${(-i * .35).toFixed(2)}s" d="M-30 ${625 + i * 40} q25 -${5 + i} 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0"/>`)}
        </g>
      </svg>` },
    { depth: 1.2, z: 2, cls: 'wide', html: `
      <svg class="fit hp-near" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hp-ship"><g class="hb-bob">
          <path d="M0 120 H240 L214 164 Q120 178 30 164 Z" fill="#5a3a1e"/>
          <path d="M8 132 H232" stroke="#e8b93b" stroke-width="5"/>
          ${rep(7, k => `<rect x="${30 + k * 26}" y="140" width="12" height="9" rx="2" fill="#1b120a"/>`)}
          ${[60, 120, 180].map((m, k) => `<rect x="${m}" y="${-70 + k * 10}" width="6" height="${190 - k * 10}" fill="#3a2410"/>
            <path class="hb-sail" d="M${m - 34} ${-50 + k * 10} h74 v54 h-74 z" fill="#f2e8d2"/>
            <path class="hb-sail" d="M${m - 30} ${12 + k * 10} h66 v44 h-66 z" fill="#ece0c4"/>`).join('')}
          <rect x="183" y="-86" width="30" height="6" fill="#ffffff"/><rect x="183" y="-80" width="30" height="6" fill="#2a5db0"/><rect x="183" y="-74" width="30" height="6" fill="#d6312b"/>
          <g class="hp-smoke">${rep(4, k => `<circle cx="${236 + k * 8}" cy="${142 - k * 6}" r="${10 + k * 5}" fill="rgba(230,230,230,.75)" style="--i:${k}"/>`)}</g>
        </g></g>
      </svg>` },
    { depth: 1.7, z: 3, cls: 'wide', html: `
      <svg class="fit hp-top" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hp-scroll">
          <rect x="70" y="160" width="260" height="170" rx="12" fill="#f4e7c6" stroke="#9b7a3a" stroke-width="4"/>
          <rect x="56" y="150" width="28" height="190" rx="14" fill="#c9a46a" stroke="#9b7a3a" stroke-width="3"/>
          <rect x="316" y="150" width="28" height="190" rx="14" fill="#c9a46a" stroke="#9b7a3a" stroke-width="3"/>
          <text x="200" y="230" text-anchor="middle" class="hp-t1">МИР</text>
          <text x="200" y="272" text-anchor="middle" class="hp-t2">с Турцией · 1700</text>
          <circle cx="262" cy="304" r="22" fill="#b3261e"/><text x="262" y="312" text-anchor="middle" class="hp-seal">П</text>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-in' },
    { t: 2600, cls: 'is-sail' },
    { t: 9200, cls: 'is-city' },
    { t: 11600, cls: 'is-boom' },
    { t: 17200, cls: 'is-peace', fxFront: { type: 'sparks', rate: 24 } }
  ],
  captions: [
    { t: 500, text: 'Посол на корабле', big: true, hold: 2600 },
    { t: 2900, text: '1699 год: дьяк Украинцев плывёт к турецкому султану', hold: 4200 },
    { t: 7400, text: 'Корабль «Крепость» — 46 пушек', hold: 3200 },
    { t: 11800, text: 'Первый русский корабль в Константинополе!', hold: 3800 },
    { t: 17400, text: '1700 год · мир с Турцией', big: true, hold: 4200 }
  ],
  sound: [
    { t: 400, s: 'water' }, { t: 2700, s: 'wind' }, { t: 9300, s: 'bells' },
    { t: 11600, s: 'boom' }, { t: 12300, s: 'boom' }, { t: 17300, s: 'fanfare' }
  ]
});

/* 4. Хитровская площадь: шумный рынок сто лет назад */
SCENES.push({
  id: 'khitrov',
  day: KG,
  title: 'Хитров рынок',
  place: 'Хитровская площадь, сквер',
  aim: 'Встань у сквера на Хитровской площади и наведи камеру на середину площади.',
  lead: 'Всё становится старой фотографией: прилавки, пар от котлов, фонари и журналист Гиляровский с блокнотом. А потом снова тихий сквер.',
  say: 'Закрой на секунду глаза и представь: сто лет назад здесь шумел Хитров рынок. Торговки продавали горячую еду прямо из котлов, над ними шёл пар, вечером зажигали фонари. Место было шумное и опасное, но журналист Владимир Гиляровский не боялся сюда приходить. Он записывал истории здешних людей и написал о них книгу «Москва и москвичи». А теперь открой глаза: вместо рынка тихий сквер и детская площадка.',
  tint: 'linear-gradient(180deg, rgba(110,80,40,.42), rgba(60,40,20,.55))',
  fxBack: { type: 'steam', rate: 8 },
  layers: [
    { depth: .6, z: 1, cls: 'wide', html: `
      <svg class="fit hx-market" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        ${rep(3, i => `<g transform="translate(${i * 140 - 10} 600)"><g class="hx-stall" style="--i:${i}">
          <path d="M0 0 L120 0 L110 -40 L10 -40 Z" fill="${['#8a4a2a', '#6b5a2a', '#7a3b2a'][i]}"/>
          ${rep(4, k => `<path d="M${10 + k * 28} 0 l14 -40" stroke="#e8d8b8" stroke-width="6" opacity=".5"/>`)}
          <rect x="10" y="0" width="100" height="70" fill="#5a3d25"/>
          <ellipse cx="60" cy="0" rx="30" ry="10" fill="#3a2a1a"/>
          <rect x="34" y="-14" width="52" height="16" rx="6" fill="#4a3826"/>
        </g></g>`)}
        ${[40, 200, 360].map((x, i) => `<g class="hx-lamp" style="--i:${i}"><rect x="${x - 3}" y="380" width="6" height="220" fill="#2a2016"/>
          <path d="M${x - 16} 380 h32 l-6 -28 h-20 z" fill="#2a2016"/><circle class="hx-flame" cx="${x}" cy="368" r="8" fill="#ffcf5a"/></g>`).join('')}
      </svg>` },
    { depth: 1.2, z: 2, cls: 'wide', html: `
      <svg class="fit hx-people" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        ${rep(4, i => `<g class="hx-walker" style="--i:${i}"><g transform="translate(0 ${720 + (i % 2) * 30}) scale(${1 - (i % 2) * .15})">
          <circle cx="0" cy="-92" r="12" fill="#2a2016"/><path d="M-14 -78 h28 l8 70 h-44 z" fill="#2a2016"/>
          <path d="M-8 -8 v40 M8 -8 v40" stroke="#2a2016" stroke-width="7"/></g></g>`)}
        <g class="hx-gil" transform="translate(300 730)">
          <path d="M-22 -112 h44 l-6 -14 h-32 z" fill="#1a140e"/><rect x="-26" y="-114" width="52" height="6" rx="3" fill="#1a140e"/>
          <circle cx="0" cy="-96" r="13" fill="#1a140e"/><path d="M-8 -86 q8 10 16 0 v8 h-16 z" fill="#1a140e"/>
          <path d="M-18 -80 h36 l10 82 h-56 z" fill="#1a140e"/><rect x="18" y="-60" width="18" height="24" fill="#e8d8b8"/>
          <path d="M-10 2 v40 M10 2 v40" stroke="#1a140e" stroke-width="8"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-old' },
    { t: 3200, cls: 'is-walk' },
    { t: 8600, cls: 'is-gil' },
    { t: 15200, cls: 'is-now', fxBack: { type: 'pollen', rate: 18 }, tint: 'linear-gradient(180deg, rgba(20,40,30,.08), rgba(10,20,14,.25))' }
  ],
  captions: [
    { t: 500, text: 'Хитров рынок', big: true, hold: 2600 },
    { t: 3400, text: 'Сто лет назад здесь шумел рынок: пар от котлов, фонари, толпа', hold: 4200 },
    { t: 8800, text: 'Журналист Гиляровский не боялся приходить сюда', hold: 3600 },
    { t: 12400, text: 'Он написал книгу «Москва и москвичи»', hold: 2600 },
    { t: 15400, text: 'А теперь здесь тихий сквер', big: true, hold: 4200 }
  ],
  sound: [
    { t: 400, s: 'steam' }, { t: 3300, s: 'hooves' }, { t: 6000, s: 'steam' },
    { t: 8800, s: 'chime' }, { t: 15300, s: 'birds' }, { t: 16200, s: 'sparkle' }
  ]
});

/* ============================================================
   ЧТ. ВЕЛОПОХОД В АЛТУФЬЕВО — четыре сцены по пути и в усадьбе
   ============================================================ */
const AL = 'Чт 29 · Алтуфьево';

/* 1. Свиблово: бобры на Яузе */
SCENES.push({
  id: 'bobry',
  day: AL,
  title: 'Свибловские бобры',
  place: 'Берег Яузы у усадьбы Свиблово',
  aim: 'Встань у воды и наведи камеру на реку так, чтобы противоположный берег был в середине экрана.',
  lead: 'По Яузе плывёт бобр с веткой, складывает плотину и хатку, а из хатки выглядывает бобрёнок.',
  say: 'Тихо, смотри на воду. По Яузе плывёт бобр и тащит ветку. Бобры — настоящие строители: из веток, ила и камней они строят плотины и хатки. Вход в хатку всегда под водой, чтобы враги не пробрались. Бобры живут на Яузе прямо в городе, а у здешних, свибловских, недавно родился бобрёнок. Вот он!',
  tint: 'linear-gradient(180deg, rgba(30,50,40,.15), rgba(10,24,18,.45))',
  fxBack: { type: 'leaves', rate: 6 },
  layers: [
    { depth: .55, z: 1, cls: 'wide', html: `
      <svg class="fit hy-water" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g fill="none" stroke="rgba(205,236,255,.7)" stroke-width="2.5" stroke-linecap="round">
          ${rep(8, i => `<path class="hb-ripple" style="animation-delay:${(-i * .3).toFixed(1)}s" d="M-30 ${590 + i * 38} q25 -${5 + i} 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0"/>`)}
        </g>
        <g class="hy-lodge">
          ${rep(16, i => `<path class="hy-stick" style="--i:${i}" d="M${70 + (i % 8) * 34} ${640 - Math.floor(i / 8) * 26} l${i % 2 ? 60 : -60} ${i % 3 ? -14 : 10}" stroke="${['#6b4524', '#5a3a1e', '#7a5530'][i % 3]}" stroke-width="9" stroke-linecap="round"/>`)}
          <path class="hy-dome" d="M80 650 Q200 470 330 650 Z" fill="#5a3d25" stroke="#3a2614" stroke-width="4"/>
          <g class="hy-kit"><ellipse cx="200" cy="640" rx="22" ry="16" fill="#7a5530"/><circle cx="190" cy="634" r="3" fill="#111"/><circle cx="210" cy="634" r="3" fill="#111"/><ellipse cx="200" cy="644" rx="6" ry="4" fill="#2a1a0e"/></g>
        </g>
      </svg>` },
    { depth: 1.2, z: 2, cls: 'wide', html: `
      <svg class="fit hy-near" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hy-beaver">
          <path d="M-60 40 q30 -20 80 -8" stroke="rgba(220,240,255,.7)" stroke-width="3" fill="none"/>
          <ellipse cx="40" cy="30" rx="46" ry="22" fill="#6b4524"/>
          <ellipse cx="-14" cy="34" rx="26" ry="10" fill="#3a2614"/>
          <circle cx="82" cy="20" r="16" fill="#6b4524"/><circle cx="90" cy="14" r="3" fill="#111"/>
          <rect x="88" y="26" width="8" height="8" fill="#f2e6c8"/>
          <path d="M70 10 L150 -24" stroke="#5a3a1e" stroke-width="7" stroke-linecap="round"/>
          <path d="M120 -12 l16 -16 M134 -18 l8 -18" stroke="#6f8f3a" stroke-width="5" stroke-linecap="round"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-in' },
    { t: 1800, cls: 'is-swim' },
    { t: 8200, cls: 'is-build' },
    { t: 13800, cls: 'is-dome' },
    { t: 16800, cls: 'is-kit', fxFront: { type: 'sparks', rate: 18 } }
  ],
  captions: [
    { t: 500, text: 'Свибловские бобры', big: true, hold: 2400 },
    { t: 2600, text: 'Бобр тащит ветку для плотины', hold: 3800 },
    { t: 8400, text: 'Из веток и ила получается плотина', hold: 3600 },
    { t: 14000, text: 'А это хатка: вход в неё — под водой', hold: 3000 },
    { t: 17000, text: 'У свибловских бобров родился бобрёнок!', big: true, hold: 4000 }
  ],
  sound: [
    { t: 300, s: 'water' }, { t: 2000, s: 'water' },
    ...[8400, 8900, 9400, 9900, 10400, 10900].map(t => ({ t, s: 'crack' })),
    { t: 14000, s: 'birds' }, { t: 17000, s: 'chime' }
  ]
});

/* 2. Главный дом: терем Жеребцовых */
SCENES.push({
  id: 'zherebtsov',
  day: AL,
  title: 'Терем Жеребцовых',
  place: 'Усадьба Алтуфьево, главный дом',
  aim: 'Встань перед главным домом усадьбы и наведи камеру на фасад, чтобы он занял почти весь экран.',
  lead: 'Окна вспыхивают кокошниками, вырастают колонки-кувшины, а наверху появляется герб с годом 1851.',
  say: 'Посмотри на этот дом. В тысяча восемьсот пятьдесят первом году хозяин усадьбы Николай Жеребцов перестроил его в русском стиле, как старинный терем. Сейчас загорятся окна с кокошниками. А вот колонки, похожие на кувшины. Наверху, на фронтоне, появляется герб хозяев. Говорят, это единственный усадебный дом в Москве в таком стиле.',
  tint: 'radial-gradient(120% 80% at 50% 25%, rgba(60,30,20,.2), rgba(18,10,8,.5))',
  fxBack: { type: 'pollen', rate: 14 },
  layers: [
    { depth: .6, z: 1, html: `
      <svg class="fit hz-house" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <defs>${glow('hzGold', 6, '#ffcf5a')}</defs>
        <g fill="none" stroke="#ffd36a" stroke-width="5" filter="url(#hzGold)" stroke-linejoin="round">
          <path class="hz-line" style="--len:2200" d="M80 820 V480 H720 V820 M60 480 L400 330 L740 480"/>
          ${rep(4, i => {
            const x = 140 + i * 150;
            return `<path class="hz-line hz-win" style="--len:700;animation-delay:${(.6 + i * .35).toFixed(2)}s" d="M${x} 760 V610 Q${x} 560 ${x + 40} 548 Q${x + 60} 520 ${x + 80} 548 Q${x + 120} 560 ${x + 120} 610 V760 Z"/>`;
          })}
        </g>
        <g class="hz-cols">
          ${rep(5, i => `<g transform="translate(${118 + i * 150} 600)"><g class="hz-col" style="--i:${i}">
            <path d="M0 220 Q-14 150 -10 110 Q-22 70 0 40 Q22 70 10 110 Q14 150 0 220 Z" fill="#f4e7c6" stroke="#9b7a3a" stroke-width="3"/>
            <rect x="-14" y="30" width="28" height="10" rx="3" fill="#c9a46a"/></g></g>`)}
        </g>
        <g class="hz-crest">
          <path d="M360 360 h80 v50 q0 40 -40 56 q-40 -16 -40 -56 z" fill="#b3261e" stroke="#ffe39a" stroke-width="4"/>
          <path d="M380 380 h40 M400 372 v60" stroke="#ffe39a" stroke-width="6"/>
          <text x="400" y="320" text-anchor="middle" class="hz-year">1851</text>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-draw' },
    { t: 5600, cls: 'is-lit', fxFront: { type: 'sparks', rate: 22 } },
    { t: 9200, cls: 'is-cols' },
    { t: 13200, cls: 'is-crest' }
  ],
  captions: [
    { t: 500, text: 'Терем Жеребцовых', big: true, hold: 2600 },
    { t: 3200, text: '1851 год: дом перестроили в русском стиле', hold: 3400 },
    { t: 6000, text: 'Окна с кокошниками — как у старинного терема', hold: 3000 },
    { t: 9400, text: 'Колонки похожи на кувшины', hold: 3400 },
    { t: 13400, text: 'Наверху — герб хозяев', big: true, hold: 4200 }
  ],
  sound: [{ t: 300, s: 'chime' }, { t: 5600, s: 'sparkle' }, { t: 9200, s: 'grow' }, { t: 13200, s: 'bells' }]
});

/* 3. Аллеи: гость Куракина Крылов и его басня */
SCENES.push({
  id: 'krylov',
  day: AL,
  title: 'Ворона и Лисица',
  place: 'Липовые аллеи усадьбы',
  aim: 'Встань в липовой аллее и наведи камеру на деревья, чтобы ветки были в верхней части экрана.',
  lead: 'На ветке появляется ворона с сыром, из кустов выходит лисица — и оживает басня Крылова, гостя князя Куракина.',
  say: 'При князе Куракине сюда в гости приезжал баснописец Иван Крылов. Давай оживим его самую известную басню. Вороне где-то Бог послал кусочек сыру. На ель ворона взгромоздясь, позавтракать было совсем уж собралась. А вот и лисица! Она хвалит ворону и просит спеть. Ворона каркнула во всё воронье горло. Сыр выпал — с ним была плутовка такова. Мораль: не верь льстецам.',
  tint: 'linear-gradient(180deg, rgba(30,40,20,.15), rgba(10,16,8,.45))',
  fxBack: { type: 'leaves', rate: 10 },
  layers: [
    { depth: .9, z: 1, cls: 'wide', html: `
      <svg class="fit hr-branch" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <path d="M-20 300 Q120 280 260 330" stroke="#4a3220" stroke-width="18" fill="none" stroke-linecap="round"/>
        ${rep(6, i => `<ellipse cx="${30 + i * 40}" cy="${290 + (i % 2) * 22}" rx="22" ry="9" fill="#d8a13a" transform="rotate(${i % 2 ? 25 : -20} ${30 + i * 40} ${290 + (i % 2) * 22})"/>`)}
        <g class="hr-crow">
          <ellipse cx="170" cy="270" rx="34" ry="24" fill="#1a1a22"/>
          <circle cx="200" cy="248" r="16" fill="#1a1a22"/><circle cx="206" cy="244" r="3" fill="#fff"/>
          <path class="hr-beak" d="M214 248 l22 6 l-22 6 z" fill="#3a3a44"/>
          <path d="M140 272 l-30 10 l30 4 z" fill="#1a1a22"/>
          <g class="hr-cheese"><path d="M232 252 l26 -4 l-6 22 z" fill="#ffd34a" stroke="#c9a020" stroke-width="2"/><circle cx="246" cy="256" r="2.5" fill="#c9a020"/></g>
        </g>
      </svg>` },
    { depth: 1.3, z: 2, cls: 'wide', html: `
      <svg class="fit hr-ground" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <g class="hr-fox">
          <path d="M0 0 q-40 -30 -80 -10 q30 6 40 20 z" fill="#d9631e"/>
          <ellipse cx="40" cy="0" rx="50" ry="24" fill="#d9631e"/>
          <path d="M80 -10 l30 -30 l-6 34 z M98 -16 l20 -24 l-4 30 z" fill="#d9631e"/>
          <path d="M84 -20 q34 6 38 20 q-20 8 -40 0 z" fill="#d9631e"/><circle cx="104" cy="-10" r="3" fill="#111"/>
          <path d="M120 0 l6 2 l-6 3 z" fill="#111"/>
          <path d="M-74 -4 q14 -8 22 2 q-12 4 -22 -2 z" fill="#fff"/>
          <path d="M10 20 v26 M30 20 v26 M60 20 v26 M76 20 v26" stroke="#9b3e10" stroke-width="7"/>
        </g>
      </svg>` },
    { depth: 1.7, z: 3, html: `
      <svg class="fit hr-quill" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <g class="hr-sign">
          <path d="M260 120 q120 -40 260 10" stroke="#ffe39a" stroke-width="3" fill="none"/>
          <text x="400" y="100" text-anchor="middle" class="hr-name">И. А. Крылов</text>
          <path d="M560 30 q-60 50 -90 110" stroke="#f4e7c6" stroke-width="6" stroke-linecap="round"/>
          <path d="M560 30 q30 -10 40 -30 q-30 0 -40 30 z" fill="#f4e7c6"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-crow' },
    { t: 7000, cls: 'is-fox' },
    { t: 13600, cls: 'is-caw' },
    { t: 14400, cls: 'is-drop' },
    { t: 15800, cls: 'is-run' },
    { t: 18400, cls: 'is-sign', fxFront: { type: 'sparks', rate: 20 } }
  ],
  captions: [
    { t: 500, text: 'В гостях у князя Куракина бывал Иван Крылов', hold: 3800 },
    { t: 4600, text: '«Вороне где-то Бог послал кусочек сыру…»', hold: 2600 },
    { t: 7300, text: '«…Плутовка к дереву на цыпочках подходит»', hold: 3600 },
    { t: 13700, text: '«Ворона каркнула во всё воронье горло»', hold: 2400 },
    { t: 16200, text: '«Сыр выпал — с ним была плутовка такова»', hold: 2400 },
    { t: 18600, text: 'Мораль: не верь льстецам', big: true, hold: 3800 }
  ],
  sound: [{ t: 300, s: 'birds' }, { t: 7100, s: 'wind' }, { t: 13600, s: 'caw' }, { t: 14200, s: 'caw' }, { t: 15900, s: 'hooves' }, { t: 18500, s: 'chime' }]
});

/* 4. Серебристый клён-великан */
SCENES.push({
  id: 'klen',
  day: AL,
  title: 'Клён-великан',
  place: 'Старый парк усадьбы',
  aim: 'Найди самое большое дерево в парке — серебристый клён — и наведи камеру на его ствол снизу вверх.',
  lead: 'Ствол обводится золотом, ветки растут до неба, листья переворачиваются серебром, а на срезе считаем годовые кольца.',
  say: 'Это серебристый клён, великан старинного парка. Смотри, как растут его ветки. Листья у него сверху зелёные, а снизу серебристые, поэтому, когда дует ветер, дерево будто мерцает. Как узнать возраст дерева? По годовым кольцам: каждый год у ствола нарастает одно новое кольцо. Деревья в этом парке видели и князя Куракина, и его знаменитых гостей.',
  tint: 'linear-gradient(180deg, rgba(20,30,40,.12), rgba(8,12,18,.42))',
  fxBack: { type: 'leaves', rate: 14 },
  layers: [
    { depth: .6, z: 1, cls: 'wide', html: `
      <svg class="fit hm2-tree" viewBox="0 0 400 900" preserveAspectRatio="xMidYMax slice">
        <defs>${glow('hlGold', 6, '#ffdc7a')}</defs>
        <g fill="none" stroke="#ffd36a" stroke-width="6" filter="url(#hlGold)" stroke-linecap="round">
          <path class="hl-line" style="--len:700" d="M180 900 Q170 700 190 520 M220 900 Q230 700 210 520"/>
          <path class="hl-line" style="--len:500;animation-delay:.8s" d="M195 560 Q120 470 60 360 M200 540 Q200 420 200 260 M205 560 Q290 470 340 360"/>
          <path class="hl-line" style="--len:400;animation-delay:1.4s" d="M90 410 Q40 370 20 300 M120 460 Q150 380 140 320 M310 410 Q360 370 380 300 M280 460 Q250 380 260 320"/>
        </g>
        ${rep(14, i => {
          const x = [40, 80, 130, 170, 200, 230, 270, 320, 360, 60, 150, 250, 340, 200][i], y = [300, 250, 280, 230, 200, 230, 280, 250, 300, 360, 330, 330, 360, 280][i];
          return `<g transform="translate(${x} ${y})"><g class="hl-leaf" style="--i:${i}"><path d="M0 -18 l6 10 l12 -4 l-6 12 l8 8 l-14 0 l-6 10 l-6 -10 l-14 0 l8 -8 l-6 -12 l12 4 z" fill="#8fae43"/></g></g>`;
        })}
      </svg>` },
    { depth: 1.5, z: 2, html: `
      <svg class="fit hl-rings" viewBox="0 0 800 900" preserveAspectRatio="xMidYMax meet">
        <g class="hl-cut" transform="translate(400 170)">
          <circle r="120" fill="#e8c992" stroke="#8a5d2a" stroke-width="6"/>
          ${rep(9, k => `<circle class="hl-ring" style="--i:${k}" r="${108 - k * 12}" fill="none" stroke="#a87447" stroke-width="3"/>`)}
          <circle r="6" fill="#8a5d2a"/>
        </g>
      </svg>` }
  ],
  beats: [
    { t: 300, cls: 'is-draw' },
    { t: 5600, cls: 'is-leaves' },
    { t: 9000, cls: 'is-silver', fxFront: { type: 'sparks', rate: 18 } },
    { t: 13000, cls: 'is-rings' }
  ],
  captions: [
    { t: 500, text: 'Клён-великан', big: true, hold: 2600 },
    { t: 3200, text: 'Серебристый клён — самое большое дерево парка', hold: 3600 },
    { t: 9200, text: 'Снизу листья серебристые — дерево мерцает на ветру', hold: 3600 },
    { t: 13200, text: 'Одно кольцо на срезе — один год жизни', hold: 3400 },
    { t: 16800, text: 'Деревья помнят князя Куракина', big: true, hold: 3600 }
  ],
  sound: [{ t: 300, s: 'grow' }, { t: 5600, s: 'wind' }, { t: 9000, s: 'sparkle' }, { t: 13200, s: 'chime' }, { t: 16800, s: 'birds' }]
});

// порядок галереи: по дням, четыре сцены Китай-города — среди среды, бонусы в конце
const ORDER = ['botik', 'glubina', 'kita', 'stena', 'posol', 'khitrov', 'terem', 'bobry', 'zherebtsov', 'krylov', 'klen', 'organ', 'dzhungli', 'voda', 'most'];
SCENES.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

if (typeof module !== 'undefined') module.exports = { SCENES };
