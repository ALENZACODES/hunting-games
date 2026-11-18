// Drawing targets. If photoreal art exists in assets/ it is used; otherwise a
// drawn stand-in is rendered. Drawing happens in metres: the canvas is scaled
// by pixels-per-metre at the target's distance, x points the way the target
// faces and negative y is up.

import { project } from './view.js';
import { getFrames } from '../engine/assets.js';
import { spritePaths } from '../data/art.js';

const TAU = Math.PI * 2;

function ell(g, x, y, rx, ry, rot = 0) { g.beginPath(); g.ellipse(x, y, Math.max(0.0001, rx), Math.max(0.0001, ry), rot, 0, TAU); g.fill(); }
function circ(g, x, y, r) { g.beginPath(); g.arc(x, y, Math.max(0.0001, r), 0, TAU); g.fill(); }
function poly(g, pts, fill = true) { g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.closePath(); fill ? g.fill() : g.stroke(); }
function line(g, x1, y1, x2, y2, w) { g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
  if (f < 0) { r *= 1 + f; gg *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; gg += (255 - gg) * f; b += (255 - b) * f; }
  return `rgb(${r | 0},${gg | 0},${b | 0})`;
}

// ── pose for photoreal sprites ───────────────────────────
function poseFor(e) {
  const fam = e.sp.family;
  if (fam === 'mil') return 'idle';
  if (fam === 'alien') return { skitter: 'run', glider: 'fly', orb: 'idle', stalker: 'walk', brute: 'walk', pod: 'fall', colossus: 'walk' }[e.spId] || 'idle';
  if (e.sp.anchor === 'center') return 'fly';
  if (e.mode === 'graze') return 'graze';
  if (['flee', 'run', 'charge'].includes(e.mode) || e.sp.behavior === 'hop') return 'run';
  return 'walk';
}

function spriteFrames(e) {
  const pose = poseFor(e);
  for (const p of [pose, 'walk', 'run', 'idle', 'fly']) {
    const f = getFrames(spritePaths(e.spId, e.sp.family, p));
    if (f) return { frames: f, pose: p };
  }
  return null;
}

export function drawEntity(g, e, view, t, opts = {}) {
  if (e.state === 'gone') return;
  const p = project(view, e.x, e.alt, e.d);
  const k = p.ppm;
  const span = e.sp.len * k * 1.5 + 40;
  if (p.sx < -span || p.sx > 1920 + span || p.sy < -span * 2 || p.sy > 1080 + span) return;

  g.save();
  g.globalAlpha = Math.max(0, Math.min(1, e.alpha * (opts.fade ?? 1)));
  g.translate(p.sx, p.sy);

  // death motion
  if (e.state === 'dying') {
    const dt = e.deathT;
    const fam = e.sp.family;
    if (fam === 'bird' && e.sp.anchor === 'center') g.rotate(dt * 7 * e.facing);
    else if (fam === 'quad' || (fam === 'bird')) { const c = Math.min(1, dt * 2.2); g.rotate(-e.facing * c * 0.18); g.scale(1, 1 - c * 0.55); }
    else if (fam === 'alien') { const c = Math.min(1, dt * 1.5); g.scale(1 + c * 0.3, 1 - c * 0.7); }
  }
  g.scale(e.facing * k, k);

  const art = opts.drawnOnly ? null : spriteFrames(e);
  if (art) drawSprite(g, e, art.frames);
  else (DRAW[e.sp.draw] || DRAW.popup)(g, e, t);

  if (e.sp.weakpoints && e.state === 'alive') drawWeakpoints(g, e, t);
  if (e.spId === 'sniper' && e.glint > 0 && e.state === 'alive') {
    g.globalAlpha = 1;
    const r = 9 / k;
    const grd = g.createRadialGradient(0.5, -0.42, 0, 0.5, -0.42, r);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.3, 'rgba(255,250,210,0.8)'); grd.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = grd; circ(g, 0.5, -0.42, r);
    g.strokeStyle = 'rgba(255,255,240,0.9)'; line(g, 0.5 - r * 1.6, -0.42, 0.5 + r * 1.6, -0.42, r * 0.12); line(g, 0.5, -0.42 - r * 1.2, 0.5, -0.42 + r * 1.2, r * 0.12);
  }
  g.restore();
}

function drawSprite(g, e, frames) {
  const fi = frames.length > 1 ? Math.floor((e.phase / Math.PI) % frames.length + frames.length) % frames.length : 0;
  const img = frames[fi];
  const w = e.sp.len;
  const h = w * (img.height / img.width);
  let bob = 0;
  if (frames.length === 1) {
    if (e.sp.anchor === 'center' && e.sp.family !== 'mil') bob = Math.sin(e.phase) * 0.04 * w;
    else if (e.mode === 'walk' || e.mode === 'flee' || e.mode === 'run' || e.mode === 'charge') bob = -Math.abs(Math.sin(e.phase)) * 0.025 * w;
  }
  const pop = e.popup ?? 1;
  if (e.sp.anchor === 'bottom') {
    g.save(); g.scale(1, pop);
    g.drawImage(img, -w / 2, -h + bob, w, h);
    g.restore();
  } else g.drawImage(img, -w / 2, -h / 2 + bob, w, h);
}

