// Landscapes. Uses assets/backgrounds/<biome>.jpg when present, otherwise a
// drawn landscape (cached per biome and time of day). Foreground reeds,
// grass and brush are drawn every frame so they can sway, and so animals can
// flush out from behind them.

import { W, H, rng } from './view.js';
import { getImage, isMissing } from '../engine/assets.js';
import { backgroundPath, foregroundPath } from '../data/art.js';
import { BIOMES } from '../data/levels.js';

export const SKIES = {
  dawn: { top: '#26345a', mid: '#b47a74', bottom: '#f4c890', haze: '#e9b98c', sun: { x: 0.72, up: 18, r: 44, c: '#ffe0a6' }, tint: 'rgba(255,150,90,0.10)' },
  day: { top: '#2c69b0', mid: '#8bbbe3', bottom: '#dce8ee', haze: '#c9dce6', sun: { x: 0.16, up: 330, r: 30, c: '#fffbea' }, tint: null },
  dusk: { top: '#1b2142', mid: '#6d4a76', bottom: '#ea8a58', haze: '#c98a72', sun: { x: 0.24, up: 10, r: 50, c: '#ffae6a' }, tint: 'rgba(90,40,90,0.22)' },
  night: { top: '#01030a', mid: '#071226', bottom: '#13223a', haze: '#1b2a42', moon: { x: 0.78, up: 300, r: 24 }, stars: true, tint: 'rgba(4,10,28,0.55)' },
  alien: { top: '#0d0517', mid: '#3a1452', bottom: '#b4467e', haze: '#7b3a6c', moons: true, stars: true, aurora: true, tint: 'rgba(70,10,80,0.18)' },
  citynight: { top: '#04060d', mid: '#0e1730', bottom: '#3a2c48', haze: '#2a3048', tint: null },
};

