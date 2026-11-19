// One round of play: a hunt level, a military op, or the attract-mode demo
// behind the menus. Handles input, spawning, ballistics, scoring, goals and
// drawing of the world, the gun and the HUD.

import { W, H, F, MIL, CAM_H, project, groundDistance, rand, clamp } from './view.js';
import { BIOMES } from '../data/levels.js';
import { WEAPON_BY_ID, weaponName } from '../data/weapons.js';
import { createEntity, updateEntity, hitTest, canBeHit, spook, makeCharge } from './entities.js';
import { drawEntity } from './render-targets.js';
import { drawBackdrop, drawForeground, horizonFor, worldTint, drawCoverView } from './render-scene.js';
import { createAmbience } from './ambience.js';
import { Gun, drawViewmodel, drawCrosshair, drawSightPicture, drawScopeOverlay, scopeRadius } from './weapon.js';
import { FX } from './fx.js';
import * as audio from '../engine/audio.js';
import { SPECIES } from '../data/species.js';

// whether a species counts toward quotas
const comboMul = (c) => Math.min(4, 1 + Math.max(0, c - 1) * 0.2);
const SPECIES_COUNTS = Object.fromEntries(Object.entries(SPECIES).map(([k, v]) => [k, v.counts]));

const G = 9.81;
const SOUND_SPEED = 343;

export class Session {
  constructor({ def, kind, loadout = [], options = {}, demo = false, onEnd = () => {} }) {
    this.def = def; this.kind = kind; this.demo = demo; this.onEnd = onEnd; this.opt = options;
    this.biome = BIOMES[def.biome];
    this.tod = def.tod || 'day';
    this.view = { horizonY: horizonFor(def.biome), camX: 0, bobX: 0, bobY: 0 };
    this.time = 0; this.entities = []; this.fx = new FX(this.view); this.texts = []; this.bullets = [];
    this.guns = loadout.map((id) => new Gun(WEAPON_BY_ID[id], { noScopes: def.noScopes }));
    this.gi = 0; this.lastGi = 0;
    this.aim = { x: W / 2, y: this.view.horizonY - 60 };
    this.ads = false; this.adsT = 0;
    this.breath = 1; this.holding = false; this.exhausted = 0;
    this.recoil = { x: 0, y: 0 };
    this.score = 0; this.combo = 0; this.maxCombo = 0;
    this.shots = 0; this.shotHits = 0; this.kills = 0; this.vitals = 0; this.longest = 0;
    this.slots = []; this.countedSpawned = 0; this.extras = 0;
    this.spawnT = 1.2; this.noShootHits = 0;
    this.hp = def.hp || null; this.maxHp = def.hp || null; this.hurtT = 0;
    this.timeLeft = def.timeLimit || null;
    this.shotsLeft = def.shots ?? null;
    const [w0, w1] = def.wind || [0, 0];
    this.windBase = rand(w0, w1) * (Math.random() < 0.5 ? -1 : 1);
    this.wind = this.windBase;
    this.state = demo ? 'play' : 'intro'; this.introT = 2.4;
    this.rangeInfo = null;
    this.difficulty = 1;
    this.diff = def.diff || 1;
    this.tally = { species: {}, weapons: {}, penalties: {} };
    this.finaleSpawned = false; this.bossDown = false;
    this.goal = def.goal || 'quota';
    this.total = def.total || 0;
    this.need = def.need || 0;
    this.statics = [];
    this.paused = false;
    this.chirpT = 3;
    this.fx.reduce = !!options.reduceFlashes;
    this.ambience = createAmbience(def.biome, this.biome, this.tod, { reduceFlashes: !!options.reduceFlashes });
    this.setupStatics();
    if (def.boss) this.spawnBoss(def.boss);
  }

  get gun() { return this.guns[this.gi]; }

  // ── setup ──
  setupStatics() {
    const list = [];
    if (this.def.statics) list.push(...this.def.statics);
    if (this.def.plates) {
      const p = this.def.plates;
      for (let i = 0; i < p.n; i++) list.push({ sp: 'plate', d: Math.round(rand(p.d[0], p.d[1])), sx: 0.12 + (0.76 * i) / Math.max(1, p.n - 1) + rand(-0.04, 0.04), alt: p.alt ? rand(p.alt[0], p.alt[1]) : 0 });
    }
    for (const s of list) {
      const e = createEntity(this, s.sp, { d: s.d, sx: s.sx, alt: s.alt || 0, as: s.as, lane: { d: [s.d, s.d] } });
      this.entities.push(e); this.statics.push(e);
    }
    if (this.goal === 'clear') { this.total = this.statics.length; this.need = this.def.need || this.total; }
  }

  spawnBoss(id, def = {}) {
    const e = createEntity(this, id, def);
    e.counts = false; e.isBoss = true;
    this.entities.push(e); this.boss = e;
    this.text(W / 2, this.view.horizonY - 160, `${e.sp.name.toUpperCase()} INBOUND`, '#ff3d6e', 40, 2.5, true);
    audio.sfx('boom');
  }

  bossName() { const n = this.boss ? this.boss.sp.name : 'boss'; return /^the /i.test(n) ? n : `The ${n}`; }

  // Vyrr fire back
  spawnProjectile(from, opts) {
    if (this.demo || this.state !== 'play') return;
    const e = createEntity(this, 'spine', { from, ...opts });
    e.counts = false;
    this.entities.push(e);
  }
  impact(e) {
    if (this.coverT > 0.6) {
      this.text(W / 2 + (Math.random() - 0.5) * 300, H * 0.62, 'BLOCKED', '#9fd3ff', 26, 0.8, true);
      audio.sfx('clang');
      this.hitDir = 0;
      return;
    }
    const p = project(this.view, e.x, e.alt, Math.max(2, e.d));
    this.hitDir = p.sx < W * 0.4 ? -1 : p.sx > W * 0.6 ? 1 : 0;
    this.damage(e.dmg || 10, e);
  }

  spawn(spId, def = {}) {
    const e = createEntity(this, spId, def);
    if (def.child) e.counts = false;
    this.entities.push(e);
    return e;
  }

