// Gun state (ammo, cycling, reloading, zoom, turrets) and gun drawing:
// the first-person view model, iron/bead/red-dot sight pictures and scopes
// with true-mil reticles.

import { W, H, MIL } from './view.js';
import { getImage } from '../engine/assets.js';
import { weaponPath, weaponProfilePath } from '../data/art.js';
import * as audio from '../engine/audio.js';

export class Gun {
  constructor(def, { noScopes = false } = {}) {
    this.def = def;
    this.optic = noScopes && def.optic.type !== 'bead' ? { type: 'iron', zoom: [1.25, 1.25] } : def.optic;
    this.ammo = def.mag;
    this.cycleT = 0;
    this.reloading = false;
    this.reloadT = 0;
    this.zoom = this.optic.zoom[0];
    this.elev = 0; // mils dialled up
    this.windage = 0; // mils dialled right
    this.anim = { kick: 0, cycle: 0, reload: 0, flash: 0 };
  }
  get scoped() { return this.optic.type === 'scope'; }
  get isShotgun() { return this.def.cls === 'shotgun'; }
  ready() { return !this.reloading && this.cycleT <= 0 && this.ammo > 0; }

  update(dt) {
    if (this.cycleT > 0) this.cycleT -= dt;
    const a = this.anim;
    a.kick = Math.max(0, a.kick - dt * 5);
    a.flash = Math.max(0, a.flash - dt * 12);
    a.cycle = this.cycleT > 0 && this.def.cycle > 0.4 ? Math.sin(Math.PI * (1 - this.cycleT / this.def.cycle)) : 0;
    if (this.reloading) {
      this.reloadT -= dt;
      a.reload = Math.min(1, a.reload + dt * 5);
      if (this.reloadT <= 0) {
        if (this.def.reloadMode === 'single') {
          this.ammo++;
          audio.sfx('shell');
          if (this.ammo < this.def.mag) this.reloadT = this.def.reload;
          else this.finishReload();
        } else {
          this.ammo = this.def.mag;
          audio.sfx(this.def.action === 'Over/under' ? 'break' : 'magin');
          this.finishReload();
        }
      }
    } else a.reload = Math.max(0, a.reload - dt * 5);
  }

  finishReload() {
    this.reloading = false;
    if (['Pump'].includes(this.def.action)) audio.sfx('pump');
    else if (this.def.action === 'Bolt') audio.sfx('bolt');
  }

  startReload() {
    if (this.reloading || this.ammo >= this.def.mag) return false;
    this.reloading = true;
    this.reloadT = this.def.reload;
    if (this.def.reloadMode === 'mag') {
      audio.sfx(this.def.action === 'Over/under' ? 'break' : 'magout');
      if (this.def.reloadMode === 'mag' && this.def.mag > 1) this.ammo = 0;
    }
    return true;
  }

  // a shell-by-shell reload can be interrupted by firing
  interruptReload() {
    if (this.reloading && this.def.reloadMode === 'single' && this.ammo > 0) { this.reloading = false; return true; }
    return false;
  }

  fire() {
    this.ammo--;
    this.cycleT = this.def.cycle;
    this.anim.kick = 1;
    this.anim.flash = 1;
    audio.shot(this.def.sound);
    const act = this.def.action;
    if (this.ammo > 0 || act === 'Pump') {
      if (act === 'Pump') audio.sfx('pump', 0.2);
      else if (act === 'Bolt') audio.sfx('bolt', 0.3);
      else if (act === 'Lever') audio.sfx('lever', 0.22);
    }
  }

  zoomStep(dir) {
    const [a, b] = this.optic.zoom;
    if (a === b) return;
    const steps = [a];
    let z = a;
    while (z < b) { z = Math.min(b, z < 4 ? z + 1 : z < 10 ? z + 2 : z + 4); steps.push(+z.toFixed(1)); }
    let i = steps.findIndex((s) => s >= this.zoom - 0.01);
    i = Math.max(0, Math.min(steps.length - 1, i - dir));
    if (steps[i] !== this.zoom) { this.zoom = steps[i]; audio.sfx('zoom'); }
  }
}