const cache = new Map();

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = ((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t;
  const g = ((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t;
  const bl = (pa & 255) * (1 - t) + (pb & 255) * t;
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

export function horizonFor(biomeId) { return (BIOMES[biomeId]?.horizon ?? 0.45) * H; }

function buildBackdrop(biomeId, tod) {
  const b = BIOMES[biomeId];
  const sky = SKIES[tod] || SKIES.day;
  const hy = b.horizon * H;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const R = rng(biomeId + tod);

  // sky
  const sg = g.createLinearGradient(0, 0, 0, hy);
  sg.addColorStop(0, sky.top); sg.addColorStop(0.55, sky.mid); sg.addColorStop(1, sky.bottom);
  g.fillStyle = sg; g.fillRect(0, 0, W, hy + 2);
  if (sky.stars) for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + R() * 0.8})`; g.fillRect(R() * W, R() * hy * 0.85, R() < 0.1 ? 2 : 1, R() < 0.1 ? 2 : 1); }
  if (sky.aurora) {
    for (let k = 0; k < 3; k++) {
      g.beginPath(); g.moveTo(0, 120 + k * 60);
      for (let x = 0; x <= W; x += 40) g.lineTo(x, 120 + k * 60 + Math.sin(x * 0.004 + k) * 50);
      g.lineTo(W, 0); g.lineTo(0, 0); g.closePath();
      g.fillStyle = `rgba(${k === 1 ? '120,255,190' : '200,90,255'},0.06)`; g.fill();
    }
  }
  const glow = (x, y, r, col) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 6);
    gr.addColorStop(0, col); gr.addColorStop(0.15, col + 'cc'); gr.addColorStop(1, col + '00');
    g.fillStyle = gr; g.fillRect(x - r * 6, y - r * 6, r * 12, r * 12);
    g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  };
  if (sky.sun) glow(sky.sun.x * W, hy - sky.sun.up, sky.sun.r, sky.sun.c);
  if (sky.moon) glow(sky.moon.x * W, hy - sky.moon.up, sky.moon.r, '#e8edf5');
  if (sky.moons) { glow(0.7 * W, hy - 330, 40, '#ffd2f0'); glow(0.82 * W, hy - 250, 16, '#b8f0ff'); }
  if (!sky.stars) {
    for (let i = 0; i < 9; i++) {
      const cx = R() * W, cy = 60 + R() * (hy - 180), n = 5 + (R() * 6) | 0;
      for (let j = 0; j < n; j++) {
        g.fillStyle = tod === 'day' ? 'rgba(255,255,255,0.10)' : `rgba(255,${200 - j * 5},${170 - j * 8},0.08)`;
        g.beginPath(); g.ellipse(cx + (R() - 0.5) * 220, cy + (R() - 0.5) * 30, 60 + R() * 90, 14 + R() * 18, 0, 0, Math.PI * 2); g.fill();
      }
    }
  }

  // far hills / mountains
  drawHills(g, b, sky, hy, R);
  // treeline
  drawTrees(g, b, sky, hy, R);

  // ground
  const gg = g.createLinearGradient(0, hy, 0, H);
  gg.addColorStop(0, mix(b.ground[0], sky.haze, 0.35)); gg.addColorStop(0.25, b.ground[0]); gg.addColorStop(1, b.ground[1]);
  g.fillStyle = gg; g.fillRect(0, hy, W, H - hy);
  if (b.water) {
    const wy = hy + 2, wh = b.bridge ? 26 : 48;
    const wg = g.createLinearGradient(0, wy, 0, wy + wh);
    wg.addColorStop(0, mix(sky.bottom, '#3a4a55', 0.3)); wg.addColorStop(1, mix(sky.mid, '#1d2a30', 0.5));
    g.fillStyle = wg; g.fillRect(0, wy, W, wh);
    g.strokeStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 70; i++) { const y = wy + R() * wh; g.lineWidth = 1; g.beginPath(); const x = R() * W; g.moveTo(x, y); g.lineTo(x + 20 + R() * 60, y); g.stroke(); }
  }
  // ground texture
  const grassy = !['range', 'canyon', 'urban', 'base', 'heli', 'hive'].includes(biomeId);
  for (let i = 0; i < 5200; i++) {
    const f = Math.pow(R(), 0.55);
    const y = hy + 4 + f * (H - hy);
    const x = R() * W;
    const s = 1 + f * 16;
    g.fillStyle = mix(b.ground[R() < 0.5 ? 0 : 1], R() < 0.5 ? '#000000' : '#ffffff', R() * 0.18);
    if (grassy) g.fillRect(x, y - s, Math.max(1, s * 0.12), s);
    else { g.beginPath(); g.ellipse(x, y, s * 0.5, s * 0.22, 0, 0, Math.PI * 2); g.fill(); }
  }
  drawFeatures(g, b, biomeId, hy, R, sky);
  return c;
}

function drawHills(g, b, sky, hy, R) {
  const t = b.hills;
  if (t === 'none') return;
  const layers = t === 'alps' ? 3 : t === 'ridge' ? 1 : 2;
  for (let l = 0; l < layers; l++) {
    const near = l / Math.max(1, layers - 1);
    const col = t === 'spires' ? mix('#2a1838', sky.haze, 0.5 - near * 0.3) : t === 'mesa' ? mix('#8a5434', sky.haze, 0.55 - near * 0.35) : t === 'ridge' ? mix(b.ground[0], sky.haze, 0.22) : mix(b.ground[1], sky.haze, 0.75 - near * 0.4);
    g.fillStyle = col;
    g.beginPath(); g.moveTo(0, hy + 1);
    const ph = R() * 10, ph2 = R() * 10;
    if (t === 'low' || t === 'mid') {
      const amp = (t === 'low' ? 28 : 85) * (1 - near * 0.4);
      for (let x = 0; x <= W; x += 16) g.lineTo(x, hy - amp * (0.5 + 0.35 * Math.sin(x * 0.003 + ph) + 0.15 * Math.sin(x * 0.011 + ph2)));
    } else if (t === 'alps') {
      let y = hy - 120 - R() * 120;
      const peaks = [];
      for (let x = 0; x <= W; x += 30) {
        y += (R() - 0.5) * 70 * (1.4 - near);
        y = Math.max(hy - (380 - near * 180), Math.min(hy - 40 - near * 20, y));
        g.lineTo(x, y); peaks.push([x, y]);
      }
      g.lineTo(W, hy + 1); g.closePath(); g.fill();
      if (near < 0.6) { // snow
        g.fillStyle = mix('#f4f6f8', sky.haze, 0.35);
        for (let i = 1; i < peaks.length - 1; i++) if (peaks[i][1] < hy - 230 + near * 60) {
          g.beginPath(); g.moveTo(peaks[i - 1][0] + 10, peaks[i][1] + 30); g.lineTo(peaks[i][0], peaks[i][1]); g.lineTo(peaks[i + 1][0] - 10, peaks[i][1] + 34); g.closePath(); g.fill();
        }
      }
      continue;
    } else if (t === 'mesa') {
      let x = -50;
      while (x < W) {
        const w = 120 + R() * 260, h = (60 + R() * 110) * (1 - near * 0.3), gap = 60 + R() * 200;
        g.lineTo(x, hy); g.lineTo(x + 20, hy - h); g.lineTo(x + w - 20, hy - h); g.lineTo(x + w, hy);
        x += w + gap;
      }
    } else if (t === 'ridge') {
      for (let x = 0; x <= W; x += 12) g.lineTo(x, hy - 230 - 70 * Math.sin(x * 0.0018 + 0.6) - 18 * Math.sin(x * 0.013 + ph));
    } else if (t === 'spires') {
      for (let i = 0; i < 9; i++) {
        const x = R() * W, h = 140 + R() * 260, w = 18 + R() * 30;
        g.moveTo(x - w, hy); g.quadraticCurveTo(x - w * 0.2, hy - h * 0.6, x + w * 0.6, hy - h); g.quadraticCurveTo(x + w * 0.3, hy - h * 0.5, x + w, hy);
      }
      g.fill();
      g.fillStyle = 'rgba(255,90,200,0.7)';
      continue;
    }
    g.lineTo(W, hy + 1); g.closePath(); g.fill();
    if (t === 'ridge') { // scrub dots on the ridge face
      for (let i = 0; i < 900; i++) { const x = R() * W, y = hy - R() * 260; g.fillStyle = `rgba(${40 + R() * 30 | 0},${45 + R() * 30 | 0},${25 + R() * 20 | 0},0.5)`; g.beginPath(); g.ellipse(x, y, 2 + R() * 4, 1 + R() * 2, 0, 0, Math.PI * 2); g.fill(); }
    }
  }
}

function drawTrees(g, b, sky, hy, R) {
  const t = b.trees;
  if (t === 'none') return;
  const farCol = (c) => mix(c, sky.haze, 0.45);
  const conifer = (x, base, h, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x, base - h); g.lineTo(x + h * 0.22, base); g.lineTo(x - h * 0.22, base); g.closePath(); g.fill(); };
  const blob = (x, base, h, col) => { g.fillStyle = col; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + (R() - 0.5) * h * 0.5, base - h * 0.55 - R() * h * 0.3, h * (0.28 + R() * 0.15), 0, Math.PI * 2); g.fill(); } g.fillRect(x - 1, base - h * 0.3, 2, h * 0.3); };
  const palette = {
    conifer: ['#24361f', '#2c4026', '#1d2d1a'], spruce: ['#1f2f1d', '#26381f', '#18251a'],
    deciduous: ['#4b6b2e', '#5b7a34', '#3d5a26'], autumn: ['#b2582a', '#c9862f', '#8e3b22', '#6a6a2a', '#d0a040'],
    mixed: ['#3d5228', '#4a5a2a', '#2c3d22', '#6a6a30'], hedgerow: ['#46602c', '#3a5226', '#57703a'],
    sparse: ['#4c6230', '#3c5028'], scrub: ['#6b6a3c', '#5a5634', '#7a744a'], alien: ['#3a1f4f', '#5a2a6a', '#2a1238'],
  }[t] || ['#3c5028'];
  const count = t === 'sparse' ? 14 : t === 'scrub' ? 160 : 220;
  for (let i = 0; i < count; i++) {
    const x = R() * W;
    const base = hy + 2 + R() * 6;
    const h = t === 'scrub' ? 5 + R() * 9 : t === 'sparse' ? 14 + R() * 30 : 10 + R() * 26;
    const col = farCol(palette[(R() * palette.length) | 0]);
    if (t === 'conifer' || t === 'spruce') conifer(x, base, h * (t === 'spruce' ? 1.3 : 1), col);
    else if (t === 'alien') { g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + 10, base - h, x + 4, base - h * 1.6); g.stroke(); g.fillStyle = 'rgba(120,255,210,0.7)'; g.beginPath(); g.arc(x + 4, base - h * 1.6, 3, 0, 7); g.fill(); }
    else blob(x, base, h, col);
  }
  // closer clumps for wooded biomes
  if (['autumn', 'mixed', 'deciduous', 'spruce', 'conifer'].includes(t)) {
    for (let i = 0; i < 9; i++) {
      const side = R() < 0.5 ? R() * W * 0.28 : W - R() * W * 0.28;
      const base = hy + 6 + R() * 14, h = 60 + R() * 90;
      const col = mix(palette[(R() * palette.length) | 0], sky.haze, 0.2);
      if (t === 'conifer' || t === 'spruce') conifer(side, base, h * 1.2, col); else blob(side, base, h, col);
    }
  }
}

function drawFeatures(g, b, biomeId, hy, R, sky) {
  const yAt = (d) => hy + (2318 * 1.6) / d;
  if (b.berms) {
    for (const d of [60, 120, 220, 420, 900]) {
      const y = yAt(d), h = Math.max(3, 2.2 * 2318 / d * 0.5);
      g.fillStyle = mix('#8a6d48', sky.haze, Math.min(0.6, 100 / d * 0.2 + d / 2400));
      g.beginPath(); g.moveTo(0, y + 1);
      for (let x = 0; x <= W; x += 40) g.lineTo(x, y - h * (0.7 + 0.3 * Math.sin(x * 0.01 + d)));
      g.lineTo(W, y + 1); g.closePath(); g.fill();
    }
  }
  if (b.buildings) {
    const d = 45, base = yAt(d), ppm = 2318 / d;
    let x = -40;
    while (x < W) {
      const w = (6 + R() * 8) * ppm, h = (4 + R() * 5) * ppm;
      const wall = mix(['#b9ab92', '#a39a88', '#c2b49a', '#8f8678'][(R() * 4) | 0], sky.haze, 0.1);
      g.fillStyle = wall; g.fillRect(x, base - h, w, h);
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x + w - 8, base - h, 8, h);
      g.fillStyle = '#5a5248'; g.fillRect(x - 4, base - h - 10, w + 8, 12);
      for (let wx = x + 0.8 * ppm; wx < x + w - 1.6 * ppm; wx += 2.2 * ppm) {
        for (let wy = base - h + 0.8 * ppm; wy < base - 2.4 * ppm; wy += 2.6 * ppm) { g.fillStyle = '#1d1b19'; g.fillRect(wx, wy, 1.0 * ppm, 1.3 * ppm); }
      }
      g.fillStyle = '#2a2622'; g.fillRect(x + w * 0.4, base - 2.1 * ppm, 1.1 * ppm, 2.1 * ppm);
      x += w + (1 + R() * 3) * ppm;
    }
  }
  if (b.bridge) {
    const d = 450, base = yAt(d) - 2, ppm = 2318 / d, h = 7 * ppm;
    g.strokeStyle = '#3a3c3e'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, base); g.lineTo(W, base); g.stroke();
    g.lineWidth = 2;
    for (let x = 0; x < W; x += 60) { g.beginPath(); g.moveTo(x, base); g.lineTo(x + 30, base - h); g.lineTo(x + 60, base); g.stroke(); }
    g.beginPath(); g.moveTo(0, base - h); g.lineTo(W, base - h); g.stroke();
    for (let x = 80; x < W; x += 360) { g.fillStyle = '#4a4a46'; g.fillRect(x, base, 14, 22); }
  }
  if (b.crash) {
    const x = W * 0.62, y = yAt(260), ppm = 2318 / 260;
    g.fillStyle = '#20232a'; g.beginPath(); g.ellipse(x, y - 1.5 * ppm, 14 * ppm, 3.2 * ppm, -0.18, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(120,255,220,0.8)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x - 10 * ppm + i * 4 * ppm, y - 1.2 * ppm + i * 0.5 * ppm, 0.4 * ppm, 0, 7); g.fill(); }
    for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(60,60,70,${0.15 - i * 0.008})`; g.beginPath(); g.arc(x + 6 * ppm + i * 6, y - 4 * ppm - i * 18, 12 + i * 4, 0, 7); g.fill(); }
  }
  if (b.alien) {
    for (let i = 0; i < 40; i++) {
      const f = Math.pow(R(), 0.7), y = hy + 10 + f * (H - hy - 200), x = R() * W, r = 2 + f * 14;
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 3); gr.addColorStop(0, 'rgba(255,120,220,0.7)'); gr.addColorStop(1, 'rgba(255,120,220,0)');
      g.fillStyle = gr; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    }
  }
}

