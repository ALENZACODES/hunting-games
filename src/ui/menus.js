// Menus and overlays (DOM): title with career dashboard, campaign (10
// chapters × 10 levels), ops, briefing + loadout, arsenal, career, hall of
// fame, options, how to play, pause and results.

import { LEVELS, BIOMES, CHAPTERS, CONDITION_LABELS, LEVEL_COUNT } from '../data/levels.js';
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
const fmt = (n) => Math.round(n).toLocaleString();
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const fmtTime = (s) => { s = Math.round(s); const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60; return hh ? `${hh} h ${mm} m` : mm ? `${mm} m ${ss} s` : `${ss} s`; };
const bar = (value, max, label) => h('div', { class: 'pbar' }, h('div', { class: 'pbar-fill', style: { width: `${Math.min(100, pct(value, max))}%` } }), label ? h('span', {}, label) : null);
const chip = (text, kind = '') => h('span', { class: 'chip-tag ' + kind }, text);
const kv = (k, v, cls = '') => h('div', { class: 'kv ' + cls }, h('span', {}, k), h('b', {}, v));

const RANKS = [[0, 'Greenhorn'], [10, 'Apprentice'], [30, 'Hunter'], [60, 'Woodsman'], [100, 'Marksman'], [150, 'Guide'], [200, 'Sharpshooter'], [260, 'Master Hunter'], [320, 'Legend'], [370, 'Grand Slam Legend']];
const MAX_STARS = LEVEL_COUNT * 3 + OPS.length * 3;

function rankFor(starsTotal) {
  let i = 0;
  while (i + 1 < RANKS.length && starsTotal >= RANKS[i + 1][0]) i++;
  const next = RANKS[i + 1];
  return { name: RANKS[i][1], level: i + 1, from: RANKS[i][0], next: next ? next[1] : null, nextAt: next ? next[0] : null };
}

function totals() {
  return store.starTotals(LEVELS.map((l) => l.id), OPS.map((o) => o.id));
}

const CHIP_KIND = { fog: 'cool', wind: 'cool', timed: 'warn', trophy: 'gold', far: 'cool', swarm: 'warn', night: 'dark', nv: 'green', thermal: 'hot', boss: 'hot' };
const CHIP_HELP = {
  fog: 'Fog bank: targets fade with distance.', wind: 'Strong, gusting wind: hold or dial for drift.', timed: 'The quota must be met before the clock runs out.',
  trophy: 'A trophy animal may appear, worth triple.', far: 'Big game held at long range: range it and hold over.', swarm: 'More targets at once and faster waves.',
  night: 'Dark, with no optic help.', nv: 'Night-vision optic issued.', thermal: 'Thermal optic issued: warm targets glow white.', boss: 'The Colossus walks in once the quota is met.',
};

function levelTargets(def) {
  const seen = new Map();
  for (const s of def.spawns || []) {
    const sp = { ...SPECIES[s.sp], ...(s.as || {}) };
    if (!seen.has(sp.name)) seen.set(sp.name, sp);
  }
  return [...seen.values()];
}

function objectiveOf(def) {
  if (def.goal) return goalText(def);
  return `Hit ${def.need} of ${def.total}${def.timeLimit ? ` in ${def.timeLimit} s` : ''}${def.finale ? ', then destroy the Colossus' : ''}`;
}

function difficultyPips(diff = 1) {
  const n = Math.max(1, Math.min(5, Math.round((diff - 1) / 0.72 * 4) + 1));
  return h('span', { class: 'pips', title: `Difficulty ${n} of 5` }, ...Array.from({ length: 5 }, (_, i) => h('i', { class: i < n ? 'on' : '' })));
}

function nextLevel() {
  const reached = store.campaignLevelReached();
  return LEVELS.find((l) => !store.progressOf(l.id).passed && l.n <= reached) || null;
}

export class UI {
  constructor(root, app) {
    this.root = root; this.app = app;
    this.loadouts = {};
  }

  clear() { this.root.innerHTML = ''; this.root.classList.remove('show', 'dim', 'title-art'); }

