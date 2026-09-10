/* Сцены дополненной реальности: рисованные картинки поверх камеры.
   Каждая сцена — это SVG с анимациями, ar.js двигает её по экрану вслед за компасом. */

const Scenes = (() => {

  const CSS = `
  .ar-obj svg{display:block;overflow:visible;filter:drop-shadow(0 10px 24px rgba(0,0,0,.45))}
  .ar-caption{
    position:absolute;left:50%;transform:translateX(-50%);bottom:-54px;white-space:nowrap;
    background:rgba(0,0,0,.62);color:#fff;padding:8px 14px;border-radius:20px;font-size:14px;font-weight:600
  }
  @keyframes ar-rise{from{transform:translateY(60%);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes ar-grow{from{transform:scale(.05);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes ar-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
  @keyframes ar-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes ar-fly{from{transform:translate(-140px,20px) rotate(-8deg)}to{transform:translate(140px,-30px) rotate(8deg)}}
  @keyframes ar-ride{from{transform:translateX(-180px)}to{transform:translateX(200px)}}
  @keyframes ar-blink{0%,100%{opacity:.35}50%{opacity:1}}
  @keyframes ar-spin{to{transform:rotate(360deg)}}
  @keyframes ar-fall{from{transform:translateY(-60px);opacity:0}60%{opacity:.9}to{transform:translateY(200px);opacity:0}}
  @keyframes ar-tilt{0%{transform:rotate(6deg)}45%{transform:rotate(6deg)}75%{transform:rotate(0deg)}100%{transform:rotate(0deg)}}
  @keyframes ar-lift{0%,100%{transform:translateY(0)}50%{transform:translateY(-90px)}}
  @keyframes ar-note{from{transform:translate(0,0) scale(.6);opacity:0}25%{opacity:1}to{transform:translate(90px,-110px) scale(1.1);opacity:0}}
  @keyframes ar-boom{from{transform:scale(.1);opacity:1}to{transform:scale(1.6);opacity:0}}
  @keyframes ar-stamp{0%,100%{transform:translateY(-70px) rotate(-6deg)}45%,55%{transform:translateY(0) rotate(0)}}
  `;

  function styleOnce() {
    if (document.getElementById('ar-scene-css')) return;
    const s = document.createElement('style');
    s.id = 'ar-scene-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function make(svgMarkup, caption) {
    styleOnce();
    const wrap = document.createElement('div');
    wrap.className = 'ar-obj';
    wrap.innerHTML = svgMarkup + (caption ? `<div class="ar-caption">${caption}</div>` : '');
    return wrap;
  }

  const SCENES = {

    /* Аптекарский огород: Пётр сажает лиственницу, она вырастает */
    ogorod: {
      tip: 'Наведи камеру на сад — увидишь, как сажают ту самую лиственницу',
      build: () => make(`
      <svg width="300" height="330" viewBox="0 0 300 330">
        <ellipse cx="150" cy="320" rx="96" ry="12" fill="rgba(0,0,0,.25)"/>
        <g style="animation:ar-grow 3s ease-out both;transform-origin:150px 320px">
          <path d="M150 320 L150 150" stroke="#7a4a24" stroke-width="14" stroke-linecap="round"/>
          <g style="transform-origin:150px 200px;animation:ar-sway 4s ease-in-out infinite 3s">
            <path d="M150 40 L96 130 L204 130 Z" fill="#3f8a4d"/>
            <path d="M150 90 L80 190 L220 190 Z" fill="#4b9c58"/>
            <path d="M150 140 L66 246 L234 246 Z" fill="#57ab63"/>
          </g>
        </g>
        <g style="animation:ar-fly 6s ease-in-out infinite alternate">
          <g style="transform-origin:64px 122px;animation:ar-sway .4s ease-in-out infinite">
            <path d="M64 122 q-22 -22 -2 -26 q10 -2 2 26z" fill="#ffd166"/>
            <path d="M64 122 q22 -22 2 -26 q-10 -2 -2 26z" fill="#ffc233"/>
            <path d="M62 118 h4 v12 h-4z" fill="#7a4a24"/>
          </g>
        </g>
        <g transform="translate(28,196)">
          <ellipse cx="26" cy="122" rx="30" ry="7" fill="rgba(0,0,0,.28)"/>
          <path d="M8 122 L18 66 h18 l10 56z" fill="#20406e"/>
          <rect x="16" y="40" width="22" height="30" rx="8" fill="#f0c9a4"/>
          <path d="M2 40 q26 -22 50 0 q-26 -10 -50 0z" fill="#16233c"/>
          <path d="M38 74 l26 22" stroke="#f0c9a4" stroke-width="9" stroke-linecap="round"/>
          <g style="transform-origin:64px 96px;animation:ar-sway 1.6s ease-in-out infinite">
            <path d="M64 96 l16 30" stroke="#8a5a2c" stroke-width="6" stroke-linecap="round"/>
            <path d="M74 118 l16 26 l-14 6 l-12 -26z" fill="#9aa4ae"/>
          </g>
        </g>
      </svg>`, 'Пётр I, 1706 год')
    },

    /* Странноприимный дом: колоннада, карета, занавес */
    sheremetev: {
      tip: 'Наведи камеру на колоннаду',
      build: () => make(`
      <svg width="340" height="260" viewBox="0 0 340 260">
        <g style="animation:ar-rise 1.6s ease-out both">
          <rect x="20" y="120" width="300" height="110" fill="#f4ece0"/>
          <path d="M170 20 a110 110 0 0 1 110 100 h-220 a110 110 0 0 1 110 -100z" fill="#e8dcc9"/>
          <circle cx="170" cy="64" r="30" fill="#cdd9e8"/>
          ${[0,1,2,3,4,5,6].map(i => `<rect x="${44 + i*38}" y="120" width="16" height="110" fill="#fff"/>`).join('')}
          <rect x="20" y="112" width="300" height="12" fill="#fff"/>
        </g>
        <g style="animation:ar-ride 7s linear infinite">
          <rect x="120" y="176" width="70" height="38" rx="9" fill="#3a2a1c"/>
          <circle cx="134" cy="220" r="14" fill="none" stroke="#5c4630" stroke-width="5" style="transform-origin:134px 220px;animation:ar-spin 1.2s linear infinite"/>
          <circle cx="178" cy="220" r="14" fill="none" stroke="#5c4630" stroke-width="5" style="transform-origin:178px 220px;animation:ar-spin 1.2s linear infinite"/>
          <path d="M190 196 l34 -8" stroke="#5c4630" stroke-width="5"/>
          <path d="M224 214 q10 -30 22 -22 q-6 12 -4 22z" fill="#6b4a2c"/>
        </g>
        <g style="animation:ar-note 4s ease-out infinite" transform="translate(236,150)">
          <text font-size="30" fill="#ffd166">♪</text>
        </g>
      </svg>`, 'Больница графа Шереметева, 1810')
    },

    /* Сухарева башня поднимается из земли */
    suharev: {
      tip: 'Наведи камеру на середину площади',
      build: () => make(`
      <svg width="240" height="440" viewBox="0 0 240 440">
        <g style="animation:ar-rise 2.4s cubic-bezier(.2,.8,.3,1) both">
          <rect x="30" y="250" width="180" height="180" fill="#e9e0cf"/>
          <rect x="30" y="238" width="180" height="16" fill="#c9573f"/>
          <rect x="66" y="150" width="108" height="100" fill="#f2e9d8"/>
          <rect x="60" y="140" width="120" height="14" fill="#c9573f"/>
          <rect x="86" y="70" width="68" height="76" fill="#e9e0cf"/>
          <circle cx="120" cy="106" r="20" fill="#fff" stroke="#16233c" stroke-width="3"/>
          <path d="M120 106 L120 94 M120 106 L130 112" stroke="#16233c" stroke-width="3" stroke-linecap="round"/>
          <path d="M120 6 L86 72 h68z" fill="#c9573f"/>
          <path d="M120 6 L120 -14" stroke="#ffd166" stroke-width="4"/>
          <rect x="96" y="300" width="26" height="46" rx="12" fill="#5a4a34"/>
          <rect x="140" y="300" width="26" height="46" rx="12" fill="#5a4a34"/>
          <rect x="52" y="300" width="26" height="46" rx="12" fill="#5a4a34"/>
          <rect x="100" y="176" width="40" height="40" fill="#ffd166" style="animation:ar-blink 2.6s ease-in-out infinite 2.4s"/>
        </g>
        <g fill="#16233c" style="animation:ar-fly 8s ease-in-out infinite alternate">
          <path d="M12 60 q10 -10 20 0 q10 -10 20 0" stroke="#16233c" stroke-width="3" fill="none"/>
        </g>
      </svg>`, 'Сухарева башня, 1695–1934')
    },

    /* Улан скачет с пикой */
    ulan: {
      tip: 'Наведи камеру вдоль переулка',
      build: () => make(`
      <svg width="320" height="240" viewBox="0 0 320 240">
        <g style="animation:ar-ride 5s linear infinite">
          <ellipse cx="150" cy="222" rx="80" ry="10" fill="rgba(0,0,0,.25)"/>
          <path d="M80 170 q20 -50 70 -50 q50 0 60 40 l10 40 h-16 l-10 -30 h-90 l-12 34 h-16z" fill="#7b4a28"/>
          <path d="M206 128 q22 -18 30 -44 q-4 26 -12 40z" fill="#5c3418"/>
          <circle cx="230" cy="96" r="16" fill="#7b4a28"/>
          <path d="M138 122 q6 -34 26 -34 q18 0 20 30z" fill="#2a4d8f"/>
          <circle cx="164" cy="70" r="13" fill="#f0c9a4"/>
          <rect x="148" y="46" width="32" height="14" fill="#16233c" transform="rotate(-6 164 53)"/>
          <path d="M172 84 L272 26" stroke="#c9a25a" stroke-width="5"/>
          <path d="M256 34 l30 -6 l-14 18z" fill="#c9573f" style="transform-origin:256px 34px;animation:ar-sway .5s ease-in-out infinite"/>
        </g>
      </svg>`, 'Улан с пикой')
    },

    /* Сахаров: атом и голубь */
    sakharov: {
      tip: 'Наведи камеру на проспект',
      build: () => make(`
      <svg width="300" height="280" viewBox="0 0 300 280">
        <g transform="translate(150,140)">
          <circle r="18" fill="#ffd166"/>
          <g style="transform-origin:0 0;animation:ar-spin 7s linear infinite">
            <ellipse rx="90" ry="34" fill="none" stroke="#8fd0ff" stroke-width="4"/>
            <circle cx="90" cy="0" r="9" fill="#8fd0ff"/>
          </g>
          <g style="transform-origin:0 0;animation:ar-spin 5s linear infinite reverse" transform="rotate(60)">
            <ellipse rx="90" ry="34" fill="none" stroke="#a8e6b0" stroke-width="4"/>
            <circle cx="-90" cy="0" r="9" fill="#a8e6b0"/>
          </g>
          <g style="transform-origin:0 0;animation:ar-spin 9s linear infinite" transform="rotate(-60)">
            <ellipse rx="90" ry="34" fill="none" stroke="#ffb4a1" stroke-width="4"/>
            <circle cx="70" cy="20" r="9" fill="#ffb4a1"/>
          </g>
        </g>
        <g style="animation:ar-float 4s ease-in-out infinite" transform="translate(30,36)">
          <path d="M0 30 q30 -34 62 -14 q22 -22 40 -8 q-14 6 -18 20 q26 12 6 30 q-38 22 -70 -4 q-22 -10 -20 -24z" fill="#fff"/>
          <circle cx="96" cy="18" r="3" fill="#16233c"/>
        </g>
      </svg>`, 'Академик Сахаров')
    },

    /* Патерностер: кабинки едут по кругу */
    narkomzem: {
      tip: 'Наведи камеру на серый дом с круглой башней',
      build: () => make(`
      <svg width="240" height="380" viewBox="0 0 240 380">
        <rect x="20" y="20" width="200" height="340" rx="10" fill="#cfd4d8"/>
        <rect x="40" y="40" width="70" height="300" fill="#2f3a46"/>
        <rect x="130" y="40" width="70" height="300" fill="#2f3a46"/>
        ${[0,1,2].map(i => `<rect x="46" y="${60 + i*110}" width="58" height="80" rx="6" fill="#ffd166" style="animation:ar-lift 3.2s ease-in-out infinite ${i*0.5}s"/>`).join('')}
        ${[0,1,2].map(i => `<rect x="136" y="${100 + i*110}" width="58" height="80" rx="6" fill="#ffe6a3" style="animation:ar-lift 3.2s ease-in-out infinite ${0.9 + i*0.5}s"/>`).join('')}
        <circle cx="120" cy="200" r="16" fill="none" stroke="#fff" stroke-width="4" style="transform-origin:120px 200px;animation:ar-spin 3.2s linear infinite"/>
      </svg>`, 'Лифт, который не останавливается')
    },

    /* Красные Ворота с золотой Славой */
    vorota: {
      tip: 'Наведи камеру на середину площади',
      build: () => make(`
      <svg width="300" height="380" viewBox="0 0 300 380">
        <g style="animation:ar-rise 2s ease-out both">
          <rect x="30" y="120" width="240" height="240" fill="#c9573f"/>
          <path d="M150 160 a56 56 0 0 1 56 56 v144 h-112 v-144 a56 56 0 0 1 56 -56z" fill="rgba(0,0,0,.55)"/>
          <rect x="20" y="104" width="260" height="20" fill="#f4ece0"/>
          <rect x="46" y="124" width="16" height="236" fill="#f4ece0"/>
          <rect x="238" y="124" width="16" height="236" fill="#f4ece0"/>
          <path d="M60 104 L150 46 L240 104z" fill="#c9573f"/>
          <path d="M60 104 L150 46 L240 104z" fill="none" stroke="#f4ece0" stroke-width="6"/>
          <g transform="translate(150,44)" style="animation:ar-float 3.4s ease-in-out infinite">
            <circle cy="-30" r="11" fill="#e8b93b"/>
            <path d="M-10 -20 q10 -6 20 0 l6 40 h-32z" fill="#e8b93b"/>
            <path d="M8 -26 l40 -14 l-6 14 l6 12z" fill="#e8b93b"/>
          </g>
        </g>
        <g style="animation:ar-note 3.5s ease-out infinite" transform="translate(196,14)"><text font-size="26" fill="#e8b93b">♫</text></g>
      </svg>`, 'Красные Ворота, 1757–1927')
    },

    /* Высотка: наклонили, заморозили, выпрямилась */
    vysotka: {
      tip: 'Наведи камеру на высотку',
      build: () => make(`
      <svg width="260" height="440" viewBox="0 0 260 440">
        <g style="transform-origin:130px 430px;animation:ar-tilt 6s ease-in-out infinite">
          <rect x="86" y="140" width="88" height="290" fill="#d8cfc0"/>
          <rect x="60" y="250" width="140" height="180" fill="#cec4b3"/>
          <rect x="104" y="70" width="52" height="76" fill="#e2d9c9"/>
          <path d="M130 6 L104 74 h52z" fill="#b9ae9c"/>
          <path d="M130 -16 L124 8 h12z" fill="#e8b93b"/>
          <circle cx="130" cy="-20" r="8" fill="#e8b93b"/>
          ${[0,1,2,3,4,5,6,7].map(i => `<rect x="98" y="${170 + i*30}" width="64" height="12" fill="#8c8272" opacity=".6"/>`).join('')}
        </g>
        ${[0,1,2,3,4,5].map(i => `<circle cx="${30 + i*42}" cy="0" r="5" fill="#bfe6ff" style="animation:ar-fall ${3 + i*0.4}s linear infinite ${i*0.6}s"/>`).join('')}
      </svg>`, 'Построили криво — стала прямой')
    },

    /* Басманный хлеб с печатью */
    petropavel: {
      tip: 'Наведи камеру на храм',
      build: () => make(`
      <svg width="300" height="320" viewBox="0 0 300 320">
        <g style="animation:ar-rise 1.6s ease-out both">
          <rect x="176" y="120" width="60" height="180" fill="#f0e6d4"/>
          <path d="M206 44 L176 124 h60z" fill="#3f6b8a"/>
          <rect x="60" y="170" width="110" height="130" fill="#f4ece0"/>
          <path d="M115 96 q34 24 34 56 h-68 q0 -32 34 -56z" fill="#3f6b8a"/>
          <path d="M104 92 h22 v-10 h-22z" fill="#e8b93b"/>
          <path d="M115 62 L115 84" stroke="#e8b93b" stroke-width="5"/>
        </g>
        <g transform="translate(150,250)">
          <ellipse cx="0" cy="10" rx="66" ry="34" fill="#d99b53"/>
          <ellipse cx="0" cy="2" rx="66" ry="32" fill="#e8b268"/>
          <g style="animation:ar-stamp 3s ease-in-out infinite">
            <circle cx="0" cy="0" r="20" fill="#b3762f"/>
            <path d="M-9 0 h18 M0 -9 v18" stroke="#e8b268" stroke-width="4"/>
          </g>
        </g>
      </svg>`, 'Басма — клеймо на хлебе')
    },

    /* Сад Баумана: грот и салют */
    bauman: {
      tip: 'Наведи камеру на грот в глубине сада',
      build: () => make(`
      <svg width="320" height="320" viewBox="0 0 320 320">
        <g style="animation:ar-rise 1.6s ease-out both">
          <path d="M40 300 v-90 q0 -70 120 -70 q120 0 120 70 v90z" fill="#8e8778"/>
          <path d="M160 300 v-120 q-52 0 -52 60 v60z" fill="#2b2b28"/>
          <path d="M160 300 v-120 q52 0 52 60 v60z" fill="#2b2b28"/>
          <circle cx="90" cy="196" r="16" fill="#a49b8a"/>
          <circle cx="230" cy="196" r="16" fill="#a49b8a"/>
          <path d="M20 300 h280" stroke="#5b6b4a" stroke-width="12"/>
        </g>
        ${[[70,70,'#ffd166'],[160,40,'#ff8f6b'],[250,80,'#8fd0ff']].map(([x,y,c],i) => `
        <g transform="translate(${x},${y})" style="animation:ar-boom 2.2s ease-out infinite ${i*0.7}s">
          ${[0,45,90,135,180,225,270,315].map(a => `<path d="M0 0 L${Math.round(Math.cos(a*Math.PI/180)*46)} ${Math.round(Math.sin(a*Math.PI/180)*46)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`).join('')}
        </g>`).join('')}
      </svg>`, 'Финиш! Салют в честь пройденного маршрута')
    }
  };

  return {
    has: id => !!SCENES[id],
    tip: id => (SCENES[id] && SCENES[id].tip) || 'Наведи камеру вокруг себя',
    build: id => SCENES[id] ? SCENES[id].build() : null
  };
})();