function backdropCanvas(biomeId, tod) {
  const key = biomeId + '|' + tod;
  if (!cache.has(key)) cache.set(key, BIOMES[biomeId].city ? buildCityBackdrop(biomeId, tod) : buildBackdrop(biomeId, tod));
  return cache.get(key);
}


// ── City Hunt stand-in scenes (replaced by assets/city/<city>/scene_NN.jpg) ──
function buildCityBackdrop(biomeId, tod) {
  const b = BIOMES[biomeId];
  const sky = SKIES[tod] || SKIES.day;
  const night = tod === 'citynight';
  const hy = b.horizon * H;
  const type = b.sceneType;
  const neon = b.neon || ['#ff2d55', '#00c2ff', '#ffd60a'];
  const R = rng(biomeId + tod);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const vx = W / 2;
  const win = (x, y, w, h) => {
    if (!night && R() < 0.6) { g.fillStyle = `rgba(150,180,210,${0.25 + R() * 0.3})`; g.fillRect(x, y, w, h); return; }
    if (night && R() < 0.55) { g.fillStyle = R() < 0.15 ? neon[(R() * neon.length) | 0] : `rgba(255,${200 + R() * 40 | 0},${120 + R() * 60 | 0},${0.5 + R() * 0.5})`; g.fillRect(x, y, w, h); }
  };
  const tower = (x, top, w, base, col) => {
    g.fillStyle = col; g.fillRect(x, top, w, base - top);
    for (let yy = top + 6; yy < base - 6; yy += 9) for (let xx = x + 4; xx < x + w - 5; xx += 8) win(xx, yy, 4, 5);
  };
  if (type !== 'interior') {
    const sg = g.createLinearGradient(0, 0, 0, hy);
    sg.addColorStop(0, sky.top); sg.addColorStop(0.6, sky.mid); sg.addColorStop(1, sky.bottom);
    g.fillStyle = sg; g.fillRect(0, 0, W, hy + 2);
    if (night) { const gl = g.createRadialGradient(W / 2, hy, 10, W / 2, hy, W * 0.7); gl.addColorStop(0, 'rgba(255,150,80,0.35)'); gl.addColorStop(1, 'rgba(255,150,80,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, hy); }
    // far skyline
    const farCol = night ? '#0b1020' : mix(sky.haze, '#3d4656', 0.45);
    for (let x = -20; x < W; x += 28 + R() * 50) {
      const w = 26 + R() * 60, h = 40 + Math.pow(R(), 1.6) * (type === 'rooftop' ? 260 : 340);
      tower(x, hy - h, w, hy + 2, farCol);
      if (R() < 0.12) { g.fillStyle = farCol; g.fillRect(x + w / 2 - 2, hy - h - 40, 4, 40); }
    }
  }
  const ground = (top, colA, colB) => { const gg = g.createLinearGradient(0, top, 0, H); gg.addColorStop(0, colA); gg.addColorStop(1, colB); g.fillStyle = gg; g.fillRect(0, top, W, H - top); };
  const lanes = (col) => { g.strokeStyle = col; g.lineWidth = 3; for (const f of [-0.6, -0.2, 0.2, 0.6]) { g.beginPath(); g.moveTo(vx + f * 40, hy + 4); g.lineTo(vx + f * W * 1.4, H); g.stroke(); } };
  const facades = (sign) => {
    // a wall of buildings receding toward the vanishing point on one side
    const near = sign < 0 ? 0 : W, far = vx + sign * 120;
    for (let k = 0; k < 7; k++) {
      const f0 = k / 7, f1 = (k + 1) / 7;
      const x0 = near + (far - near) * f0, x1 = near + (far - near) * f1;
      const t0 = hy - (H * 0.95) * (1 - f0) - 60 * R(), t1 = hy - (H * 0.95) * (1 - f1) - 40;
      const col = night ? mix('#151a26', '#2a3044', R() * 0.6) : mix('#8d8f94', '#b9a98f', R());
      g.fillStyle = col;
      g.beginPath(); g.moveTo(x0, t0); g.lineTo(x1, Math.min(t1, hy - 20)); g.lineTo(x1, hy + 8 + (1 - f1) * 40); g.lineTo(x0, H * (0.98 - f0 * 0.2)); g.closePath(); g.fill();
      for (let r = 0; r < 14; r++) {
        const fy = r / 14;
        const ya = t0 + (H * (0.98 - f0 * 0.2) - t0) * fy, yb = Math.min(t1, hy - 20) + (hy + 8 + (1 - f1) * 40 - Math.min(t1, hy - 20)) * fy;
        const wx = x0 + (x1 - x0) * 0.25, wy = ya + (yb - ya) * 0.25;
        win(Math.min(wx, wx + (x1 - x0) * 0.5), wy, Math.abs(x1 - x0) * 0.4, Math.max(2, (H - t0) / 40));
      }
      if ((type === 'strip' || type === 'square') && R() < 0.7) {
        const nc = neon[(R() * neon.length) | 0];
        const sx0 = x0 + (x1 - x0) * 0.2, sy = t0 + (hy - t0) * (0.35 + R() * 0.3);
        g.save(); g.shadowColor = nc; g.shadowBlur = 25; g.fillStyle = nc;
        g.globalAlpha = night ? 0.9 : 0.5;
        g.fillRect(Math.min(sx0, sx0 + (x1 - x0) * 0.6), sy, Math.abs(x1 - x0) * 0.6, (H - t0) / 9);
        g.restore();
      }
    }
  };
  switch (type) {
    case 'street': case 'strip': case 'square': {
      ground(hy, night ? '#1a1c22' : '#5a5c60', night ? '#0c0d10' : '#2e2f33');
      lanes(night ? 'rgba(255,220,120,0.35)' : 'rgba(255,255,255,0.5)');
      facades(-1); facades(1);
      if (night) { for (let k = 0; k < 8; k++) { const x = R() * W, y = hy + 20 + R() * (H - hy) * 0.6; const gl = g.createRadialGradient(x, y, 0, x, y, 120); gl.addColorStop(0, `${neon[k % neon.length]}55`); gl.addColorStop(1, `${neon[k % neon.length]}00`); g.fillStyle = gl; g.fillRect(x - 120, y - 120, 240, 240); } }
      if (type === 'strip') for (let k = 0; k < 6; k++) { const x = vx + (k % 2 ? 1 : -1) * (80 + k * 70), base = hy + 30 + k * 30, h = 120 + k * 40; g.strokeStyle = '#2a2014'; g.lineWidth = 6 + k; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + 10, base - h * 0.6, x + 4, base - h); g.stroke(); g.fillStyle = night ? '#16301c' : '#3d6b34'; for (let f = 0; f < 7; f++) { g.beginPath(); g.ellipse(x + Math.cos(f) * 30, base - h + Math.sin(f) * 8, 40, 9, f, 0, 7); g.fill(); } }
      break;
    }
    case 'park': {
      ground(hy, night ? '#14261a' : '#5f7a3a', night ? '#0a120c' : '#33461f');
      g.strokeStyle = night ? 'rgba(200,190,160,0.25)' : 'rgba(210,200,170,0.7)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(vx - 30, hy + 4); g.lineTo(vx - W * 0.35, H); g.moveTo(vx + 30, hy + 4); g.lineTo(vx + W * 0.35, H); g.stroke();
      for (const sign of [-1, 1]) for (let k = 0; k < 9; k++) {
        const f = k / 9, x = vx + sign * (60 + (W * 0.5) * Math.pow(f, 1.4)), base = hy + 10 + (H - hy) * Math.pow(f, 2) * 0.7, h = 40 + f * 420;
        g.fillStyle = night ? '#0b140d' : mix('#2f4d24', '#567a34', R()); g.beginPath(); g.ellipse(x, base - h * 0.75, h * 0.35, h * 0.4, 0, 0, 7); g.fill();
        g.fillStyle = '#2a2116'; g.fillRect(x - 2 - f * 6, base - h * 0.4, 4 + f * 12, h * 0.4);
      }
      break;
    }
    case 'interior': {
      const bg = g.createLinearGradient(0, 0, 0, hy); bg.addColorStop(0, night ? '#14161c' : '#cfc6b4'); bg.addColorStop(1, night ? '#2a2620' : '#a99d86');
      g.fillStyle = bg; g.fillRect(0, 0, W, hy + 2);
      for (let k = 0; k < 7; k++) { const x = 160 + k * 260; g.fillStyle = night ? '#221f1a' : '#b8ab92'; g.fillRect(x, 60, 70, hy - 60); g.fillStyle = night ? 'rgba(255,220,150,0.8)' : 'rgba(255,255,240,0.9)'; g.beginPath(); g.ellipse(x + 35, 50, 60, 10, 0, 0, 7); g.fill(); }
      for (let k = 0; k < 3; k++) { g.strokeStyle = night ? '#3a3328' : '#8e826c'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, hy * (0.35 + k * 0.2)); g.lineTo(W, hy * (0.35 + k * 0.2)); g.stroke(); }
      ground(hy, night ? '#2b2721' : '#d9d0bf', night ? '#14120f' : '#8f8573');
      g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 2; for (let f = -8; f <= 8; f++) { g.beginPath(); g.moveTo(vx + f * 30, hy); g.lineTo(vx + f * 260, H); g.stroke(); }
      break;
    }
    case 'rooftop': {
      const roofTop = hy + 60;
      ground(roofTop, night ? '#24252a' : '#77736a', night ? '#111216' : '#47443e');
      g.fillStyle = night ? '#1b1c20' : '#8a857b'; g.fillRect(0, roofTop - 14, W, 18);
      for (let k = 0; k < 3; k++) { const x = 200 + k * 650 + R() * 100, base = roofTop - 10, w = 90 + R() * 40, h = 110 + R() * 60; g.fillStyle = night ? '#2a211a' : '#6b4a2e'; g.fillRect(x, base - h, w, h * 0.75); g.beginPath(); g.moveTo(x - 6, base - h); g.lineTo(x + w / 2, base - h - 40); g.lineTo(x + w + 6, base - h); g.fill(); g.fillStyle = '#222'; for (let l = 0; l < 4; l++) g.fillRect(x + 8 + l * (w - 16) / 3, base - h * 0.25, 5, h * 0.25); }
      break;
    }
    case 'bridge': {
      ground(hy, night ? '#1d1f24' : '#6d6a63', night ? '#0d0e11' : '#3d3a35');
      g.strokeStyle = night ? 'rgba(200,210,230,0.5)' : 'rgba(80,80,80,0.8)'; g.lineWidth = 3;
      for (const sign of [-1, 1]) for (let k = 0; k < 14; k++) { g.beginPath(); g.moveTo(vx + sign * 40, hy - 330); g.lineTo(vx + sign * (60 + k * 70), hy + 10 + k * 40); g.stroke(); }
      g.fillStyle = night ? '#1b1a1f' : '#8b7d6a'; g.fillRect(vx - 70, hy - 360, 140, 370);
      g.fillStyle = night ? '#0d0e11' : '#5a5246'; g.fillRect(vx - 30, hy - 250, 24, 120); g.fillRect(vx + 6, hy - 250, 24, 120);
      break;
    }
    case 'waterfront': {
      const shore = H * 0.66;
      const wg = g.createLinearGradient(0, hy, 0, shore); wg.addColorStop(0, night ? '#151c30' : mix(sky.bottom, '#2c4a66', 0.5)); wg.addColorStop(1, night ? '#07090f' : '#1c3346');
      g.fillStyle = wg; g.fillRect(0, hy, W, shore - hy);
      for (let k = 0; k < 160; k++) { const x = R() * W, y = hy + 4 + R() * (shore - hy); g.fillStyle = night ? `${neon[k % neon.length]}66` : 'rgba(255,255,255,0.2)'; g.fillRect(x, y, 10 + R() * 40, 2); }
      ground(shore, night ? '#2a2a2e' : '#9c958a', night ? '#121215' : '#5e5a52');
      g.fillStyle = night ? '#3a3a40' : '#c2bcb0'; g.fillRect(0, shore - 6, W, 8);
      for (let k = 0; k < 9; k++) { const x = k * 230 + 60; g.strokeStyle = '#222'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, shore); g.lineTo(x, shore - 160); g.stroke(); if (night) { const gl = g.createRadialGradient(x, shore - 165, 0, x, shore - 165, 60); gl.addColorStop(0, 'rgba(255,230,170,0.9)'); gl.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = gl; g.fillRect(x - 60, shore - 225, 120, 120); } }
      break;
    }
    default: ground(hy, '#444', '#222');
  }
  return c;
}