  screen(title, body, { back = true, wide = false, dim = false, onBack = null, sub = null } = {}) {
    this.clear();
    this.root.classList.add('show');
    if (dim) this.root.classList.add('dim');
    const panel = h('div', { class: 'panel' + (wide ? ' wide' : '') },
      h('div', { class: 'panel-head' },
        back ? h('button', { class: 'back', onclick: () => { click(); (onBack || (() => this.title()))(); } }, '← Back') : h('span'),
        h('div', { class: 'panel-title' }, h('h2', {}, title), sub ? h('small', {}, sub) : null), h('span')),
      body);
    this.root.append(panel);
    return panel;
  }

  // ── title + career dashboard ──
  title() {
    this.clear();
    this.root.classList.add('show', 'title-art'); // assets/ui/title.jpg, if present, sits behind the menu
    const reached = store.campaignLevelReached();
    const t = totals();
    const st = store.stats();
    const allStars = t.campaignStars + t.opStars;
    const rank = rankFor(allStars);
    const opsOpen = OPS.filter((o) => this.opUnlocked(o)).length;
    const gunsOpen = WEAPONS.filter((w) => w.unlock <= reached).length;
    const next = nextLevel();
    const best = store.hall()[0];

    const menu = h('nav', { class: 'menu' },
      next ? h('button', { class: 'primary', onclick: () => { click(); this.briefing(next, 'hunt'); } }, 'Continue', h('small', {}, `Level ${next.n} · ${next.name}`)) : null,
      h('button', { class: next ? '' : 'primary', onclick: () => { click(); this.campaign(); } }, 'Hunt Campaign', h('small', {}, `${t.campaignPassed} / ${LEVEL_COUNT} cleared · ${t.campaignStars} ★`)),
      h('button', { onclick: () => { click(); this.ops(); } }, 'Military Ops', h('small', {}, `${opsOpen} / ${OPS.length} open · ${t.opStars} ★`)),
      h('button', { onclick: () => { click(); this.arsenal(); } }, 'Arsenal', h('small', {}, `${gunsOpen} / ${WEAPONS.length} guns`)),
      h('button', { onclick: () => { click(); this.career(); } }, 'Career & Stats', h('small', {}, rank.name)),
      h('button', { onclick: () => { click(); this.hall(); } }, 'Hall of Fame', h('small', {}, best ? `Top ${fmt(best.score)}` : 'No scores yet')),
      h('button', { onclick: () => { click(); this.options(); } }, 'Options'),
      h('button', { onclick: () => { click(); this.howTo(); } }, 'How to Play'));

    const chapterStrip = h('div', { class: 'chapter-strip' }, ...CHAPTERS.map((ch) => {
      const ids = LEVELS.filter((l) => l.chapter === ch.n);
      const passed = ids.filter((l) => store.progressOf(l.id).passed).length;
      return h('div', { class: 'seg' + (passed === 10 ? ' done' : passed ? ' part' : ''), title: `Chapter ${ch.n}: ${ch.name} — ${passed}/10` }, h('i', { style: { height: `${passed * 10}%` } }));
    }));

    const card = h('aside', { class: 'career-card' },
      h('div', { class: 'rank' }, h('span', { class: 'rank-badge' }, rank.level), h('div', {}, h('small', {}, 'Rank'), h('strong', {}, rank.name))),
      rank.next ? h('div', { class: 'rank-next' }, bar(allStars - rank.from, rank.nextAt - rank.from), h('small', {}, `${allStars} ★ · ${rank.nextAt - allStars} more for ${rank.next}`)) : h('small', {}, `${allStars} ★ · top rank`),
      h('h4', {}, 'Campaign'),
      bar(t.campaignPassed, LEVEL_COUNT, `${t.campaignPassed} / ${LEVEL_COUNT} levels · ${t.campaignStars} / ${LEVEL_COUNT * 3} ★`),
      chapterStrip,
      h('h4', {}, 'Military Ops'),
      bar(t.opsPassed, OPS.length, `${t.opsPassed} / ${OPS.length} complete · ${t.opStars} / ${OPS.length * 3} ★`),
      h('h4', {}, 'Career'),
      st.runs ? h('div', { class: 'kv-grid' },
        kv('Accuracy', `${pct(st.hits, st.shots)} %`), kv('Kills', fmt(st.kills)),
        kv('Longest shot', st.longest ? `${st.longest} m` : '—'), kv('Trophies', st.trophies),
        kv('Hunts played', st.runs), kv('Time in the field', fmtTime(st.time))) : h('p', { class: 'meta' }, 'No hunts yet. Start with Level 1, Marsh Dawn.'));

    this.root.append(h('div', { class: 'title-layout' },
      h('div', { class: 'title' },
        h('div', { class: 'logo' }, h('span', { class: 'logo-top' }, 'HUNTING'), h('span', { class: 'logo-bottom' }, 'GAMES')),
        h('p', { class: 'tag' }, `Field to frontier. ${LEVEL_COUNT} levels in 10 chapters · 25 real firearms · 25 military ops.`),
        menu,
        h('p', { class: 'hint' }, 'Best with a mouse. Click to aim with a locked pointer · Esc to pause')),
      card));
  }