// ── view model ─────────────────────────────────────────────
const MODELS = {
  shotgun: { stock: '#6b3f22', metal: '#1d1f22', len: 1.0, barrel: 0.5, pump: true },
  overunder: { stock: '#7a4426', metal: '#2b2d31', len: 0.95, barrel: 0.5, double: true },
  semishotgun: { stock: '#2a2b2c', metal: '#151618', len: 1.0, barrel: 0.48, camo: true },
  rimfire: { stock: '#5d3a22', metal: '#1c1d20', len: 0.8, barrel: 0.35, scope: 0.6 },
  revolver: { stock: '#3a2618', metal: '#9ea3a8', len: 0.45, barrel: 0.3, pistol: true },
  lever: { stock: '#7a4a28', metal: '#1e1f22', len: 0.9, barrel: 0.42, lever: true },
  bolt: { stock: '#5b3a22', metal: '#1b1c1f', len: 1.0, barrel: 0.45, scope: 0.75, bolt: true },
  semirifle: { stock: '#5e3b23', metal: '#1b1c1f', len: 0.98, barrel: 0.42, scope: 0.7 },
  single: { stock: '#6e4426', metal: '#1b1c1f', len: 0.95, barrel: 0.48, scope: 0.6 },
  ar: { stock: '#1d1e20', metal: '#24262a', len: 0.85, barrel: 0.32, rail: true, mag: 'straight', dot: true },
  ak: { stock: '#7a4423', metal: '#1f2023', len: 0.88, barrel: 0.34, mag: 'curved' },
  sniper: { stock: '#a08c62', metal: '#222327', len: 1.1, barrel: 0.5, scope: 0.95, brake: true },
  fifty: { stock: '#26272a', metal: '#1a1b1e', len: 1.25, barrel: 0.6, scope: 0.85, brake: true, big: true },
};

