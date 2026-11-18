// Every target in the game: animals, aliens and military targets.
//
// len        sprite width in metres (art is scaled so its trimmed width = len)
// anchor     'bottom' (stands on the ground) or 'center' (flyers, hovering)
// body       hit ellipse in metres relative to the anchor { x, y (up), rx, ry }
// vital      vital-zone circle { x, y, r } (facing right; mirrored automatically)
// minPower   weakest gun power that gives a clean kill (see weapons.js)
// hp         hits needed (vital hits count double)
// behavior   see src/game/entities.js
// speed      main movement speed in m/s (walk/run use walk + speed)
// lane       default spawn distance band { d: [min, max] } in metres
// escape     seconds before it leaves on its own
// counts     false for no-shoot / protected targets (they never count toward the quota)
// penalty    points lost if shot

export const SPECIES = {
  // ── Birds ─────────────────────────────────────────────
  mallard: { name: 'Mallard', family: 'bird', draw: 'duck', len: 0.62, anchor: 'center', body: { x: 0, y: 0, rx: 0.3, ry: 0.16 }, vital: { x: 0.14, y: 0.03, r: 0.08 }, minPower: 1, hp: 1, behavior: 'flush', speed: 6.5, lane: { d: [18, 30] }, escape: 6, points: 100, colors: ['#5b4a3a', '#1f6b3a', '#c9b48f'] },
  goose: { name: 'Canada goose', family: 'bird', draw: 'goose', len: 1.0, anchor: 'center', body: { x: 0, y: 0, rx: 0.46, ry: 0.2 }, vital: { x: 0.2, y: 0.05, r: 0.11 }, minPower: 2, hp: 1, behavior: 'flush', speed: 5.5, lane: { d: [24, 38] }, escape: 7, points: 150, colors: ['#6a5d50', '#141414', '#e8e2d6'] },
  pheasant: { name: 'Ring-necked pheasant', family: 'bird', draw: 'pheasant', len: 0.85, anchor: 'center', body: { x: 0, y: 0, rx: 0.36, ry: 0.13 }, vital: { x: 0.14, y: 0.03, r: 0.08 }, minPower: 1, hp: 1, behavior: 'flush', low: true, speed: 7.5, lane: { d: [12, 24] }, escape: 4.5, points: 150, colors: ['#9a4b22', '#1d5a46', '#c23a2b'] },
  dove: { name: 'Mourning dove', family: 'bird', draw: 'dove', len: 0.32, anchor: 'center', body: { x: 0, y: 0, rx: 0.17, ry: 0.09 }, vital: { x: 0.07, y: 0.02, r: 0.05 }, minPower: 1, hp: 1, behavior: 'flush', erratic: true, speed: 9, lane: { d: [14, 26] }, escape: 4, points: 120, colors: ['#9b8f84', '#7d7068', '#d8c7b3'] },
  turkey: { name: 'Wild turkey', family: 'bird', draw: 'turkey', len: 1.05, anchor: 'bottom', body: { x: 0, y: 0.55, rx: 0.42, ry: 0.3 }, vital: { x: 0.36, y: 0.82, r: 0.09 }, minPower: 2, hp: 1, behavior: 'graze', walk: 1.0, speed: 5, lane: { d: [25, 55] }, escape: 20, points: 250, colors: ['#3a2a1f', '#7a2a22', '#4a5a7a'] },
  swan: { name: 'Trumpeter swan (protected)', family: 'bird', draw: 'swan', len: 1.55, anchor: 'center', body: { x: 0, y: 0, rx: 0.7, ry: 0.22 }, vital: { x: 0.3, y: 0.05, r: 0.12 }, minPower: 1, hp: 1, behavior: 'cross', speed: 5, lane: { d: [30, 45] }, escape: 12, points: 0, counts: false, penalty: 1000, protected: true, colors: ['#f4f2ec', '#1b1b1b', '#d9d4c8'] },
  eagle: { name: 'Bald eagle (protected)', family: 'bird', draw: 'eagle', len: 0.95, anchor: 'center', body: { x: 0, y: 0, rx: 0.9, ry: 0.18 }, vital: { x: 0.2, y: 0.04, r: 0.12 }, minPower: 1, hp: 1, behavior: 'cross', high: true, speed: 6, lane: { d: [40, 70] }, escape: 14, points: 0, counts: false, penalty: 1000, protected: true, colors: ['#3b2a1c', '#f5f3ee', '#e2b33a'] },

  // ── Small game ────────────────────────────────────────
  rabbit: { name: 'Eastern cottontail', family: 'quad', draw: 'rabbit', len: 0.42, anchor: 'bottom', body: { x: 0, y: 0.15, rx: 0.2, ry: 0.12 }, vital: { x: 0.08, y: 0.17, r: 0.06 }, minPower: 1, hp: 1, behavior: 'hop', speed: 5, lane: { d: [12, 24] }, escape: 6, points: 120, colors: ['#8a7560', '#efe8dc'] },

  // ── Big game ──────────────────────────────────────────
  whitetail: { name: 'Whitetail buck', family: 'quad', draw: 'deer', antlers: 'whitetail', len: 2.0, anchor: 'bottom', body: { x: 0, y: 0.95, rx: 0.72, ry: 0.32 }, vital: { x: 0.35, y: 0.88, r: 0.13 }, minPower: 4, hp: 1, behavior: 'graze', walk: 1.2, speed: 11, lane: { d: [60, 140] }, escape: 30, points: 400, colors: ['#8b6a48', '#f2ede4', '#3a2b1d'] },
  doe: { name: 'Whitetail doe (not legal)', family: 'quad', draw: 'deer', antlers: null, len: 1.85, anchor: 'bottom', body: { x: 0, y: 0.9, rx: 0.66, ry: 0.3 }, vital: { x: 0.32, y: 0.84, r: 0.12 }, minPower: 4, hp: 1, behavior: 'graze', walk: 1.2, speed: 11, lane: { d: [60, 140] }, escape: 30, points: 0, counts: false, penalty: 500, colors: ['#93734f', '#f2ede4', '#3a2b1d'] },
  muledeer: { name: 'Mule deer', family: 'quad', draw: 'deer', antlers: 'mule', len: 2.1, anchor: 'bottom', body: { x: 0, y: 1.0, rx: 0.76, ry: 0.34 }, vital: { x: 0.36, y: 0.92, r: 0.14 }, minPower: 4, hp: 1, behavior: 'graze', walk: 1.1, speed: 10, lane: { d: [120, 260] }, escape: 30, points: 450, colors: ['#857463', '#ece6da', '#2f2620'] },
  pronghorn: { name: 'Pronghorn', family: 'quad', draw: 'pronghorn', antlers: 'pronghorn', len: 1.5, anchor: 'bottom', body: { x: 0, y: 0.85, rx: 0.55, ry: 0.27 }, vital: { x: 0.27, y: 0.78, r: 0.11 }, minPower: 4, hp: 1, behavior: 'run', walk: 1.4, speed: 16, lane: { d: [150, 300] }, escape: 22, points: 500, colors: ['#c58a4a', '#f4efe6', '#222'] },
  elk: { name: 'Elk', family: 'quad', draw: 'deer', antlers: 'elk', len: 2.7, anchor: 'bottom', body: { x: 0, y: 1.25, rx: 0.98, ry: 0.42 }, vital: { x: 0.48, y: 1.15, r: 0.17 }, minPower: 6, hp: 1, behavior: 'graze', walk: 1.1, speed: 10, lane: { d: [200, 400] }, escape: 35, points: 600, colors: ['#9b7550', '#4a3424', '#e9d9b8'] },
  moose: { name: 'Moose', family: 'quad', draw: 'moose', antlers: 'moose', len: 3.0, anchor: 'bottom', body: { x: 0, y: 1.5, rx: 1.05, ry: 0.5 }, vital: { x: 0.5, y: 1.4, r: 0.2 }, minPower: 7, hp: 1, behavior: 'graze', walk: 1.0, speed: 9, lane: { d: [120, 260] }, escape: 35, points: 650, colors: ['#3b2b20', '#5a4535', '#7d6a58'] },
  boar: { name: 'Wild boar', family: 'quad', draw: 'boar', len: 1.5, anchor: 'bottom', body: { x: 0, y: 0.55, rx: 0.6, ry: 0.28 }, vital: { x: 0.3, y: 0.52, r: 0.11 }, minPower: 4, hp: 1, behavior: 'run', walk: 1.5, speed: 7, lane: { d: [30, 80] }, escape: 14, points: 300, chargeWhenWounded: true, damage: 30, colors: ['#3a312b', '#5a4c40', '#efe6d2'] },
  bear: { name: 'Black bear', family: 'quad', draw: 'bear', len: 1.8, anchor: 'bottom', body: { x: 0, y: 0.6, rx: 0.72, ry: 0.36 }, vital: { x: 0.36, y: 0.6, r: 0.14 }, minPower: 6, hp: 1, behavior: 'graze', walk: 0.9, speed: 9, lane: { d: [60, 150] }, escape: 30, points: 700, chargeWhenWounded: true, damage: 50, colors: ['#151312', '#2a2522', '#8a6a4f'] },

  // ── Aliens ────────────────────────────────────────────
  skitter: { name: 'Skitter', family: 'alien', draw: 'skitter', len: 1.25, anchor: 'bottom', body: { x: 0, y: 0.38, rx: 0.55, ry: 0.26 }, vital: { x: 0.35, y: 0.45, r: 0.12 }, minPower: 2, hp: 1, behavior: 'charge', speed: 7, lane: { d: [60, 110] }, escape: 25, points: 300, damage: 15, colors: ['#1d2b2a', '#61ffd4', '#0b1413'] },
  glider: { name: 'Glider', family: 'alien', draw: 'glider', len: 2.8, anchor: 'center', body: { x: 0, y: 0, rx: 1.3, ry: 0.3 }, vital: { x: 0.45, y: 0.02, r: 0.2 }, minPower: 3, hp: 2, behavior: 'cross', swoop: true, speed: 9, lane: { d: [40, 80] }, escape: 10, points: 400, colors: ['#22183a', '#b37bff', '#0d0a17'] },
  orb: { name: 'Orb', family: 'alien', draw: 'orb', len: 1.0, anchor: 'center', body: { x: 0, y: 0, rx: 0.48, ry: 0.48 }, vital: { x: 0, y: 0, r: 0.18 }, minPower: 4, hp: 1, behavior: 'blink', speed: 3, lane: { d: [40, 120] }, escape: 16, points: 450, colors: ['#0e1a2a', '#7cd6ff', '#ffffff'] },
  stalker: { name: 'Stalker', family: 'alien', draw: 'stalker', len: 1.3, anchor: 'bottom', body: { x: 0, y: 1.4, rx: 0.42, ry: 1.3 }, vital: { x: 0.12, y: 2.55, r: 0.2 }, minPower: 5, hp: 2, behavior: 'stalk', walk: 1.3, speed: 8, lane: { d: [80, 200] }, escape: 30, points: 600, damage: 30, colors: ['#1c2620', '#9dff6a', '#0a0f0b'] },
  brute: { name: 'Brute', family: 'alien', draw: 'brute', len: 3.3, anchor: 'bottom', body: { x: 0, y: 1.3, rx: 1.5, ry: 1.1 }, vital: { x: -0.85, y: 2.15, r: 0.32 }, minPower: 7, hp: 4, behavior: 'advance', speed: 2.6, lane: { d: [120, 200] }, escape: 120, points: 900, damage: 50, armored: true, colors: ['#2a2420', '#ff7b3a', '#14100d'] },
  pod: { name: 'Drop pod', family: 'alien', draw: 'pod', len: 1.2, anchor: 'center', body: { x: 0, y: 0, rx: 0.55, ry: 0.85 }, vital: { x: 0, y: -0.2, r: 0.25 }, minPower: 3, hp: 1, behavior: 'drop', speed: 11, lane: { d: [50, 150] }, escape: 30, points: 350, colors: ['#2c2f36', '#ffcf5a', '#14161a'] },
  colossus: { name: 'Colossus', family: 'alien', draw: 'colossus', len: 13, anchor: 'bottom', body: { x: 0, y: 8, rx: 5.5, ry: 7.5 }, weakpoints: [{ x: 0.5, y: 12.6, r: 0.9 }, { x: -3.2, y: 8.6, r: 0.8 }, { x: 2.8, y: 5.4, r: 0.8 }], minPower: 6, hp: 36, behavior: 'advance', boss: true, speed: 2.4, lane: { d: [300, 330] }, reach: 70, escape: 999, points: 5000, damage: 100, colors: ['#1a1a20', '#ff3d6e', '#08080b'] },

  // ── Military targets ──────────────────────────────────
  plate: { name: 'Steel plate', family: 'mil', draw: 'plate', len: 0.6, anchor: 'bottom', body: { x: 0, y: 1.0, rx: 0.25, ry: 0.25 }, vital: { x: 0, y: 1.0, r: 0.08 }, minPower: 1, hp: 1, behavior: 'static', lane: { d: [100, 800] }, escape: 999, points: 100, colors: ['#d8d2c4', '#2b2b2b'] },
  popup: { name: 'Hostile pop-up', family: 'mil', draw: 'popup', len: 0.62, anchor: 'bottom', body: { x: 0, y: 1.15, rx: 0.24, ry: 0.55 }, vital: { x: 0, y: 1.27, r: 0.1 }, minPower: 1, hp: 1, behavior: 'popup', lane: { d: [25, 300] }, escape: 3, points: 150, colors: ['#8b7a55', '#3c3424'] },
  noshoot: { name: 'No-shoot', family: 'mil', draw: 'noshoot', len: 0.62, anchor: 'bottom', body: { x: 0, y: 1.15, rx: 0.24, ry: 0.55 }, vital: { x: 0, y: 1.27, r: 0.1 }, minPower: 1, hp: 1, behavior: 'popup', lane: { d: [25, 300] }, escape: 3, points: 0, counts: false, penalty: 750, noShoot: true, colors: ['#f2f2ee', '#2a5ea8'] },
  mover: { name: 'Moving target', family: 'mil', draw: 'popup', len: 0.62, anchor: 'bottom', body: { x: 0, y: 1.15, rx: 0.24, ry: 0.55 }, vital: { x: 0, y: 1.27, r: 0.1 }, minPower: 1, hp: 1, behavior: 'mover', speed: 3.5, lane: { d: [50, 200] }, escape: 14, points: 220, colors: ['#8b7a55', '#3c3424'] },
  drone: { name: 'Quadcopter drone', family: 'mil', draw: 'drone', len: 0.65, anchor: 'center', body: { x: 0, y: 0, rx: 0.33, ry: 0.13 }, vital: { x: 0, y: 0, r: 0.1 }, minPower: 1, hp: 1, behavior: 'drone', speed: 9, lane: { d: [45, 90] }, escape: 25, points: 250, damage: 12, colors: ['#2a2d31', '#ff3b30', '#9aa3ad'] },
  vehicle: { name: 'Armoured vehicle', family: 'mil', draw: 'vehicle', len: 5.6, anchor: 'bottom', body: { x: 0, y: 1.2, rx: 2.7, ry: 1.0 }, vital: { x: 2.0, y: 1.25, r: 0.5 }, minPower: 6, hp: 6, behavior: 'drive', speed: 8, lane: { d: [300, 600] }, escape: 999, points: 800, armored: true, colors: ['#5b5a3e', '#2c2b1e', '#1a1a14'] },
  sniper: { name: 'Enemy marksman', family: 'mil', draw: 'sniper', len: 1.7, anchor: 'bottom', body: { x: 0, y: 0.3, rx: 0.75, ry: 0.28 }, vital: { x: 0.4, y: 0.38, r: 0.14 }, minPower: 1, hp: 1, behavior: 'sniper', lane: { d: [300, 700] }, escape: 999, points: 700, damage: 20, colors: ['#4f4a36', '#2a271c'] },
};

export const SPECIES_IDS = Object.keys(SPECIES);
