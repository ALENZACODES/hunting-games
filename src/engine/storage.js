// Save data: progress, high scores and options, kept in local storage.
// Storage can be unavailable (private mode, sandboxed frames), so every access
// is guarded and the game keeps working from memory.

import { LEVEL_COUNT } from '../data/levels.js';

const KEY = 'hunting-games.v1';

export const DEFAULT_OPTIONS = {
  sensitivity: 1.0,
  scopeSensitivity: 0.8,
  adsMode: 'hold', // hold | toggle
  ballistics: 'realistic', // realistic | arcade
  autoDial: true,
  reticleColor: '#111111',
  masterVolume: 0.8,
  sfxVolume: 0.9,
  showFps: false,
  reduceFlashes: false,
  genericNames: false,
  unlockAll: false,
};

const blankStats = () => ({
  runs: 0, passes: 0, shots: 0, hits: 0, kills: 0, vitals: 0, longest: 0, longestWith: '', time: 0,
  bestCombo: 0, penalties: 0, trophies: 0, species: {}, weapons: {},
});

const blank = () => ({
  options: { ...DEFAULT_OPTIONS },
  progress: {}, // modeId -> { passed, stars, best, plays, lastScore }
  hall: [], // [{ name, score, mode, date }]
  stats: blankStats(),
  ui: { chapter: 1 },
});

let state = blank();

export function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...blank(), ...parsed, options: { ...DEFAULT_OPTIONS, ...(parsed.options || {}) }, stats: { ...blankStats(), ...(parsed.stats || {}) }, ui: { chapter: 1, ...(parsed.ui || {}) } };
    }
  } catch (e) { /* storage unavailable */ }
  return state;
}

export function save() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export const options = () => state.options;
export function setOption(k, v) { state.options[k] = v; save(); }

export function progressOf(modeId) { return { passed: false, stars: 0, best: 0, plays: 0, lastScore: 0, ...(state.progress[modeId] || {}) }; }

export function recordResult(modeId, { passed, stars, score }) {
  const p = progressOf(modeId);
  state.progress[modeId] = {
    passed: p.passed || passed,
    stars: Math.max(p.stars, passed ? stars : 0),
    best: Math.max(p.best, score),
    plays: p.plays + 1,
    lastScore: score,
  };
  save();
  return p; // the record before this run, for comparisons
}

export function stats() { return state.stats; }

// lifetime career totals
export function recordStats(r) {
  const s = state.stats;
  s.runs++; if (r.pass) s.passes++;
  s.shots += r.shots; s.hits += r.hits; s.kills += r.kills; s.vitals += r.vitals;
  s.time += r.time; s.bestCombo = Math.max(s.bestCombo, r.maxCombo || 0);
  if (r.longest > s.longest) { s.longest = r.longest; s.longestWith = r.longestWith || ''; }
  const t = r.tally || { species: {}, weapons: {}, penalties: {} };
  for (const [k, v] of Object.entries(t.species)) { s.species[k] = (s.species[k] || 0) + v; if (k.startsWith('Trophy')) s.trophies += v; }
  for (const [k, v] of Object.entries(t.weapons)) { const w = s.weapons[k] || (s.weapons[k] = { shots: 0, kills: 0 }); w.shots += v.shots; w.kills += v.kills; }
  for (const v of Object.values(t.penalties)) s.penalties += v;
  save();
}

export function uiState() { return state.ui; }
export function setUi(k, v) { state.ui[k] = v; save(); }

export function starTotals(levelIds, opIds) {
  const sum = (ids) => ids.reduce((a, id) => a + progressOf(id).stars, 0);
  const passed = (ids) => ids.filter((id) => progressOf(id).passed).length;
  return { campaignStars: sum(levelIds), campaignPassed: passed(levelIds), opStars: sum(opIds), opsPassed: passed(opIds) };
}

export function hall() { return state.hall; }

export function qualifiesForHall(score) {
  if (score <= 0) return false;
  return state.hall.length < 10 || score > state.hall[state.hall.length - 1].score;
}

export function addToHall(name, score, mode) {
  state.hall.push({ name: (name || 'YOU').toUpperCase().slice(0, 3), score, mode, date: new Date().toISOString().slice(0, 10) });
  state.hall.sort((a, b) => b.score - a.score);
  state.hall = state.hall.slice(0, 10);
  save();
}

export function campaignLevelReached() {
  // highest level number that is playable (passed levels + 1)
  let n = 1;
  for (let i = 1; i <= LEVEL_COUNT; i++) if (progressOf('L' + i).passed) n = i + 1;
  return state.options.unlockAll ? LEVEL_COUNT + 1 : n;
}

export function resetProgress() {
  const keepOptions = state.options;
  state = blank();
  state.options = keepOptions;
  save();
}
