// Menus and overlays (DOM): title, campaign, ops, briefing + loadout,
// arsenal, hall of fame, options, how to play, pause and results.

import { LEVELS, BIOMES } from '../data/levels.js';
import { OPS } from '../data/ops.js';
import { WEAPONS, WEAPON_BY_ID, CLASSES, weaponName } from '../data/weapons.js';
import { SPECIES } from '../data/species.js';
import * as store from '../engine/storage.js';
import * as audio from '../engine/audio.js';
import { thumbnail } from '../game/render-scene.js';
import { weaponProfilePath } from '../data/art.js';

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  return el;
}

const stars = (n, max = 3) => h('span', { class: 'stars' }, ...Array.from({ length: max }, (_, i) => h('i', { class: i < n ? 'on' : '' }, '★')));
const click = () => audio.sfx('tick');

export class UI {
  constructor(root, app) {
    this.root = root; this.app = app; this.stack = [];
    this.loadouts = {};
  }

  clear() { this.root.innerHTML = ''; this.root.classList.remove('show', 'dim', 'title-art'); }

  screen(title, body, { back = true, wide = false, dim = false } = {}) {
    this.clear();
    this.root.classList.add('show');
    if (dim) this.root.classList.add('dim');
    const panel = h('div', { class: 'panel' + (wide ? ' wide' : '') },
      h('div', { class: 'panel-head' },
        back ? h('button', { class: 'back', onclick: () => { click(); this.title(); } }, '← Back') : h('span'),
        h('h2', {}, title), h('span')),
      body);
    this.root.append(panel);
    return panel;
  }

  // ── title ──
  title() {
    this.clear();
    this.root.classList.add('show', 'title-art'); // assets/ui/title.jpg, if present, sits behind the menu
    const reached = store.campaignLevelReached();
    const opsOpen = OPS.filter((o) => this.opUnlocked(o)).length;
    const menu = h('div', { class: 'title' },
      h('div', { class: 'logo' }, h('span', { class: 'logo-top' }, 'HUNTING'), h('span', { class: 'logo-bottom' }, 'GAMES')),
      h('p', { class: 'tag' }, 'Field to frontier. 25 real firearms. 12 hunts. 25 military ops.'),
      h('nav', { class: 'menu' },
        h('button', { class: 'primary', onclick: () => { click(); this.campaign(); } }, 'Hunt Campaign', h('small', {}, reached > 12 ? 'All levels open' : `Level ${reached} of 12`)),
        h('button', { onclick: () => { click(); this.ops(); } }, 'Military Ops', h('small', {}, `${opsOpen} of ${OPS.length} unlocked`)),
        h('button', { onclick: () => { click(); this.arsenal(); } }, 'Arsenal', h('small', {}, '25 firearms')),
        h('button', { onclick: () => { click(); this.hall(); } }, 'Hall of Fame'),
        h('button', { onclick: () => { click(); this.options(); } }, 'Options'),
        h('button', { onclick: () => { click(); this.howTo(); } }, 'How to Play')),
      h('p', { class: 'hint' }, 'Best with a mouse. Click to aim with a locked pointer · Esc to pause'));
    this.root.append(menu);
  }

  // ── campaign ──
  campaign() {
    const reached = store.campaignLevelReached();
    const grid = h('div', { class: 'grid' });
    for (const L of LEVELS) {
      const open = L.n <= reached;
      const p = store.progressOf(L.id);
      grid.append(h('button', {
        class: 'card' + (open ? '' : ' locked'), disabled: !open,
        onclick: () => { click(); this.briefing(L, 'hunt'); },
      },
      h('div', { class: 'thumb', style: { backgroundImage: `url(${thumbnail(L.biome, L.tod)})` } }, h('span', { class: 'num' }, L.n), !open && h('span', { class: 'lock' }, '🔒')),
      h('div', { class: 'card-body' },
        h('strong', {}, L.name),
        h('small', {}, [...new Set(L.spawns.filter((s) => SPECIES[s.sp].counts !== false).map((s) => SPECIES[s.sp].name.replace(/ \(.*\)/, '')))].join(' · ')),
        h('div', { class: 'card-foot' }, stars(p.stars), p.best ? h('span', { class: 'best' }, p.best.toLocaleString()) : null))));
    }
    this.screen('Hunt Campaign', grid, { wide: true });
  }

  opUnlocked(o) { return store.options().unlockAll || store.progressOf('L' + o.unlock).passed; }

