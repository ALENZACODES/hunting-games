// Targets: spawning, movement behaviours and hit geometry.
//
// Positions are in metres: x (lateral, right +), alt (height above the
// camera's ground plane), d (distance ahead). The session object `S` gives
// access to the view, the player and spawn/damage helpers.

import { SPECIES } from '../data/species.js';
import { project, xForScreen, altForScreen, W, rand, clamp, pick } from './view.js';
import { OFFICER_BASES, CIVILIANS_PER_CITY } from '../data/art.js';

let nextId = 1;

export function createEntity(S, spId, def = {}) {
  const base = SPECIES[spId];
  let sp = def.as ? { ...base, ...def.as, colors: base.colors } : base;
  // later levels: targets move faster and leave sooner
  const dm = S.diff || 1;
  if (dm !== 1 && !sp.boss && sp.behavior !== 'static') {
    sp = { ...sp, speed: sp.speed ? sp.speed * (1 + (dm - 1) * 0.6) : sp.speed, walk: sp.walk ? sp.walk * (1 + (dm - 1) * 0.4) : sp.walk, escape: sp.escape < 900 ? sp.escape / dm : sp.escape };
  }
  const lane = def.lane || sp.lane;
  const e = {
    id: nextId++, spId, sp, lane,
    state: 'alive', result: null, age: 0, hp: sp.hp, phase: Math.random() * 6,
    alpha: 1, facing: Math.random() < 0.5 ? 1 : -1, flash: 0, counts: sp.counts !== false,
    mode: '', timer: 0, x: 0, alt: 0, d: rand(lane.d[0], lane.d[1]), vx: 0, valt: 0, vd: 0,
    alt0: lane.alt ? rand(lane.alt[0], lane.alt[1]) : 0, popup: 1, deathT: 0, wounded: false,
  };
  // Animals walk on the ground in the scene photo. Lanes written for the old
  // drawn hillsides lifted deer and elk up to 28 m, which floats them in the sky.
  if (sp.family === 'quad' && sp.anchor === 'bottom') e.alt0 = Math.min(e.alt0, 1.2);
  // City Hunt per-entity art sets
  if (def.clan) { e.artBase = `city/${def.clan}/hunter`; e.artKind = 'hunter'; }
  if (spId === 'civilian' && def.city) { e.artBase = `city/${def.city}/civilian_${1 + ((Math.random() * CIVILIANS_PER_CITY) | 0)}`; e.artKind = 'civilian'; }
  if (spId === 'officer') { e.artBase = pick(OFFICER_BASES); e.artKind = 'officer'; }
  if (spId === 'vyrr_alpha' && def.city) { e.artBase = `city/${def.city}/alpha`; e.artKind = 'alpha'; }
  if (def.d != null) e.d = def.d;
  if (def.alt != null) e.alt0 = def.alt;
  e.alt = e.alt0;
  (INIT[sp.behavior] || INIT.static)(e, S, def);
  if (def.x != null) e.x = def.x;
  return e;
}

const sxToX = (S, e, sx) => xForScreen(S.view, sx, e.d);
const screen = (S, e) => project(S.view, e.x, e.alt, e.d);
const onScreenX = (sx, m = 0) => sx > -m && sx < W + m;

function enterFromSide(S, e, margin = 90) {
  e.x = sxToX(S, e, e.facing > 0 ? -margin : W + margin);
}