function drawWeakpoints(g, e, t) {
  const pulse = 0.6 + 0.4 * Math.sin(t * 6);
  for (const w of e.sp.weakpoints) {
    const grd = g.createRadialGradient(w.x, -w.y, 0, w.x, -w.y, w.r * 1.8);
    grd.addColorStop(0, `rgba(255,240,240,${pulse})`); grd.addColorStop(0.4, `rgba(255,61,110,${0.85 * pulse})`); grd.addColorStop(1, 'rgba(255,61,110,0)');
    g.fillStyle = grd; circ(g, w.x, -w.y, w.r * 1.8);
  }
}

// ── birds ─────────────────────────────────────────────────
function flyingBird(g, e, c) {
  const L = e.sp.len;
  const up = Math.sin(e.phase);
  const glide = c.glide ? 0.25 + 0.1 * up : null;
  const wingUp = glide ?? up;
  const wing = (lag, color) => {
    const u = glide ?? Math.sin(e.phase - lag);
    const sx = 0.04 * L, sy = -c.ry * 0.55;
    const tipY = sy - c.wing * (0.1 + 0.9 * u);
    const tipX = sx - c.wing * 0.42;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(sx + c.wing * 0.22, sy + 0.01);
    g.quadraticCurveTo(sx + c.wing * 0.1, sy - c.wing * 0.7 * (0.1 + 0.9 * u), tipX, tipY);
    g.quadraticCurveTo(sx - c.wing * 0.3, sy - c.wing * 0.3 * (0.1 + 0.9 * u), sx - c.wing * 0.32, sy + 0.02);
    g.closePath(); g.fill();
    if (c.accent) { g.fillStyle = c.accent; ell(g, sx - c.wing * 0.16, sy - c.wing * 0.18 * (0.1 + 0.9 * u), c.wing * 0.1, c.wing * 0.045, -0.6 * u); }
  };
  wing(0.35, shade(c.wingColor, -0.35));
  // tail
  g.fillStyle = c.tail || c.body;
  poly(g, [-c.rx * 0.8, -c.ry * 0.2, -c.rx - c.tailLen, -c.ry * 0.05 - c.tailLen * 0.15, -c.rx - c.tailLen * 0.9, c.ry * 0.3, -c.rx * 0.8, c.ry * 0.3]);
  // body
  const grd = g.createLinearGradient(0, -c.ry, 0, c.ry);
  grd.addColorStop(0, shade(c.body, -0.15)); grd.addColorStop(1, c.belly || shade(c.body, 0.25));
  g.fillStyle = grd; ell(g, 0, 0, c.rx, c.ry, -0.08);
  // neck + head
  g.strokeStyle = c.neck || c.head; g.lineCap = 'round';
  const hx = c.rx + c.neckLen * 0.85, hy = -c.ry * 0.55 - c.neckLen * 0.25;
  line(g, c.rx * 0.6, -c.ry * 0.25, hx, hy, c.neckW || c.headR * 1.3);
  if (c.ring) { g.strokeStyle = '#f2f0ea'; line(g, hx - c.neckLen * 0.3, hy + 0.02, hx - c.neckLen * 0.18, hy + 0.0, c.headR * 1.35); }
  if (c.chin) { g.fillStyle = c.chin; ell(g, hx, hy + c.headR * 0.3, c.headR * 0.9, c.headR * 0.6); }
  g.fillStyle = c.head; ell(g, hx, hy, c.headR * 1.1, c.headR);
  if (c.face) { g.fillStyle = c.face; ell(g, hx + c.headR * 0.2, hy, c.headR * 0.5, c.headR * 0.55); }
  g.fillStyle = c.bill || '#d8a530';
  poly(g, [hx + c.headR * 0.8, hy - c.headR * 0.25, hx + c.headR * 0.8 + c.billLen, hy + c.headR * 0.05, hx + c.headR * 0.8, hy + c.headR * 0.35]);
  g.fillStyle = '#0a0a0a'; circ(g, hx + c.headR * 0.3, hy - c.headR * 0.2, c.headR * 0.18);
  wing(0, c.wingColor);
  return wingUp;
}

// ── quadrupeds ───────────────────────────────────────────
function legs(g, e, s, c) {
  const gallop = ['flee', 'run', 'charge'].includes(e.mode) || e.sp.behavior === 'hop';
  const moving = gallop || e.mode === 'walk' || e.mode === 'move';
  const amp = gallop ? 0.65 : moving ? 0.32 : 0;
  const pairs = [
    { x: c.front, off: 0, rear: false }, { x: c.front - 0.06 * s, off: Math.PI * (gallop ? 0.25 : 1), rear: false },
    { x: c.rear, off: Math.PI * (gallop ? 1 : 0.5), rear: true }, { x: c.rear - 0.06 * s, off: Math.PI * (gallop ? 1.25 : 1.5), rear: true },
  ];
  g.lineCap = 'round';
  pairs.forEach((lg, i) => {
    const a = Math.sin(e.phase + lg.off) * amp;
    const top = -c.hip;
    const kneeL = c.leg * 0.5;
    const kx = lg.x + Math.sin(a) * kneeL, ky = top + Math.cos(a) * kneeL;
    const bend = lg.rear ? -0.5 : 0.35;
    const fx = kx + Math.sin(a + bend * (gallop ? 1.2 : 0.6)) * kneeL, fy = Math.min(0, ky + Math.cos(a + bend) * kneeL);
    g.strokeStyle = i % 2 === 1 ? shade(c.color, -0.35) : shade(c.color, -0.1);
    line(g, lg.x, top, kx, ky, c.legW * 1.3);
    line(g, kx, ky, fx, fy, c.legW);
    g.fillStyle = c.hoof || '#1a1410'; ell(g, fx + 0.01 * s, fy - 0.01 * s, c.legW * 0.7, c.legW * 0.45);
  });
}

