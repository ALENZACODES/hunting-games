// Synthesized sound. No audio files are needed; every sound is built from
// noise and oscillators with Web Audio. Recorded sounds can replace any of
// these later without touching the game code.

let ac = null, master = null, sfxBus = null, echo = null, noiseBuf = null;
let windGain = null, windFilter = null;
let vol = { master: 0.8, sfx: 0.9 };

export function initAudio() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ac = new AC();
  master = ac.createGain();
  master.gain.value = vol.master;
  master.connect(ac.destination);
  sfxBus = ac.createGain();
  sfxBus.gain.value = vol.sfx;
  sfxBus.connect(master);

  // outdoor echo: a damped feedback delay
  echo = ac.createDelay(1.5);
  echo.delayTime.value = 0.42;
  const fb = ac.createGain(); fb.gain.value = 0.32;
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
  const echoOut = ac.createGain(); echoOut.gain.value = 0.55;
  echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(echoOut); echoOut.connect(sfxBus);

  noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const ch = noiseBuf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;

  // wind bed
  const wn = ac.createBufferSource(); wn.buffer = noiseBuf; wn.loop = true;
  windFilter = ac.createBiquadFilter(); windFilter.type = 'bandpass'; windFilter.frequency.value = 380; windFilter.Q.value = 0.6;
  windGain = ac.createGain(); windGain.gain.value = 0;
  wn.connect(windFilter); windFilter.connect(windGain); windGain.connect(master);
  wn.start();
}

export function setVolumes(m, s) {
  vol.master = m; vol.sfx = s;
  if (master) master.gain.value = m;
  if (sfxBus) sfxBus.gain.value = s;
}

export function setWind(level) {
  if (!ac || !windGain) return;
  const t = ac.currentTime;
  windGain.gain.setTargetAtTime(Math.min(0.12, level * 0.012), t, 0.6);
  windFilter.frequency.setTargetAtTime(260 + level * 40, t, 0.6);
}

function noise(dur, { type = 'lowpass', freq = 2000, q = 0.7, gain = 1, attack = 0.002, delay = 0, toEcho = 0 } = {}) {
  if (!ac) return;
  const t = ac.currentTime + delay;
  const src = ac.createBufferSource(); src.buffer = noiseBuf;
  const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(sfxBus);
  if (toEcho) { const e = ac.createGain(); e.gain.value = toEcho; g.connect(e); e.connect(echo); }
  src.start(t, Math.random() * Math.max(0, 1.9 - dur)); src.stop(t + dur + 0.05);
}

function tone(freq, dur, { type = 'sine', gain = 0.5, delay = 0, slideTo = null, attack = 0.002 } = {}) {
  if (!ac) return;
  const t = ac.currentTime + delay;
  const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(sfxBus);
  o.start(t); o.stop(t + dur + 0.05);
}

const SHOTS = {
  rimfire: { dur: 0.09, freq: 4200, gain: 0.35, thump: 0, echo: 0.1 },
  shotgun: { dur: 0.32, freq: 1700, gain: 1.0, thump: 0.7, echo: 0.5 },
  carbine: { dur: 0.16, freq: 3200, gain: 0.75, thump: 0.35, echo: 0.3 },
  rifle: { dur: 0.26, freq: 2600, gain: 0.95, thump: 0.6, echo: 0.55 },
  magnum: { dur: 0.36, freq: 2000, gain: 1.0, thump: 0.85, echo: 0.65 },
  fifty: { dur: 0.6, freq: 1300, gain: 1.0, thump: 1.0, echo: 0.8 },
};

export function shot(kind) {
  const s = SHOTS[kind] || SHOTS.rifle;
  noise(s.dur, { freq: s.freq, gain: s.gain, toEcho: s.echo });
  noise(0.03, { type: 'highpass', freq: 3000, gain: s.gain * 0.6 });
  if (s.thump) tone(110, 0.18 + s.thump * 0.2, { gain: s.thump * 0.8, slideTo: 38 });
}