const INIT = {
  flush(e, S) {
    const sx = rand(300, W - 300);
    const sy = (S.biome.fgTop ? S.biome.fgTop * 1080 : S.view.horizonY + 120) + 40;
    e.x = sxToX(S, e, sx);
    e.alt = altForScreen(S.view, sy, e.d);
    e.mode = 'flush'; e.timer = 0.55;
    e.valt = e.sp.low ? rand(2.5, 3.5) : rand(3.5, 5);
    e.vx = e.facing * e.sp.speed * rand(0.35, 0.7);
    e.vd = rand(-0.5, 1.5);
    S.sound('flush');
  },
  cross(e, S) {
    enterFromSide(S, e, 140);
    const sy = e.sp.high ? rand(90, 230) : rand(140, Math.max(200, S.view.horizonY - 80));
    e.alt = altForScreen(S.view, sy, e.d);
    e.baseAlt = e.alt;
    e.vx = e.facing * e.sp.speed * rand(0.85, 1.15);
    e.mode = 'fly';
  },
  graze(e, S) {
    e.x = sxToX(S, e, rand(220, W - 220));
    e.alpha = 0; e.mode = 'walk'; e.timer = rand(2, 5);
    e.vx = e.facing * (e.sp.walk || 1);
  },
  run(e, S) {
    enterFromSide(S, e);
    e.mode = 'run'; e.timer = rand(1.5, 3);
    e.vx = e.facing * e.sp.speed * rand(0.75, 1);
  },
  hop(e, S) {
    enterFromSide(S, e, 60);
    e.mode = 'run'; e.timer = rand(0.4, 0.9);
    e.vx = e.facing * e.sp.speed;
  },
  charge(e, S) {
    e.x = sxToX(S, e, rand(200, W - 200));
    e.alpha = 0; e.mode = 'charge';
    e.vd = -e.sp.speed * rand(0.8, 1.1);
    S.sound('alien');
  },
  advance(e, S) {
    e.x = sxToX(S, e, e.sp.boss ? W / 2 : rand(300, W - 300));
    e.alpha = 0; e.mode = 'advance';
    e.vd = -e.sp.speed;
  },
  blink(e, S) {
    placeHover(S, e);
    e.alpha = 0; e.mode = 'in'; e.timer = 0.3;
  },
  stalk(e, S) {
    e.x = sxToX(S, e, rand(220, W - 220));
    e.alpha = 0; e.mode = 'walk'; e.cloak = false; e.cloakT = rand(2, 3);
    e.vx = e.facing * e.sp.walk;
  },
  drop(e, S) {
    e.x = sxToX(S, e, rand(200, W - 200));
    e.alt = altForScreen(S.view, -80, e.d);
    e.valt = -e.sp.speed; e.vx = rand(-1, 1); e.mode = 'fall';
  },
  drone(e, S) {
    placeHover(S, e);
    e.alpha = 0; e.mode = 'hover'; e.timer = rand(2, 4.5);
  },
  popup(e, S) {
    e.x = sxToX(S, e, rand(150, W - 150));
    e.popup = 0; e.mode = 'rise'; e.timer = 0.18;
    e.upTime = e.sp.escape * rand(0.8, 1.25) * (S.difficulty || 1);
  },
  mover(e, S) {
    enterFromSide(S, e, 60);
    e.vx = e.facing * e.sp.speed * rand(0.7, 1.3);
    e.mode = 'move';
  },
  static(e, S, def) {
    e.x = def.sx != null ? sxToX(S, e, def.sx * W) : sxToX(S, e, rand(200, W - 200));
    e.mode = 'idle'; e.facing = 1;
  },
  drive(e, S) {
    enterFromSide(S, e, 200);
    e.vx = e.facing * e.sp.speed * rand(0.8, 1.15);
    e.mode = 'drive';
  },
  hunter(e, S) {
    e.alt = perchAlt(e);
    e.x = sxToX(S, e, perchScreenX(e.alt));
    e.alpha = 0; e.mode = 'perch'; e.timer = rand(2.2, 3.8);
    if (e.sp.isAlpha) { e.d = e.lane.d[1] - 15; e.x = sxToX(S, e, W / 2); e.alt = 0; e.nextRoar = 0.75; }
  },
  projectile(e, S, def) {
    const from = def.from;
    e.x = from.x + from.facing * 0.3; e.d = Math.max(3, from.d - 0.5);
    e.alt = from.alt + (from.sp.anchor === 'bottom' ? from.sp.body.y * 1.5 : 0);
    const T = Math.max(0.55, e.d / (def.speed || 40));
    const tx = S.view.camX + rand(-0.5, 0.5) + (def.spread || 0), talt = 1.45 + rand(-0.15, 0.15), td = 1.2;
    e.vx = (tx - e.x) / T; e.valt = (talt - e.alt) / T; e.vd = (td - e.d) / T;
    e.dmg = def.dmg || 10; e.facing = e.vx >= 0 ? 1 : -1;
    e.mode = 'fly';
  },
  sniper(e, S) {
    e.x = sxToX(S, e, rand(200, W - 200));
    e.alpha = 0; e.mode = 'hide';
    e.fireT = rand(8, 12); e.glintT = rand(0.8, 2);
  },
};