  ops() {
    const wrap = h('div', {});
    const cats = [...new Set(OPS.map((o) => o.cat))];
    for (const cat of cats) {
      const grid = h('div', { class: 'grid' });
      for (const o of OPS.filter((x) => x.cat === cat)) {
        const open = this.opUnlocked(o);
        const p = store.progressOf(o.id);
        grid.append(h('button', { class: 'card' + (open ? '' : ' locked'), disabled: !open, onclick: () => { click(); this.briefing(o, 'ops'); } },
          h('div', { class: 'thumb', style: { backgroundImage: `url(${thumbnail(o.biome, o.tod)})` } }, h('span', { class: 'num' }, o.n), o.filter && h('span', { class: 'chip' }, o.filter === 'nv' ? 'NIGHT VISION' : 'THERMAL'), !open && h('span', { class: 'lock' }, '🔒')),
          h('div', { class: 'card-body' },
            h('strong', {}, o.name),
            h('small', {}, open ? o.brief.split('. ')[0] + '.' : `Pass campaign level ${o.unlock} to unlock`),
            h('div', { class: 'card-foot' }, stars(p.stars), p.best ? h('span', { class: 'best' }, p.best.toLocaleString()) : null))));
      }
      wrap.append(h('h3', { class: 'cat' }, cat), grid);
    }
    this.screen('Military Ops', wrap, { wide: true });
  }

  // ── briefing + loadout ──
  briefing(def, kind) {
    const reached = store.campaignLevelReached();
    const gen = store.options().genericNames;
    let pool;
    if (kind === 'ops') pool = def.issue.map((id) => WEAPON_BY_ID[id]);
    else {
      const allowed = WEAPONS.filter((w) => !def.classes || def.classes.includes(w.cls));
      pool = allowed.filter((w) => w.unlock <= reached);
      if (!pool.length) pool = allowed.filter((w) => w.unlock === Math.min(...allowed.map((x) => x.unlock)));
    }
    const key = def.id;
    let sel = this.loadouts[key] || pool.slice().sort((a, b) => b.unlock - a.unlock || b.power - a.power).slice(0, 3).map((w) => w.id);
    sel = sel.filter((id) => pool.some((w) => w.id === id));
    if (!sel.length && pool.length) sel = [pool[0].id];

    const targets = h('ul', { class: 'targets' });
    const seen = new Set();
    for (const s of def.spawns || []) {
      if (seen.has(s.sp)) continue; seen.add(s.sp);
      const sp = { ...SPECIES[s.sp], ...(s.as || {}) };
      const bad = sp.counts === false;
      targets.append(h('li', { class: bad ? 'bad' : '' }, h('b', {}, sp.name), bad ? ` — penalty −${sp.penalty}` : ` — ${sp.points} pts · needs power ${sp.minPower}+`));
    }
    if (def.statics || def.plates) targets.append(h('li', {}, h('b', {}, 'Steel plates'), def.plates ? ' — unknown distances' : ` — ${[...new Set(def.statics.map((s) => s.d))].join(', ')} m`));
    if (def.boss || def.finale) targets.append(h('li', { class: 'boss' }, h('b', {}, 'Colossus'), ' — only the three glowing weak points take damage'));

    const list = h('div', { class: 'loadout' });
    const render = () => {
      list.innerHTML = '';
      for (const w of pool) {
        const on = sel.includes(w.id);
        list.append(h('button', {
          class: 'gun' + (on ? ' on' : ''),
          onclick: () => {
            click();
            if (on) { if (sel.length > 1) sel = sel.filter((x) => x !== w.id); } else if (sel.length < 3) sel = [...sel, w.id]; else sel = [...sel.slice(1), w.id];
            render();
          },
        }, h('strong', {}, weaponName(w, gen)), h('small', {}, `${w.caliber} · ${w.action} · ${w.mag} rd · ${opticLabel(w, def.noScopes)}`), bars(w)));
      }
      startBtn.disabled = !sel.length;
    };
    const startBtn = h('button', { class: 'primary big', onclick: () => { click(); this.loadouts[key] = sel; this.app.start(def, kind, sel); } }, 'Start');
    const objective = def.goal ? goalText(def) : `Hit ${def.need} of ${def.total}`;
    const body = h('div', { class: 'brief' },
      h('div', { class: 'brief-left' },
        h('div', { class: 'thumb big', style: { backgroundImage: `url(${thumbnail(def.biome, def.tod)})` } }),
        h('p', { class: 'lead' }, def.brief),
        h('p', { class: 'objective' }, objective),
        h('p', { class: 'meta' }, `${BIOMES[def.biome].name} · ${def.tod}${def.wind ? ` · wind ${def.wind[0]}–${def.wind[1]} m/s` : ''}${def.hp ? ' · you can be hurt' : ''}`),
        h('h4', {}, 'Targets'), targets),
      h('div', { class: 'brief-right' },
        h('h4', {}, kind === 'ops' ? `Issued weapons${pool.length > 3 ? ' (pick 3)' : ''}` : `Loadout (pick up to 3)${def.classes ? ' · ' + def.classes.map((c) => CLASSES[c]).join(', ') : ''}`),
        list, startBtn));
    this.screen(def.name, body, { wide: true });
    render();
  }

