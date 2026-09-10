/* Частицы поверх камеры: пыль, снег, искры, салют, туман, пыльца.
   Один общий цикл, у каждого типа свои правила рождения, движения и рисования. */

const Particles = (() => {

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  /* ---------- описания типов ---------- */
  const TYPES = {

    dust: {
      blend: 'source-over', rate: 26,
      spawn: (w, h) => ({
        x: rnd(-40, w + 40), y: h + rnd(0, 60),
        vx: rnd(-12, 12), vy: rnd(-38, -14),
        r: rnd(1.5, 6), life: rnd(2.6, 6), age: 0,
        c: pick(['218,196,158', '198,174,138', '236,220,190'])
      }),
      draw: (ctx, p) => {
        const k = 1 - p.age / p.life;
        ctx.fillStyle = `rgba(${p.c},${(0.34 * k).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + (1 - k) * 1.6), 0, 7); ctx.fill();
      }
    },

    snow: {
      blend: 'source-over', rate: 34,
      spawn: (w, h) => ({
        x: rnd(0, w), y: rnd(-80, -10),
        vx: rnd(-14, 14), vy: rnd(28, 70),
        r: rnd(1.4, 4.4), life: rnd(6, 12), age: 0, ph: rnd(0, 7)
      }),
      step: (p, dt) => { p.x += Math.sin(p.ph + p.age * 1.6) * 16 * dt; },
      draw: (ctx, p) => {
        ctx.fillStyle = `rgba(255,255,255,${0.86 - p.r * 0.06})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
    },

    frost: {
      blend: 'lighter', rate: 22,
      spawn: (w, h) => ({
        x: rnd(0, w), y: rnd(-60, h),
        vx: rnd(-8, 8), vy: rnd(-18, 18),
        r: rnd(3, 9), life: rnd(2, 5), age: 0, rot: rnd(0, 7)
      }),
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * p.age / p.life);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + p.age);
        ctx.strokeStyle = `rgba(190,230,255,${(0.75 * k).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 3; i++) {
          const a = i * Math.PI / 3;
          ctx.beginPath();
          ctx.moveTo(-Math.cos(a) * p.r, -Math.sin(a) * p.r);
          ctx.lineTo(Math.cos(a) * p.r, Math.sin(a) * p.r);
          ctx.stroke();
        }
        ctx.restore();
      }
    },

    drops: {
      blend: 'source-over', rate: 18,
      spawn: (w, h) => ({
        x: rnd(0, w), y: rnd(-40, 0),
        vx: 0, vy: rnd(260, 460), r: rnd(1, 2.2), life: rnd(1.2, 2.4), age: 0
      }),
      draw: (ctx, p) => {
        ctx.strokeStyle = 'rgba(180,220,255,.7)'; ctx.lineWidth = p.r;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.vy * 0.04); ctx.stroke();
      }
    },

    sparks: {
      blend: 'lighter', rate: 60, gravity: 120,
      spawn: (w, h, o) => {
        const a = rnd(-Math.PI * 0.92, -Math.PI * 0.08);
        const s = rnd(60, 260);
        return {
          x: w * (o.x || .5) + rnd(-14, 14), y: h * (o.y || .42),
          vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          r: rnd(1, 2.8), life: rnd(0.7, 2.1), age: 0,
          c: pick(['255,214,102', '255,176,60', '255,244,200'])
        };
      },
      draw: (ctx, p) => {
        const k = 1 - p.age / p.life;
        ctx.fillStyle = `rgba(${p.c},${(k * .95).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * k + .4, 0, 7); ctx.fill();
        ctx.strokeStyle = `rgba(${p.c},${(k * .35).toFixed(3)})`; ctx.lineWidth = p.r * k;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * .03, p.y - p.vy * .03); ctx.stroke();
      }
    },

    embers: {
      blend: 'lighter', rate: 24, gravity: -30,
      spawn: (w, h) => ({
        x: rnd(0, w), y: h + rnd(0, 40),
        vx: rnd(-18, 18), vy: rnd(-70, -26),
        r: rnd(1, 3), life: rnd(2, 5), age: 0, ph: rnd(0, 7),
        c: pick(['255,150,60', '255,196,90', '255,110,40'])
      }),
      step: (p, dt) => { p.x += Math.sin(p.ph + p.age * 2.2) * 22 * dt; },
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * Math.min(1, p.age / p.life));
        ctx.fillStyle = `rgba(${p.c},${(k * .9).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
    },

    pollen: {
      blend: 'lighter', rate: 20,
      spawn: (w, h) => ({
        x: rnd(0, w), y: rnd(0, h),
        vx: rnd(-16, 16), vy: rnd(-26, -6),
        r: rnd(1.6, 4.6), life: rnd(4, 9), age: 0, ph: rnd(0, 7),
        c: pick(['255,238,160', '200,255,190', '255,252,220'])
      }),
      step: (p, dt) => { p.x += Math.sin(p.ph + p.age) * 20 * dt; },
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * p.age / p.life) * (.6 + .4 * Math.sin(p.ph + p.age * 4));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(${p.c},${(k * .9).toFixed(3)})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 7); ctx.fill();
      }
    },

    stars: {
      blend: 'lighter', rate: 14,
      spawn: (w, h) => ({
        x: rnd(0, w), y: rnd(0, h * .7),
        vx: rnd(-4, 4), vy: rnd(-4, 4),
        r: rnd(1, 2.6), life: rnd(2.5, 6), age: 0, ph: rnd(0, 7)
      }),
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * p.age / p.life) * (.55 + .45 * Math.sin(p.ph + p.age * 5));
        ctx.fillStyle = `rgba(255,255,235,${Math.max(0, k).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        ctx.strokeStyle = `rgba(255,255,235,${Math.max(0, k * .5).toFixed(3)})`; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - p.r * 3, p.y); ctx.lineTo(p.x + p.r * 3, p.y);
        ctx.moveTo(p.x, p.y - p.r * 3); ctx.lineTo(p.x, p.y + p.r * 3);
        ctx.stroke();
      }
    },

    steam: {
      blend: 'source-over', rate: 14,
      spawn: (w, h, o) => ({
        x: w * (o.x || .5) + rnd(-30, 30), y: h * (o.y || .6),
        vx: rnd(-14, 14), vy: rnd(-44, -18),
        r: rnd(14, 34), life: rnd(2.4, 5), age: 0
      }),
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * p.age / p.life);
        const R = p.r * (1 + p.age * .5);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
        g.addColorStop(0, `rgba(255,255,255,${(k * .34).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 7); ctx.fill();
      }
    },

    fog: {
      blend: 'source-over', rate: 3,
      spawn: (w, h) => ({
        x: rnd(-w * .4, w), y: rnd(h * .45, h * .92),
        vx: rnd(10, 34), vy: rnd(-3, 3),
        r: rnd(120, 300), life: rnd(7, 14), age: 0
      }),
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * p.age / p.life);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(226,236,246,${(k * .3).toFixed(3)})`);
        g.addColorStop(1, 'rgba(226,236,246,0)');
        ctx.fillStyle = g;
        ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1, .42);
        ctx.beginPath(); ctx.arc(0, 0, p.r, 0, 7); ctx.fill(); ctx.restore();
      }
    },

    leaves: {
      blend: 'source-over', rate: 10,
      spawn: (w, h) => ({
        x: rnd(0, w), y: rnd(-60, -10),
        vx: rnd(-20, 20), vy: rnd(30, 70),
        r: rnd(5, 11), life: rnd(5, 10), age: 0, ph: rnd(0, 7),
        c: pick(['#d8a13a', '#c46a2a', '#8fae43', '#e0b957'])
      }),
      step: (p, dt) => { p.x += Math.sin(p.ph + p.age * 2) * 34 * dt; },
      draw: (ctx, p) => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.ph + p.age * 2.4);
        ctx.fillStyle = p.c; ctx.globalAlpha = .85;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .45, 0, 0, 7); ctx.fill();
        ctx.restore(); ctx.globalAlpha = 1;
      }
    },

    notes: {
      blend: 'source-over', rate: 5,
      spawn: (w, h, o) => ({
        x: w * (o.x || .5) + rnd(-30, 30), y: h * (o.y || .55),
        vx: rnd(10, 46), vy: rnd(-60, -28),
        r: rnd(16, 30), life: rnd(2.6, 4.6), age: 0, ph: rnd(0, 7),
        g: pick(['♪', '♫', '♩'])
      }),
      step: (p, dt) => { p.x += Math.sin(p.ph + p.age * 2) * 26 * dt; },
      draw: (ctx, p) => {
        const k = Math.sin(Math.PI * p.age / p.life);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.ph + p.age) * .3);
        ctx.font = `${p.r}px serif`;
        ctx.fillStyle = `rgba(255,226,150,${(k * .95).toFixed(3)})`;
        ctx.shadowColor = 'rgba(255,190,80,.8)'; ctx.shadowBlur = 14;
        ctx.fillText(p.g, 0, 0); ctx.restore();
      }
    },

    /* салют: залпы сами собой, у каждого свой цвет */
    fireworks: {
      blend: 'lighter', rate: 0, gravity: 70, custom: true
    }
  };

  const BOOM_COLORS = [
    ['255,214,102', '255,160,60'],
    ['255,120,140', '255,70,120'],
    ['140,220,255', '80,160,255'],
    ['180,255,170', '90,220,140'],
    ['235,180,255', '190,120,255']
  ];

  /* ---------- цикл ---------- */
  function start(canvas, cfg) {
    const type = TYPES[cfg.type];
    if (!canvas || !type) return () => {};

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, items = [], last = performance.now(), raf = 0, stopped = false;
    let boomTimer = 0;

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function boom() {
      const [c1, c2] = pick(BOOM_COLORS);
      const cx = rnd(w * .15, w * .85), cy = rnd(h * .1, h * .45);
      const n = 90 + (Math.random() * 70 | 0);
      const power = rnd(120, 240);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = power * (0.35 + Math.random() * 0.75);
        items.push({
          x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          r: rnd(1.4, 3.2), life: rnd(1.3, 2.6), age: 0,
          c: Math.random() < .6 ? c1 : c2, trail: true
        });
      }
      // вспышка в центре
      items.push({ x: cx, y: cy, vx: 0, vy: 0, r: 60, life: .45, age: 0, c: c1, flash: true });
    }

    function frame(now) {
      if (stopped) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(.05, (now - last) / 1000); last = now;

      if (type.custom) {
        boomTimer -= dt;
        if (boomTimer <= 0) { boom(); boomTimer = rnd(.55, 1.5); }
      } else {
        const want = (cfg.rate || type.rate) * dt;
        let n = Math.floor(want) + (Math.random() < want % 1 ? 1 : 0);
        while (n-- > 0 && items.length < (cfg.max || 700)) items.push(type.spawn(w, h, cfg));
      }

      const g = cfg.gravity !== undefined ? cfg.gravity : (type.gravity || 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = type.blend;

      for (let i = items.length - 1; i >= 0; i--) {
        const p = items[i];
        p.age += dt;
        if (p.age >= p.life) { items.splice(i, 1); continue; }
        p.vy += g * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (type.step) type.step(p, dt);

        if (type.custom) {
          const k = 1 - p.age / p.life;
          if (p.flash) {
            const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (1 + p.age * 6));
            rg.addColorStop(0, `rgba(${p.c},${(k * .9).toFixed(3)})`);
            rg.addColorStop(1, `rgba(${p.c},0)`);
            ctx.fillStyle = rg;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + p.age * 6), 0, 7); ctx.fill();
          } else {
            ctx.strokeStyle = `rgba(${p.c},${(k * .8).toFixed(3)})`;
            ctx.lineWidth = p.r * k + .4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * .045, p.y - p.vy * .045);
            ctx.stroke();
          }
        } else {
          type.draw(ctx, p);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    raf = requestAnimationFrame(frame);

    return function stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    };
  }

  return { start, types: Object.keys(TYPES) };
})();