  // ── campaign: chapter tabs ──
  campaign(chapterN) {
    const reached = store.campaignLevelReached();
    const ui = store.uiState();
    const auto = nextLevel();
    let cn = chapterN || ui.chapter || (auto ? auto.chapter : 1);
    store.setUi('chapter', cn);
    const ch = CHAPTERS[cn - 1];
    const tabs = h('div', { class: 'tabs' }, ...CHAPTERS.map((c) => {
      const lv = LEVELS.filter((l) => l.chapter === c.n);
      const open = lv[0].n <= reached;
      const st = lv.reduce((a, l) => a + store.progressOf(l.id).stars, 0);
      const done = lv.filter((l) => store.progressOf(l.id).passed).length;
      return h('button', { class: 'tab' + (c.n === cn ? ' on' : '') + (open ? '' : ' locked'), disabled: !open, onclick: () => { click(); this.campaign(c.n); } },
        h('span', { class: 'tab-n' }, c.n), h('span', { class: 'tab-name' }, c.name), h('small', {}, open ? `${done}/10 · ${st}★` : '🔒'));
    }));
    const levels = LEVELS.filter((l) => l.chapter === cn);
    const chStars = levels.reduce((a, l) => a + store.progressOf(l.id).stars, 0);
    const chDone = levels.filter((l) => store.progressOf(l.id).passed).length;
    const header = h('div', { class: 'chapter-head' },
      h('div', {},
        h('h3', {}, `Chapter ${ch.n} · ${ch.name}`),
        h('p', { class: 'lead' }, ch.tag),
        h('p', { class: 'meta' }, `Guns: ${ch.classes ? ch.classes.map((c) => CLASSES[c]).join(', ') : 'any'}${ch.hp ? ' · animals and aliens can hurt you' : ''} · Levels ${levels[0].n}–${levels[9].n}`)),
      h('div', { class: 'chapter-progress' }, bar(chDone, 10, `${chDone} / 10 cleared`), bar(chStars, 30, `${chStars} / 30 ★`)));
    const grid = h('div', { class: 'grid levels' });
    for (const L of levels) {
      const open = L.n <= reached;
      const p = store.progressOf(L.id);
      const targets = levelTargets(L).filter((sp) => sp.counts !== false && !sp.trophy).map((sp) => sp.name.replace(/ \(.*\)/, ''));
      grid.append(h('button', { class: 'card' + (open ? '' : ' locked') + (auto && auto.id === L.id ? ' next' : ''), disabled: !open, onclick: () => { click(); this.briefing(L, 'hunt'); } },
        h('div', { class: 'thumb', style: { backgroundImage: `url(${thumbnail(L.biome, L.tod)})` } },
          h('span', { class: 'num' }, L.n), !open && h('span', { class: 'lock' }, '🔒'), p.passed && h('span', { class: 'done' }, '✓'),
          auto && auto.id === L.id ? h('span', { class: 'next-tag' }, 'NEXT') : null),
        h('div', { class: 'card-body' },
          h('strong', {}, L.name),
          h('small', {}, targets.join(' · ')),
          h('div', { class: 'obj' }, objectiveOf(L)),
          h('div', { class: 'chips' }, ...(L.cond || []).map((c) => chip(CONDITION_LABELS[c], CHIP_KIND[c]))),
          h('div', { class: 'card-foot' }, stars(p.stars), difficultyPips(L.diff), p.best ? h('span', { class: 'best' }, fmt(p.best)) : h('span', { class: 'meta' }, open ? 'New' : '')))));
    }
    this.screen('Hunt Campaign', h('div', {}, tabs, header, grid), { wide: true, sub: `${totals().campaignPassed} / ${LEVEL_COUNT} cleared` });
  }