  // ── helpers used by entities ──
  sound(name, delay = 0) { if (!this.demo) audio.sfx(name, delay); }
  damage(n, e) {
    if (this.demo || this.hp == null || this.state !== 'play') return;
    this.hp = Math.max(0, this.hp - n);
    this.hurtT = 0.6; this.hitDirT = 0.8;
    audio.sfx('hurt');
    this.text(W / 2, H * 0.62, `${this.def.hpLabel || 'HEALTH'} −${n}`, '#ff5a4a', 30, 1.2, true);
    if (this.hp <= 0) this.end(this.goal === 'endless', this.goal === 'endless' ? 'You went down.' : (this.def.hpLabel === 'CONVOY' ? 'The convoy was destroyed.' : 'You were taken down.'));
  }
  onGone(e) {
    if (e.slot != null && this.slots[e.slot] === 'pending') {
      this.slots[e.slot] = 'miss';
      if (!this.demo) this.combo = 0;
    }
  }
  text(x, y, str, color = '#fff', size = 28, life = 1.2, screen = false) {
    this.texts.push({ x, y, str, color, size, life, max: life, screen });
  }

  // ── ballistics ──
  ballistic(def) {
    const L = def.dragL, v0 = def.vel;
    const tof = (d) => (L / v0) * (Math.exp(d / L) - 1);
    const drop = (d) => 0.5 * G * tof(d) ** 2;
    const zero = def.zero || 100;
    const sightH = def.cls === 'shotgun' ? 0.02 : def.optic.type === 'scope' ? 0.045 : 0.03; // sight above bore, m
    const dropRel = (d) => drop(d) + sightH - (drop(zero) + sightH) * (d / zero); // metres below line of sight
    const drift = (d, wind) => wind * (tof(d) - d / v0); // metres downwind
    const traveled = (t) => L * Math.log(1 + (v0 * t) / L);
    return { tof, dropRel, drift, traveled };
  }

  gunPoint() {
    const g = this.gun;
    if (!g) return { x: this.aim.x, y: this.aim.y };
    const def = g.def;
    const ads = this.adsT > 0.5;
    let amp = def.sway * (ads ? 3.5 : 6.5);
    if (this.holding) amp *= 0.18;
    if (this.exhausted > 0) amp *= 1.7;
    if (this.def.platform === 'heli') amp *= 1.6;
    const t = this.time;
    const breathe = this.holding ? 0 : Math.sin(t * 1.55) * amp * 0.45;
    const sx = amp * (0.7 * Math.sin(t * 0.83) + 0.3 * Math.sin(t * 2.1 + 1.3));
    const sy = amp * (0.6 * Math.cos(t * 0.71) + 0.4 * Math.sin(t * 1.7 + 0.4)) + breathe;
    return { x: this.aim.x + (sx + this.recoil.x) * MIL, y: this.aim.y + (sy - this.recoil.y) * MIL };
  }