function antlers(g, type, hx, hy, s) {
  g.strokeStyle = type === 'pronghorn' ? '#111' : '#d9c9a6'; g.lineCap = 'round';
  const w = 0.035 * s;
  if (type === 'whitetail') {
    g.beginPath(); g.moveTo(hx - 0.05 * s, hy - 0.08 * s); g.quadraticCurveTo(hx - 0.2 * s, hy - 0.45 * s, hx + 0.18 * s, hy - 0.42 * s); g.lineWidth = w; g.stroke();
    for (let i = 0; i < 3; i++) { const tx = hx - 0.1 * s + i * 0.1 * s; line(g, tx, hy - 0.4 * s + i * 0.01 * s, tx + 0.02 * s, hy - 0.62 * s + i * 0.04 * s, w * 0.8); }
  } else if (type === 'mule') {
    const fork = (x, y, len, ang) => { const ex = x + Math.cos(ang) * len, ey = y - Math.sin(ang) * len; line(g, x, y, ex, ey, w); return [ex, ey]; };
    const [ax, ay] = fork(hx - 0.04 * s, hy - 0.08 * s, 0.28 * s, 1.85);
    const [bx, by] = fork(ax, ay, 0.2 * s, 1.3); fork(ax, ay, 0.2 * s, 2.3);
    fork(bx, by, 0.12 * s, 1.0); fork(bx, by, 0.12 * s, 1.7);
  } else if (type === 'elk') {
    g.beginPath(); g.moveTo(hx - 0.05 * s, hy - 0.08 * s); g.quadraticCurveTo(hx - 0.25 * s, hy - 0.8 * s, hx - 0.65 * s, hy - 0.95 * s); g.lineWidth = w * 1.2; g.stroke();
    for (let i = 0; i < 5; i++) { const f = i / 5; const tx = hx - 0.08 * s - f * 0.5 * s, ty = hy - 0.25 * s - f * 0.65 * s; line(g, tx, ty, tx + 0.18 * s, ty - 0.12 * s, w * 0.8); }
  } else if (type === 'moose') {
    g.fillStyle = '#c9b48d';
    g.beginPath(); g.moveTo(hx - 0.05 * s, hy - 0.06 * s);
    g.quadraticCurveTo(hx - 0.35 * s, hy - 0.15 * s, hx - 0.55 * s, hy - 0.45 * s);
    for (let i = 0; i < 6; i++) g.lineTo(hx - 0.55 * s + i * 0.12 * s, hy - (0.55 + (i % 2) * 0.1) * s);
    g.quadraticCurveTo(hx + 0.2 * s, hy - 0.35 * s, hx + 0.02 * s, hy - 0.06 * s); g.closePath(); g.fill();
  } else if (type === 'pronghorn') {
    line(g, hx - 0.02 * s, hy - 0.08 * s, hx - 0.02 * s, hy - 0.32 * s, w * 1.1);
    line(g, hx - 0.02 * s, hy - 0.32 * s, hx - 0.09 * s, hy - 0.38 * s, w);
    line(g, hx - 0.02 * s, hy - 0.2 * s, hx + 0.06 * s, hy - 0.24 * s, w * 0.8);
  }
}