  // ── arsenal ──
  arsenal() {
    const gen = store.options().genericNames;
    const reached = store.campaignLevelReached();
    const wrap = h('div', {});
    for (const [cls, label] of Object.entries(CLASSES)) {
      const grid = h('div', { class: 'arsenal' });
      for (const w of WEAPONS.filter((x) => x.cls === cls)) {
        const open = w.unlock <= reached;
        grid.append(h('div', { class: 'gun-card' + (open ? '' : ' locked') },
          h('img', { class: 'profile', src: 'assets/' + weaponProfilePath(w.id), alt: '', onerror: (e) => e.target.remove() }),
          h('strong', {}, weaponName(w, gen)),
          h('small', {}, `${w.caliber} · ${w.action} · ${w.mag} rounds`),
          h('small', {}, `${opticLabel(w)} · ${w.vel} m/s${w.pellets ? ` · ${w.pellets} pellets · ${w.range} m` : ''}`),
          bars(w),
          h('em', {}, open ? (w.cls === 'military' ? 'Unlocked · also issued in Military Ops' : 'Unlocked') : `Unlocks at level ${w.unlock}`)));
      }
      wrap.append(h('h3', { class: 'cat' }, label), grid);
    }
    this.screen('Arsenal', wrap, { wide: true });
  }

  // ── hall of fame ──
  hall() {
    const rows = store.hall();
    const table = h('table', { class: 'hall' }, h('tr', {}, h('th', {}, '#'), h('th', {}, 'Name'), h('th', {}, 'Score'), h('th', {}, 'Mode'), h('th', {}, 'Date')));
    rows.forEach((r, i) => table.append(h('tr', {}, h('td', {}, i + 1), h('td', {}, r.name), h('td', {}, r.score.toLocaleString()), h('td', {}, r.mode), h('td', {}, r.date))));
    if (!rows.length) table.append(h('tr', {}, h('td', { colspan: 5 }, 'No scores yet. Go hunting.')));
    const bests = h('div', { class: 'bests' });
    for (const m of [...LEVELS, ...OPS]) {
      const p = store.progressOf(m.id);
      if (p.best) bests.append(h('div', {}, h('span', {}, m.name), stars(p.stars), h('b', {}, p.best.toLocaleString())));
    }
    this.screen('Hall of Fame', h('div', { class: 'hall-wrap' }, table, h('h4', {}, 'Best per level and op'), bests.childNodes.length ? bests : h('p', { class: 'meta' }, 'Nothing yet.')));
  }

