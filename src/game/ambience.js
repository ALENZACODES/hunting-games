// Scene ambience: moving light and weather drawn over a still scene photo so
// the place feels alive. Each City Hunt scene lists its effects in
// src/data/cities.js. The back layer is drawn in world space right after the
// backdrop (behind every figure); the front layer is drawn in screen space over
// the finished view (rain and snow fall in front of everything).

import { W, H } from './view.js';
import { getImage } from '../engine/assets.js';
import { backgroundPath } from '../data/art.js';
import { setLiveBackdrop } from './render-scene.js';

const TAU = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

export function createAmbience(biomeId, biome, tod, opts = {}) {
  const fx = new Set(biome.ambience || []);
  if (!fx.size) return null;
  const night = tod === 'citynight' || tod === 'night';
  const neonCols = biome.neon || ['#ff2d55', '#00c2ff', '#ffd60a'];
  const st = { t: 0, wind: 0, gust: 0 };
  const hz = () => biome.horizon * H;
  const calm = !!opts.reduceFlashes;

  // ── back layer state ──
  const glints = fx.has('glints') ? Array.from({ length: 70 }, () => ({ x: rnd(0, W), f: Math.random() ** 1.6, ph: rnd(0, TAU), w: rnd(1.5, 4), col: night ? (Math.random() < 0.55 ? '#ffe2b0' : neonCols[(Math.random() * neonCols.length) | 0]) : '#ffffff' })) : [];
  const beams = fx.has('searchlights') ? [{ x: W * rnd(0.12, 0.3), a0: -0.35, ph: rnd(0, TAU), sp: 0.11 }, { x: W * rnd(0.68, 0.9), a0: 0.3, ph: rnd(0, TAU), sp: 0.09 }] : [];
  const heli = fx.has('heli') ? { x: -40, y: 0, vx: 0, wait: rnd(2, 8) } : null;
  const birds = fx.has('birds') ? { list: [], wait: rnd(4, 12) } : null;
  const mist = (fx.has('mist') || fx.has('cloud')) ? Array.from({ length: fx.has('cloud') ? 9 : 6 }, () => ({ x: rnd(-300, W + 300), y: rnd(-0.06, 0.22), rx: rnd(380, 760), ry: rnd(70, 150), a: rnd(0.06, 0.12) * (fx.has('cloud') ? 2 : 1), vx: rnd(6, 18) * (fx.has('cloud') ? 3 : 1) })) : [];
  const steam = fx.has('steam') ? { src: [{ x: W * rnd(0.3, 0.42) }, { x: W * rnd(0.58, 0.7) }], puffs: [], t: 0 } : null;
  let neon = null; // bright, saturated parts of the photo, built once it has loaded
  let neonBox = [0, 270], neonCache = null, neonT = -1;

  // ── front layer state ──
  const rain = fx.has('rain') || fx.has('drizzle') || fx.has('sleet');
  const drops = rain ? Array.from({ length: fx.has('drizzle') ? 150 : fx.has('sleet') ? 200 : 320 }, () => newDrop(true)) : [];
  const splashes = [];
  const flakes = (fx.has('snow') || fx.has('sleet')) ? Array.from({ length: fx.has('sleet') ? 120 : 260 }, () => newFlake(true)) : [];
  const leaves = fx.has('leaves') ? Array.from({ length: 22 }, () => newLeaf(true)) : [];
  const motes = fx.has('motes') ? Array.from({ length: 70 }, () => ({ x: rnd(0, W), y: rnd(0, H * 0.85), r: rnd(0.8, 2.4), ph: rnd(0, TAU), vx: rnd(-6, 6), vy: rnd(-4, 4) })) : [];
  const flicker = fx.has('flicker') && !calm ? { next: rnd(2, 6), on: 0 } : null;
  const dust = fx.has('dust') ? { x: -9999, wait: rnd(3, 8), grit: [] } : null;

  function newDrop(init) {
    const big = Math.random() < 0.06;
    return { x: rnd(-100, W + 100), y: init ? rnd(-H, H) : rnd(-160, -20), len: big ? rnd(70, 110) : rnd(22, 55), v: rnd(1300, 1900) * (fx.has('drizzle') ? 0.8 : 1), a: big ? rnd(0.08, 0.14) : rnd(0.14, 0.32), lw: big ? 2.6 : rnd(0.8, 1.5), ground: rnd(hz() + 0.08 * H, H) };
  }
  function newFlake(init) {
    const r = Math.random() ** 2 * 3 + 0.7;
    return { x: rnd(-60, W + 60), y: init ? rnd(-20, H) : -10, r, v: 30 + r * 28, ph: rnd(0, TAU), a: rnd(0.55, 0.95) };
  }
  function newLeaf(init) {
    const cols = ['#8a5a22', '#b5702a', '#6e7b2e', '#c58a2d', '#5d4022'];
    return { x: init ? rnd(0, W) : (st.wind >= 0 ? -30 : W + 30), y: rnd(hz() - 0.2 * H, H * 0.95), s: rnd(4, 10), rot: rnd(0, TAU), vr: rnd(-4, 4), vy: rnd(10, 40), ph: rnd(0, TAU), col: cols[(Math.random() * cols.length) | 0] };
  }

  function buildNeon() {
    const img = getImage(backgroundPath(biomeId), 'raw');
    if (!img) return;
    const w = 480, h = 270;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, w, h);
    let d;
    try { d = g.getImageData(0, 0, w, h); } catch (e) { neon = false; return; }
    const px = d.data;
    let kept = 0;
    for (let i = 0; i < px.length; i += 4) {
      const mx = Math.max(px[i], px[i + 1], px[i + 2]), mn = Math.min(px[i], px[i + 1], px[i + 2]);
      const k = mx > 150 && mx - mn > 60 ? Math.min(1, (mx - 150) / 80) * Math.min(1, (mx - mn - 60) / 60) : 0;
      px[i + 3] = 255 * k; if (k > 0.2) kept++;
    }
    g.putImageData(d, 0, 0);
    // rows that hold any glow, so only that strip is redrawn
    let top = h, bot = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x += 3) if (px[(y * w + x) * 4 + 3] > 20) { if (y < top) top = y; bot = y + 1; break; }
    neonBox = [Math.max(0, top - 2), Math.min(h, bot + 2)];
    neon = kept > 200 && bot > top ? c : false;
  }

  return {
    dispose() { setLiveBackdrop(biomeId, null); },
    update(dt, wind = 0) {
      st.t += dt; st.wind = wind;
      const t = st.t;
      const slant = 0.1 + wind * 0.035;
      for (const d of drops) {
        d.y += d.v * dt; d.x += d.v * slant * dt;
        if (d.y > d.ground) {
          if (d.lw < 2 && splashes.length < 90 && Math.random() < 0.5) splashes.push({ x: d.x, y: d.ground, t: 0 });
          Object.assign(d, newDrop(false));
        }
      }
      for (let i = splashes.length - 1; i >= 0; i--) if ((splashes[i].t += dt) > 0.22) splashes.splice(i, 1);
      for (const f of flakes) {
        f.y += f.v * dt; f.x += (Math.sin(t * 1.3 + f.ph) * 18 + wind * 9) * dt;
        if (f.y > H + 10 || f.x < -80 || f.x > W + 80) Object.assign(f, newFlake(false));
      }
      for (const l of leaves) {
        l.x += (wind * 25 + Math.sin(t * 0.9 + l.ph) * 30 + (wind >= 0 ? 25 : -25)) * dt;
        l.y += (l.vy + Math.sin(t * 2 + l.ph) * 25) * dt; l.rot += l.vr * dt;
        if (l.y > H + 20 || l.x < -60 || l.x > W + 60) Object.assign(l, newLeaf(false));
      }
      for (const m of motes) { m.x += (m.vx + wind * 2) * dt; m.y += m.vy * dt; if (m.x < -5) m.x = W + 5; if (m.x > W + 5) m.x = -5; if (m.y < -5 || m.y > H) m.y = rnd(0, H * 0.85); }
      for (const m of mist) { m.x += m.vx * dt * (wind < 0 ? -1 : 1); if (m.x - m.rx > W + 200) m.x = -m.rx - 200; if (m.x + m.rx < -200) m.x = W + m.rx + 200; }
      if (heli) {
        if (heli.wait > 0) { heli.wait -= dt; if (heli.wait <= 0) { const left = Math.random() < 0.5; heli.x = left ? -40 : W + 40; heli.vx = (left ? 1 : -1) * rnd(28, 55); heli.y = H * rnd(0.08, 0.24); heli.spot = Math.random() < 0.6; } }
        else { heli.x += heli.vx * dt; if (heli.x < -60 || heli.x > W + 60) heli.wait = rnd(6, 16); }
      }
      if (birds) {
        if (!birds.list.length && (birds.wait -= dt) <= 0) {
          const left = Math.random() < 0.5, n = 4 + ((Math.random() * 6) | 0), y0 = H * rnd(0.06, 0.3), vx = (left ? 1 : -1) * rnd(80, 130);
          for (let i = 0; i < n; i++) birds.list.push({ x: (left ? -30 : W + 30) - Math.sign(vx) * i * rnd(18, 40), y: y0 + rnd(-30, 30), vx, ph: rnd(0, TAU), s: rnd(5, 9) });
          birds.wait = rnd(14, 34);
        }
        for (const b of birds.list) { b.x += b.vx * dt; b.y += Math.sin(st.t * 0.8 + b.ph) * 6 * dt; }
        birds.list = birds.list.filter((b) => b.x > -80 && b.x < W + 80);
      }
      if (steam) {
        steam.t += dt;
        while (steam.t > 0.14) {
          steam.t -= 0.14;
          for (const s of steam.src) steam.puffs.push({ x: s.x + rnd(-12, 12), y: hz() + 0.1 * H, r: rnd(14, 24), a: rnd(0.1, 0.16), life: 0, max: rnd(3.5, 5) });
        }
        for (const p of steam.puffs) { p.life += dt; p.y -= 34 * dt; p.x += (wind * 6 + 4) * dt; p.r += 26 * dt; }
        steam.puffs = steam.puffs.filter((p) => p.life < p.max);
      }
      if (flicker) {
        if (flicker.on > 0) flicker.on -= dt;
        else if ((flicker.next -= dt) <= 0) { flicker.on = rnd(0.05, 0.14); flicker.next = Math.random() < 0.35 ? 0.12 : rnd(3, 8); }
      }
      if (dust) {
        if (dust.x < -900 && (dust.wait -= dt) <= 0) { dust.x = -700; dust.wait = rnd(7, 15); dust.grit = Array.from({ length: 70 }, () => ({ x: rnd(-700, 0), y: rnd(hz(), H), r: rnd(0.8, 2.2) })); }
        if (dust.x > -900) { dust.x += 650 * dt; for (const q of dust.grit) q.x += rnd(600, 760) * dt; if (dust.x > W + 700) dust.x = -9999; }
      }
    },

    // world space, behind the figures
    drawBack(g) {
      const t = st.t;
      const y0 = hz();
      g.save();
      if (fx.has('neon')) {
        if (neon === null) buildNeon();
        if (neon) {
          // signs and screens pulse and change at their own pace, band by band.
          // The glow is baked into a copy of the photo ten times a second, and
          // that copy is drawn as the backdrop, so the pulse costs no extra pass.
          if (!neonCache || t - neonT > 0.1 || t < neonT) {
            neonT = t;
            const photo = getImage(backgroundPath(biomeId), 'raw');
            if (photo) {
              if (!neonCache) { neonCache = document.createElement('canvas'); neonCache.width = W; neonCache.height = H; setLiveBackdrop(biomeId, neonCache); }
              const c = neonCache.getContext('2d');
              c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
              c.drawImage(photo, 0, 0, W, H);
              c.globalCompositeOperation = 'lighter';
              const bands = 8, bw = neon.width / bands, cw = W / bands, sy = neonBox[0], sh = neonBox[1] - neonBox[0], k = H / neon.height;
              for (let i = 0; i < bands; i++) {
                let a = 0.1 + 0.14 * (0.5 + 0.5 * Math.sin(t * (0.7 + i * 0.37) + i * 1.9));
                if (!calm && fx.has('neonflicker') && Math.sin(t * 7.3 + i * 3.1) > 0.93) a = 0.45;
                c.globalAlpha = a;
                c.drawImage(neon, i * bw, sy, bw, sh, i * cw, sy * k, cw, sh * k);
              }
              c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
            }
          }
        }
      }
      if (beams.length) {
        g.globalCompositeOperation = 'lighter';
        for (const b of beams) {
          const ang = b.a0 + 0.38 * Math.sin(t * b.sp + b.ph);
          const L = H * 1.1, spread = 0.035;
          const bx = b.x, by = y0 - 6;
          const ex = bx + Math.sin(ang) * L, ey = by - Math.cos(ang) * L;
          const grd = g.createLinearGradient(bx, by, ex, ey);
          grd.addColorStop(0, 'rgba(210,225,255,0.22)'); grd.addColorStop(0.5, 'rgba(210,225,255,0.07)'); grd.addColorStop(1, 'rgba(210,225,255,0)');
          g.fillStyle = grd;
          g.beginPath(); g.moveTo(bx - 3, by);
          g.lineTo(bx + Math.sin(ang - spread) * L, by - Math.cos(ang - spread) * L);
          g.lineTo(bx + Math.sin(ang + spread) * L, by - Math.cos(ang + spread) * L);
          g.lineTo(bx + 3, by); g.closePath(); g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      }
      if (heli && heli.wait <= 0) {
        const { x, y } = heli;
        g.globalCompositeOperation = 'lighter';
        if (heli.spot && night) {
          const grd = g.createLinearGradient(x, y, x, y0 + 0.2 * H);
          grd.addColorStop(0, 'rgba(230,240,255,0.16)'); grd.addColorStop(1, 'rgba(230,240,255,0)');
          g.fillStyle = grd; g.beginPath(); g.moveTo(x - 2, y); g.lineTo(x - 140, y0 + 0.2 * H); g.lineTo(x + 140, y0 + 0.2 * H); g.lineTo(x + 2, y); g.fill();
        }
        const beacon = Math.sin(t * TAU) > 0.6;
        const strobe = (t % 1.3) < 0.05 || ((t % 1.3) > 0.12 && (t % 1.3) < 0.17);
        if (beacon) { const r = g.createRadialGradient(x, y, 0, x, y, 9); r.addColorStop(0, 'rgba(255,60,50,1)'); r.addColorStop(1, 'rgba(255,60,50,0)'); g.fillStyle = r; g.fillRect(x - 9, y - 9, 18, 18); }
        if (strobe) { const r = g.createRadialGradient(x + 6, y + 2, 0, x + 6, y + 2, 12); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(x - 6, y - 10, 24, 24); }
        g.globalCompositeOperation = 'source-over';
        g.fillStyle = 'rgba(10,12,16,0.85)'; g.fillRect(x - 5, y - 1.5, 10, 3); // the airframe, barely visible
      }
      if (birds) {
        g.strokeStyle = night ? 'rgba(20,20,24,0.7)' : 'rgba(30,30,34,0.8)'; g.lineCap = 'round';
        for (const b of birds.list) {
          const f = Math.sin(t * 11 + b.ph) * 0.8;
          g.lineWidth = Math.max(1, b.s / 5);
          g.beginPath(); g.moveTo(b.x - b.s, b.y - f * b.s * 0.6); g.quadraticCurveTo(b.x - b.s * 0.4, b.y - f * b.s * 0.2 - 1, b.x, b.y); g.quadraticCurveTo(b.x + b.s * 0.4, b.y - f * b.s * 0.2 - 1, b.x + b.s, b.y - f * b.s * 0.6); g.stroke();
        }
      }
      if (glints.length) {
        // light dancing on the water just below the horizon
        g.globalCompositeOperation = 'lighter';
        const band = 0.1 * H;
        for (const q of glints) {
          const a = Math.max(0, Math.sin(t * (1.6 + q.f * 2) + q.ph)) ** 3 * (night ? 0.75 : 0.55);
          if (a < 0.02) continue;
          const y = y0 + 3 + q.f * band, len = 6 + q.f * 34;
          g.globalAlpha = a; g.fillStyle = q.col;
          g.fillRect(q.x + Math.sin(t * 0.7 + q.ph) * 6, y, len, q.w * (0.4 + q.f * 0.6));
        }
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      }
      if (fx.has('police') && !calm) {
        // patrol cars just out of frame, light bars washing the street
        const side = Math.floor(t / 11) % 3; // left, right, both
        const sides = side === 2 ? [0, 1] : [side];
        g.globalCompositeOperation = 'lighter';
        for (const s of sides) {
          const x = s ? W * 0.97 : W * 0.03, y = y0 + 0.07 * H;
          const ph = (t * 2.6 + s * 0.5) % 2;
          const red = ph < 1;
          const on = (ph % 1) < 0.18 || ((ph % 1) > 0.3 && (ph % 1) < 0.45);
          if (!on) continue;
          const col = red ? '255,40,40' : '40,90,255';
          const r = g.createRadialGradient(x, y, 0, x, y, 340);
          r.addColorStop(0, `rgba(${col},0.32)`); r.addColorStop(1, `rgba(${col},0)`);
          g.fillStyle = r; g.fillRect(x - 340, y - 340, 680, 680);
          const wash = g.createRadialGradient(x, H * 0.92, 0, x, H * 0.92, 520);
          wash.addColorStop(0, `rgba(${col},0.12)`); wash.addColorStop(1, `rgba(${col},0)`);
          g.fillStyle = wash; g.fillRect(x - 520, H * 0.6, 1040, H * 0.4);
        }
        g.globalCompositeOperation = 'source-over';
      }
      if (steam) {
        for (const p of steam.puffs) {
          const a = p.a * Math.sin(Math.PI * Math.min(1, p.life / p.max)) * (p.life < 0.4 ? p.life / 0.4 : 1);
          const r = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          r.addColorStop(0, `rgba(235,235,240,${a})`); r.addColorStop(1, 'rgba(235,235,240,0)');
          g.fillStyle = r; g.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        }
      }
      if (mist.length) {
        const col = tod === 'dawn' ? '255,236,222' : night ? '170,182,205' : '225,230,236';
        for (const m of mist) {
          const y = y0 + m.y * H;
          g.save(); g.translate(m.x, y); g.scale(1, m.ry / m.rx);
          const r = g.createRadialGradient(0, 0, 0, 0, 0, m.rx);
          r.addColorStop(0, `rgba(${col},${m.a})`); r.addColorStop(1, `rgba(${col},0)`);
          g.fillStyle = r; g.fillRect(-m.rx, -m.rx, m.rx * 2, m.rx * 2); g.restore();
        }
      }
      g.restore();
    },

    // screen space, over the finished view
    drawFront(g, ads = false) {
      const t = st.t;
      const k = ads ? 0.35 : 1;
      g.save();
      if (drops.length) {
        const slant = 0.1 + st.wind * 0.035;
        const col = night ? '205,215,230' : '215,222,232';
        // batched by brightness and thickness: one stroke per group
        for (const [lo, hi, lw, big] of [[0, 0.17, 0.9, false], [0.17, 0.25, 1.1, false], [0.25, 1, 1.4, false], [0, 1, 2.6, true]]) {
          g.strokeStyle = `rgba(${col},${(big ? 0.11 : (lo + Math.min(hi, 0.35)) / 2) * k})`;
          g.lineWidth = lw;
          g.beginPath();
          for (const d of drops) {
            if ((d.lw > 2) !== big || d.a < lo || d.a >= hi) continue;
            g.moveTo(d.x, d.y); g.lineTo(d.x - d.len * slant, d.y - d.len);
          }
          g.stroke();
        }
        g.strokeStyle = `rgba(${col},${0.35 * k})`; g.lineWidth = 1;
        for (const s of splashes) {
          const r = 2 + s.t * 30;
          g.globalAlpha = 1 - s.t / 0.22;
          g.beginPath(); g.ellipse(s.x, s.y, r, r * 0.25, 0, 0, TAU); g.stroke();
        }
        g.globalAlpha = 1;
      }
      if (flakes.length) {
        g.fillStyle = '#ffffff';
        for (const f of flakes) { g.globalAlpha = f.a * k; g.beginPath(); g.arc(f.x, f.y, f.r, 0, TAU); g.fill(); }
        g.globalAlpha = 1;
      }
      if (leaves.length) {
        for (const l of leaves) {
          g.save(); g.translate(l.x, l.y); g.rotate(l.rot); g.scale(1, 0.45 + 0.45 * Math.abs(Math.sin(t * 3 + l.ph)));
          g.globalAlpha = 0.9 * k; g.fillStyle = l.col; g.beginPath(); g.ellipse(0, 0, l.s, l.s * 0.55, 0, 0, TAU); g.fill(); g.restore();
        }
      }
      if (motes.length) {
        g.fillStyle = '#fff4dc';
        for (const m of motes) { g.globalAlpha = (0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.7 + m.ph))) * k; g.beginPath(); g.arc(m.x, m.y, m.r, 0, TAU); g.fill(); }
        g.globalAlpha = 1;
      }
      if (dust && dust.x > -900) {
        const grd = g.createLinearGradient(dust.x - 600, 0, dust.x + 600, 0);
        grd.addColorStop(0, 'rgba(196,160,112,0)'); grd.addColorStop(0.5, `rgba(196,160,112,${0.2 * k})`); grd.addColorStop(1, 'rgba(196,160,112,0)');
        g.fillStyle = grd; g.fillRect(dust.x - 600, hz() - 0.1 * H, 1200, H);
        g.fillStyle = `rgba(150,120,85,${0.7 * k})`;
        for (const q of dust.grit) { g.beginPath(); g.arc(q.x, q.y, q.r, 0, TAU); g.fill(); }
      }
      if (flicker && flicker.on > 0) { g.fillStyle = 'rgba(0,0,0,0.38)'; g.fillRect(0, 0, W, H); }
      g.restore();
    },
  };
}