// High perches sit toward the sides of the view, where the scene has walls,
// facades, trees or cables to cling to; ground positions can be anywhere.
function perchScreenX(alt) {
  if (alt <= 1.5) return rand(220, W - 220);
  return Math.random() < 0.5 ? rand(90, W * 0.22) : rand(W * 0.78, W - 90);
}

function perchAlt(e) {
  const a = e.lane.alt;
  if (!a || a[1] < 1.5 || Math.random() < 0.55) return 0;
  return rand(Math.max(2, a[0]), a[1]);
}

function placeHover(S, e) {
  e.x = sxToX(S, e, rand(220, W - 220));
  e.alt = altForScreen(S.view, rand(130, S.view.horizonY - 60), e.d);
}

// ── per-frame behaviour ───────────────────────────────────────

const UPDATE = {
  flush(e, dt, S) {
    const sp = e.sp;
    e.phase += dt * (sp.erratic ? 13 : sp.len > 0.9 ? 6 : 10) * Math.PI;
    e.timer -= dt;
    if (e.mode === 'flush' && e.timer <= 0) { e.mode = 'fly'; e.timer = 0; }
    if (e.mode === 'fly' && e.timer <= 0) {
      e.timer = sp.erratic ? rand(0.3, 0.7) : rand(0.6, 1.4);
      e.vx = (Math.random() < 0.5 ? -1 : 1) * sp.speed * rand(0.55, 1);
      e.valt = rand(-0.5, 1) * sp.speed * 0.55;
      e.vd = rand(-1.5, 2);
    }
    if (e.mode === 'fly' && e.age > sp.escape) { e.mode = 'escape'; e.valt = sp.speed * 1.3; }
    move(e, dt);
    const p = screen(S, e);
    if (e.mode !== 'escape') {
      if ((p.sx < 90 && e.vx < 0) || (p.sx > W - 90 && e.vx > 0)) e.vx = -e.vx;
      const floor = sp.low ? (S.biome.fgTop || 0.7) * 1080 - 30 : S.view.horizonY - 25;
      if (e.mode === 'fly') {
        if (p.sy < 70 && e.valt > 0) e.valt = -Math.abs(e.valt) - 0.5;
        if (p.sy > floor && e.valt < 0) e.valt = Math.abs(e.valt) + 0.5;
      }
      e.d = clamp(e.d, e.lane.d[0] * 0.8, e.lane.d[1] * 1.5);
    } else if (p.sy < -120 || !onScreenX(p.sx, 160)) escape(e, S);
    if (e.vx) e.facing = Math.sign(e.vx);
  },
  cross(e, dt, S) {
    e.phase += dt * (e.sp.draw === 'eagle' ? 2 : 5) * Math.PI;
    if (e.sp.swoop) e.valt = Math.sin(e.age * 1.4) * 2.5;
    else e.valt = Math.sin(e.age * 0.9) * 0.4;
    move(e, dt);
    const p = screen(S, e);
    if (e.age > 1 && !onScreenX(p.sx, 160)) escape(e, S);
  },
  graze(e, dt, S) {
    const sp = e.sp;
    fadeIn(e, dt, 1.2);
    const p = screen(S, e);
    e.timer -= dt;
    switch (e.mode) {
      case 'walk':
        e.phase += dt * 4 * (sp.walk || 1);
        if ((p.sx < 80 && e.vx < 0) || (p.sx > W - 80 && e.vx > 0)) { e.facing *= -1; e.vx = -e.vx; }
        if (e.timer <= 0) { e.mode = Math.random() < 0.55 ? 'graze' : 'look'; e.timer = rand(1.5, 3.5); e.vx = 0; }
        break;
      case 'graze': case 'look':
        if (e.timer <= 0) {
          if (Math.random() < 0.3) e.facing *= -1;
          e.mode = 'walk'; e.timer = rand(2, 5); e.vx = e.facing * (sp.walk || 1);
        }
        break;
      case 'alert':
        e.vx = 0;
        if (e.timer <= 0) startFlee(e);
        break;
      case 'flee':
        e.phase += dt * 9;
        if (!onScreenX(p.sx, 120)) escape(e, S);
        break;
      case 'charge':
        e.phase += dt * 9;
        e.vx = -(e.x - S.view.camX) * 0.6;
        if (e.d < 7) { S.damage(sp.damage || 20, e); escape(e, S); }
        break;
      default: break;
    }
    if (e.age > sp.escape && (e.mode === 'walk' || e.mode === 'graze' || e.mode === 'look')) startFlee(e);
    move(e, dt);
  },
  run(e, dt, S) {
    const sp = e.sp;
    const p = screen(S, e);
    e.timer -= dt;
    if (e.mode === 'run') {
      e.phase += dt * 9;
      if (e.timer <= 0 && onScreenX(p.sx, -200) && Math.random() < 0.5) { e.mode = 'stop'; e.timer = rand(0.7, 1.5); e.vx = 0; }
      else if (e.timer <= 0) e.timer = rand(1.5, 3);
    } else if (e.mode === 'stop') {
      if (e.timer <= 0) { e.mode = 'run'; e.timer = rand(1.5, 3); e.vx = e.facing * sp.speed * rand(0.75, 1); }
    } else if (e.mode === 'charge') {
      e.phase += dt * 10;
      e.vx = -(e.x - S.view.camX) * 0.6;
      if (e.d < 7) { S.damage(sp.damage || 20, e); escape(e, S); }
    } else if (e.mode === 'alert' && e.timer <= 0) { e.mode = 'run'; e.vx = e.facing * sp.speed; }
    if (e.mode !== 'charge' && e.age > 1 && !onScreenX(p.sx, 140)) escape(e, S);
    if (e.age > sp.escape && e.mode === 'stop') { e.mode = 'run'; e.vx = e.facing * sp.speed; }
    move(e, dt);
  },
  hop(e, dt, S) {
    const p = screen(S, e);
    e.timer -= dt;
    if (e.mode === 'run') {
      e.phase += dt * 12;
      if (e.timer <= 0) { e.mode = 'pause'; e.timer = rand(0.25, 0.7); e.vx = 0; e.vd = 0; }
    } else if (e.timer <= 0) {
      e.mode = 'run'; e.timer = rand(0.4, 0.9);
      if (Math.random() < 0.25 && e.age > 1.5) e.facing *= -1;
      e.vx = e.facing * e.sp.speed * rand(0.7, 1.1); e.vd = rand(-2, 2);
    }
    e.d = clamp(e.d, e.lane.d[0], e.lane.d[1] * 1.3);
    if (e.age > e.sp.escape && e.mode === 'pause') { e.mode = 'run'; e.timer = 9; e.vx = e.facing * e.sp.speed; }
    if (e.age > 1 && !onScreenX(p.sx, 100)) escape(e, S);
    move(e, dt);
  },
  charge(e, dt, S) {
    fadeIn(e, dt, 0.6);
    e.phase += dt * 14;
    e.vx = Math.sin(e.age * 2.6 + e.id) * e.sp.speed * 0.7 - (e.x - S.view.camX) * 0.05;
    move(e, dt);
    if (Math.random() < dt * 0.3) S.sound('alien');
    if (e.d < 6) { S.damage(e.sp.damage || 15, e); escape(e, S); }
  },
  advance(e, dt, S) {
    fadeIn(e, dt, 1.5);
    e.phase += dt * (e.sp.boss ? 1.2 : 3);
    move(e, dt);
    if (e.d < (e.sp.reach || 8)) { S.damage(e.sp.damage || 40, e); escape(e, S); }
  },
  blink(e, dt, S) {
    e.phase += dt * 3;
    e.timer -= dt;
    if (e.mode === 'in') { e.alpha = Math.min(1, e.alpha + dt / 0.3); if (e.timer <= 0) { e.mode = 'hover'; e.timer = rand(1.8, 3.2); } }
    else if (e.mode === 'hover') {
      e.vx = Math.sin(e.age * 0.9 + e.id) * e.sp.speed;
      e.valt = Math.cos(e.age * 1.3 + e.id) * e.sp.speed * 0.4;
      if (e.timer <= 0) { e.mode = 'out'; e.timer = 0.25; }
    } else if (e.mode === 'out') {
      e.alpha = Math.max(0, e.alpha - dt / 0.25);
      if (e.timer <= 0) {
        if (e.age > e.sp.escape) { escape(e, S); return; }
        e.d = rand(e.lane.d[0], e.lane.d[1]); placeHover(S, e); e.mode = 'in'; e.timer = 0.3; S.sound('alien');
      }
    }
    move(e, dt);
  },
  stalk(e, dt, S) {
    e.cloakT -= dt;
    if (e.cloakT <= 0) { e.cloak = !e.cloak; e.cloakT = e.cloak ? rand(1.8, 3) : rand(2, 3.2); }
    const target = e.cloak ? 0.07 : 1;
    e.alpha += (target - e.alpha) * Math.min(1, dt * 5);
    const p = screen(S, e);
    if (e.mode === 'walk') {
      e.phase += dt * 3;
      if ((p.sx < 100 && e.vx < 0) || (p.sx > W - 100 && e.vx > 0)) { e.facing *= -1; e.vx = -e.vx; }
      if (e.age > 12) { e.mode = 'charge'; S.sound('alien'); }
    } else if (e.mode === 'charge') {
      e.phase += dt * 8;
      e.vd = -e.sp.speed; e.vx = -(e.x - S.view.camX) * 0.3;
      if (e.d < 6) { S.damage(e.sp.damage || 25, e); escape(e, S); }
    }
    move(e, dt);
  },
  drop(e, dt, S) {
    e.phase += dt * 10;
    move(e, dt);
    if (Math.random() < 0.6) S.fx.trail(e);
    if (e.alt <= e.alt0 + 0.3) {
      S.sound('boom');
      S.fx.dust(e, 2.5);
      S.spawn('skitter', { d: e.d, alt: e.alt0, x: e.x, child: true });
      escape(e, S);
    }
  },
  drone(e, dt, S) {
    fadeIn(e, dt, 0.4);
    e.phase += dt * 40;
    e.timer -= dt;
    if (e.mode === 'hover') {
      e.vx = Math.sin(e.age * 1.7 + e.id) * e.sp.speed * 0.5;
      e.valt = Math.cos(e.age * 2.1 + e.id) * 1.2;
      e.vd = Math.sin(e.age * 0.8 + e.id) * 2;
      if (e.timer <= 0) { e.mode = 'dive'; S.sound('alien'); }
    } else {
      e.vd = -e.sp.speed;
      e.vx = -(e.x - S.view.camX) * 0.5 + Math.sin(e.age * 5) * 2;
      e.valt = (1.8 - e.alt) * 0.8;
      if (e.d < 5) { S.damage(e.sp.damage || 10, e); escape(e, S); }
    }
    move(e, dt);
  },
  popup(e, dt, S) {
    e.timer -= dt;
    if (e.mode === 'rise') { e.popup = Math.min(1, e.popup + dt / 0.18); if (e.timer <= 0) { e.mode = 'up'; e.timer = e.upTime; } }
    else if (e.mode === 'up') { if (e.timer <= 0) { e.mode = 'drop'; e.timer = 0.18; } }
    else if (e.mode === 'drop') { e.popup = Math.max(0, e.popup - dt / 0.18); if (e.timer <= 0) escape(e, S); }
  },
  mover(e, dt, S) {
    e.phase += dt * 2;
    move(e, dt);
    const p = screen(S, e);
    if (e.age > 1 && !onScreenX(p.sx, 80)) escape(e, S);
  },
  static() {},
  drive(e, dt, S) {
    e.phase += dt * 6;
    if (e.hp < e.sp.hp && Math.random() < dt * 8) S.fx.smoke(e);
    move(e, dt);
    const p = screen(S, e);
    if (e.age > 2 && !onScreenX(p.sx, 260)) escape(e, S);
  },
  hunter(e, dt, S) {
    const sp = e.sp;
    e.timer -= dt;
    if (e.firedT > 0) e.firedT -= dt;
    switch (e.mode) {
      case 'perch': {
        fadeIn(e, dt, sp.cloaks ? 0.5 : 0.8);
        if (sp.isAlpha) {
          if (e.hp <= sp.hp * e.nextRoar && e.nextRoar > 0) { e.mode = 'roar'; e.timer = 1.3; e.nextRoar -= 0.25; S.sound('alien'); S.spawn('vyrr_hound', {}); S.spawn('vyrr_hound', {}); break; }
          if (e.d < 14) { S.damage(25, e); e.timer = 0; }
        }
        if (e.timer <= 0 && !e.aiming) startMove(e, S);
        if (!sp.isAlpha && e.age > sp.escape) { e.mode = 'vanish'; }
        break;
      }
      case 'roar':
        if (e.timer <= 0) { e.mode = 'perch'; e.timer = rand(1.5, 2.5); }
        break;
      case 'move': {
        const p = Math.min(1, (e.age - e.t0) / e.T);
        e.x = e.x0 + (e.x1 - e.x0) * p; e.d = e.d0 + (e.d1 - e.d0) * p; e.alt = e.a0 + (e.a1 - e.a0) * p;
        e.facing = e.x1 >= e.x0 ? 1 : -1;
        e.phase += dt * 4 * (sp.walk || 2);
        if (sp.cloaks) e.alpha += (0.4 - e.alpha) * Math.min(1, dt * 6); // the cloak photo is already see-through
        if (p >= 1) { e.mode = 'perch'; e.timer = rand(2.4, 4.2) / (S.diff || 1); }
        break;
      }
      case 'leap': {
        const p = Math.min(1, (e.age - e.t0) / e.T);
        e.x = e.x0 + (e.x1 - e.x0) * p; e.d = e.d0 + (e.d1 - e.d0) * p;
        e.alt = e.a0 + (e.a1 - e.a0) * p + e.arc * 4 * p * (1 - p);
        e.facing = e.x1 >= e.x0 ? 1 : -1;
        if (p >= 1) { e.mode = 'perch'; e.timer = rand(2.4, 4.2) / (S.diff || 1); S.fx.dust(e, 1); }
        break;
      }
      case 'vanish':
        e.alpha = Math.max(0, e.alpha - dt * 1.5);
        if (e.alpha <= 0) escape(e, S);
        break;
      default: break;
    }
  },
  projectile(e, dt, S) {
    e.phase += dt * 20;
    move(e, dt);
    if (Math.random() < 0.7) S.fx.spineTrail(e);
    if (e.d <= 1.5) { S.impact(e); e.state = 'gone'; e.result = 'impact'; S.onGone(e); }
  },
  sniper(e, dt, S) {
    fadeIn(e, dt, 1);
    e.glintT -= dt;
    if (e.glintT <= 0) { e.glint = 0.18; e.glintT = rand(1.4, 2.4); }
    if (e.glint > 0) e.glint -= dt;
    e.fireT -= dt;
    if (e.fireT <= 0) {
      S.sound('snipe');
      S.damage(e.sp.damage || 20, e);
      e.d = rand(e.lane.d[0], e.lane.d[1]);
      e.alt0 = e.lane.alt ? rand(e.lane.alt[0], e.lane.alt[1]) : 0; e.alt = e.alt0;
      e.x = sxToX(S, e, rand(200, W - 200));
      e.alpha = 0; e.fireT = rand(7, 10);
    }
  },
};