  // ── options ──
  options(fromPause = false) {
    const o = store.options();
    const set = (k, v) => { store.setOption(k, v); this.app.applyOptions(); };
    const slider = (k, label, min, max, step) => h('label', { class: 'opt' }, h('span', {}, label),
      h('input', { type: 'range', min, max, step, value: o[k], oninput: (e) => { set(k, +e.target.value); e.target.nextSibling.textContent = (+e.target.value).toFixed(2); } }), h('output', {}, (+o[k]).toFixed(2)));
    const toggle = (k, label) => h('label', { class: 'opt' }, h('span', {}, label), h('input', { type: 'checkbox', checked: o[k], onchange: (e) => set(k, e.target.checked) }));
    const choice = (k, label, opts) => h('label', { class: 'opt' }, h('span', {}, label),
      h('select', { onchange: (e) => set(k, e.target.value) }, ...opts.map(([v, t]) => h('option', { value: v, selected: o[k] === v }, t))));
    const body = h('div', { class: 'options' },
      h('h4', {}, 'Aim'),
      slider('sensitivity', 'Mouse sensitivity', 0.3, 2.5, 0.05),
      slider('scopeSensitivity', 'Scope sensitivity', 0.2, 2, 0.05),
      choice('adsMode', 'Aim down sights', [['hold', 'Hold right mouse'], ['toggle', 'Toggle right mouse']]),
      choice('reticleColor', 'Reticle colour', [['#111111', 'Black'], ['#e8232a', 'Red'], ['#38ff6a', 'Green'], ['#ffffff', 'White']]),
      h('h4', {}, 'Realism'),
      choice('ballistics', 'Ballistics', [['realistic', 'Realistic (drop, wind, flight time)'], ['arcade', 'Arcade (instant, no drop)']]),
      toggle('autoDial', 'Rangefinder dials the scope for you'),
      toggle('genericNames', 'Use generic gun names'),
      h('h4', {}, 'Sound & display'),
      slider('masterVolume', 'Master volume', 0, 1, 0.05),
      slider('sfxVolume', 'Effects volume', 0, 1, 0.05),
      toggle('reduceFlashes', 'Reduce flashes'),
      toggle('showFps', 'Show FPS'),
      h('h4', {}, 'Progress'),
      toggle('unlockAll', 'Preview: unlock all levels, guns and ops'),
      h('button', { class: 'danger', onclick: () => { if (confirmReset()) { store.resetProgress(); this.options(fromPause); } } }, 'Reset progress and scores'));
    if (fromPause) {
      this.screen('Options', body, { back: false, dim: true });
      this.root.querySelector('.panel-head').firstChild.replaceWith(h('button', { class: 'back', onclick: () => { click(); this.pause(); } }, '← Back'));
    } else this.screen('Options', body);
  }

  howTo() {
    const rows = [
      ['Mouse', 'Aim'], ['Left click', 'Fire (hold for automatic guns)'], ['Right click', 'Aim down sights / scope'],
      ['Mouse wheel', 'Zoom when scoped · switch gun otherwise'], ['R', 'Reload'], ['1 · 2 · 3 · Q', 'Select gun · last gun'],
      ['Shift', 'Hold breath (about 4 s)'], ['F', 'Rangefinder and holdover'], ['Arrow keys', 'Dial elevation / windage (0.1 mil)'],
      ['Backspace', 'Turrets back to zero'], ['Esc · P', 'Pause'],
    ];
    const body = h('div', { class: 'howto' },
      h('table', {}, ...rows.map(([k, v]) => h('tr', {}, h('td', {}, h('kbd', {}, k)), h('td', {}, v)))),
      h('div', { class: 'tips' },
        h('h4', {}, 'How it works'),
        h('p', {}, 'Each level sends targets in waves. Hit enough of them to fill the quota bar. Misses and escapes turn grey.'),
        h('p', {}, 'Rounds take time to arrive and drop with distance. Lead moving targets, range far ones with F and hold over (or let the scope dial it).'),
        h('p', {}, 'A gun that is too weak wounds instead of kills. Protected birds, does in buck-only season and no-shoot targets cost points.'),
        h('p', {}, 'Vital-zone hits, long shots and combos score more.')));
    this.screen('How to Play', body);
  }

  // ── in-game overlays ──
  pause() {
    this.clear();
    this.root.classList.add('show', 'dim');
    this.root.append(h('div', { class: 'pause' },
      h('h2', {}, 'Paused'),
      h('button', { class: 'primary', onclick: () => { click(); this.app.resume(); } }, 'Resume'),
      h('button', { onclick: () => { click(); this.app.restart(); } }, 'Restart'),
      h('button', { onclick: () => { click(); this.options(true); } }, 'Options'),
      h('button', { onclick: () => { click(); this.app.quit(); } }, 'Quit to menu')));
  }