function quad(g, e, c) {
  const s = c.s;
  const gallop = ['flee', 'run', 'charge'].includes(e.mode);
  const bob = gallop ? Math.sin(e.phase * 2) * 0.03 * s : 0;
  g.translate(0, bob);
  legs(g, e, s, c);
  // body
  const grd = g.createLinearGradient(0, -c.hip - c.ry, 0, -c.hip + c.ry);
  grd.addColorStop(0, shade(c.color, -0.18)); grd.addColorStop(0.7, c.color); grd.addColorStop(1, c.belly || shade(c.color, 0.3));
  g.fillStyle = grd;
  ell(g, 0, -c.hip - c.ry * 0.25, c.rx, c.ry);
  ell(g, c.front - 0.02 * s, -c.hip - c.ry * (c.hump ? 0.65 : 0.35), c.ry * (c.hump ? 1.15 : 0.95), c.ry * (c.hump ? 1.2 : 1));
  ell(g, c.rear + 0.04 * s, -c.hip - c.ry * 0.35, c.ry * 0.95, c.ry * 0.95);
  if (c.rump) { g.fillStyle = c.rump; ell(g, c.rear - c.ry * 0.55, -c.hip - c.ry * 0.3, c.ry * 0.4, c.ry * 0.55); }
  // tail
  g.fillStyle = (gallop && c.flag) ? c.flag : shade(c.color, -0.2);
  if (gallop && c.flag) ell(g, c.rear - c.ry * 0.9, -c.hip - c.ry * 0.95, 0.06 * s, 0.11 * s, -0.5);
  else ell(g, c.rear - c.ry * 0.95, -c.hip - c.ry * 0.5, 0.04 * s, 0.09 * s, 0.4);
  // neck + head
  const grazing = e.mode === 'graze';
  const nx = c.front + 0.08 * s, ny = -c.hip - c.ry * 0.7;
  const hx = grazing ? c.front + c.neck * 0.75 : c.front + c.neck * 0.55;
  const hy = grazing ? -0.12 * s : -c.hip - c.ry - c.neck * 0.8;
  g.strokeStyle = c.neckColor || c.color; g.lineCap = 'round';
  line(g, nx, ny, hx - 0.04 * s, hy + 0.05 * s, c.neckW);
  if (c.bell) { g.fillStyle = shade(c.color, -0.25); ell(g, hx - 0.05 * s, hy + 0.22 * s, 0.05 * s, 0.12 * s); }
  g.fillStyle = c.headColor || c.color;
  ell(g, hx + c.head * 0.35, hy + 0.02 * s, c.head * 0.6, c.headH, grazing ? 1.1 : 0.32);
  g.fillStyle = c.nose || '#1b1612';
  const tipx = hx + c.head * (grazing ? 0.55 : 0.85), tipy = hy + (grazing ? 0.22 : 0.1) * s;
  ell(g, tipx, tipy, c.head * 0.13, c.headH * 0.45);
  if (c.tusk) { g.strokeStyle = '#efe6d2'; line(g, tipx - 0.04 * s, tipy + 0.02 * s, tipx + 0.02 * s, tipy - 0.06 * s, 0.025 * s); }
  // ears
  g.fillStyle = shade(c.headColor || c.color, -0.1);
  if (c.roundEars) { circ(g, hx - 0.02 * s, hy - c.headH * 0.9, c.headH * 0.45); }
  else ell(g, hx - 0.02 * s, hy - c.headH * 1.1, c.ear * 0.35, c.ear, -0.5);
  g.fillStyle = '#080706'; circ(g, hx + c.head * 0.3, hy - c.headH * 0.25, 0.018 * s);
  if (c.antlers && !grazing) antlers(g, c.antlers, hx, hy - c.headH * 0.4, s);
  if (c.bristle) { g.strokeStyle = shade(c.color, -0.4); for (let i = 0; i < 7; i++) { const bx = c.rear + i * (c.front - c.rear) / 6; line(g, bx, -c.hip - c.ry * 1.05, bx + 0.02 * s, -c.hip - c.ry * 1.35, 0.025 * s); } }
}