// Ducked behind cover: the scene's cover object fills the lower screen.
export function drawCoverView(g, biomeId, coverT, t) {
  const k = Math.min(1, coverT);
  g.save();
  g.fillStyle = `rgba(0,0,0,${0.25 * k})`; g.fillRect(0, 0, W, H);
  const img = BIOMES[biomeId].noCoverArt ? null : getImage(foregroundPath(biomeId), 'overlay');
  const lift = k * H * 0.3;
  if (img) {
    // grow the overlay from the bottom centre until its cover object rises to just below eye level
    const c = coverOverlay(img);
    const top0 = c.solid + c.shift; // where the object's top sits in the normal view
    const target = top0 + (0.48 - top0) * k;
    const sc = (1 - target) / (1 - top0);
    g.drawImage(c.img, W / 2 - (W / 2) * sc, H - (H - c.shift * H) * sc, W * sc, H * sc);
  } else {
    const top = H - lift - 120 * k;
    const gr = g.createLinearGradient(0, top, 0, H);
    gr.addColorStop(0, '#b9b4aa'); gr.addColorStop(0.15, '#8f8a80'); gr.addColorStop(1, '#4a4741');
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(-20, H); g.lineTo(-20, top + 60); g.lineTo(W * 0.08, top); g.lineTo(W * 0.92, top); g.lineTo(W + 20, top + 60); g.lineTo(W + 20, H); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = 120; x < W; x += 360) g.fillRect(x, top + 20, 6, H - top);
    g.fillStyle = '#d6c25a'; g.fillRect(W * 0.08, top + 4, W * 0.84, 6);
  }
  g.restore();
}