export function sfx(name, delay = 0) {
  if (!ac) return;
  switch (name) {
    case 'dry': tone(2400, 0.03, { type: 'square', gain: 0.08, delay }); break;
    case 'shell': tone(1800, 0.03, { type: 'square', gain: 0.06, delay }); noise(0.05, { type: 'bandpass', freq: 2500, gain: 0.15, delay: delay + 0.04 }); break;
    case 'pump': noise(0.07, { type: 'bandpass', freq: 1400, q: 2, gain: 0.35, delay }); noise(0.08, { type: 'bandpass', freq: 1100, q: 2, gain: 0.35, delay: delay + 0.16 }); break;
    case 'bolt': noise(0.05, { type: 'bandpass', freq: 2600, q: 3, gain: 0.25, delay }); noise(0.06, { type: 'bandpass', freq: 1900, q: 3, gain: 0.3, delay: delay + 0.22 }); break;
    case 'lever': noise(0.06, { type: 'bandpass', freq: 1700, q: 2.5, gain: 0.3, delay }); noise(0.06, { type: 'bandpass', freq: 2100, q: 2.5, gain: 0.3, delay: delay + 0.18 }); break;
    case 'magout': noise(0.06, { type: 'bandpass', freq: 900, q: 2, gain: 0.3, delay }); break;
    case 'magin': noise(0.05, { type: 'bandpass', freq: 1500, q: 3, gain: 0.4, delay }); tone(900, 0.03, { type: 'square', gain: 0.05, delay: delay + 0.02 }); break;
    case 'break': noise(0.08, { type: 'bandpass', freq: 1200, q: 2, gain: 0.35, delay }); break;
    case 'ding': [1180, 1790, 2610].forEach((f, i) => tone(f, 0.9 - i * 0.2, { gain: 0.18 - i * 0.04, delay })); break;
    case 'thwack': noise(0.07, { freq: 500, gain: 0.45, delay }); break;
    case 'clang': noise(0.12, { type: 'bandpass', freq: 2200, q: 4, gain: 0.4, delay }); tone(620, 0.25, { type: 'triangle', gain: 0.15, delay }); break;
    case 'dust': noise(0.12, { type: 'highpass', freq: 1200, gain: 0.08, delay }); break;
    case 'alien': tone(520 + Math.random() * 200, 0.35, { type: 'sawtooth', gain: 0.07, slideTo: 140, delay }); break;
    case 'alienDie': tone(900, 0.5, { type: 'sawtooth', gain: 0.1, slideTo: 60, delay }); noise(0.3, { freq: 900, gain: 0.3, delay }); break;
    case 'hurt': tone(70, 0.4, { gain: 0.7, slideTo: 40, delay }); noise(0.2, { freq: 600, gain: 0.4, delay }); break;
    case 'snipe': noise(0.05, { type: 'highpass', freq: 4000, gain: 0.5, delay }); noise(0.3, { freq: 1500, gain: 0.3, delay: delay + 0.08 }); break;
    case 'flush': noise(0.4, { type: 'bandpass', freq: 600, q: 1.2, gain: 0.25, delay }); break;
    case 'chirp': { const b = 2200 + Math.random() * 1500; tone(b, 0.08, { gain: 0.04, slideTo: b * 1.4, delay }); tone(b * 1.1, 0.07, { gain: 0.035, slideTo: b * 0.9, delay: delay + 0.12 }); break; }
    case 'tick': tone(1200, 0.03, { type: 'square', gain: 0.05, delay }); break;
    case 'good': tone(660, 0.12, { type: 'triangle', gain: 0.15, delay }); tone(990, 0.18, { type: 'triangle', gain: 0.15, delay: delay + 0.1 }); break;
    case 'bad': tone(300, 0.25, { type: 'square', gain: 0.08, slideTo: 150, delay }); break;
    case 'zoom': tone(300, 0.05, { type: 'triangle', gain: 0.04, delay }); break;
    case 'boom': noise(1.2, { freq: 400, gain: 0.8, toEcho: 0.6, delay }); tone(60, 0.9, { gain: 0.8, slideTo: 25, delay }); break;
    default: break;
  }
}
