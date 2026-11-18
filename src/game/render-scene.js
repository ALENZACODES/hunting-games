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
  if (!cache.has(key)) cache.set(key, buildBackdrop(biomeId, tod));
  return cache.get(key);
}

export function drawBackdrop(g, biomeId, tod, view, wide = false) {
  const img = getImage(backgroundPath(biomeId), 'raw');
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

export function drawForeground(g, biomeId, t, windStrength = 2, wide = false) {
  if (wide) { for (const k of [-1, 0, 1]) { g.save(); g.translate(k * W, 0); drawForeground(g, biomeId, t, windStrength, false); g.restore(); } return; }
  const img = getImage(foregroundPath(biomeId), 'raw');
  if (img) { g.drawImage(img, 0, 0, W, H); return; }
  const b = BIOMES[biomeId];
  if (!b.fg || b.fg === 'none') return;
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