// A scene can hand in a live version of its photo (the ambience bakes the
// pulsing neon into it a few times a second); it is drawn in place of the photo.
const liveBackdrops = new Map();
export function setLiveBackdrop(biomeId, canvas) { if (canvas) liveBackdrops.set(biomeId, canvas); else liveBackdrops.delete(biomeId); }

export function drawBackdrop(g, biomeId, tod, view, wide = false) {
  const img = liveBackdrops.get(biomeId) || getImage(backgroundPath(biomeId), 'raw');
  const src = img || backdropCanvas(biomeId, tod);
  const b = BIOMES[biomeId];
  if (b.scroll) {
    const off = ((view.camX * 2318) / 700) % (W * 2);
    for (let k = -1; k <= 2; k++) {
      const x = k * W * 2 - off;
      g.drawImage(src, x, 0, W, H);
      g.save(); g.translate(x + W * 2, 0); g.scale(-1, 1); g.drawImage(src, 0, 0, W, H); g.restore();
    }
  } else {
    g.drawImage(src, 0, 0, W, H);
    if (wide) {
      // when zoomed near an edge, extend the scene: mirror left/right, stretch the
      // top row of sky upward and the bottom row of ground downward
      const sw = src.width || W, sh = src.height || H;
      for (const k of [-1, 1]) { g.save(); g.translate(k < 0 ? 0 : W * 2, 0); g.scale(-1, 1); g.drawImage(src, 0, 0, W, H); g.restore(); }
      g.drawImage(src, 0, 0, sw, 1, -W, -H, W * 3, H);
      g.drawImage(src, 0, sh - 1, sw, 1, -W, H, W * 3, H);
    }
  }
}