  opUnlocked(o) { return store.options().unlockAll || store.progressOf('L' + o.unlock).passed; }

  ops() {
    const wrap = h('div', {});
    const cats = [...new Set(OPS.map((o) => o.cat))];
    const gen = store.options().genericNames;
    for (const cat of cats) {
      const grid = h('div', { class: 'grid' });
      for (const o of OPS.filter((x) => x.cat === cat)) {
        const open = this.opUnlocked(o);
        const p = store.progressOf(o.id);
        const chips = [o.filter === 'nv' && chip('Night vision', 'green'), o.filter === 'thermal' && chip('Thermal', 'hot'), o.fog && chip('Fog', 'cool'), o.platform && chip('Moving platform', 'warn'), o.hp && chip('You can be hurt', 'warn'), o.shots && chip(`${o.shots} rounds`, 'gold')].filter(Boolean);
        grid.append(h('button', { class: 'card' + (open ? '' : ' locked'), disabled: !open, onclick: () => { click(); this.briefing(o, 'ops'); } },
          h('div', { class: 'thumb', style: { backgroundImage: `url(${thumbnail(o.biome, o.tod)})` } }, h('span', { class: 'num' }, o.n), !open && h('span', { class: 'lock' }, '🔒'), p.passed && h('span', { class: 'done' }, '✓')),
          h('div', { class: 'card-body' },
            h('strong', {}, o.name),
            h('small', {}, open ? o.brief.split('. ')[0] + '.' : `Clear campaign level ${o.unlock} to unlock`),
            h('div', { class: 'obj' }, goalText(o)),
            h('div', { class: 'chips' }, ...chips),
            h('small', { class: 'issued' }, 'Issued: ' + o.issue.map((id) => weaponName(WEAPON_BY_ID[id], gen)).join(', ')),
            h('div', { class: 'card-foot' }, stars(p.stars), p.best ? h('span', { class: 'best' }, fmt(p.best)) : null))));
      }
      wrap.append(h('h3', { class: 'cat' }, cat), grid);
    }
    const t = totals();
    this.screen('Military Ops', wrap, { wide: true, sub: `${t.opsPassed} / ${OPS.length} complete · ${t.opStars} ★` });
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
    const needs = Math.max(...levelTargets(def).filter((sp) => sp.counts !== false).map((sp) => sp.minPower || 1), 1);
    const scoped = (w) => (w.optic.type === 'scope' ? 1 : 0);
    let sel = this.loadouts[key] || pool.slice().sort((a, b) => (b.power >= needs) - (a.power >= needs) || b.power - a.power || scoped(b) - scoped(a) || b.unlock - a.unlock).slice(0, 3).map((w) => w.id);
    sel = sel.filter((id) => pool.some((w) => w.id === id));
    if (!sel.length && pool.length) sel = [pool[0].id];

    const targets = h('ul', { class: 'targets' });
    for (const sp of levelTargets(def)) {
      const bad = sp.counts === false;
      targets.append(h('li', { class: bad ? 'bad' : sp.trophy ? 'gold' : '' }, h('b', {}, sp.name),
        bad ? ` — do not shoot, −${sp.penalty}` : ` — ${sp.points} pts · gun power ${sp.minPower}+${sp.hp > 1 ? ` · ${sp.hp} hits` : ''}${sp.chargeWhenWounded ? ' · charges if wounded' : ''}${sp.damage && sp.family === 'alien' ? ' · attacks' : ''}`));
    }
    if (def.statics || def.plates) targets.append(h('li', {}, h('b', {}, 'Steel plates'), def.plates ? ' — unknown distances' : ` — ${[...new Set(def.statics.map((s) => s.d))].join(', ')} m`));
    if (def.boss || def.finale) targets.append(h('li', { class: 'boss' }, h('b', {}, 'Colossus'), ' — only the three glowing weak points take damage'));

    const list = h('div', { class: 'loadout' });
    const render = () => {
      list.innerHTML = '';
      for (const w of pool) {
        const on = sel.includes(w.id);
        const weak = w.power < needs;
        list.append(h('button', {
          class: 'gun' + (on ? ' on' : ''),
          onclick: () => {
            click();
            if (on) { if (sel.length > 1) sel = sel.filter((x) => x !== w.id); } else if (sel.length < 3) sel = [...sel, w.id]; else sel = [...sel.slice(1), w.id];
            render();
          },
        }, h('strong', {}, weaponName(w, gen), on ? h('em', { class: 'slot' }, `slot ${sel.indexOf(w.id) + 1}`) : null),
        h('small', {}, `${w.caliber} · ${w.action} · ${w.mag} rd · ${opticLabel(w, def.noScopes)}`),
        weak ? h('small', { class: 'warn-text' }, `Power ${w.power}: too light for some targets here`) : null,
        bars(w)));
      }
      startBtn.disabled = !sel.length;
    };
    const startBtn = h('button', { class: 'primary big', onclick: () => { click(); this.loadouts[key] = sel; this.app.start(def, kind, sel); } }, 'Start');
    const p = store.progressOf(def.id);
    const ch = kind === 'hunt' ? CHAPTERS[def.chapter - 1] : null;
    const conds = (def.cond || []).map((c) => h('li', {}, chip(CONDITION_LABELS[c], CHIP_KIND[c]), ' ', CHIP_HELP[c]));
    const starRule = def.goal && def.goal !== 'quota'
      ? { score: `★ reach ${fmt(def.need || 0)} · ★★ 1.4× · ★★★ 2×`, survive: '★ survive · ★★ 35 % health left · ★★★ 70 % health left', boss: '★ destroy it · ★★ 35 % health left · ★★★ 70 % health left', clear: '★ clear the target · ★★ every plate · ★★★ every plate with 70 % accuracy', endless: '★ 30 s · ★★ 90 s · ★★★ 180 s' }[def.goal]
      : '★ meet the quota · ★★ hit 85 % of all targets · ★★★ hit them all with 60 % accuracy';
    const body = h('div', { class: 'brief' },
      h('div', { class: 'brief-left' },
        h('div', { class: 'thumb big', style: { backgroundImage: `url(${thumbnail(def.biome, def.tod)})` } }),
        h('p', { class: 'lead' }, def.brief),
        h('p', { class: 'objective' }, objectiveOf(def)),
        h('div', { class: 'kv-grid' },
          kv('Setting', `${BIOMES[def.biome].name}, ${def.filter === 'nv' ? 'night (NV)' : def.filter === 'thermal' ? 'night (thermal)' : def.tod}`),
          kv('Wind', def.wind ? `${def.wind[0]}–${def.wind[1]} m/s` : 'light'),
          kv('Difficulty', difficultyPips(def.diff || (kind === 'ops' ? 1.3 : 1))),
          kv('Health', def.hp ? `${def.hp}` : 'not at risk'),
          kv('Your best', p.best ? fmt(p.best) : '—'),
          kv('Played', p.plays ? `${p.plays}×` : 'never')),
        conds.length ? h('ul', { class: 'conds' }, ...conds) : null,
        h('h4', {}, 'Targets'), targets,
        h('p', { class: 'meta star-rule' }, starRule)),
      h('div', { class: 'brief-right' },
        h('h4', {}, kind === 'ops' ? `Issued weapons${pool.length > 3 ? ' (pick 3)' : ''}` : `Loadout (pick up to 3)${def.classes ? ' · ' + def.classes.map((c) => CLASSES[c]).join(', ') : ' · any gun'}`),
        list, startBtn));
    const sub = kind === 'hunt' ? `Chapter ${ch.n} · ${ch.name} · Level ${def.n} of ${LEVEL_COUNT}` : `Military Op ${def.n} of ${OPS.length} · ${def.cat}`;
    this.screen(def.name, body, { wide: true, sub, onBack: () => (kind === 'hunt' ? this.campaign(def.chapter) : this.ops()) });
    render();
  }