export function drawViewmodel(g, gun, aimX, aimY, t, moving) {
  const a = gun.anim;
  const img = getImage(weaponPath(gun.def.id));
  const lower = a.reload * 160 + a.cycle * 40;
  const kickBack = a.kick * a.kick * 60 * (0.4 + gun.def.recoil);
  const sway = Math.sin(t * 1.6) * 4;
  if (img) {
    // first-person photo: hands and gun, anchored in the bottom-right corner
    const h = H * 0.47;
    const w = h * (img.width / img.height);
    const x0 = W - w * 0.86 + (aimX - W / 2) * 0.05 + kickBack * 0.4;
    const y0 = H - h * 0.93 + lower + kickBack * 0.5 + sway + (aimY - H / 2) * 0.04;
    g.save();
    g.translate(x0, y0);
    g.rotate(-a.kick * 0.04 * (1 + gun.def.recoil) + a.reload * 0.25);
    g.drawImage(img, 0, 0, w, h);
    g.restore();
    if (a.flash > 0.3) muzzleFlash(g, x0 + w * 0.05, y0 + h * 0.06, 60 * a.flash * (gun.def.power / 5 + 0.5));
    return;
  }
  const profile = getImage(weaponProfilePath(gun.def.id));
  if (profile) { drawProfileViewmodel(g, gun, profile, aimX, aimY, kickBack, lower, sway); return; }
  const m = MODELS[gun.def.model] || MODELS.bolt;
  const ox = W * 0.76 + (aimX - W / 2) * 0.08 + kickBack * 0.6;
  const oy = H + 60 + lower + kickBack * 0.4 + sway + (aimY - H / 2) * 0.05;
  const tx = W * 0.58 + (aimX - W / 2) * 0.3, ty = H * 0.7 + (aimY - H / 2) * 0.22;
  const ang = Math.atan2(ty - oy, tx - ox) - a.kick * 0.06 * (1 + gun.def.recoil) + a.reload * 0.35;
  const L = (m.pistol ? 380 : 560) * Math.min(1.1, m.len);
  g.save();
  g.translate(ox, oy); g.rotate(ang);
  const thick = (x) => (m.big ? 1.35 : 1) * (1 - (x / L) * 0.55); // perspective taper
  const seg = (x0, x1, h0, col) => {
    const t0 = thick(x0), t1 = thick(x1);
    const gr = g.createLinearGradient(0, -h0 * t0, 0, h0 * t0);
    gr.addColorStop(0, shadeHex(col, 0.25)); gr.addColorStop(0.5, col); gr.addColorStop(1, shadeHex(col, -0.45));
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(x0, -h0 * t0); g.lineTo(x1, -h0 * t1); g.lineTo(x1, h0 * t1); g.lineTo(x0, h0 * t0); g.closePath(); g.fill();
  };
  if (m.pistol) {
    seg(-40, 120, 30, m.stock);
    seg(90, 200, 36, m.metal);
    seg(200, L, 16, m.metal);
    g.fillStyle = shadeHex(m.metal, -0.2); g.beginPath(); g.arc(150, 0, 34 * thick(150), 0, Math.PI * 2); g.fill();
    glove(g, 40, 30, 1.2); glove(g, 90, 46, 1.05);
  } else {
    const rcv0 = L * 0.34, rcv1 = L * 0.56;
    seg(-60, rcv0, 46, m.stock); // stock
    if (m.camo) { g.fillStyle = 'rgba(90,80,60,0.35)'; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(i * 40, (i % 3 - 1) * 12, 18, 8, i, 0, 6.3); g.fill(); } }
    seg(rcv0, rcv1, 34, m.metal); // receiver
    seg(rcv1, L * (1 - m.barrel * 0.2), m.double ? 22 : 14, m.metal); // barrel
    if (m.double) { g.strokeStyle = shadeHex(m.metal, -0.5); g.lineWidth = 2; g.beginPath(); g.moveTo(rcv1, 0); g.lineTo(L * (1 - m.barrel * 0.2), 0); g.stroke(); }
    if (m.pump) seg(L * 0.6, L * 0.78, 24, m.stock);
    else if (!m.rail && !m.pistol) seg(rcv1, L * 0.78, 26, m.stock); // fore-end
    if (m.rail) { seg(rcv0 - 10, L * 0.8, 30, m.metal); g.fillStyle = '#0d0e10'; for (let x = rcv0; x < L * 0.78; x += 16) g.fillRect(x, -30 * thick(x), 6, 6); }
    if (m.mag === 'straight') { g.fillStyle = '#16171a'; g.beginPath(); g.moveTo(rcv0 + 20, 20); g.lineTo(rcv0 + 80, 20); g.lineTo(rcv0 + 70, 110); g.lineTo(rcv0 + 14, 104); g.closePath(); g.fill(); }
    if (m.mag === 'curved') { g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(rcv0 + 20, 20); g.lineTo(rcv0 + 80, 20); g.quadraticCurveTo(rcv0 + 110, 80, rcv0 + 120, 130); g.lineTo(rcv0 + 70, 136); g.quadraticCurveTo(rcv0 + 50, 80, rcv0 + 20, 20); g.fill(); }
    if (m.lever) { g.strokeStyle = m.metal; g.lineWidth = 7; g.beginPath(); g.ellipse(rcv0 + 10, 40 + a.cycle * 30, 40, 22, 0, 0, Math.PI * 2); g.stroke(); }
    if (m.scope) {
      const s0 = rcv0 - 20, s1 = rcv0 + L * 0.3 * m.scope + 60;
      g.save(); g.translate(0, -62 * thick(s0));
      seg(s0, s1, 20, '#141517');
      seg(s0 - 30, s0 + 10, 26, '#141517'); seg(s1 - 20, s1 + 20, 28, '#141517');
      g.fillStyle = '#26282c'; g.fillRect((s0 + s1) / 2 - 12, -40, 24, 22);
      g.restore();
    }
    if (m.dot) { g.fillStyle = '#121315'; g.fillRect(rcv0 + 10, -70 * thick(rcv0), 60, 34); }
    if (m.bolt) { g.fillStyle = '#9a9ea3'; g.beginPath(); g.arc(rcv0 + 30 + a.cycle * 25, 36 + a.cycle * -40, 10, 0, Math.PI * 2); g.fill(); }
    if (m.brake) seg(L * (1 - m.barrel * 0.2), L * (1 - m.barrel * 0.2) + 40, 20, '#1a1a1c');
    glove(g, rcv0 - 40, 34, 1.25);
    glove(g, L * 0.66, 30, 1.0);
  }
  g.restore();
  if (a.flash > 0.3) {
    const mx = ox + Math.cos(ang) * L * 1.02, my = oy + Math.sin(ang) * L * 1.02;
    muzzleFlash(g, mx, my, 50 * a.flash * (gun.def.power / 5 + 0.5));
  }
}