  results(def, kind, r, unlocks) {
    this.clear();
    this.root.classList.add('show', 'dim');
    const next = r.pass && kind === 'hunt' ? LEVELS.find((l) => l.n === def.n + 1) : null;
    const stat = (k, v) => h('div', { class: 'stat' }, h('span', {}, k), h('b', {}, v));
    const box = h('div', { class: 'results ' + (r.pass ? 'pass' : 'fail') },
      h('h2', {}, r.pass ? (kind === 'hunt' ? 'Level cleared' : 'Op complete') : 'Failed'),
      h('p', { class: 'reason' }, r.reason || (r.pass ? def.name : '')),
      h('div', { class: 'score' }, r.score.toLocaleString()),
      stars(r.stars),
      h('div', { class: 'stats' },
        r.quota && stat('Quota', r.quota),
        stat('Accuracy', `${Math.round(r.accuracy * 100)} %`),
        stat('Shots', r.shots), stat('Kills', r.kills), stat('Vital hits', r.vitals),
        stat('Longest shot', r.longest ? `${r.longest} m` : '—'), stat('Best combo', r.maxCombo), stat('Time', `${r.time.toFixed(0)} s`)),
      r.lines.length ? h('div', { class: 'bonus' }, ...r.lines.map(([k, v]) => h('div', {}, h('span', {}, k), h('b', {}, `+${v.toLocaleString()}`)))) : null,
      unlocks.length ? h('div', { class: 'unlocks' }, h('h4', {}, 'Unlocked'), ...unlocks.map((u) => h('div', {}, u))) : null);
    if (store.qualifiesForHall(r.score)) {
      const input = h('input', { maxlength: 3, placeholder: 'AAA', class: 'initials', autocomplete: 'off' });
      const save = h('button', { class: 'primary', onclick: () => { store.addToHall(input.value || 'YOU', r.score, def.name); click(); entry.replaceWith(h('p', { class: 'saved' }, 'Saved to the Hall of Fame.')); } }, 'Save');
      input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') save.click(); });
      const entry = h('div', { class: 'hall-entry' }, h('span', {}, 'New high score! Your initials:'), input, save);
      box.append(entry);
      setTimeout(() => input.focus(), 50);
    }
    box.append(h('div', { class: 'actions' },
      next ? h('button', { class: 'primary', onclick: () => { click(); this.briefing(next, 'hunt'); } }, `Next: ${next.name}`) : null,
      h('button', { onclick: () => { click(); this.app.restart(); } }, 'Retry'),
      h('button', { onclick: () => { click(); kind === 'hunt' ? this.campaign() : this.ops(); this.app.toMenu(); } }, kind === 'hunt' ? 'Campaign' : 'Ops'),
      h('button', { onclick: () => { click(); this.app.quit(); } }, 'Main menu')));
    this.root.append(box);
  }
}

function confirmReset() { try { return window.confirm('Reset all progress and high scores?'); } catch (e) { return true; } }

function opticLabel(w, noScopes) {
  const o = w.optic;
  if (noScopes && o.type !== 'bead') return 'Iron sights (no optics)';
  if (o.type === 'bead') return 'Bead sight';
  if (o.type === 'iron') return 'Iron sights';
  if (o.type === 'reddot') return `Red dot ${o.zoom[0]}–${o.zoom[1]}×`;
  return `${o.zoom[0]}–${o.zoom[1]}× ${({ duplex: 'duplex', bdc: 'BDC', mildot: 'mil-dot', lpvo: 'LPVO' })[o.reticle] || ''}`;
}

function bars(w) {
  const reach = Math.min(1, (w.pellets ? w.range / 1000 : (w.vel / 1000) * (w.dragL / 5200)) * 1.4);
  const row = (label, v) => h('div', { class: 'bar' }, h('span', {}, label), h('i', {}, h('b', { style: { width: `${Math.round(Math.max(0.04, Math.min(1, v)) * 100)}%` } })));
  return h('div', { class: 'bars' }, row('Power', w.power / 10), row('Reach', reach), row('Recoil', w.recoil), row('Steadiness', 1 - w.sway));
}

function goalText(d) {
  switch (d.goal) {
    case 'quota': return `Hit ${d.need} of ${d.total}${d.timeLimit ? ` within ${d.timeLimit} s` : ''}`;
    case 'score': return `Score ${d.need.toLocaleString()} in ${d.timeLimit} s${d.shots ? ` with ${d.shots} rounds` : ''}`;
    case 'survive': return `Survive ${d.timeLimit} s`;
    case 'clear': return `Knock down ${d.need}${d.statics ? ` of ${d.statics.length}` : d.plates ? ` of ${d.plates.n}` : ''} plates${d.timeLimit ? ` in ${d.timeLimit} s` : ''}${d.shots ? ` · ${d.shots} rounds` : ''}`;
    case 'boss': return 'Destroy the Colossus before it reaches you';
    case 'endless': return 'Survive as long as you can';
    default: return '';
  }
}
