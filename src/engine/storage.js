// Save data: progress, high scores and options, kept in local storage.
// Storage can be unavailable (private mode, sandboxed frames), so every access
// is guarded and the game keeps working from memory.

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

const blank = () => ({
  options: { ...DEFAULT_OPTIONS },
  progress: {}, // modeId -> { passed, stars, best }
  hall: [], // [{ name, score, mode, date }]
});

let state = blank();

export function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...blank(), ...parsed, options: { ...DEFAULT_OPTIONS, ...(parsed.options || {}) } };
    }
  } catch (e) { /* storage unavailable */ }
  return state;
}

export function save() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export const options = () => state.options;
export function setOption(k, v) { state.options[k] = v; save(); }

export function progressOf(modeId) { return state.progress[modeId] || { passed: false, stars: 0, best: 0 }; }

export function recordResult(modeId, { passed, stars, score }) {
  const p = progressOf(modeId);
  state.progress[modeId] = {
    passed: p.passed || passed,
    stars: Math.max(p.stars, passed ? stars : 0),
    best: Math.max(p.best, score),
  };
  save();
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
  for (let i = 1; i <= 12; i++) if (progressOf('L' + i).passed) n = i + 1;
  return state.options.unlockAll ? 13 : n;
}

export function resetProgress() {
  const keepOptions = state.options;
  state = blank();
  state.options = keepOptions;
  save();
}