function startMove(e, S) {
  const sp = e.sp;
  e.x0 = e.x; e.d0 = e.d; e.a0 = e.alt; e.t0 = e.age;
  e.d1 = rand(e.lane.d[0], e.lane.d[1]);
  if (sp.isAlpha) { e.lane = { ...e.lane, d: [Math.max(12, e.lane.d[0] - 6), Math.max(18, e.lane.d[1] - 6)] }; e.d1 = rand(e.lane.d[0], e.lane.d[1]); }
  e.a1 = perchAlt(e);
  e.x1 = xForScreen(S.view, perchScreenX(e.a1), e.d1);
  const dist = Math.hypot(e.x1 - e.x0, e.d1 - e.d0);
  if (sp.leaps && (Math.abs(e.a1 - e.a0) > 1.5 || Math.random() < 0.35)) {
    e.mode = 'leap'; e.T = rand(0.8, 1.2); e.arc = rand(2, 4) + Math.abs(e.a1 - e.a0) * 0.3;
  } else {
    e.a1 = e.a0 < 1.5 ? 0 : e.a0; // walking stays on the same surface
    if (e.a1 > 1.5) { // along the same wall: stay on this side of the view
      const left = project(S.view, e.x0, e.a0, e.d0).sx < W / 2;
      e.x1 = xForScreen(S.view, left ? rand(90, W * 0.22) : rand(W * 0.78, W - 90), e.d1);
    }
    e.mode = 'move'; e.T = Math.max(0.8, dist / (sp.speed * 0.7));
  }
}