  // ── input ──
  handleInput(input, dt) {
    const gun = this.gun;
    const ads = this.adsT > 0.5;
    const zoom = ads && gun ? gun.zoom : 1;
    const sens = this.opt.sensitivity || 1;
    if (!input.locked && !ads) { this.aim.x = input.x; this.aim.y = input.y; }
    else {
      const k = ads ? sens * (this.opt.scopeSensitivity || 0.8) / zoom : sens;
      this.aim.x += input.dx * k; this.aim.y += input.dy * k;
    }
    this.aim.x = clamp(this.aim.x, 0, W); this.aim.y = clamp(this.aim.y, 0, H);

    for (const ev of input.events) {
      if (ev.type === 'fire') this.tryFire();
      else if (ev.type === 'adsDown') this.ads = this.opt.adsMode === 'toggle' ? !this.ads : true;
      else if (ev.type === 'adsUp') { if (this.opt.adsMode !== 'toggle') this.ads = false; }
      else if (ev.type === 'wheel') { if (ads && gun) gun.zoomStep(ev.value); else this.switchGun((this.gi + ev.value + this.guns.length) % this.guns.length); }
    }
    if (gun && gun.def.auto && input.left && gun.cycleT <= 0) this.tryFire(true);
    const k = input.pressed;
    if (k.has('KeyR') && gun) gun.startReload();
    if (k.has('Digit1')) this.switchGun(0);
    if (k.has('Digit2')) this.switchGun(1);
    if (k.has('Digit3')) this.switchGun(2);
    if (k.has('KeyQ')) this.switchGun(this.lastGi);
    if (k.has('KeyF')) this.rangefind();
    if (gun && gun.scoped) {
      if (k.has('ArrowUp')) gun.elev = +(gun.elev + 0.1).toFixed(1);
      if (k.has('ArrowDown')) gun.elev = +(gun.elev - 0.1).toFixed(1);
      if (k.has('ArrowRight')) gun.windage = +(gun.windage + 0.1).toFixed(1);
      if (k.has('ArrowLeft')) gun.windage = +(gun.windage - 0.1).toFixed(1);
      if (k.has('Backspace')) { gun.elev = 0; gun.windage = 0; }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].some((c) => k.has(c))) audio.sfx('tick');
    }
    const shift = input.down.has('ShiftLeft') || input.down.has('ShiftRight');
    this.holding = shift && this.breath > 0.02 && this.exhausted <= 0;
    this.cover = !!this.def.cover && input.down.has('Space');
    if (this.cover) this.ads = false;
  }

  switchGun(i) {
    if (i < 0 || i >= this.guns.length || i === this.gi) return;
    this.lastGi = this.gi; this.gi = i;
    this.gun.anim.reload = 1;
    audio.sfx('tick');
  }

  rangefind() {
    const gp = this.gunPoint();
    let best = null;
    for (const e of this.entities) {
      if (e.state !== 'alive') continue;
      if (hitTest(e, this.view, gp.x - this.view.bobX, gp.y - this.view.bobY, 6)) { if (!best || e.d < best.d) best = e; }
    }
    let d = best ? best.d : groundDistance(this.view, gp.y - this.view.bobY);
    if (!isFinite(d) || d > 3000) { this.rangeInfo = { d: null, t: 3 }; audio.sfx('tick'); return; }
    d = Math.round(d);
    const gun = this.gun;
    const info = { d, t: 4 };
    if (gun && !gun.isShotgun) {
      const b = this.ballistic(gun.def);
      info.hold = (b.dropRel(d) / d) * 1000;
      info.windHold = -(b.drift(d, this.wind) / d) * 1000;
      if (this.opt.autoDial && gun.scoped) { gun.elev = Math.round(info.hold * 10) / 10; gun.windage = Math.round(info.windHold * 10) / 10; info.dialed = true; }
    }
    this.rangeInfo = info;
    audio.sfx('tick');
  }

  // ── shooting ──
  tryFire(auto = false) {
    if (this.state !== 'play' || this.demo) return;
    if (this.coverT > 0.5) return; // ducked behind cover
    const gun = this.gun;
    if (!gun) return;
    if (gun.reloading && !gun.interruptReload()) return;
    if (gun.cycleT > 0) return;
    if (this.shotsLeft === 0) { if (!auto) { audio.sfx('dry'); this.text(W / 2, H * 0.7, 'OUT OF AMMO', '#ffb347', 28, 1, true); } return; }
    if (gun.ammo <= 0) { if (!auto) audio.sfx('dry'); gun.startReload(); return; }
    gun.fire();
    this.shots++;
    const wt = this.tally.weapons[gun.def.id] || (this.tally.weapons[gun.def.id] = { shots: 0, kills: 0 });
    wt.shots++;
    if (this.shotsLeft != null) this.shotsLeft--;
    const def = gun.def;
    const gp = this.gunPoint();
    const px = gp.x - this.view.bobX + gun.windage * MIL;
    const py = gp.y - this.view.bobY - gun.elev * MIL;
    // recoil lifts the sight after the round has left the barrel
    this.recoil.y += def.recoil * 26 * (def.auto ? 0.6 : 1);
    this.recoil.x += rand(-1, 1) * def.recoil * 5;
    for (const e of this.entities) spook(e);
    const realistic = this.opt.ballistics !== 'arcade';
    if (gun.isShotgun) this.fireShotgun(gun, px, py);
    else if (!realistic) this.resolveInstant(gun, px, py);
    else this.bullets.push({ gun, def, x0: px, y0: py, t: 0, checked: new Set(), b: this.ballistic(def), wind: this.wind, done: false, hit: false });
    if (gun.ammo === 0 && def.mag > 1) gun.startReload();
  }

  targetsByDistance() {
    return this.entities.filter((e) => canBeHit(e)).sort((a, b) => a.d - b.d);
  }

  fireShotgun(gun, px, py) {
    const def = gun.def;
    const r = def.spread * F;
    const counts = new Map();
    let anyHit = false;
    for (let i = 0; i < def.pellets; i++) {
      const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * r;
      const x = px + Math.cos(a) * rr, y = py + Math.sin(a) * rr;
      for (const e of this.targetsByDistance()) {
        const h = hitTest(e, this.view, x, y);
        if (h) { const c = counts.get(e) || { n: 0, vital: false, x, y }; c.n++; c.vital ||= h.vital; counts.set(e, c); break; }
      }
    }
    for (const [e, c] of counts) {
      anyHit = true;
      const need = e.d <= def.range * 0.6 ? 1 : e.d <= def.range ? 2 : Infinity;
      if (c.n >= need) this.resolveHit(e, { vital: c.vital || c.n >= 4 }, def, e.d, c.x, c.y);
      else if (e.d > def.range) { this.text(c.x, c.y - 20, 'OUT OF RANGE', '#ffb347', 22); this.combo = 0; }
      else { this.text(c.x, c.y - 20, 'NOT DOWN', '#ffb347', 22); }
    }
    if (anyHit) this.shotHits++;
    else { this.combo = 0; this.groundImpact(px, py, null); }
  }

  resolveInstant(gun, px, py) {
    for (const e of this.targetsByDistance()) {
      const h = hitTest(e, this.view, px, py);
      if (h) { this.shotHits++; this.resolveHit(e, h, gun.def, e.d, px, py); return; }
    }
    this.combo = 0;
    this.groundImpact(px, py, null);
  }

  updateBullets(dt) {
    const hy = this.view.horizonY;
    for (const bl of this.bullets) {
      if (bl.done) continue;
      bl.t += dt;
      const prev = bl.s || 0;
      const s = bl.b.traveled(bl.t);
      bl.s = s;
      // where (if anywhere) the round meets flat ground: its height above the
      // ground at distance d is CAM_H - (line-of-sight drop + bullet drop)
      const below = (d) => ((bl.y0 - hy) * d) / F + bl.b.dropRel(d) - CAM_H;
      let limit = s, ground = false;
      if (below(s) >= 0) {
        let a = prev, b = s;
        for (let i = 0; i < 24; i++) { const m = (a + b) / 2; if (below(m) >= 0) b = m; else a = m; }
        limit = b; ground = true;
      }
      for (const e of this.targetsByDistance()) {
        if (e.d > limit) break;
        if (bl.checked.has(e.id)) continue;
        bl.checked.add(e.id);
        const ix = bl.x0 + (bl.b.drift(e.d, bl.wind) * F) / e.d;
        const iy = bl.y0 + (bl.b.dropRel(e.d) * F) / e.d;
        const h = hitTest(e, this.view, ix, iy);
        if (h) { bl.done = true; bl.hit = true; this.shotHits++; this.resolveHit(e, h, bl.def, e.d, ix, iy); break; }
      }
      if (bl.done) continue;
      if (ground) {
        bl.done = true;
        const ix = bl.x0 + (bl.b.drift(limit, bl.wind) * F) / limit;
        const iy = hy + (F * CAM_H) / limit;
        this.groundImpact(ix, iy, limit, bl.b.tof(limit));
      } else if (s > 2600 || bl.t > 6) bl.done = true;
      if (bl.done && !bl.hit) this.combo = 0;
    }
    this.bullets = this.bullets.filter((b) => !b.done);
  }

  groundImpact(x, y, d, tof = 0) {
    if (y <= this.view.horizonY + 1) return;
    const dd = d || groundDistance(this.view, y);
    if (!isFinite(dd)) return;
    this.fx.dust({ sx: x, sy: y, ppm: F / dd }, 0.8);
    audio.sfx('dust', tof + dd / SOUND_SPEED);
  }

  resolveHit(e, hit, def, d, ix, iy) {
    const sp = e.sp;
    let power = def.power;
    if (def.cls === 'shotgun' && d > def.range) power = 0;
    const k = F / d;
    const delay = this.ballistic(def).tof(d) + d / SOUND_SPEED;

    if (power < sp.minPower) {
      if (sp.armored || sp.family === 'alien' || sp.family === 'mil') {
        this.text(ix, iy - 20, sp.armored ? 'DEFLECTED' : 'NO EFFECT', '#9fb3c8', 22);
        this.fx.sparks(ix, iy, '#ffe2a0', Math.max(0.4, k / 30));
        audio.sfx('clang', delay);
        return;
      }
      e.wounded = true;
      if (e.slot != null && this.slots[e.slot] === 'pending') this.slots[e.slot] = 'miss';
      this.fx.tuft(ix, iy, Math.max(0.4, k / 30));
      audio.sfx('thwack', delay);
      this.combo = 0;
      if (sp.family === 'quad' || sp.draw === 'turkey') {
        this.score -= 200;
        this.text(ix, iy - 24, 'WOUNDED  −200  (underpowered)', '#ff8a5a', 22);
        if (sp.chargeWhenWounded) { makeCharge(e, this); this.text(W / 2, H * 0.3, 'IT\'S CHARGING!', '#ff5a4a', 34, 1.4, true); }
        else { e.mode = 'flee'; e.vx = e.facing * sp.speed; }
      } else this.text(ix, iy - 20, 'NOT DOWN', '#ffb347', 22);
      return;
    }

    if (sp.intercept) { // a spine shot out of the air
      e.state = 'dying'; e.deathT = 0; e.vx = e.vd = e.valt = 0;
      this.score += sp.points; this.text(ix, iy - 20, `INTERCEPTED  +${sp.points}`, '#9fe0ff', 22);
      this.fx.sparks(ix, iy, '#ffd27a', Math.max(0.35, k / 30)); audio.sfx('clang', delay);
      return;
    }
    let dmg;
    if (sp.weakpoints) {
      if (hit.weak == null) { this.text(ix, iy - 20, 'ARMOR', '#9fb3c8', 22); this.fx.sparks(ix, iy, '#ffe2a0', k / 10); audio.sfx('clang', delay); return; }
      dmg = 2 + (power >= 9 ? 1 : 0);
    } else dmg = 1 + (hit.vital ? 1 : 0) + (power >= sp.minPower + 3 ? 1 : 0);
    e.hp -= dmg;
    e.flash = 0.15;
    const fxk = Math.max(0.35, k / 30);
    if (sp.family === 'alien') this.fx.ichor(ix, iy, fxk);
    else if (sp.family === 'mil') this.fx.sparks(ix, iy, '#ffe2a0', fxk);
    else if (sp.family === 'bird' && sp.anchor === 'center') this.fx.feathers(ix, iy, fxk);
    else this.fx.tuft(ix, iy, fxk);

    if (e.hp > 0) {
      this.addPoints(25, ix, iy, 'HIT', '#ffe08a', false);
      audio.sfx(sp.family === 'mil' ? 'clang' : 'thwack', delay);
      if (sp.chargeWhenWounded && e.mode !== 'charge') makeCharge(e, this);
      return;
    }

    // ── kill ──
    e.state = 'dying'; e.deathT = 0; e.vx *= 0.3; e.vd = 0;
    if (sp.behavior === 'static') { e.hitX = clamp((ix - project(this.view, e.x, e.alt, e.d).sx) / (sp.body.rx * k), -0.7, 0.7); e.hitY = rand(-0.5, 0.5); }
    audio.sfx(sp.family === 'mil' ? (sp.behavior === 'static' ? 'ding' : 'clang') : sp.family === 'alien' ? 'alienDie' : 'thwack', delay);
    if (sp.draw === 'vehicle' || sp.boss) { audio.sfx('boom', delay); for (let i = 0; i < 6; i++) this.fx.smoke(e); }
    if (e.isBoss) { this.bossDown = true; this.addPoints(sp.points, ix, iy, `${sp.name.toUpperCase()} DOWN`, '#ff3d6e', true); return; }

    if (!e.counts && sp.penalty) {
      e.result = 'illegal';
      this.tally.penalties[sp.name] = (this.tally.penalties[sp.name] || 0) + 1;
      this.score -= sp.penalty;
      this.combo = 0;
      const label = sp.penaltyLabel || (sp.noShoot ? 'NO-SHOOT' : sp.protected ? 'PROTECTED SPECIES' : 'NOT LEGAL');
      this.text(ix, iy - 26, `${label}  −${sp.penalty}`, '#ff5a4a', 26, 1.8);
      audio.sfx('bad');
      if (sp.noShoot) {
        this.noShootHits++;
        if (this.def.failOnNoShoot && this.noShootHits >= this.def.failOnNoShoot) this.end(false, 'Too many no-shoot hits.');
      }
      return;
    }
    e.result = 'hit';
    if (e.slot != null) this.slots[e.slot] = 'hit';
    this.kills++;
    this.tally.species[sp.name] = (this.tally.species[sp.name] || 0) + 1;
    const wk = this.tally.weapons[def.id] || (this.tally.weapons[def.id] = { shots: 0, kills: 0 });
    wk.kills++;
    if (hit.vital) this.vitals++;
    if (d > this.longest) { this.longest = d; this.longestWith = def.id; }
    let label = hit.vital ? (sp.family === 'alien' ? 'WEAK POINT' : 'VITAL') : (sp.family === 'mil' ? 'HIT' : 'CLEAN');
    let mul = (1 + d / 100) * (hit.vital ? 1.5 : 1);
    if ((sp.family === 'bird' || sp.draw === 'rabbit') && def.power >= 7) { mul *= 0.5; label = 'OVERKILL'; }
    this.addPoints(sp.points * mul, ix, iy, label, hit.vital ? '#7dffb0' : '#ffe08a', true);
  }

  addPoints(base, x, y, label, color, combo) {
    if (combo) { this.combo++; this.maxCombo = Math.max(this.maxCombo, this.combo); }
    const cm = combo ? comboMul(this.combo) : 1;
    const pts = Math.round(base * cm);
    this.score += pts;
    this.text(x, y - 24, `${label}  +${pts}${cm > 1 ? `  ×${cm.toFixed(1)}` : ''}`, color, 24, 1.3);
  }

  // ── spawning ──
  spawnTick(dt) {
    const def = this.def;
    if (!def.spawns || this.state !== 'play') return;
    if (this.goal === 'boss' && this.bossDown) return;
    this.spawnT -= dt;
    const ramp = def.ramp ? 1 + this.time / 45 : 1;
    const cap = Math.round((def.concurrent || 2) * Math.min(2.2, ramp));
    const live = this.entities.filter((e) => e.state === 'alive' && e.sp.behavior !== 'static' && !e.isBoss).length;
    if (this.spawnT > 0 || live >= cap) return;
    const quota = this.goal === 'quota' && this.total;
    if (quota && this.countedSpawned >= this.total) return;
    const pool = def.spawns.filter((s) => {
      const counts = s.as?.counts ?? (SPECIES_COUNTS[s.sp] !== false);
      if (!counts) return this.extras < 3 + Math.floor((this.total || 20) / 5);
      return true;
    });
    let sum = pool.reduce((a, s) => a + s.w, 0), r = Math.random() * sum, choice = pool[0];
    for (const s of pool) { r -= s.w; if (r <= 0) { choice = s; break; } }
    const e = createEntity(this, choice.sp, choice);
    if (e.sp.trophy) { this.text(W / 2, H * 0.22, `${e.sp.name.toUpperCase()} SPOTTED`, '#ffd36e', 34, 2.2, true); audio.sfx('good'); }
    if (e.counts) {
      if (quota) { e.slot = this.countedSpawned; this.slots.push('pending'); }
      this.countedSpawned++;
    } else this.extras++;
    this.entities.push(e);
    const [g0, g1] = def.gap || [1, 2];
    this.spawnT = rand(g0, g1) / Math.min(2, ramp);
  }

  // ── goals ──
  checkGoals() {
    if (this.state !== 'play' || this.demo) return;
    const g = this.goal;
    const hits = this.slots.filter((s) => s === 'hit').length;
    const pending = this.slots.filter((s) => s === 'pending').length;
    const misses = this.slots.length - hits - pending;
    const outOfShots = this.shotsLeft === 0 && this.bullets.length === 0;
    if (this.timeLeft != null && this.timeLeft <= 0) {
      if (g === 'quota') return this.end(hits >= this.need, hits >= this.need ? '' : 'Time is up.');
      if (g === 'score') return this.end(this.score >= this.need, this.score >= this.need ? '' : 'Score target not reached.');
      if (g === 'survive') return this.end(true, 'You held out.');
      if (g === 'clear') return this.endClear();
    }
    if (g === 'quota') {
      if (this.total && misses > this.total - this.need) return this.end(false, 'The quota can no longer be met.');
      if (this.countedSpawned >= this.total && pending === 0) {
        if (hits >= this.need && this.def.finale && !this.finaleSpawned) { this.finaleSpawned = true; this.goal = 'boss'; this.spawnBoss(this.def.finale, this.def.finaleDef || {}); return; }
        return this.end(hits >= this.need, hits >= this.need ? '' : 'Not enough hits.');
      }
      if (outOfShots) return this.end(hits >= this.need, 'Out of ammunition.');
    } else if (g === 'clear') {
      const down = this.statics.filter((e) => e.state !== 'alive').length;
      if (down === this.statics.length || outOfShots) return this.endClear();
    } else if (g === 'boss') {
      if (this.bossDown) return this.end(true, `${this.bossName()} is down.`);
      if (this.boss && this.boss.state === 'gone' && !this.bossDown) return this.end(false, `${this.bossName()} broke through.`);
    } else if (g === 'score' && outOfShots) return this.end(this.score >= this.need, 'Out of ammunition.');
  }

  endClear() {
    const down = this.statics.filter((e) => e.state !== 'alive').length;
    const all = down === this.statics.length;
    if (all && this.timeLeft != null) {
      const bonus = Math.round(this.timeLeft * (this.def.speedBonus ? 120 : 30));
      this.score += bonus; this.bonusLines = [[`Time bonus`, bonus]];
    }
    this.end(down >= this.need, down >= this.need ? '' : `Only ${down} of ${this.statics.length} plates down.`);
  }

  end(pass, reason = '') {
    if (this.state === 'done') return;
    this.state = 'done';
    this.ads = false;
    const acc = this.shots ? this.shotHits / this.shots : 0;
    const lines = this.bonusLines || [];
    if (pass && this.shots) { const b = Math.round(acc * 1000); this.score += b; lines.push(['Accuracy bonus', b]); }
    if (pass && this.goal === 'clear' && this.statics.every((e) => e.state !== 'alive')) { this.score += 500; lines.push(['Full clear', 500]); }
    this.score = Math.max(0, Math.round(this.score));
    const hits = this.slots.filter((s) => s === 'hit').length;
    let stars = 0;
    if (pass) {
      const g = this.def.goal || 'quota';
      if (g === 'quota') stars = hits >= this.total && acc >= 0.6 ? 3 : hits >= this.total * 0.85 ? 2 : 1;
      else if (g === 'score') stars = this.score >= this.need * 2 ? 3 : this.score >= this.need * 1.4 ? 2 : 1;
      else if (g === 'survive' || g === 'boss') stars = this.hp / this.maxHp >= 0.7 ? 3 : this.hp / this.maxHp >= 0.35 ? 2 : 1;
      else if (g === 'clear') stars = this.statics.every((e) => e.state !== 'alive') ? (acc >= 0.7 ? 3 : 2) : 1;
      else if (g === 'endless') stars = this.time >= 180 ? 3 : this.time >= 90 ? 2 : this.time >= 30 ? 1 : 0;
    }
    audio.sfx(pass ? 'good' : 'bad');
    const result = {
      pass, stars, reason, score: this.score, shots: this.shots, hits: this.shotHits, kills: this.kills, vitals: this.vitals,
      accuracy: acc, longest: Math.round(this.longest), longestWith: this.longestWith || '', time: this.time, tally: this.tally,
      quotaHits: hits, total: this.total, need: this.need, hp: this.hp, maxHp: this.maxHp, quota: (this.def.goal || 'quota') === 'quota' && this.total ? `${hits} / ${this.total}` : null, lines, maxCombo: this.maxCombo,
    };
    setTimeout(() => this.onEnd(result), 900);
  }

  // ── frame update ──
  update(dt, input) {
    if (this.paused) return;
    this.time += dt;
    if (this.state === 'intro') { this.introT -= dt; if (this.introT <= 0) this.state = 'play'; }
    if (!this.demo && this.state !== 'done') this.handleInput(input, dt);
    const gun = this.gun;
    if (gun) gun.update(dt);
    if (this.ambience) this.ambience.update(dt, this.wind);
    // cover: duck behind the scene's cover object; reloads twice as fast there
    this.coverT = clamp((this.coverT || 0) + (this.cover ? dt : -dt) / 0.18, 0, 1);
    if (gun && this.coverT > 0.5 && gun.reloading) gun.reloadT -= dt;
    if (this.hitDirT > 0) this.hitDirT -= dt;
    // ADS
    const canAds = gun && this.state !== 'done';
    this.adsT = clamp(this.adsT + (this.ads && canAds ? dt : -dt) / 0.16, 0, 1);
    // breath
    if (this.holding) { this.breath -= dt / 4; if (this.breath <= 0) { this.breath = 0; this.exhausted = 1.6; this.holding = false; } }
    else this.breath = Math.min(1, this.breath + dt / 5);
    if (this.exhausted > 0) this.exhausted -= dt;
    // recoil recovery
    const rate = gun ? 7 - gun.def.recoil * 3.5 : 6;
    this.recoil.y *= Math.exp(-dt * rate); this.recoil.x *= Math.exp(-dt * rate);
    // wind & platform
    this.wind = this.windBase + (this.def.gust ? Math.sin(this.time * 0.35) * 3 + Math.sin(this.time * 1.1) * 1.2 : Math.sin(this.time * 0.2) * 0.6);
    if (this.def.platform === 'heli') {
      this.view.camX += 18 * dt;
      this.view.bobX = Math.sin(this.time * 0.7) * 10 + Math.sin(this.time * 2.3) * 3;
      this.view.bobY = Math.sin(this.time * 1.3) * 14 + Math.sin(this.time * 3.1) * 4;
    }
    if (this.timeLeft != null && this.state === 'play') this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.hurtT > 0) this.hurtT -= dt;
    if (this.rangeInfo) { this.rangeInfo.t -= dt; if (this.rangeInfo.t <= 0) this.rangeInfo = null; }

    if (this.state !== 'intro') this.spawnTick(dt);
    if (this.demo) this.demoTick(dt);
    for (const e of this.entities) updateEntity(e, dt, this);
    this.entities = this.entities.filter((e) => e.state !== 'gone' || e.sp.behavior === 'static');
    this.updateBullets(dt);
    this.fx.update(dt);
    for (const t of this.texts) { t.life -= dt; t.y -= dt * (t.screen ? 10 : 30); }
    this.texts = this.texts.filter((t) => t.life > 0);
    this.checkGoals();
    if (!this.demo) {
      audio.setWind(Math.abs(this.wind));
      this.chirpT -= dt;
      if (this.chirpT <= 0) { this.chirpT = rand(3, 9); if (this.kind === 'hunt' && ['dawn', 'day'].includes(this.tod)) audio.sfx('chirp'); }
    }
  }

  demoTick() {
    // attract mode: keep a couple of targets moving behind the menu
    const live = this.entities.filter((e) => e.state === 'alive').length;
    if (live < 3 && Math.random() < 0.02) {
      const s = this.def.spawns[(Math.random() * this.def.spawns.length) | 0];
      this.entities.push(createEntity(this, s.sp, s));
    }
  }

  // ── drawing ──
  render(g, opts = {}) {
    const gun = this.gun;
    const ads = !this.demo && gun && this.adsT > 0.5;
    const gp = this.gunPoint();
    const z = ads ? gun.zoom : 1;
    const filter = this.def.filter;
    // Night vision and thermal use blend modes on whole layers (fast everywhere);
    // thermal draws warm targets on their own layer so they can glow white.
    const thermal = filter === 'thermal';
    const world = opts.worldCanvas;
    const layer = (canvas, draw) => {
      const c = canvas.getContext('2d');
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, W, H);
      c.save();
      if (ads) { c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-gp.x, -gp.y); }
      c.translate(this.view.bobX, this.view.bobY);
      draw(c);
      c.restore();
    };
    layer(world, (c) => this.renderWorld(c, { thermal }));
    if (thermal) {
      if (!this.hotCanvas) { this.hotCanvas = document.createElement('canvas'); this.hotCanvas.width = W; this.hotCanvas.height = H; }
      layer(this.hotCanvas, (c) => this.renderEntities(c));
      const hc = this.hotCanvas.getContext('2d');
      hc.setTransform(1, 0, 0, 1, 0, 0);
      hc.globalCompositeOperation = 'source-in'; hc.fillStyle = '#ffffff'; hc.fillRect(0, 0, W, H);
      hc.globalCompositeOperation = 'source-over';
    }

    g.drawImage(world, 0, 0);
    if (filter === 'nv') {
      g.globalCompositeOperation = 'color'; g.fillStyle = '#4dff6e'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(40,130,50,0.85)'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over';
      this.nvNoise(g);
    } else if (thermal) {
      g.globalCompositeOperation = 'color'; g.fillStyle = '#808080'; g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(0, 0, W, H);
      g.globalAlpha = 0.35;
      for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) g.drawImage(this.hotCanvas, dx, dy);
      g.globalAlpha = 1;
      g.drawImage(this.hotCanvas, 0, 0);
    }

    if (this.demo) return;
    // gun / optics
    if (ads && gun.scoped) {
      const vx = (gp.x - this.aim.x) * 0.25, vy = (gp.y - this.aim.y) * 0.25;
      drawScopeOverlay(g, gun, clamp(vx, -40, 40), clamp(vy, -40, 40), filter ? '#ff3b30' : this.opt.reticleColor);
      if (gun.anim.flash > 0.5 && !this.opt.reduceFlashes) { g.fillStyle = `rgba(255,230,200,${0.25 * gun.anim.flash})`; g.fillRect(0, 0, W, H); }
    } else if (ads) drawSightPicture(g, gun, this.time, this.opt.reticleColor);
    else if (gun && this.state !== 'done' && (this.coverT || 0) < 0.5) {
      drawViewmodel(g, gun, gp.x, gp.y, this.time);
      drawCrosshair(g, gp.x, gp.y, gun, filter ? '#7dff9a' : '#ffffff');
    }
    if (this.def.cover && this.coverT > 0) drawCoverView(g, this.def.biome, this.coverT, this.time);
    if (this.ambience) this.ambience.drawFront(g, ads);
    this.drawTexts(g, ads, gp, z);
    this.drawWarnings(g, ads, gp, z);
    this.drawHud(g, ads);
  }

  // red brackets on any Vyrr charging a shot, incoming spines and hit direction
  drawWarnings(g, ads, gp, z) {
    if (this.demo) return;
    g.save();
    const pulse = 0.55 + 0.45 * Math.sin(this.time * 18);
    let incoming = 0;
    for (const e of this.entities) {
      if (e.state !== 'alive') continue;
      if (e.aiming) {
        const p = project(this.view, e.x, e.alt, e.d);
        const c = this.toScreen(p.sx, p.sy - e.sp.body.y * p.ppm, ads, gp, z);
        const r = Math.max(26, e.sp.body.ry * p.ppm * (ads ? z : 1) * 1.2);
        g.strokeStyle = `rgba(255,60,40,${pulse})`; g.lineWidth = 3;
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          g.beginPath(); g.moveTo(c.x + sx * r, c.y + sy * r * 0.6); g.lineTo(c.x + sx * r, c.y + sy * r); g.lineTo(c.x + sx * r * 0.6, c.y + sy * r); g.stroke();
        }
        incoming++;
      }
      if (e.sp.intercept && e.d < 25) incoming++;
    }
    if (incoming && this.def.cover) {
      g.font = '700 30px "Bahnschrift", "Arial Narrow", system-ui, sans-serif'; g.textAlign = 'center';
      g.lineWidth = 5; g.strokeStyle = 'rgba(0,0,0,0.7)'; g.fillStyle = `rgba(255,80,60,${pulse})`;
      const msg = this.coverT > 0.5 ? 'INCOMING · STAY DOWN' : 'INCOMING · SPACE FOR COVER';
      g.strokeText(msg, W / 2, H * 0.2); g.fillText(msg, W / 2, H * 0.2);
    }
    if (this.hitDirT > 0 && this.hitDir) {
      const a = Math.min(1, this.hitDirT);
      const x = this.hitDir < 0 ? 0 : W - 140;
      const gr = g.createLinearGradient(x, 0, x + 140, 0);
      gr.addColorStop(this.hitDir < 0 ? 0 : 1, `rgba(220,20,10,${0.7 * a})`); gr.addColorStop(this.hitDir < 0 ? 1 : 0, 'rgba(220,20,10,0)');
      g.fillStyle = gr; g.fillRect(x, 0, 140, H);
    }
    g.restore();
  }

  renderEntities(g) {
    const fog = this.def.fog || 0;
    const sorted = [...this.entities].sort((a, b) => b.d - a.d);
    for (const e of sorted) {
      const fade = fog ? Math.max(0.05, Math.exp(-Math.max(0, e.d - 30) / (160 * (1 - fog) + 30))) : 1;
      drawEntity(g, e, this.view, this.time, { fade });
    }
  }

  renderWorld(g, { thermal = false } = {}) {
    const wide = this.adsT > 0.5;
    drawBackdrop(g, this.def.biome, this.tod, this.view, wide);
    if (this.ambience && !thermal) this.ambience.drawBack(g);
    if (!thermal) this.renderEntities(g);
    drawForeground(g, this.def.biome, this.time, Math.abs(this.wind), wide);
    this.fx.draw(g);
    const fog = this.def.fog || 0;
    const tint = thermal || this.biome.city ? null : worldTint(this.tod);
    if (tint) { g.fillStyle = tint; g.fillRect(-W, -H, W * 3, H * 3); }
    if (fog) {
      const fg = g.createLinearGradient(0, this.view.horizonY - 300, 0, H);
      fg.addColorStop(0, `rgba(200,205,210,${fog * 0.85})`); fg.addColorStop(0.4, `rgba(200,205,210,${fog * 0.75})`); fg.addColorStop(1, `rgba(200,205,210,${fog * 0.2})`);
      g.fillStyle = fg; g.fillRect(-W, -H, W * 3, H * 3);
    }
  }

  nvNoise(g) {
    g.fillStyle = 'rgba(200,255,200,0.07)';
    for (let i = 0; i < 400; i++) g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    const v = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,10,0,0.75)');
    g.fillStyle = v; g.fillRect(0, 0, W, H);
  }

  toScreen(x, y, ads, gp, z) {
    if (ads) return { x: (x + this.view.bobX - gp.x) * z + W / 2, y: (y + this.view.bobY - gp.y) * z + H / 2 };
    return { x: x + this.view.bobX, y: y + this.view.bobY };
  }

  drawTexts(g, ads, gp, z) {
    g.save();
    g.textAlign = 'center';
    for (const t of this.texts) {
      const p = t.screen ? t : this.toScreen(t.x, t.y, ads, gp, z);
      const a = Math.min(1, t.life / (t.max * 0.4));
      g.globalAlpha = a;
      g.font = `700 ${t.size}px "Oswald", "Arial Narrow", system-ui, sans-serif`;
      g.lineWidth = 5; g.strokeStyle = 'rgba(0,0,0,0.75)';
      g.strokeText(t.str, p.x, p.y); g.fillStyle = t.color; g.fillText(t.str, p.x, p.y);
    }
    g.restore();
  }

  drawHud(g, ads) {
    const gun = this.gun;
    const font = (w, s) => `${w} ${s}px "Oswald", "Arial Narrow", system-ui, sans-serif`;
    const shadowText = (str, x, y, size, color = '#fff', align = 'left', weight = 700) => {
      g.font = font(weight, size); g.textAlign = align;
      g.lineWidth = 4; g.strokeStyle = 'rgba(0,0,0,0.6)'; g.strokeText(str, x, y);
      g.fillStyle = color; g.fillText(str, x, y);
    };
    g.save();
    // hurt
    if (this.hurtT > 0) {
      const v = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      v.addColorStop(0, 'rgba(150,0,0,0)'); v.addColorStop(1, `rgba(170,0,0,${this.hurtT * 0.9})`);
      g.fillStyle = v; g.fillRect(0, 0, W, H);
    }
    // score
    shadowText(this.score.toLocaleString(), 40, 70, 54);
    if (this.combo > 1) shadowText(`COMBO ×${comboMul(this.combo).toFixed(1)}`, 40, 108, 24, '#ffd36e');
    // title + quota / clock
    shadowText((this.kind === 'hunt' && this.def.n ? `${this.def.n}. ` : '') + this.def.name.toUpperCase(), W / 2, 44, 26, '#e9e4d6', 'center', 600);
    if (this.goal === 'quota' && this.total) this.drawQuota(g);
    else if (this.goal === 'clear') shadowText(`PLATES  ${this.statics.filter((e) => e.state !== 'alive').length} / ${this.statics.length}   (need ${this.need})`, W / 2, 84, 24, '#ffffff', 'center');
    else if (this.goal === 'score') shadowText(`TARGET  ${this.need.toLocaleString()}`, W / 2, 84, 24, this.score >= this.need ? '#7dffb0' : '#ffffff', 'center');
    else if (this.goal === 'boss' && this.boss) {
      const f = Math.max(0, this.boss.hp / this.boss.sp.hp);
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(W / 2 - 300, 66, 600, 18);
      g.fillStyle = '#ff3d6e'; g.fillRect(W / 2 - 300, 66, 600 * f, 18);
      shadowText(`${this.boss.sp.name.toUpperCase()}  ${Math.round(this.boss.d)} m`, W / 2, 116, 22, '#ffb3c6', 'center');
    } else if (this.goal === 'endless') shadowText(`SURVIVED  ${this.time.toFixed(0)} s`, W / 2, 84, 24, '#ffffff', 'center');
    // right column
    let ry = 60;
    if (this.timeLeft != null) { const t = Math.ceil(this.timeLeft); shadowText(`${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`, W - 40, ry + 10, 46, t <= 10 ? '#ff6a5a' : '#fff', 'right'); ry += 50; }
    if (this.hp != null) {
      shadowText(this.def.hpLabel || 'HEALTH', W - 40, ry + 6, 18, '#ddd', 'right', 600);
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(W - 300, ry + 14, 260, 14);
      const f = this.hp / this.maxHp;
      g.fillStyle = f > 0.5 ? '#6ad38a' : f > 0.25 ? '#ffc04a' : '#ff5a4a'; g.fillRect(W - 300, ry + 14, 260 * f, 14);
      ry += 52;
    }
    // wind
    const wv = this.wind;
    shadowText(`WIND ${Math.abs(wv).toFixed(1)} m/s ${wv >= 0 ? '→' : '←'}`, W - 40, ry + 12, 20, '#cfe7ff', 'right', 600);
    ry += 30;
    if (this.shotsLeft != null) shadowText(`ROUNDS LEFT ${this.shotsLeft}`, W - 40, ry + 12, 20, '#ffd36e', 'right', 600);
    if (this.def.cover) { ry += 30; shadowText(this.coverT > 0.5 ? 'IN COVER · RELOADING FASTER' : 'HOLD SPACE · TAKE COVER', W - 40, ry + 12, 18, this.coverT > 0.5 ? '#9fe0ff' : '#cfcfcf', 'right', 600); }

    // weapon block
    if (gun) {
      const by = H - 40;
      const nm = weaponName(gun.def, this.opt.genericNames);
      shadowText(nm.toUpperCase(), 40, by - 58, 26, '#fff');
      shadowText(`${gun.def.caliber}  ·  ${gun.def.action}${this.guns.length > 1 ? `  ·  [${this.gi + 1}/${this.guns.length}]` : ''}`, 40, by - 30, 18, '#d6d0c0', 'left', 500);
      // ammo pips
      const n = gun.def.mag;
      const pw = n > 12 ? 7 : 14, ph = n > 12 ? 20 : 30, gap = n > 12 ? 3 : 6;
      for (let i = 0; i < n; i++) {
        g.fillStyle = i < gun.ammo ? (gun.isShotgun ? '#c8322a' : '#d9b25a') : 'rgba(255,255,255,0.18)';
        g.fillRect(40 + i * (pw + gap), by - 6, pw, ph);
        if (i < gun.ammo && gun.isShotgun) { g.fillStyle = '#c9a24a'; g.fillRect(40 + i * (pw + gap), by + ph - 14, pw, 8); }
      }
      if (gun.reloading) shadowText('RELOADING…', 40 + n * (pw + gap) + 16, by + 18, 20, '#ffd36e');
      else if (gun.ammo === 0) shadowText('R  RELOAD', 40 + n * (pw + gap) + 16, by + 18, 20, '#ff8a5a');
      // optics readout
      if (gun.scoped && (ads || gun.elev || gun.windage)) {
        const txt = `${gun.zoom.toFixed(1)}×   ELEV ${gun.elev >= 0 ? '+' : ''}${gun.elev.toFixed(1)}   WIND ${gun.windage >= 0 ? 'R' : 'L'} ${Math.abs(gun.windage).toFixed(1)} mil`;
        shadowText(txt, W / 2, H - 30, 22, '#cfe7ff', 'center', 600);
      }
    }
    // breath
    if (ads || this.breath < 1) {
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(W / 2 - 100, H - 70, 200, 8);
      g.fillStyle = this.exhausted > 0 ? '#ff6a5a' : this.holding ? '#9fe0ff' : '#e9e4d6'; g.fillRect(W / 2 - 100, H - 70, 200 * this.breath, 8);
      if (ads && this.breath === 1 && !this.holding) shadowText('SHIFT  hold breath   ·   F  range', W / 2, H - 80, 16, 'rgba(255,255,255,0.6)', 'center', 500);
    }
    // rangefinder
    if (this.rangeInfo) {
      const r = this.rangeInfo;
      const lines = r.d == null ? ['RANGE  - - -'] : [`RANGE  ${r.d} m`];
      if (r.d != null && r.hold != null) lines.push(`HOLD  ${r.hold >= 0 ? 'UP' : 'DOWN'} ${Math.abs(r.hold).toFixed(1)} mil   WIND ${r.windHold >= 0 ? 'R' : 'L'} ${Math.abs(r.windHold).toFixed(1)}${r.dialed ? '   · DIALED' : ''}`);
      lines.forEach((l, i) => shadowText(l, W / 2, (ads ? H / 2 + scopeRadius() * 0.55 : H * 0.72) + i * 30, i ? 20 : 28, '#ffcf6a', 'center'));
    }
    // intro card
    if (this.state === 'intro') {
      const a = Math.min(1, this.introT);
      g.globalAlpha = a;
      g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, H * 0.36, W, 190);
      if (this.kind === 'hunt' && this.def.n) shadowText(`LEVEL ${this.def.n} · CHAPTER ${this.def.chapter}`, W / 2, H * 0.36 + 26, 22, '#ffb07a', 'center', 600);
      if (this.kind === 'city') shadowText(`${this.def.cityName.toUpperCase()} · SCENE ${this.def.n} OF 12`, W / 2, H * 0.36 + 26, 22, '#ffb07a', 'center', 600);
      shadowText(this.def.name.toUpperCase(), W / 2, H * 0.36 + 80, 64, '#fff', 'center');
      shadowText(this.objectiveText(), W / 2, H * 0.36 + 140, 26, '#ffd36e', 'center', 500);
      g.globalAlpha = 1;
    }
    if (this.opt.showFps && this.fps) shadowText(`${this.fps | 0} fps`, W - 20, H - 16, 16, '#9f9', 'right', 500);
    g.restore();
  }

  objectiveText() {
    const d = this.def;
    switch (this.goal) {
      case 'quota': return `Hit ${this.need} of ${this.total}${d.timeLimit ? ` in ${d.timeLimit} s` : ''}`;
      case 'score': return `Score ${this.need.toLocaleString()} in ${d.timeLimit} s`;
      case 'survive': return `Survive ${d.timeLimit} s`;
      case 'clear': return `Knock down ${this.need} of ${this.total} plates${d.shots ? ` with ${d.shots} rounds` : ''}`;
      case 'boss': return this.boss?.sp.isAlpha ? `Bring down ${this.boss.sp.name}` : `Destroy ${this.bossName().replace(/^The /, 'the ')}`;
      case 'endless': return 'Survive as long as you can';
      default: return '';
    }
  }

  drawQuota(g) {
    const n = this.total;
    const size = Math.min(26, 900 / n - 6);
    const x0 = W / 2 - (n * (size + 6)) / 2;
    for (let i = 0; i < n; i++) {
      const s = this.slots[i];
      g.fillStyle = s === 'hit' ? '#ffcc33' : s === 'miss' ? 'rgba(120,120,120,0.85)' : s === 'pending' ? '#ffffff' : 'rgba(255,255,255,0.25)';
      g.beginPath(); g.arc(x0 + i * (size + 6) + size / 2, 76, size / 2, 0, Math.PI * 2); g.fill();
    }
    // need marker
    const mx = x0 + this.need * (size + 6) - 3;
    g.fillStyle = '#ff5a4a'; g.fillRect(mx, 58, 3, 36);
  }
}