// ── foreground ───────────────────────────────────────────
const fgCache = new Map();
function fgStalks(biomeId) {
  if (fgCache.has(biomeId)) return fgCache.get(biomeId);
  const b = BIOMES[biomeId];
  const R = rng('fg' + biomeId);
  const top = (b.fgTop || 0.8) * H;
  const list = [];
  const n = { reeds: 170, corn: 70, grass: 320, brush: 26, rocks: 9, alien: 60, wire: 1 }[b.fg] || 0;
  for (let i = 0; i < n; i++) {
    const x = R() * W;
    const edge = Math.min(x, W - x) / (W / 2);
    let h = (H - top) * (0.75 + R() * 0.5);
    if (b.fg === 'grass') h *= 0.55 + R() * 0.3;
    if (b.fg === 'brush' || b.fg === 'rocks') h *= 1.2 - edge * 0.8;
    list.push({ x, h, w: 2 + R() * 4, ph: R() * 6, c: R(), lean: (R() - 0.5) * 0.3, edge });
  }
  fgCache.set(biomeId, list);
  return list;
}

// City cover overlays come in many shapes. Find where the solid part of the
// object starts, push it down so it never covers more than the bottom quarter,
// and fade out anything that sticks up above it (a palm trunk, a lamp post).
const COVER_TOP = 0.85; // only a lip of the cover object shows until you duck
const coverCache = new WeakMap();
function coverOverlay(img) {
  let c = coverCache.get(img);
  if (c) return c;
  const w = img.width, h = img.height;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  let solid = 0.74;
  try {
    const d = g.getImageData(0, 0, w, h);
    // climb from the bottom edge while at least half of each row is covered;
    // a tree canopy or sign above a thin trunk or post does not count
    let top = h;
    for (let y = h - 1; y >= 0; y--) {
      let n = 0;
      for (let x = 0; x < w; x += 2) if (d.data[(y * w + x) * 4 + 3] > 40) n++;
      if (n >= w * 0.25) top = y; else if (top < h) break;
    }
    if (top < h) solid = top / h;
    const fadeTo = solid * h + h * 0.002, fadeFrom = solid * h - h * 0.006;
    for (let y = 0; y < fadeTo; y++) {
      const k = y < fadeFrom ? 0 : (y - fadeFrom) / (fadeTo - fadeFrom);
      for (let x = 0; x < w; x++) { const i = (y * w + x) * 4 + 3; d.data[i] *= k; }
    }
    g.putImageData(d, 0, 0);
  } catch (e) { /* tainted (file://): draw as is */ }
  c = { img: cv, solid, shift: Math.max(0, COVER_TOP - solid) };
  coverCache.set(img, c);
  return c;
}