  // ── career ──
  career() {
    const st = store.stats();
    const t = totals();
    const allStars = t.campaignStars + t.opStars;
    const rank = rankFor(allStars);
    const gen = store.options().genericNames;
    const chRows = CHAPTERS.map((c) => {
      const lv = LEVELS.filter((l) => l.chapter === c.n);
      const done = lv.filter((l) => store.progressOf(l.id).passed).length;
      const s = lv.reduce((a, l) => a + store.progressOf(l.id).stars, 0);
      const best = lv.reduce((a, l) => a + store.progressOf(l.id).best, 0);
      return h('tr', {}, h('td', {}, c.n), h('td', {}, c.name), h('td', {}, `${done}/10`), h('td', {}, `${s}/30`), h('td', {}, best ? fmt(best) : '—'));
    });
    const species = Object.entries(st.species).sort((a, b) => b[1] - a[1]);
    const guns = Object.entries(st.weapons).sort((a, b) => b[1].kills - a[1].kills);
    const body = h('div', { class: 'career' },
      h('div', { class: 'career-top' },
        h('div', { class: 'rank big' }, h('span', { class: 'rank-badge' }, rank.level), h('div', {}, h('small', {}, 'Rank'), h('strong', {}, rank.name),
          h('small', {}, rank.next ? `${allStars} / ${MAX_STARS} ★ · ${rank.nextAt - allStars} to ${rank.next}` : `${allStars} / ${MAX_STARS} ★`))),
        h('div', { class: 'kv-grid wide' },
          kv('Hunts played', st.runs), kv('Cleared', st.passes), kv('Shots fired', fmt(st.shots)), kv('Accuracy', `${pct(st.hits, st.shots)} %`),
          kv('Kills', fmt(st.kills)), kv('Vital hits', fmt(st.vitals)), kv('Longest shot', st.longest ? `${st.longest} m${st.longestWith ? ' · ' + weaponName(WEAPON_BY_ID[st.longestWith] || { name: st.longestWith, generic: st.longestWith }, gen) : ''}` : '—'),
          kv('Best combo', st.bestCombo), kv('Trophies', st.trophies), kv('Penalties', st.penalties), kv('Time in the field', fmtTime(st.time)), kv('Military Ops', `${t.opsPassed}/${OPS.length}`))),
      h('div', { class: 'career-cols' },
        h('div', {}, h('h4', {}, 'Campaign by chapter'),
          h('table', { class: 'hall' }, h('tr', {}, h('th', {}, '#'), h('th', {}, 'Chapter'), h('th', {}, 'Cleared'), h('th', {}, 'Stars'), h('th', {}, 'Best total')), ...chRows)),
        h('div', {}, h('h4', {}, 'Bag'),
          species.length ? h('table', { class: 'hall' }, h('tr', {}, h('th', {}, 'Species'), h('th', {}, 'Taken')), ...species.map(([k, v]) => h('tr', {}, h('td', {}, k), h('td', {}, v)))) : h('p', { class: 'meta' }, 'Nothing taken yet.'),
          h('h4', {}, 'Guns'),
          guns.length ? h('table', { class: 'hall' }, h('tr', {}, h('th', {}, 'Gun'), h('th', {}, 'Shots'), h('th', {}, 'Kills'), h('th', {}, 'Kills / shot')),
            ...guns.map(([id, v]) => h('tr', {}, h('td', {}, WEAPON_BY_ID[id] ? weaponName(WEAPON_BY_ID[id], gen) : id), h('td', {}, v.shots), h('td', {}, v.kills), h('td', {}, v.shots ? (v.kills / v.shots).toFixed(2) : '—')))) : h('p', { class: 'meta' }, 'No shots fired yet.'))));
    this.screen('Career & Stats', body, { wide: true });
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
          h('em', {}, open ? (w.cls === 'military' ? 'Unlocked · also issued in Military Ops' : 'Unlocked') : `Unlocks at level ${w.unlock} · Chapter ${Math.ceil(w.unlock / 10)}`)));
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
    const s = this.app.session;
    const c = this.app.current || {};
    const def = c.def || {};
    const info = [];
    if (s) {
      const hits = s.slots.filter((x) => x === 'hit').length;
      info.push(kv('Score', fmt(s.score)));
      if (s.goal === 'quota' && s.total) info.push(kv('Quota', `${hits} / ${s.total} (need ${s.need})`));
      if (s.goal === 'clear') info.push(kv('Plates', `${s.statics.filter((e) => e.state !== 'alive').length} / ${s.statics.length}`));
      if (s.timeLeft != null) info.push(kv('Time left', `${Math.ceil(s.timeLeft)} s`));
      if (s.hp != null) info.push(kv(def.hpLabel || 'Health', `${Math.round(s.hp)} / ${s.maxHp}`));
      info.push(kv('Shots', s.shots), kv('Accuracy', `${pct(s.shotHits, s.shots)} %`), kv('Combo', s.combo), kv('Wind', `${Math.abs(s.wind).toFixed(1)} m/s ${s.wind >= 0 ? '→' : '←'}`));
      if (s.gun) info.push(kv('Gun', `${weaponName(s.gun.def, store.options().genericNames)} · ${s.gun.ammo}/${s.gun.def.mag}`));
    }
    const keys = [['Left click', 'Fire'], ['Right click', 'Aim / scope'], ['Wheel', 'Zoom · switch gun'], ['R', 'Reload'], ['1 2 3 Q', 'Guns'], ['Shift', 'Hold breath'], ['F', 'Range'], ['Arrows', 'Dial turrets']];
    this.root.append(h('div', { class: 'pause-wrap' },
      h('div', { class: 'pause' },
        h('h2', {}, 'Paused'),
        h('p', { class: 'meta' }, c.kind === 'hunt' ? `Level ${def.n} · ${def.name}` : def.name || ''),
        h('p', { class: 'objective' }, def.n || def.goal ? objectiveOf(def) : ''),
        h('button', { class: 'primary', onclick: () => { click(); this.app.resume(); } }, 'Resume'),
        h('button', { onclick: () => { click(); this.app.restart(); } }, 'Restart'),
        h('button', { onclick: () => { click(); this.options(true); } }, 'Options'),
        h('button', { onclick: () => { click(); this.app.quit(); } }, 'Quit to menu')),
      h('div', { class: 'pause-side' },
        h('h4', {}, 'This run'), h('div', { class: 'kv-grid' }, ...info),
        h('h4', {}, 'Controls'), h('table', { class: 'keys' }, ...keys.map(([k, v]) => h('tr', {}, h('td', {}, h('kbd', {}, k)), h('td', {}, v)))))));
  }

  results(def, kind, r, unlocks) {
    this.clear();
    this.root.classList.add('show', 'dim');
    const gen = store.options().genericNames;
    const next = r.pass && kind === 'hunt' ? LEVELS.find((l) => l.n === def.n + 1) : null;
    const before = r.before || { best: 0, plays: 0 };
    const newBest = r.score > before.best;
    const stat = (k, v) => h('div', { class: 'stat' }, h('span', {}, k), h('b', {}, v));
    const t = r.tally || { species: {}, weapons: {}, penalties: {} };
    const bag = Object.entries(t.species).sort((a, b) => b[1] - a[1]);
    const pens = Object.entries(t.penalties);
    const guns = Object.entries(t.weapons).filter(([, v]) => v.shots);
    const records = [];
    if (newBest && before.plays) records.push(`New personal best (was ${fmt(before.best)})`);
    else if (newBest) records.push('First score on this level');
    if (r.careerBefore && r.longest > r.careerBefore.longest && r.longest) records.push(`New career longest shot: ${r.longest} m`);
    if (bag.some(([k]) => k.startsWith('Trophy'))) records.push('Trophy taken');
    let chapterLine = null;
    if (kind === 'hunt') {
      const ch = CHAPTERS[def.chapter - 1];
      const lv = LEVELS.filter((l) => l.chapter === ch.n);
      const done = lv.filter((l) => store.progressOf(l.id).passed).length;
      const st = lv.reduce((a, l) => a + store.progressOf(l.id).stars, 0);
      chapterLine = h('div', { class: 'chapter-line' }, h('span', {}, `Chapter ${ch.n} · ${ch.name}`), bar(done, 10, `${done}/10 cleared · ${st}/30 ★`));
    }
    const box = h('div', { class: 'results ' + (r.pass ? 'pass' : 'fail') },
      h('h2', {}, r.pass ? (kind === 'hunt' ? 'Level cleared' : 'Op complete') : 'Failed'),
      h('p', { class: 'reason' }, (kind === 'hunt' ? `Level ${def.n} · ` : '') + def.name + (r.reason ? ` — ${r.reason}` : '')),
      h('div', { class: 'score' }, fmt(r.score)),
      h('div', { class: 'score-sub' }, stars(r.stars), newBest ? chip('New best', 'gold') : chip(`Best ${fmt(Math.max(before.best, r.score))}`)),
      h('div', { class: 'stats' },
        r.quota && stat('Quota', `${r.quota} (need ${r.need})`),
        stat('Accuracy', `${Math.round(r.accuracy * 100)} %`),
        stat('Shots · hits', `${r.shots} · ${r.hits}`), stat('Kills', r.kills), stat('Vital hits', r.vitals),
        stat('Longest shot', r.longest ? `${r.longest} m` : '—'), stat('Best combo', r.maxCombo), stat('Time', `${r.time.toFixed(0)} s`),
        r.maxHp ? stat('Health left', `${Math.round(r.hp)} / ${r.maxHp}`) : null),
      h('div', { class: 'results-cols' },
        h('div', {}, h('h4', {}, 'Bag'),
          bag.length || pens.length ? h('div', { class: 'bag' }, ...bag.map(([k, v]) => h('div', { class: k.startsWith('Trophy') ? 'gold' : '' }, h('span', {}, k), h('b', {}, `×${v}`))), ...pens.map(([k, v]) => h('div', { class: 'bad' }, h('span', {}, k), h('b', {}, `×${v}`)))) : h('p', { class: 'meta' }, 'Nothing taken.')),
        h('div', {}, h('h4', {}, 'Guns'),
          guns.length ? h('div', { class: 'bag' }, ...guns.map(([id, v]) => h('div', {}, h('span', {}, WEAPON_BY_ID[id] ? weaponName(WEAPON_BY_ID[id], gen) : id), h('b', {}, `${v.kills} / ${v.shots}`)))) : h('p', { class: 'meta' }, 'No shots fired.'),
          r.lines.length ? h('h4', {}, 'Bonuses') : null,
          r.lines.length ? h('div', { class: 'bonus' }, ...r.lines.map(([k, v]) => h('div', {}, h('span', {}, k), h('b', {}, `+${fmt(v)}`)))) : null)),
      records.length ? h('div', { class: 'records' }, ...records.map((x) => h('div', {}, '★ ' + x))) : null,
      unlocks.length ? h('div', { class: 'unlocks' }, h('h4', {}, 'Unlocked'), ...unlocks.map((u) => h('div', {}, u))) : null,
      chapterLine);
    if (store.qualifiesForHall(r.score)) {
      const input = h('input', { maxlength: 3, placeholder: 'AAA', class: 'initials', autocomplete: 'off' });
      const save = h('button', { class: 'primary', onclick: () => { store.addToHall(input.value || 'YOU', r.score, def.name); click(); entry.replaceWith(h('p', { class: 'saved' }, 'Saved to the Hall of Fame.')); } }, 'Save');
      input.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') save.click(); });
      const entry = h('div', { class: 'hall-entry' }, h('span', {}, 'New high score! Your initials:'), input, save);
      box.append(entry);
      setTimeout(() => input.focus({ preventScroll: true }), 50);
    }
    box.append(h('div', { class: 'actions' },
      next ? h('button', { class: 'primary', onclick: () => { click(); this.briefing(next, 'hunt'); } }, `Next: Level ${next.n}`) : null,
      h('button', { onclick: () => { click(); this.app.restart(); } }, 'Retry'),
      h('button', { onclick: () => { click(); this.app.toMenu(); kind === 'hunt' ? this.campaign(def.chapter) : this.ops(); } }, kind === 'hunt' ? 'Chapter' : 'Ops'),
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