// ── drawing table ────────────────────────────────────────
const DRAW = {
  duck(g, e) { const [b, h, belly] = e.sp.colors; flyingBird(g, e, { rx: 0.22, ry: 0.085, body: b, belly, head: h, headR: 0.055, neckLen: 0.07, ring: true, billLen: 0.07, bill: '#d9b23a', tailLen: 0.06, tail: '#2b2b2b', wing: 0.42, wingColor: '#7d6a55', accent: '#3657c9' }); },
  goose(g, e) { const [b, n, chin] = e.sp.colors; flyingBird(g, e, { rx: 0.33, ry: 0.12, body: b, belly: '#cfc6b8', head: n, neck: n, neckLen: 0.24, neckW: 0.055, headR: 0.06, chin, billLen: 0.06, bill: '#151515', tailLen: 0.07, tail: '#151515', wing: 0.6, wingColor: '#5e5246' }); },
  pheasant(g, e) { const [b, h, face] = e.sp.colors; flyingBird(g, e, { rx: 0.2, ry: 0.09, body: b, belly: '#b4682e', head: h, face, ring: true, neckLen: 0.07, headR: 0.05, billLen: 0.035, bill: '#d6c49a', tailLen: 0.4, tail: '#8a5a33', wing: 0.32, wingColor: '#a88350' }); },
  dove(g, e) { const [b, w, belly] = e.sp.colors; flyingBird(g, e, { rx: 0.11, ry: 0.045, body: b, belly, head: b, headR: 0.03, neckLen: 0.03, billLen: 0.018, bill: '#222', tailLen: 0.1, tail: w, wing: 0.22, wingColor: w }); },
  swan(g, e) { const [b, bill] = e.sp.colors; flyingBird(g, e, { rx: 0.5, ry: 0.16, body: b, belly: '#ffffff', head: b, neck: b, neckLen: 0.55, neckW: 0.07, headR: 0.07, billLen: 0.1, bill, tailLen: 0.08, tail: b, wing: 0.95, wingColor: '#ecebe6' }); },
  eagle(g, e) { const [b, w, bill] = e.sp.colors; flyingBird(g, e, { rx: 0.3, ry: 0.1, body: b, belly: b, head: w, headR: 0.07, neckLen: 0.07, billLen: 0.06, bill, tailLen: 0.16, tail: w, wing: 1.0, wingColor: b, glide: true }); },
  turkey(g, e) {
    const [b, wat, head] = e.sp.colors;
    g.strokeStyle = '#a07a5a'; g.lineCap = 'round';
    const a = ['walk', 'flee'].includes(e.mode) ? Math.sin(e.phase * 1.5) * 0.3 : 0;
    line(g, 0.02, -0.35, 0.02 + Math.sin(a) * 0.3, 0, 0.035); line(g, -0.06, -0.35, -0.06 - Math.sin(a) * 0.3, 0, 0.035);
    g.fillStyle = shade(b, -0.1);
    g.beginPath(); g.moveTo(-0.2, -0.55); g.arc(-0.28, -0.62, 0.38, Math.PI * 0.55, Math.PI * 1.55); g.closePath(); g.fill();
    g.strokeStyle = '#c9a77a'; g.lineWidth = 0.025; g.beginPath(); g.arc(-0.28, -0.62, 0.34, Math.PI * 0.6, Math.PI * 1.5); g.stroke();
    const grd = g.createLinearGradient(0, -0.85, 0, -0.3); grd.addColorStop(0, '#5a4630'); grd.addColorStop(1, b);
    g.fillStyle = grd; ell(g, 0, -0.56, 0.36, 0.25);
    g.strokeStyle = shade(b, 0.1); line(g, 0.24, -0.66, 0.36, -0.88, 0.07);
    g.fillStyle = head; ell(g, 0.38, -0.9, 0.06, 0.05);
    g.fillStyle = wat; ell(g, 0.39, -0.82, 0.03, 0.06);
    g.fillStyle = '#1b1612'; poly(g, [0.18, -0.6, 0.22, -0.4, 0.2, -0.6]);
  },
  rabbit(g, e) {
    const [b, w] = e.sp.colors;
    const hop = e.mode === 'run' ? Math.abs(Math.sin(e.phase)) : 0;
    g.translate(0, -hop * 0.12);
    g.fillStyle = shade(b, -0.15); ell(g, -0.12, -0.06, 0.1 + hop * 0.05, 0.04, -hop * 0.6);
    g.fillStyle = b; ell(g, 0, -0.15, 0.17, 0.1, -hop * 0.2);
    ell(g, 0.15, -0.22, 0.07, 0.06);
    ell(g, 0.1, -0.33, 0.025, 0.09, -0.4); ell(g, 0.13, -0.33, 0.025, 0.09, -0.2);
    g.fillStyle = w; circ(g, -0.17, -0.18, 0.045);
    g.fillStyle = '#000'; circ(g, 0.18, -0.24, 0.012);
    g.fillStyle = shade(b, -0.2); ell(g, 0.08, -0.04 + hop * 0.03, 0.03, 0.05, 0.3 + hop);
  },
  deer(g, e) {
    const s = e.sp.len / 2.0;
    const [c, w, n] = e.sp.colors;
    const isElk = e.sp.antlers === 'elk';
    quad(g, e, { s, color: c, belly: shade(c, 0.35), rump: isElk ? n : w, flag: e.sp.antlers === 'whitetail' || !e.sp.antlers ? w : null, hip: 0.82 * s, leg: 0.84 * s, legW: 0.065 * s, rx: 0.56 * s, ry: 0.24 * s, front: 0.42 * s, rear: -0.42 * s, neck: 0.5 * s, neckW: 0.15 * s, neckColor: isElk ? w : c, head: 0.3 * s, headH: 0.085 * s, ear: 0.1 * s * (e.sp.antlers === 'mule' ? 1.5 : 1), antlers: e.sp.antlers, nose: '#1a1612' });
  },
  pronghorn(g, e) {
    const s = e.sp.len / 1.5;
    const [c, w] = e.sp.colors;
    quad(g, e, { s, color: c, belly: w, rump: w, hip: 0.6 * s, leg: 0.62 * s, legW: 0.05 * s, rx: 0.42 * s, ry: 0.19 * s, front: 0.32 * s, rear: -0.32 * s, neck: 0.36 * s, neckW: 0.1 * s, head: 0.22 * s, headH: 0.065 * s, ear: 0.07 * s, antlers: 'pronghorn', nose: '#111' });
  },
  moose(g, e) {
    const s = e.sp.len / 3.0;
    const [c, mid, legc] = e.sp.colors;
    quad(g, e, { s, color: c, belly: mid, hip: 1.3 * s, leg: 1.3 * s, legW: 0.1 * s, rx: 0.88 * s, ry: 0.42 * s, front: 0.62 * s, rear: -0.6 * s, hump: true, neck: 0.55 * s, neckW: 0.3 * s, head: 0.62 * s, headH: 0.16 * s, ear: 0.14 * s, antlers: 'moose', bell: true, hoof: legc });
  },
  boar(g, e) {
    const s = e.sp.len / 1.5;
    const [c, m] = e.sp.colors;
    quad(g, e, { s, color: c, belly: m, hip: 0.32 * s, leg: 0.34 * s, legW: 0.07 * s, rx: 0.58 * s, ry: 0.27 * s, front: 0.38 * s, rear: -0.42 * s, hump: true, neck: 0.12 * s, neckW: 0.3 * s, head: 0.42 * s, headH: 0.16 * s, ear: 0.07 * s, tusk: true, bristle: true, nose: '#3a2c26' });
  },
  bear(g, e) {
    const s = e.sp.len / 1.8;
    const [c, m, muzzle] = e.sp.colors;
    quad(g, e, { s, color: c, belly: m, hip: 0.45 * s, leg: 0.46 * s, legW: 0.15 * s, rx: 0.66 * s, ry: 0.33 * s, front: 0.42 * s, rear: -0.45 * s, hump: true, neck: 0.22 * s, neckW: 0.32 * s, head: 0.36 * s, headH: 0.15 * s, ear: 0.06 * s, roundEars: true, headColor: c, nose: muzzle });
  },

  // ── aliens ──
  skitter(g, e) {
    const [c, glow] = e.sp.colors;
    g.lineCap = 'round'; g.strokeStyle = shade(c, 0.15);
    for (let i = 0; i < 6; i++) {
      const lx = -0.4 + i * 0.16, ph = e.phase + i * 1.3;
      const kx = lx + Math.sin(ph) * 0.12, ky = -0.62 - Math.abs(Math.cos(ph)) * 0.08;
      line(g, lx, -0.38, kx, ky, 0.05); line(g, kx, ky, kx + 0.12 + Math.sin(ph) * 0.08, 0, 0.035);
    }
    const grd = g.createLinearGradient(0, -0.62, 0, -0.2); grd.addColorStop(0, shade(c, 0.2)); grd.addColorStop(1, '#050808');
    g.fillStyle = grd; ell(g, -0.05, -0.42, 0.55, 0.19, -0.05);
    g.fillStyle = shade(c, 0.1); ell(g, 0.52, -0.38, 0.17, 0.12);
    g.strokeStyle = glow; g.globalAlpha *= 0.9;
    for (let i = 0; i < 4; i++) line(g, -0.4 + i * 0.2, -0.56, -0.32 + i * 0.2, -0.5, 0.025);
    g.fillStyle = glow; circ(g, 0.62, -0.42, 0.035); circ(g, 0.56, -0.44, 0.03);
    g.strokeStyle = '#0a0f0f'; line(g, 0.66, -0.32, 0.76, -0.24, 0.03);
  },
  glider(g, e) {
    const [c, glow] = e.sp.colors;
    const u = Math.sin(e.phase) * 0.35;
    const grd = g.createLinearGradient(0, -0.5, 0, 0.4); grd.addColorStop(0, shade(c, 0.25)); grd.addColorStop(1, '#07050c');
    g.fillStyle = grd;
    g.beginPath(); g.moveTo(1.3, 0); g.quadraticCurveTo(0.6, -0.35, 0.1, -0.2 - u);
    g.quadraticCurveTo(-0.6, -0.6 - u * 1.4, -1.4, -0.1 - u * 1.6); g.quadraticCurveTo(-0.5, 0.2, -0.2, 0.15);
    g.quadraticCurveTo(0.4, 0.25, 1.3, 0); g.fill();
    g.strokeStyle = shade(c, -0.2); line(g, -0.2, 0.12, -1.0, 0.35 + Math.sin(e.phase * 0.7) * 0.15, 0.05);
    g.fillStyle = glow; for (let i = 0; i < 5; i++) circ(g, 0.8 - i * 0.38, -0.08 - (i > 1 ? u * (i - 1) * 0.35 : 0), 0.045);
    circ(g, 1.15, -0.04, 0.06);
  },
  orb(g, e) {
    const [c, glow, core] = e.sp.colors;
    const grd = g.createRadialGradient(-0.12, -0.15, 0.05, 0, 0, 0.5);
    grd.addColorStop(0, '#9fdcff'); grd.addColorStop(0.5, shade(c, 0.25)); grd.addColorStop(1, '#03070c');
    g.fillStyle = grd; circ(g, 0, 0, 0.46);
    const pulse = 0.6 + 0.4 * Math.sin(e.phase * 3);
    const cg = g.createRadialGradient(0, 0, 0, 0, 0, 0.3); cg.addColorStop(0, core); cg.addColorStop(0.5, `rgba(124,214,255,${pulse})`); cg.addColorStop(1, 'rgba(124,214,255,0)');
    g.fillStyle = cg; circ(g, 0, 0, 0.3);
    g.strokeStyle = glow; g.lineWidth = 0.035; g.beginPath(); g.ellipse(0, 0, 0.66, 0.16 * Math.abs(Math.sin(e.phase)) + 0.03, 0.2, 0, TAU); g.stroke();
  },
  stalker(g, e) {
    const [c, glow] = e.sp.colors;
    const walk = e.mode === 'charge' ? 0.7 : 0.35;
    g.lineCap = 'round'; g.strokeStyle = shade(c, 0.1);
    for (const off of [0, Math.PI]) {
      const a = Math.sin(e.phase + off) * walk;
      const kx = Math.sin(a) * 0.5 + 0.12, ky = -0.75;
      line(g, 0, -1.3, kx, ky, 0.12); line(g, kx, ky, kx - 0.2 + Math.sin(a) * 0.2, 0, 0.08);
    }
    const grd = g.createLinearGradient(-0.3, 0, 0.3, 0); grd.addColorStop(0, '#060906'); grd.addColorStop(0.6, shade(c, 0.2)); grd.addColorStop(1, '#0a0f0b');
    g.fillStyle = grd; ell(g, 0.02, -1.8, 0.28, 0.55, 0.08);
    g.strokeStyle = shade(c, 0.05); line(g, 0.15, -2.1, 0.45 + Math.sin(e.phase) * 0.1, -1.3, 0.07); line(g, 0.45 + Math.sin(e.phase) * 0.1, -1.3, 0.55, -1.0, 0.05);
    g.fillStyle = shade(c, 0.12); ell(g, 0.05, -2.5, 0.2, 0.17, -0.5); ell(g, -0.15, -2.62, 0.25, 0.1, -0.3);
    g.fillStyle = glow; circ(g, 0.17, -2.54, 0.04); circ(g, 0.1, -2.56, 0.035);
  },
  brute(g, e) {
    const [c, glow] = e.sp.colors;
    g.lineCap = 'round'; g.strokeStyle = shade(c, -0.2);
    for (let i = 0; i < 4; i++) { const a = Math.sin(e.phase + i * 1.6) * 0.25; const lx = -1.0 + i * 0.65; line(g, lx, -1.0, lx + Math.sin(a) * 0.4, 0, 0.32); }
    const grd = g.createLinearGradient(0, -2.4, 0, -0.4); grd.addColorStop(0, shade(c, 0.25)); grd.addColorStop(1, '#0b0907');
    g.fillStyle = grd; ell(g, 0, -1.35, 1.55, 0.95, -0.05);
    g.fillStyle = shade(c, -0.25); for (let i = 0; i < 4; i++) ell(g, -0.9 + i * 0.55, -2.0 + Math.abs(i - 1.5) * 0.12, 0.35, 0.18, -0.3);
    g.fillStyle = shade(c, 0.1); ell(g, 1.35, -1.0, 0.45, 0.35);
    g.fillStyle = '#efe0c8'; poly(g, [1.6, -0.82, 1.85, -0.95, 1.62, -0.7]);
    g.fillStyle = glow; circ(g, 1.55, -1.12, 0.06);
    const pulse = 0.55 + 0.45 * Math.sin(e.phase * 2.5);
    const sg = g.createRadialGradient(-0.85, -2.15, 0, -0.85, -2.15, 0.45); sg.addColorStop(0, `rgba(255,220,180,${pulse})`); sg.addColorStop(0.5, `rgba(255,123,58,${pulse})`); sg.addColorStop(1, 'rgba(255,123,58,0)');
    g.fillStyle = sg; circ(g, -0.85, -2.15, 0.45);
  },
  pod(g, e) {
    const [c, glow] = e.sp.colors;
    const grd = g.createLinearGradient(-0.5, 0, 0.5, 0); grd.addColorStop(0, '#0c0d10'); grd.addColorStop(0.5, shade(c, 0.35)); grd.addColorStop(1, '#0c0d10');
    g.fillStyle = grd; ell(g, 0, 0, 0.5, 0.85);
    g.strokeStyle = glow; g.lineWidth = 0.04; g.beginPath(); g.ellipse(0, 0, 0.5, 0.85, 0, Math.PI * 0.2, Math.PI * 0.8); g.stroke();
    line(g, -0.45, -0.1, 0.45, -0.1, 0.03);
    const fg = g.createRadialGradient(0, 0.85, 0, 0, 0.85, 0.6); fg.addColorStop(0, 'rgba(255,240,200,0.95)'); fg.addColorStop(0.4, 'rgba(255,150,60,0.7)'); fg.addColorStop(1, 'rgba(255,90,30,0)');
    g.fillStyle = fg; ell(g, 0, 1.0, 0.45, 0.6);
  },
  colossus(g, e) {
    const [c] = e.sp.colors;
    g.lineCap = 'round';
    const legsX = [-5.2, 0.6, 5.0];
    legsX.forEach((lx, i) => {
      const a = Math.sin(e.phase + i * 2.1) * 0.12;
      const kx = lx * 0.75 + Math.sin(a) * 2, ky = -12.5;
      g.strokeStyle = shade(c, i === 1 ? -0.3 : 0.05);
      line(g, lx * 0.3, -9.5, kx, ky, 1.0); line(g, kx, ky, lx + Math.sin(a) * 1.5, 0, 0.7);
    });
    const grd = g.createLinearGradient(0, -14, 0, -7); grd.addColorStop(0, shade(c, 0.3)); grd.addColorStop(1, '#040406');
    g.fillStyle = grd; ell(g, 0, -10.2, 5.6, 2.8);
    g.fillStyle = shade(c, 0.12); ell(g, 0.4, -12.4, 2.2, 1.4);
    g.fillStyle = shade(c, -0.3); for (let i = 0; i < 5; i++) ell(g, -4 + i * 2, -9, 0.6, 0.25);
    g.strokeStyle = '#111'; line(g, 2.5, -10, 5.5, -7.5, 0.35);
  },

  // ── military ──
  plate(g, e) {
    const b = e.sp.body;
    g.strokeStyle = '#3a3a36'; g.lineCap = 'butt';
    line(g, 0, 0, 0, -(b.y - b.ry * 0.5), Math.max(0.03, b.rx * 0.12));
    line(g, -b.rx * 0.6, 0, b.rx * 0.6, 0, Math.max(0.03, b.rx * 0.12));
    const sw = e.swing ? Math.sin(e.swing * 14) * Math.exp(-e.swing * 1.5) : 0;
    g.save(); g.translate(0, -(b.y + b.ry * 0.9)); g.scale(1, 1 - Math.abs(sw) * 0.5);
    const grd = g.createRadialGradient(-b.rx * 0.3, b.ry * 0.6, 0, 0, b.ry * 0.9, b.rx * 1.1);
    grd.addColorStop(0, '#f4f1ea'); grd.addColorStop(1, '#a9a395');
    g.fillStyle = grd; circ(g, 0, b.ry * 0.9, b.rx);
    g.strokeStyle = '#4a4740'; g.lineWidth = b.rx * 0.08; g.beginPath(); g.arc(0, b.ry * 0.9, b.rx, 0, TAU); g.stroke();
    if (e.state === 'dying') { g.fillStyle = '#2a2a2a'; circ(g, (e.hitX || 0) * b.rx, b.ry * 0.9 + (e.hitY || 0) * b.ry, b.rx * 0.12); }
    g.restore();
  },
  popup(g, e) { silhouette(g, e, false); },
  noshoot(g, e) { silhouette(g, e, true); },
  drone(g, e) {
    const [c, led, rotor] = e.sp.colors;
    g.strokeStyle = shade(c, 0.1); g.lineCap = 'round';
    line(g, -0.3, -0.03, 0.3, -0.03, 0.035);
    g.fillStyle = `rgba(160,170,180,0.35)`;
    ell(g, -0.3, -0.07, 0.17, 0.025); ell(g, 0.3, -0.07, 0.17, 0.025);
    g.strokeStyle = rotor; line(g, -0.3, -0.03, -0.3, -0.07, 0.02); line(g, 0.3, -0.03, 0.3, -0.07, 0.02);
    g.fillStyle = c; ell(g, 0, 0, 0.13, 0.06);
    g.fillStyle = '#0d0f12'; circ(g, 0.06, 0.06, 0.035);
    if (Math.sin(e.phase * 0.2) > 0) { g.fillStyle = led; circ(g, -0.1, -0.02, 0.02); }
  },
  vehicle(g, e) {
    const [c, d, tire] = e.sp.colors;
    const burnt = e.state === 'dying' || e.hp <= 0;
    const body = burnt ? '#1c1a17' : c;
    g.fillStyle = tire;
    for (let i = 0; i < 4; i++) circ(g, -1.9 + i * 1.25, -0.48, 0.48);
    g.fillStyle = '#3a3a33'; for (let i = 0; i < 4; i++) circ(g, -1.9 + i * 1.25, -0.48, 0.2);
    const grd = g.createLinearGradient(0, -2.3, 0, -0.6); grd.addColorStop(0, shade(body, 0.12)); grd.addColorStop(1, shade(body, -0.25));
    g.fillStyle = grd; poly(g, [-2.75, -0.7, 2.3, -0.7, 2.8, -1.25, 2.3, -1.95, -2.6, -1.95, -2.8, -1.4]);
    g.fillStyle = shade(body, -0.15); poly(g, [-1.0, -1.95, 0.9, -1.95, 0.7, -2.45, -0.8, -2.45]);
    g.strokeStyle = shade(body, -0.35); line(g, 0.6, -2.25, 2.6, -2.3, 0.1);
    g.fillStyle = '#111'; poly(g, [1.85, -1.7, 2.35, -1.7, 2.55, -1.35, 1.85, -1.35]);
    g.strokeStyle = d; line(g, -2.6, -1.3, 2.2, -1.3, 0.04);
  },
  sniper(g, e) {
    const [c, d] = e.sp.colors;
    g.fillStyle = d; ell(g, -0.1, -0.18, 0.85, 0.2);
    g.fillStyle = c;
    for (let i = 0; i < 9; i++) ell(g, -0.75 + i * 0.18, -0.26 - (i % 3) * 0.04, 0.16, 0.12);
    g.fillStyle = shade(c, 0.15); ell(g, 0.45, -0.32, 0.13, 0.11);
    g.strokeStyle = '#141414'; line(g, 0.45, -0.38, 1.1, -0.36, 0.035);
    g.fillStyle = '#141414'; ell(g, 0.48, -0.44, 0.1, 0.03);
  },
};