// Side-profile photo used as the in-hand gun when no first-person photo exists:
// mirrored so the muzzle points into the scene, stock running off the
// bottom-right corner, angled toward the aim point.
function drawProfileViewmodel(g, gun, img, aimX, aimY, kickBack, lower, sway) {
  const a = gun.anim;
  const pistol = gun.def.model === 'revolver';
  const len = W * (pistol ? 0.34 : 0.6) * (pistol ? 1 : Math.min(1.15, (MODELS[gun.def.model] || MODELS.bolt).len));
  const s = len / img.width;
  const w = img.width * s, h = img.height * s;
  const ox = W * (pistol ? 0.86 : 1.03) + kickBack * 0.8;
  const oy = H * (pistol ? 0.9 : 0.95) + lower + kickBack * 0.3 + sway;
  const tx = W * 0.5 + (aimX - W / 2) * 0.35, ty = H * 0.58 + (aimY - H / 2) * 0.3;
  const ang = Math.atan2(ty - oy, tx - ox) - Math.PI - a.kick * 0.05 * (1 + gun.def.recoil) - a.reload * 0.3;
  g.save();
  g.translate(ox, oy);
  g.rotate(ang);
  g.scale(-1, 1);
  g.shadowColor = 'rgba(0,0,0,0.3)'; g.shadowBlur = 6; g.shadowOffsetY = 3;
  g.drawImage(img, 0, -h * 0.55, w, h);
  g.restore();
  if (a.flash > 0.3) {
    const mx = ox + Math.cos(ang + Math.PI) * w * 0.99 + Math.sin(ang) * h * 0.25;
    const my = oy + Math.sin(ang + Math.PI) * w * 0.99 - Math.cos(ang) * h * 0.25;
    muzzleFlash(g, mx, my, 50 * a.flash * (gun.def.power / 5 + 0.5));
  }
}

function glove(g, x, y, s) {
  const gr = g.createRadialGradient(x - 10, y - 10, 4, x, y, 48 * s);
  gr.addColorStop(0, '#4a4438'); gr.addColorStop(1, '#1d1b17');
  g.fillStyle = gr;
  g.beginPath(); g.ellipse(x, y, 52 * s, 34 * s, 0.2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2;
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(x - 20 * s + i * 16 * s, y - 26 * s); g.lineTo(x - 18 * s + i * 16 * s, y + 4 * s); g.stroke(); }
}

function muzzleFlash(g, x, y, r) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, 'rgba(255,255,230,0.95)'); gr.addColorStop(0.3, 'rgba(255,200,90,0.8)'); gr.addColorStop(1, 'rgba(255,120,30,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
}

function shadeHex(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
  if (f < 0) { r *= 1 + f; gg *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; gg += (255 - gg) * f; b += (255 - b) * f; }
  return `rgb(${r | 0},${gg | 0},${b | 0})`;
}

// ── hip-fire crosshair ─────────────────────────────────────
export function drawCrosshair(g, x, y, gun, color = '#ffffff') {
  g.save();
  g.strokeStyle = color; g.lineWidth = 2; g.globalAlpha = 0.9;
  const gap = 8, len = 12;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    g.beginPath(); g.moveTo(x + dx * gap, y + dy * gap); g.lineTo(x + dx * (gap + len), y + dy * (gap + len)); g.stroke();
  }
  if (gun.isShotgun) {
    g.globalAlpha = 0.35; g.beginPath(); g.arc(x, y, gun.def.spread * 2318, 0, Math.PI * 2); g.stroke();
  }
  g.fillStyle = color; g.globalAlpha = 1; g.fillRect(x - 1, y - 1, 2, 2);
  g.restore();
}

