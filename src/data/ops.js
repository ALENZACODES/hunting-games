// Military Ops: 25 unlockable modes on the same engine.
//
// goal: quota   hit `need` of `total` counted targets
//       score   reach `need` points before the clock runs out
//       survive keep health above zero until the clock runs out
//       clear   knock down `need` of the static targets (time bonus for speed)
//       boss    bring down the boss before it reaches you
//       endless survive as long as you can (always a pass; score counts)
// issue: guns handed out for the op (campaign unlocks do not apply)
// unlock: campaign level that must be passed first
// statics: fixed targets { sp, d (m), sx (0..1 across screen), alt (m) }
// plates: random static plates { n, d: [min, max] }
// as: per-spawn overrides of species fields

const plateRow = (ds, alt = 0) => ds.map((d, i) => ({ sp: 'plate', d, sx: 0.12 + (0.76 * i) / Math.max(1, ds.length - 1), alt }));
const bigPlate = { len: 1.6, body: { x: 0, y: 1.6, rx: 0.6, ry: 0.6 }, vital: { x: 0, y: 1.6, r: 0.2 } };

export const OPS = [
  { id: 'qual-range', n: 1, cat: 'Range', name: 'Qualification Range', biome: 'range', tod: 'day', goal: 'quota', total: 30, need: 20, concurrent: 3, gap: [0.3, 0.9],
    spawns: [{ sp: 'popup', w: 1, lane: { d: [25, 300] } }], issue: ['m4', 'rem700'], unlock: 2, wind: [0, 3],
    brief: 'Standard qualification. Pop-ups from 25 to 300 metres. Hit 20 of 30.' },
  { id: 'steel-ladder', n: 2, cat: 'Range', name: 'Steel Ladder', biome: 'range', tod: 'day', goal: 'clear', need: 6, timeLimit: 90,
    statics: plateRow([100, 200, 300, 400, 500, 600, 700, 800]), issue: ['rem700', 'tikka'], unlock: 2, wind: [1, 4],
    brief: 'Eight steel plates from 100 to 800 metres. Range each one, hold or dial, and ring them all.' },
  { id: 'cold-bore', n: 3, cat: 'Range', name: 'Cold Bore', biome: 'ridge', tod: 'dawn', goal: 'clear', need: 3, timeLimit: 120, shots: 5,
    plates: { n: 5, d: [250, 750], alt: [0, 30] }, issue: ['axmc'], unlock: 2, wind: [1, 5],
    brief: 'Five plates at unknown distances. Five rounds. Use the rangefinder before every shot.' },
  { id: 'moving-range', n: 4, cat: 'Range', name: 'Moving Target Range', biome: 'range', tod: 'day', goal: 'quota', total: 20, need: 12, concurrent: 2, gap: [0.6, 1.4],
    spawns: [{ sp: 'mover', w: 1, lane: { d: [50, 200] } }], issue: ['scar', 'm4'], unlock: 4, wind: [0, 3],
    brief: 'Targets on rails. Lead them: at 200 metres a walking target moves a full body width before the round arrives.' },
  { id: 'shoot-house', n: 5, cat: 'Close quarters', name: 'Shoot House', biome: 'urban', tod: 'day', goal: 'score', need: 3000, timeLimit: 60, concurrent: 3, gap: [0.3, 0.8],
    spawns: [{ sp: 'popup', w: 0.7, lane: { d: [8, 25] } }, { sp: 'noshoot', w: 0.3, lane: { d: [8, 25] } }], issue: ['m4', 'moss500'], unlock: 4,
    brief: 'Close pop-ups. Hostiles are tan, no-shoots are white with hands up. Speed and judgement.' },
  { id: 'hostage', n: 6, cat: 'Close quarters', name: 'Hostage Rescue', biome: 'urban', tod: 'dusk', goal: 'quota', total: 10, need: 8, concurrent: 3, gap: [0.4, 1], failOnNoShoot: 2,
    spawns: [{ sp: 'noshoot', w: 0.6, lane: { d: [10, 30] } }, { sp: 'popup', w: 0.4, lane: { d: [10, 30] } }], issue: ['m4'], unlock: 4,
    brief: 'Most targets are hostages. Hit 8 of 10 hostiles. Two hostage hits and the op is over.' },
  { id: 'counter-sniper', n: 7, cat: 'Recon', name: 'Counter-Sniper', biome: 'ridge', tod: 'day', goal: 'quota', total: 6, need: 5, concurrent: 2, gap: [2, 4], timeLimit: 180, hp: 100,
    spawns: [{ sp: 'sniper', w: 1, lane: { d: [300, 700], alt: [15, 55] } }], issue: ['axmc', 'savage110'], unlock: 6, wind: [1, 4],
    brief: 'Marksmen are dug in on the ridge. Watch for the scope glint and take them before they fire.' },
  { id: 'night-watch', n: 8, cat: 'Recon', name: 'Night Watch', biome: 'range', tod: 'night', filter: 'nv', goal: 'quota', total: 20, need: 12, concurrent: 2, gap: [0.6, 1.4],
    spawns: [{ sp: 'popup', w: 1, lane: { d: [50, 250] } }], issue: ['m4', 'scar'], unlock: 6,
    brief: 'Night vision. Pop-ups from 50 to 250 metres.' },
  { id: 'thermal', n: 9, cat: 'Recon', name: 'Thermal Sweep', biome: 'hardwood', tod: 'night', filter: 'thermal', goal: 'quota', total: 12, need: 8, concurrent: 3, gap: [0.8, 1.8],
    spawns: [{ sp: 'popup', w: 0.6, lane: { d: [40, 180] } }, { sp: 'whitetail', w: 0.4, as: { counts: false, noShoot: true, penalty: 500, name: 'Wildlife (no-shoot)' } }],
    issue: ['scar', 'axmc'], unlock: 6,
    brief: 'Thermal optic, white-hot. Hostiles stand up in the brush. Deer show up hot too. Do not shoot wildlife.' },
  { id: 'fog-of-war', n: 10, cat: 'Recon', name: 'Fog of War', biome: 'boreal', tod: 'day', fog: 0.85, goal: 'quota', total: 18, need: 11, concurrent: 2, gap: [0.6, 1.4],
    spawns: [{ sp: 'popup', w: 0.6, lane: { d: [30, 150] } }, { sp: 'mover', w: 0.4, lane: { d: [30, 120] } }], issue: ['akm', 'm4'], unlock: 6,
    brief: 'Dense fog. Targets fade in and out past 60 metres.' },
  { id: 'drone-swarm', n: 11, cat: 'Defense', name: 'Drone Swarm', biome: 'base', tod: 'day', goal: 'survive', timeLimit: 90, hp: 100, concurrent: 3, gap: [0.5, 1.2], ramp: true,
    spawns: [{ sp: 'drone', w: 1 }], issue: ['m4', 'sbe3'], unlock: 8,
    brief: 'Quadcopters are diving on the outpost. A shotgun pattern is the best answer up close.' },
  { id: 'convoy', n: 12, cat: 'Defense', name: 'Convoy Overwatch', biome: 'prairie', tod: 'day', goal: 'survive', timeLimit: 120, hp: 100, hpLabel: 'CONVOY', concurrent: 3, gap: [0.6, 1.4], ramp: true,
    spawns: [{ sp: 'drone', w: 0.5 }, { sp: 'skitter', w: 0.5 }], issue: ['scar', 'm4'], unlock: 8,
    brief: 'Overwatch for a supply convoy. Stop drones and skitters before they reach the trucks.' },
  { id: 'bridge-defense', n: 13, cat: 'Defense', name: 'Bridge Defense', biome: 'bridge', tod: 'day', goal: 'quota', total: 8, need: 6, concurrent: 2, gap: [3, 6],
    spawns: [{ sp: 'vehicle', w: 1, lane: { d: [300, 600] } }], issue: ['m82', 'axmc'], unlock: 8, wind: [1, 4],
    brief: 'Armoured vehicles are crossing at 300 to 600 metres. The engine block is the weak point. Small calibers do nothing.' },
  { id: 'door-gunner', n: 14, cat: 'Air', name: 'Door Gunner', biome: 'heli', tod: 'day', platform: 'heli', goal: 'score', need: 4000, timeLimit: 90, concurrent: 4, gap: [0.4, 1],
    spawns: [{ sp: 'popup', w: 0.45, lane: { d: [60, 220] } }, { sp: 'mover', w: 0.35, lane: { d: [60, 200] } }, { sp: 'vehicle', w: 0.2, lane: { d: [150, 300] }, as: { minPower: 4, hp: 4 } }],
    issue: ['m4', 'scar'], unlock: 8,
    brief: 'Moving, bobbing helicopter platform. Time your shots to the sway.' },
  { id: 'wind-masters', n: 15, cat: 'Range', name: 'Wind Masters', biome: 'range', tod: 'day', goal: 'clear', need: 6, timeLimit: 150, gust: true,
    statics: plateRow([300, 400, 500, 600, 700, 800, 850, 900]), issue: ['axmc', 'savage110'], unlock: 10, wind: [4, 10],
    brief: 'Gusting crosswind from 4 to 10 m/s. Read the wind meter and hold into it.' },
  { id: 'speed-steel', n: 16, cat: 'Range', name: 'Speed Steel', biome: 'range', tod: 'day', goal: 'clear', need: 6, timeLimit: 45, speedBonus: true,
    statics: [{ sp: 'plate', d: 15, sx: 0.2 }, { sp: 'plate', d: 22, sx: 0.36 }, { sp: 'plate', d: 30, sx: 0.5 }, { sp: 'plate', d: 18, sx: 0.64 }, { sp: 'plate', d: 40, sx: 0.78 }, { sp: 'plate', d: 25, sx: 0.88 }],
    issue: ['m4', 'akm'], unlock: 10,
    brief: 'Six plates, close. The clock is the score.' },
  { id: 'marksman-gauntlet', n: 17, cat: 'Range', name: 'Marksman Gauntlet', biome: 'ridge', tod: 'day', goal: 'score', need: 6000, timeLimit: 150, shots: 60, concurrent: 3, gap: [0.6, 1.4],
    spawns: [{ sp: 'popup', w: 0.35, lane: { d: [50, 400] } }, { sp: 'mover', w: 0.25, lane: { d: [60, 250] } }, { sp: 'drone', w: 0.15 }, { sp: 'sniper', w: 0.1, lane: { d: [300, 600], alt: [15, 45] } }, { sp: 'vehicle', w: 0.15, lane: { d: [300, 500] } }],
    issue: ['scar', 'axmc'], unlock: 10, wind: [1, 5], hp: 100,
    brief: 'Everything at once, 60 rounds total. Pick your shots.' },
  { id: 'elr', n: 18, cat: 'Range', name: 'Mile High (ELR)', biome: 'range', tod: 'day', goal: 'clear', need: 3, timeLimit: 240,
    statics: plateRow([1000, 1150, 1300, 1450, 1600]).map((s) => ({ ...s, as: bigPlate })), issue: ['m82', 'axmc'], unlock: 10, wind: [2, 6],
    brief: 'Extreme long range: 1,000 to 1,600 metres. The drop is too big to hold. Range, dial (Arrow keys), then send it. The round is in the air for over two seconds.' },
  { id: 'perimeter-breach', n: 19, cat: 'Alien', name: 'Perimeter Breach', biome: 'base', tod: 'dusk', goal: 'survive', timeLimit: 120, hp: 100, concurrent: 4, gap: [0.6, 1.4], ramp: true,
    spawns: [{ sp: 'skitter', w: 0.55 }, { sp: 'brute', w: 0.15 }, { sp: 'stalker', w: 0.3 }], issue: ['m4', 'scar', 'm82'], unlock: 11,
    brief: 'They found the outpost. Hold the wire for two minutes.' },
  { id: 'orbital-drop', n: 20, cat: 'Alien', name: 'Orbital Drop', biome: 'prairie', tod: 'night', goal: 'quota', total: 20, need: 13, concurrent: 3, gap: [0.6, 1.4], hp: 100,
    spawns: [{ sp: 'pod', w: 1 }], issue: ['m4', 'akm'], unlock: 11,
    brief: 'Drop pods are falling. Shoot them before they land, or deal with what hatches.' },
  { id: 'stalker-hunt', n: 21, cat: 'Alien', name: 'Stalker Hunt', biome: 'hardwood', tod: 'dusk', goal: 'quota', total: 8, need: 6, concurrent: 2, gap: [1.5, 3], hp: 100,
    spawns: [{ sp: 'stalker', w: 1 }], issue: ['axmc', 'scar'], unlock: 11, wind: [0, 3],
    brief: 'Stalkers cloak in the treeline. You can only hit them while they are visible. Go for the head.' },
  { id: 'hive-purge', n: 22, cat: 'Alien', name: 'Hive Purge', biome: 'hive', tod: 'alien', goal: 'score', need: 8000, timeLimit: 120, hp: 120, concurrent: 4, gap: [0.4, 1], ramp: true,
    spawns: [{ sp: 'skitter', w: 0.4 }, { sp: 'glider', w: 0.2 }, { sp: 'orb', w: 0.2 }, { sp: 'pod', w: 0.2 }], issue: ['akm', 'sbe3', 'scar'], unlock: 11,
    brief: 'Burn down the brood. Score as much as you can in two minutes.' },
  { id: 'colossus', n: 23, cat: 'Alien', name: 'Colossus', biome: 'hive', tod: 'alien', goal: 'boss', boss: 'colossus', hp: 100, concurrent: 2, gap: [1.5, 3],
    spawns: [{ sp: 'skitter', w: 0.6 }, { sp: 'glider', w: 0.4 }], issue: ['m82', 'axmc'], unlock: 12, wind: [1, 3],
    brief: 'A walker the size of a building. Only its three glowing weak points take damage. Stop it before it reaches the line.' },
  { id: 'iron-sights', n: 24, cat: 'Special', name: 'Iron Sights Only', biome: 'range', tod: 'day', goal: 'quota', total: 25, need: 15, concurrent: 2, gap: [0.5, 1.2], noScopes: true,
    spawns: [{ sp: 'popup', w: 1, lane: { d: [50, 300] } }], issue: ['akm', 'win94'], unlock: 12, wind: [0, 3],
    brief: 'No optics. Pop-ups out to 300 metres on iron sights.' },
  { id: 'last-stand', n: 25, cat: 'Alien', name: 'Last Stand', biome: 'base', tod: 'night', goal: 'endless', hp: 150, concurrent: 3, gap: [0.8, 1.6], ramp: true,
    spawns: [{ sp: 'skitter', w: 0.35 }, { sp: 'drone', w: 0.15 }, { sp: 'stalker', w: 0.15 }, { sp: 'brute', w: 0.1 }, { sp: 'glider', w: 0.15 }, { sp: 'pod', w: 0.1 }],
    issue: ['m4', 'akm', 'scar', 'axmc', 'm82', 'sbe3'], unlock: 12,
    brief: 'Endless. Everything they have, until you go down. Choose three guns.' },
];

export const OP_BY_ID = Object.fromEntries(OPS.map((o) => [o.id, o]));
