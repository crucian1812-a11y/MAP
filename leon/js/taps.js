/* Реакция на тапы по экрану камеры: в каждой сцене своя — кольца у Соника,
   молния у Маккуина, паутина у Человека-паука, клякса у Венома, «БУМ!» у Халка.
   В большом поздравлении эффекты идут по кругу. */
(() => {
  const stage = document.getElementById('stage');
  const box = document.createElement('div');
  box.className = 'taps';
  stage.appendChild(box);

  const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#4cc9f0', '#9b5de5', '#ff70a6'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const sparks = (n, colors) => Array.from({ length: n }, (_, i) =>
    `<i class="tap-spark" style="--a:${(360 / n) * i + Math.random() * 20}deg;--c:${pick(colors)};--r:${70 + Math.random() * 50}px"></i>`).join('');

  const FX = {
    ring: () => ({ sound: 'sparkle', html: `<svg class="tap-pop" viewBox="-60 -60 120 120"><circle r="34" fill="none" stroke="#ffd23f" stroke-width="12"/><circle r="34" fill="none" stroke="#fff6c2" stroke-width="4"/></svg>${sparks(8, ['#ffd23f', '#fff6c2'])}` }),
    bolt: () => ({ sound: 'crack', html: `<svg class="tap-pop" viewBox="-60 -70 120 140"><path d="M14 -64 L-34 6 H-4 L-18 64 L36 -12 H6 Z" fill="#ffd23f" stroke="#d7262b" stroke-width="6" stroke-linejoin="round"/></svg><b class="tap-word tap-word--red">КА-ЧАУ!</b>` }),
    web: () => ({ sound: 'lift', html: `<svg class="tap-splat" viewBox="-80 -80 160 160">${Array.from({ length: 8 }, (_, k) => `<path d="M0 0 L${(76 * Math.cos(k * Math.PI / 4)).toFixed(0)} ${(76 * Math.sin(k * Math.PI / 4)).toFixed(0)}"/>`).join('')}${[22, 42, 62].map(r => `<polygon points="${Array.from({ length: 8 }, (_, k) => `${(r * Math.cos(k * Math.PI / 4)).toFixed(0)},${(r * Math.sin(k * Math.PI / 4)).toFixed(0)}`).join(' ')}"/>`).join('')}</svg>` }),
    goo: () => ({ sound: 'rumble', html: `<svg class="tap-splat tap-goo" viewBox="-80 -80 160 160"><path d="M-50 -20 q-20 -40 20 -48 q30 -30 56 2 q40 -6 40 36 q24 30 -10 54 q-6 36 -46 26 q-40 22 -56 -14 q-34 -10 -4 -56 z" fill="#0d0d12"/><path d="M-36 -8 q18 -26 40 -10 q-10 22 -40 10 z M36 -8 q-18 -26 -40 -10 q10 22 40 10 z" fill="#fff"/></svg>` }),
    boom: () => ({ sound: 'boom', shake: true, html: `<svg class="tap-pop" viewBox="-80 -80 160 160"><path d="${Array.from({ length: 16 }, (_, k) => `${k ? 'L' : 'M'}${((k % 2 ? 40 : 74) * Math.cos(k * Math.PI / 8)).toFixed(0)} ${((k % 2 ? 40 : 74) * Math.sin(k * Math.PI / 8)).toFixed(0)}`).join(' ')} Z" fill="#ffd23f" stroke="#d7262b" stroke-width="6"/></svg><b class="tap-word">БУМ!</b>` }),
    confetti: () => ({ sound: 'chime', html: sparks(14, COLORS).replace(/tap-spark/g, 'tap-spark tap-spark--sq') }),
    balloon: () => ({ sound: 'chime', html: `<svg class="tap-balloon" viewBox="-40 -60 80 160"><path d="M0 50 q-8 40 6 90" stroke="#fff" stroke-width="2" fill="none"/><ellipse rx="34" ry="44" fill="${pick(COLORS)}"/><ellipse cx="-12" cy="-16" rx="8" ry="13" fill="#fff" opacity=".4"/></svg>` }),
    four: () => ({ sound: 'fanfare', html: `<b class="tap-word tap-word--four">4</b>${sparks(12, COLORS)}` })
  };
  const BY_SCENE = { sonik: ['ring'], makvin: ['bolt'], pauk: ['web'], venom: ['goo'], halk: ['boom'] };
  const PARTY = ['ring', 'balloon', 'bolt', 'confetti', 'web', 'goo', 'boom', 'balloon'];
  let n = 0;

  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('button, .stage__aim')) return;
    n++;
    const list = BY_SCENE[stage.dataset.scene];
    // каждый четвёртый тап — большая цифра 4: Леону четыре!
    const kind = n % 4 === 0 ? 'four' : list ? pick(list) : PARTY[n % PARTY.length];
    const fx = FX[kind]();
    const el = document.createElement('div');
    el.className = `tap tap--${kind}`;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.innerHTML = fx.html;
    box.appendChild(el);
    setTimeout(() => el.remove(), 1600);
    if (fx.shake) { stage.classList.remove('is-shake'); void stage.offsetWidth; stage.classList.add('is-shake'); }
    if (Stage.sound) Stage.sound(fx.sound);
    if (navigator.vibrate) navigator.vibrate(fx.shake ? 40 : 12);
  });
})();