// Vyrr (and anything with sp.fires) shoot back: a visible charge, then spines
function fireTick(e, dt, S) {
  const f = e.sp.fires;
  if (e.fireT == null) e.fireT = rand(f.every[0], f.every[1]) * 0.7;
  const ready = e.alpha > 0.6 && (e.mode === 'perch' || e.mode === 'hover' || e.mode === 'in');
  if (!ready) { e.aiming = false; return; }
  e.fireT -= dt;
  e.aiming = e.fireT <= f.windup && e.fireT > 0;
  if (e.fireT <= 0) {
    const n = f.volley || 1;
    for (let i = 0; i < n; i++) S.spawnProjectile(e, { speed: f.speed, dmg: f.dmg, spread: (i - (n - 1) / 2) * 0.6 });
    S.sound('alien');
    e.firedT = 0.35;
    e.fireT = rand(f.every[0], f.every[1]) / (S.diff || 1);
  }
}

function move(e, dt) {
  e.x += e.vx * dt; e.alt += e.valt * dt; e.d += e.vd * dt;
  if (e.d < 1) e.d = 1;
}
function fadeIn(e, dt, s) { if (e.alpha < 1) e.alpha = Math.min(1, e.alpha + dt / s); }
function startFlee(e) {
  e.mode = 'flee';
  e.vx = e.facing * e.sp.speed * rand(0.8, 1.05);
  e.vd = rand(-1, 3);
}
function escape(e, S) {
  if (e.state !== 'alive') return;
  e.state = 'gone';
  if (!e.result) e.result = 'escaped';
  S.onGone(e);
}

