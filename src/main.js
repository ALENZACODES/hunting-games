// Boot, canvas scaling, the frame loop and app-level flow
// (menu ↔ play ↔ pause ↔ results).

import { W, H } from './game/view.js';
import { input, attachInput, setTransform, endFrame, requestLock, releaseLock } from './engine/input.js';
import * as store from './engine/storage.js';
import * as audio from './engine/audio.js';
import { Session } from './game/session.js';
import { LEVELS } from './data/levels.js';
import { OPS } from './data/ops.js';
import { WEAPONS } from './data/weapons.js';
import { UI } from './ui/menus.js';
import { preload } from './engine/assets.js';
import { TITLE_ART } from './data/art.js';
import { cityLevels } from './data/cities.js';

const canvas = document.getElementById('game');
const g = canvas.getContext('2d');
const worldCanvas = document.createElement('canvas');
worldCanvas.width = W; worldCanvas.height = H;

store.load();
attachInput(canvas);

const DEMOS = [LEVELS[0], LEVELS[1], LEVELS[2], LEVELS[9], LEVELS[11]];
let demoIndex = 0;

const app = {
  mode: 'menu', // menu | play | paused | results
  session: null,
  demo: null,
  current: null, // { def, kind, loadout }

  newDemo() {
    const def = DEMOS[demoIndex++ % DEMOS.length];
    this.demo = new Session({ def, kind: 'hunt', demo: true, options: store.options() });
    this.demoT = 0;
  },

  start(def, kind, loadout) {
    audio.initAudio();
    this.applyOptions();
    this.current = { def, kind, loadout };
    this.reachedBefore = store.campaignLevelReached();
    this.session = new Session({ def, kind, loadout, options: store.options(), onEnd: (r) => this.finish(r) });
    this.mode = 'play';
    ui.clear();
    requestLock(canvas);
  },
  restart() { const c = this.current; if (c) this.start(c.def, c.kind, c.loadout); },
  resume() {
    if (!this.session) return;
    this.session.paused = false; this.mode = 'play'; ui.clear();
    requestLock(canvas);
  },
  pause() {
    if (this.mode !== 'play' || !this.session || this.session.state === 'done') return;
    this.session.paused = true; this.mode = 'paused';
    releaseLock();
    ui.pause();
  },
  quit() { this.toMenu(); ui.title(); },
  toMenu() {
    this.session = null; this.mode = 'menu';
    releaseLock();
    if (!this.demo) this.newDemo();
  },
  finish(r) {
    if (this.mode !== 'play' && this.mode !== 'paused') return;
    const { def, kind } = this.current;
    const before = store.recordResult(def.id, { passed: r.pass, stars: r.stars, score: r.score });
    const careerBefore = { longest: store.stats().longest };
    store.recordStats(r);
    r.before = before; r.careerBefore = careerBefore;
    const unlocks = [];
    const after = store.campaignLevelReached();
    if (kind === 'hunt' && after > this.reachedBefore) {
      const nl = LEVELS.find((l) => l.n === after);
      if (nl) unlocks.push(`Level ${nl.n}: ${nl.name}`);
      WEAPONS.filter((w) => w.unlock > this.reachedBefore && w.unlock <= after).forEach((w) => unlocks.push(`Gun: ${w.name}`));
      OPS.filter((o) => o.unlock === def.n).forEach((o) => unlocks.push(`Op: ${o.name}`));
    }
    if (kind === 'city' && r.pass && !before.passed) {
      const nl = cityLevels(def.city)[def.n];
      if (nl) unlocks.push(`Scene ${nl.n}: ${nl.name}`);
      else unlocks.push(`${def.cityName} cleared · city medal`);
    }
    this.mode = 'results';
    releaseLock();
    const show = () => ui.results(def, kind, r, unlocks);
    // the city's closing story plays once, after its alpha falls
    if (kind === 'city' && r.pass && def.n === 12 && !store.uiState()[`story:${def.city}:end`]) ui.story(def.city, 'end', show, true);
    else show();
  },
  applyOptions() {
    const o = store.options();
    audio.setVolumes(o.masterVolume, o.sfxVolume);
    if (this.session) { this.session.opt = o; this.session.fx.reduce = !!o.reduceFlashes; }
  },
};

const ui = new UI(document.getElementById('ui'), app);
window.__app = app; window.__ui = ui; // handy for debugging from the console

// ── canvas sizing (letterboxed 16:9) ──
function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cw = window.innerWidth, ch = window.innerHeight;
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  const scale = Math.min(cw / W, ch / H);
  const offX = (cw - W * scale) / 2, offY = (ch - H * scale) / 2;
  app.view = { dpr, scale, offX, offY };
  setTransform(scale, offX, offY);
}
window.addEventListener('resize', resize);
resize();

// ── input glue ──
canvas.addEventListener('mousedown', () => {
  audio.initAudio();
  if (app.mode === 'play' && !input.locked) requestLock(canvas);
});
window.addEventListener('keydown', (e) => {
  if ((e.code === 'Escape' || e.code === 'KeyP') && app.mode === 'play') { app.pause(); e.preventDefault(); }
  else if ((e.code === 'Escape' || e.code === 'KeyP') && app.mode === 'paused' && document.activeElement?.tagName !== 'INPUT') app.resume();
});
let wasLocked = false;
document.addEventListener('pointerlockchange', () => {
  const locked = document.pointerLockElement === canvas;
  if (wasLocked && !locked && app.mode === 'play' && app.session && app.session.state !== 'done') app.pause();
  wasLocked = locked;
});
window.addEventListener('blur', () => { if (app.mode === 'play') app.pause(); });

// ── loop ──
let last = performance.now();
let fpsAcc = 0, fpsN = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  fpsAcc += dt; fpsN++;
  const s = app.session && app.mode !== 'menu' ? app.session : app.demo;
  if (s) {
    if (s === app.demo) {
      app.demoT += dt;
      if (app.demoT > 28) app.newDemo();
    }
    s.update(dt, input);
    if (fpsAcc > 0.5) { s.fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0; }
  }
  const { dpr, scale, offX, offY } = app.view;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = '#000'; g.fillRect(0, 0, canvas.width, canvas.height);
  g.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * offX, dpr * offY);
  g.save();
  g.beginPath(); g.rect(0, 0, W, H); g.clip();
  const target = app.session && app.mode !== 'menu' ? app.session : app.demo;
  if (target) target.render(g, { worldCanvas });
  g.restore();
  endFrame();
  requestAnimationFrame(frame);
}

preload([TITLE_ART], 'raw');
app.newDemo();
ui.title();
requestAnimationFrame(frame);