export function drawForeground(g, biomeId, t, windStrength = 2, wide = false) {
  if (wide) { for (const k of [-1, 0, 1]) { g.save(); g.translate(k * W, 0); drawForeground(g, biomeId, t, windStrength, false); g.restore(); } return; }
  const b = BIOMES[biomeId];
  const img = b.noCoverArt ? null : getImage(foregroundPath(biomeId), 'overlay');
  if (img && b.fg === 'cover') { const c = coverOverlay(img); g.drawImage(c.img, 0, c.shift * H, W, H); return; }
  if (img) { g.drawImage(img, 0, 0, W, H); return; }
  if (!b.fg || b.fg === 'none') return;
  if (b.fg === 'cover') return; // city scenes: the cover object only fills the view when ducking (drawCoverView)
  const stalks = fgStalks(biomeId);
  const sway = 0.012 + windStrength * 0.004;
  if (b.fg === 'reeds' || b.fg === 'corn' || b.fg === 'grass') {
    for (const s of stalks) {
      const bend = Math.sin(t * 1.3 + s.ph + s.x * 0.004) * sway * s.h + s.lean * s.h * 0.2;
      const tx = s.x + bend, ty = H - s.h;
      const col = b.fg === 'corn' ? `rgb(${130 + s.c * 60 | 0},${120 + s.c * 50 | 0},${50 + s.c * 20 | 0})`
        : b.fg === 'reeds' ? `rgb(${70 + s.c * 50 | 0},${80 + s.c * 40 | 0},${40 + s.c * 20 | 0})`
          : `rgb(${60 + s.c * 60 | 0},${80 + s.c * 50 | 0},${30 + s.c * 20 | 0})`;
      g.strokeStyle = col; g.lineWidth = b.fg === 'grass' ? s.w * 0.7 : s.w;
      g.beginPath(); g.moveTo(s.x, H + 4); g.quadraticCurveTo(s.x + bend * 0.2, H - s.h * 0.5, tx, ty); g.stroke();
      if (b.fg === 'reeds' && s.c > 0.55) { g.fillStyle = '#4a2e1c'; g.beginPath(); g.ellipse(tx, ty + 18, 5, 18, bend * 0.004, 0, Math.PI * 2); g.fill(); }
      if (b.fg === 'corn') { g.strokeStyle = col; g.lineWidth = 3; for (let k = 1; k < 4; k++) { const ly = H - s.h * k / 4; g.beginPath(); g.moveTo(s.x + bend * k / 4, ly); g.quadraticCurveTo(s.x + bend * k / 4 + 40 * (k % 2 ? 1 : -1), ly - 20, s.x + bend * k / 4 + 70 * (k % 2 ? 1 : -1), ly + 10); g.stroke(); } }
    }
  } else if (b.fg === 'brush' || b.fg === 'alien') {
    for (const s of stalks) {
      const bend = Math.sin(t * 1.1 + s.ph) * sway * 40;
      const r = s.h * 0.35;
      g.fillStyle = b.fg === 'alien' ? `rgba(${90 + s.c * 60 | 0},${30 + s.c * 30 | 0},${110 + s.c * 60 | 0},0.95)` : `rgb(${40 + s.c * 30 | 0},${50 + s.c * 30 | 0},${25 + s.c * 15 | 0})`;
      for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(s.x + bend + (k - 2) * r * 0.45, H - r * (0.6 + (k % 2) * 0.5), r * 0.55, 0, Math.PI * 2); g.fill(); }
      if (b.fg === 'alien') { g.fillStyle = 'rgba(120,255,210,0.8)'; g.beginPath(); g.arc(s.x + bend, H - r * 1.3, 4, 0, 7); g.fill(); }
    }
  } else if (b.fg === 'rocks') {
    for (const s of stalks) {
      const r = s.h * 0.4;
      const gr = g.createLinearGradient(0, H - r * 1.4, 0, H); gr.addColorStop(0, '#8a6a50'); gr.addColorStop(1, '#3a2a20');
      g.fillStyle = gr; g.beginPath(); g.ellipse(s.x, H, r * 1.3, r, 0, Math.PI, 0); g.fill();
    }
  } else if (b.fg === 'wire') {
    const top = (b.fgTop || 0.85) * H;
    g.fillStyle = '#8a7a58';
    for (let x = -30; x < W + 30; x += 70) { for (let row = 0; row < 3; row++) { g.beginPath(); g.ellipse(x + (row % 2) * 35, H - 30 - row * 42, 40, 22, 0, 0, Math.PI * 2); g.fill(); } }
    g.strokeStyle = 'rgba(40,40,40,0.8)'; g.lineWidth = 2;
    for (let x = 0; x < W; x += 26) { g.beginPath(); g.ellipse(x, top + 30, 22, 34, 0, 0, Math.PI * 2); g.stroke(); }
  }
}

export function worldTint(tod) { return (SKIES[tod] || SKIES.day).tint; }

// small JPEG preview for menu cards
const thumbs = new Map();
export function thumbnail(biomeId, tod) {
  const key = biomeId + '|' + tod;
  if (thumbs.has(key)) return thumbs.get(key);
  const c = document.createElement('canvas'); c.width = 384; c.height = 216;
  const g = c.getContext('2d');
  const path = backgroundPath(biomeId);
  const img = getImage(path, 'raw');
  g.drawImage(img || backdropCanvas(biomeId, tod), 0, 0, 384, 216);
  const tint = worldTint(tod);
  if (tint) { g.fillStyle = tint; g.fillRect(0, 0, 384, 216); }
  let url;
  try { url = c.toDataURL('image/jpeg', 0.8); } catch (e) { url = ''; }
  if (img || isMissing(path)) thumbs.set(key, url);
  return url;
}