export function updateEntity(e, dt, S) {
  e.age += dt;
  if (e.flash > 0) e.flash -= dt;
  if (e.state === 'dying') {
    e.deathT += dt;
    const fam = e.sp.family;
    if (fam === 'bird' && e.sp.anchor === 'center') {
      e.valt -= 9.8 * dt; e.vx *= 0.98; move(e, dt);
      if (e.alt < e.alt0 - 1) e.alpha -= dt * 2;
    } else if (e.sp.behavior === 'static') {
      e.swing = (e.swing || 0) + dt;
      return; // plates stay up and swing
    } else if (e.sp.behavior === 'popup' || e.sp.behavior === 'mover') {
      e.popup = Math.max(0, e.popup - dt / 0.15);
    }
    const life = e.sp.intercept ? 0.15 : fam === 'human' ? 0.6 : fam === 'alien' ? (e.sp.boss ? 1.6 : 1.4) : fam === 'mil' ? 1.2 : 3.2;
    if (e.deathT > life - 0.6) e.alpha = Math.max(0, e.alpha - dt / 0.6);
    if (e.deathT > life) { e.state = 'gone'; S.onGone(e); }
    return;
  }
  if (e.state !== 'alive') return;
  (UPDATE[e.sp.behavior] || UPDATE.static)(e, dt, S);
  if (e.state === 'alive' && e.sp.fires) fireTick(e, dt, S);
}