function silhouette(g, e, noShoot) {
  const [c, d] = e.sp.colors;
  const pop = e.popup ?? 1;
  g.strokeStyle = '#2f2b24'; g.lineCap = 'butt';
  line(g, -0.25, 0, -0.18, -0.55, 0.04); line(g, 0.25, 0, 0.18, -0.55, 0.04);
  g.save(); g.translate(0, -0.55); g.scale(1, pop);
  g.fillStyle = c;
  poly(g, [-0.3, 0, 0.3, 0, 0.27, -0.75, 0.13, -0.86, -0.13, -0.86, -0.27, -0.75]);
  circ(g, 0, -1.0, 0.13);
  if (noShoot) {
    g.strokeStyle = c; g.lineCap = 'round';
    line(g, -0.22, -0.78, -0.36, -1.22, 0.08); line(g, 0.22, -0.78, 0.36, -1.22, 0.08);
    g.strokeStyle = d; g.lineWidth = 0.035; g.beginPath(); g.arc(0, -1.0, 0.13, 0, TAU); g.stroke();
    poly(g, [-0.3, 0, 0.3, 0, 0.27, -0.75, 0.13, -0.86, -0.13, -0.86, -0.27, -0.75], false);
  } else {
    g.strokeStyle = d; g.lineWidth = 0.02;
    g.beginPath(); g.ellipse(0, -0.68, 0.11, 0.15, 0, 0, TAU); g.stroke();
    g.beginPath(); g.ellipse(0, -0.55, 0.2, 0.3, 0, 0, TAU); g.stroke();
  }
  g.restore();
}