// ── ADS sight pictures (non-magnified) ─────────────────────
export function drawSightPicture(g, gun, t, reticleColor) {
  const cx = W / 2, cy = H / 2;
  const type = gun.optic.type;
  const m = MODELS[gun.def.model] || MODELS.bolt;
  g.save();
  // receiver/rib seen from behind
  const bodyCol = m.metal;
  const k = gun.anim.kick * 40;
  g.translate(0, k);
  g.fillStyle = shadeHex(m.stock, -0.2);
  g.beginPath(); g.moveTo(cx - 180, H); g.lineTo(cx - 46, cy + 150); g.lineTo(cx + 46, cy + 150); g.lineTo(cx + 180, H); g.closePath(); g.fill();
  g.fillStyle = bodyCol;
  g.beginPath(); g.moveTo(cx - 60, H); g.lineTo(cx - 12, cy + 14); g.lineTo(cx + 12, cy + 14); g.lineTo(cx + 60, H); g.closePath(); g.fill();
  if (type === 'bead') {
    g.fillStyle = '#d8b25a'; g.beginPath(); g.arc(cx, cy + 4, 5, 0, Math.PI * 2); g.fill();
  } else if (type === 'iron') {
    g.fillStyle = '#0c0c0d';
    g.fillRect(cx - 4, cy, 8, 36); // front post
    g.fillRect(cx - 90, cy + 70, 76, 44); g.fillRect(cx + 14, cy + 70, 76, 44); // rear notch
    g.fillRect(cx - 14, cy + 98, 28, 16);
  } else if (type === 'reddot') {
    g.strokeStyle = '#121314'; g.lineWidth = 26;
    g.beginPath(); g.arc(cx, cy, 120, 0, Math.PI * 2); g.stroke();
    g.fillStyle = 'rgba(80,120,160,0.08)'; g.beginPath(); g.arc(cx, cy, 110, 0, Math.PI * 2); g.fill();
    const gl = g.createRadialGradient(cx, cy, 0, cx, cy, 9);
    gl.addColorStop(0, 'rgba(255,60,40,1)'); gl.addColorStop(1, 'rgba(255,40,30,0)');
    g.fillStyle = gl; g.beginPath(); g.arc(cx, cy, 9, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}

// ── magnified scope ─────────────────────────────────────────
export function scopeRadius() { return H * 0.47; }

export function drawScopeOverlay(g, gun, shadowX, shadowY, reticleColor) {
  const cx = W / 2, cy = H / 2, R = scopeRadius();
  g.save();
  // eyebox shadow + tube
  g.fillStyle = '#000';
  g.beginPath(); g.rect(0, 0, W, H); g.arc(cx + shadowX, cy + shadowY, R, 0, Math.PI * 2, true); g.fill('evenodd');
  const vg = g.createRadialGradient(cx + shadowX, cy + shadowY, R * 0.82, cx + shadowX, cy + shadowY, R);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.85)');
  g.fillStyle = vg; g.beginPath(); g.arc(cx + shadowX, cy + shadowY, R, 0, Math.PI * 2); g.fill();
  // reticle (first focal plane: 1 mil = MIL × zoom px)
  const mil = MIL * gun.zoom;
  const col = reticleColor || '#111';
  g.strokeStyle = col; g.fillStyle = col;
  const ret = gun.optic.reticle || 'duplex';
  const thin = 1.6, thick = 7;
  const lineH = (x1, x2, y, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke(); };
  const lineV = (y1, y2, x, w) => { g.lineWidth = w; g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y2); g.stroke(); };
  if (ret === 'lpvo') {
    g.strokeStyle = 'rgba(255,50,40,0.95)'; g.lineWidth = 2.5;
    g.beginPath(); g.arc(cx, cy, 6.5 * mil, Math.PI * 0.1, Math.PI * 0.9, true); g.stroke();
    g.fillStyle = 'rgba(255,50,40,1)'; g.beginPath(); g.arc(cx, cy, 3, 0, Math.PI * 2); g.fill();
    g.strokeStyle = col; lineH(cx - R, cx - 8 * mil, cy, thick); lineH(cx + 8 * mil, cx + R, cy, thick); lineV(cy + 8 * mil, cy + R, cx, thick);
    for (const h of [2, 4, 6]) lineH(cx - 1.2 * mil, cx + 1.2 * mil, cy + h * mil, thin);
  } else {
    const postGap = ret === 'mildot' ? 10 * mil : Math.min(R * 0.45, 9 * mil);
    lineH(cx - R, cx - postGap, cy, thick); lineH(cx + postGap, cx + R, cy, thick);
    lineV(cy + postGap, cy + R, cx, thick); lineV(cy - R, cy - postGap, cx, thick);
    lineH(cx - postGap, cx + postGap, cy, thin); lineV(cy - postGap, cy + postGap, cx, thin);
    if (ret === 'mildot') {
      for (let i = -10; i <= 10; i++) {
        if (!i) continue;
        g.beginPath(); g.ellipse(cx + i * mil, cy, Math.max(1.5, mil * 0.11), Math.max(1.5, mil * 0.11), 0, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.ellipse(cx, cy + i * mil, Math.max(1.5, mil * 0.11), Math.max(1.5, mil * 0.11), 0, 0, Math.PI * 2); g.fill();
      }
    } else if (ret === 'bdc') {
      for (const h of [1.2, 2.6, 4.2, 6.0]) { g.lineWidth = thin; g.beginPath(); g.arc(cx, cy + h * mil, Math.max(3, mil * 0.3), 0, Math.PI * 2); g.stroke(); lineH(cx - h * mil * 0.25 - 4, cx + h * mil * 0.25 + 4, cy + h * mil, thin); }
    }
  }
  g.restore();
}