// Spook: a gunshot startles animals that can hear it
export function spook(e) {
  if (e.state !== 'alive') return;
  if (e.sp.behavior === 'graze' && (e.mode === 'walk' || e.mode === 'graze' || e.mode === 'look') && e.d < 450) {
    e.mode = 'alert'; e.timer = rand(0.25, 0.8); e.vx = 0;
  } else if (e.sp.behavior === 'run' && e.mode === 'stop') {
    e.mode = 'alert'; e.timer = rand(0.1, 0.3);
  }
}

export function makeCharge(e, S) {
  e.mode = 'charge'; e.facing = e.x > S.view.camX ? -1 : 1;
  e.vd = -e.sp.speed;
}

export function canBeHit(e) {
  if (e.state !== 'alive') return false;
  if (e.alpha < 0.35) return false;
  if ((e.sp.behavior === 'popup') && e.popup < 0.6) return false;
  return true;
}

// Returns null or { vital, weak } for a world point (logical px)
export function hitTest(e, view, px, py, tolerance = 0) {
  const p = project(view, e.x, e.alt, e.d);
  const k = p.ppm;
  const b = e.sp.body;
  const pop = e.popup ?? 1;
  const bx = p.sx + e.facing * b.x * k;
  const by = p.sy - b.y * k * pop;
  const rx = Math.max(2, b.rx * k) + tolerance;
  const ry = Math.max(2, b.ry * k * pop) + tolerance;
  const nx = (px - bx) / rx, ny = (py - by) / ry;
  const inBody = nx * nx + ny * ny <= 1;
  if (e.sp.weakpoints) {
    for (let i = 0; i < e.sp.weakpoints.length; i++) {
      const w = e.sp.weakpoints[i];
      const wx = p.sx + e.facing * w.x * k, wy = p.sy - w.y * k;
      if ((px - wx) ** 2 + (py - wy) ** 2 <= (w.r * k + 1) ** 2) return { vital: true, weak: i };
    }
    return inBody ? { vital: false } : null;
  }
  if (!inBody) return null;
  const v = e.sp.vital;
  let vital = false;
  if (v) {
    const vx = p.sx + e.facing * v.x * k, vy = p.sy - v.y * k * pop;
    vital = (px - vx) ** 2 + (py - vy) ** 2 <= (v.r * k + 0.5) ** 2;
  }
  return { vital };
}
