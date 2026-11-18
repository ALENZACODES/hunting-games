// Biomes (backgrounds) and the 12-level hunt campaign.
//
// Biome fields drive the drawn stand-in landscape and tell the engine where the
// horizon is. When assets/backgrounds/<biome>.jpg exists it replaces the drawing;
// if its horizon sits higher or lower, adjust `horizon` (0 = top, 1 = bottom).

export const BIOMES = {
  marsh:    { name: 'Cattail marsh', horizon: 0.44, hills: 'low', trees: 'mixed', ground: ['#56603a', '#2f3a22'], water: true, fg: 'reeds', fgTop: 0.66 },
  lake:     { name: 'Prairie lake', horizon: 0.46, hills: 'none', trees: 'sparse', ground: ['#7a7a48', '#4a4f2c'], water: true, fg: 'reeds', fgTop: 0.7 },
  farm:     { name: 'Cornfield edge', horizon: 0.45, hills: 'low', trees: 'hedgerow', ground: ['#a08a52', '#6b5a32'], fg: 'corn', fgTop: 0.72 },
  hardwood: { name: 'Hardwood ridge', horizon: 0.43, hills: 'mid', trees: 'autumn', ground: ['#6d5536', '#3e3020'], fg: 'brush', fgTop: 0.8 },
  forestedge: { name: 'Spring forest edge', horizon: 0.44, hills: 'low', trees: 'deciduous', ground: ['#5f7a3a', '#3a4d22'], fg: 'grass', fgTop: 0.8 },
  mountain: { name: 'Alpine meadow', horizon: 0.5, hills: 'alps', trees: 'conifer', ground: ['#7c8a4a', '#4c5a2c'], fg: 'grass', fgTop: 0.84 },
  scrub:    { name: 'Dry scrub', horizon: 0.46, hills: 'mesa', trees: 'scrub', ground: ['#9a7f55', '#5e4a2e'], fg: 'brush', fgTop: 0.8 },
  valley:   { name: 'Mountain valley', horizon: 0.5, hills: 'alps', trees: 'conifer', ground: ['#6f7a46', '#46512a'], fg: 'grass', fgTop: 0.85 },
  boreal:   { name: 'Boreal bog', horizon: 0.45, hills: 'low', trees: 'spruce', ground: ['#5c5a38', '#353420'], water: true, fg: 'grass', fgTop: 0.8 },
  prairie:  { name: 'Open prairie', horizon: 0.47, hills: 'none', trees: 'sparse', ground: ['#8a8150', '#55502e'], fg: 'grass', fgTop: 0.82 },
  canyon:   { name: 'Desert canyon', horizon: 0.47, hills: 'mesa', trees: 'none', ground: ['#9c6b45', '#5a3a24'], fg: 'rocks', fgTop: 0.84, crash: true },
  hive:     { name: 'Alien valley', horizon: 0.47, hills: 'spires', trees: 'alien', ground: ['#3b3348', '#1d1826'], fg: 'alien', fgTop: 0.82, alien: true },
  range:    { name: 'Desert firing range', horizon: 0.47, hills: 'mesa', trees: 'none', ground: ['#b39466', '#7a6141'], fg: 'none', berms: true },
  urban:    { name: 'Training village', horizon: 0.5, hills: 'none', trees: 'none', ground: ['#77736a', '#4a4741'], fg: 'none', buildings: true },
  ridge:    { name: 'Arid ridge', horizon: 0.5, hills: 'ridge', trees: 'scrub', ground: ['#9d8a62', '#5e5038'], fg: 'brush', fgTop: 0.86 },
  base:     { name: 'Forward outpost', horizon: 0.48, hills: 'mesa', trees: 'none', ground: ['#8c7b5a', '#5a4d36'], fg: 'wire', fgTop: 0.82 },
  bridge:   { name: 'River crossing', horizon: 0.46, hills: 'mid', trees: 'conifer', ground: ['#6a6a48', '#3d3d2a'], water: true, bridge: true, fg: 'none' },
  heli:     { name: 'From the helicopter', horizon: 0.36, hills: 'mesa', trees: 'scrub', ground: ['#a08158', '#6a5234'], fg: 'none', scroll: true },
};

export const LEVELS = [
  {
    id: 'L1', n: 1, name: 'Marsh Dawn', biome: 'marsh', tod: 'dawn',
    brief: 'Mallards are flushing off the marsh at first light. Swing through and lead them.',
    spawns: [{ sp: 'mallard', w: 1 }],
    total: 10, need: 6, concurrent: 2, gap: [0.8, 1.8], classes: ['shotgun'], wind: [0, 2],
  },
  {
    id: 'L2', n: 2, name: 'Flyway', biome: 'lake', tod: 'day',
    brief: 'Ducks and Canada geese on the flyway. Trumpeter swans are protected. Do not shoot them.',
    spawns: [{ sp: 'mallard', w: 0.6 }, { sp: 'goose', w: 0.4 }, { sp: 'swan', w: 0.18 }],
    total: 12, need: 7, concurrent: 2, gap: [0.8, 1.6], classes: ['shotgun'], wind: [1, 3],
  },
  {
    id: 'L3', n: 3, name: 'Cornfield Edge', biome: 'farm', tod: 'day',
    brief: 'Pheasants flush low from the stubble, doves come in fast and rabbits break from the fence line.',
    spawns: [{ sp: 'pheasant', w: 0.45 }, { sp: 'dove', w: 0.3 }, { sp: 'rabbit', w: 0.25 }],
    total: 14, need: 8, concurrent: 2, gap: [0.7, 1.5], classes: ['shotgun', 'rimfire'], wind: [1, 3],
  },
  {
    id: 'L4', n: 4, name: 'Hardwood Ridge', biome: 'hardwood', tod: 'dawn',
    brief: 'Buck-only season. Whitetail move along the ridge. Does are not legal. Use the scope and wait for the antlers.',
    spawns: [{ sp: 'whitetail', w: 0.6 }, { sp: 'doe', w: 0.5 }],
    total: 6, need: 4, concurrent: 2, gap: [2, 4], classes: ['rifle', 'lever', 'handgun'], wind: [0, 3],
  },
  {
    id: 'L5', n: 5, name: 'Turkey Hollow', biome: 'forestedge', tod: 'day',
    brief: 'Spring gobblers working the field edge. Head and neck shots are the vital zone.',
    spawns: [{ sp: 'turkey', w: 1 }],
    total: 8, need: 5, concurrent: 2, gap: [1.5, 3], classes: ['shotgun', 'rifle'], wind: [0, 2],
  },
  {
    id: 'L6', n: 6, name: 'High Meadow', biome: 'mountain', tod: 'day',
    brief: 'Mule deer feed on the slopes and pronghorn cross the flats fast. Range them and hold over.',
    spawns: [{ sp: 'muledeer', w: 0.55, lane: { d: [140, 260], alt: [0, 22] } }, { sp: 'pronghorn', w: 0.45 }],
    total: 8, need: 5, concurrent: 2, gap: [2, 4], classes: ['rifle'], wind: [2, 5],
  },
  {
    id: 'L7', n: 7, name: 'Boar Thicket', biome: 'scrub', tod: 'dusk',
    brief: 'Wild hogs run the scrub at dusk. A wounded boar will come for you.',
    spawns: [{ sp: 'boar', w: 1 }],
    total: 10, need: 6, concurrent: 2, gap: [1, 2.5], classes: null, wind: [0, 3], hp: 100,
  },
  {
    id: 'L8', n: 8, name: 'Elk Basin', biome: 'valley', tod: 'dawn',
    brief: 'Bulls on the far side of the basin, 200 to 400 metres. Big country needs a big rifle.',
    spawns: [{ sp: 'elk', w: 1, lane: { d: [200, 400], alt: [0, 28] } }],
    total: 6, need: 4, concurrent: 2, gap: [2.5, 4.5], classes: ['rifle'], wind: [2, 6],
  },
  {
    id: 'L9', n: 9, name: 'Northern Bog', biome: 'boreal', tod: 'day',
    brief: 'Moose in the bog and black bear on the edges. Bald eagles are protected. A wounded bear charges.',
    spawns: [{ sp: 'moose', w: 0.55 }, { sp: 'bear', w: 0.45 }, { sp: 'eagle', w: 0.15 }],
    total: 8, need: 5, concurrent: 2, gap: [2, 4], classes: ['rifle', 'lever'], wind: [1, 4], hp: 100,
  },
  {
    id: 'L10', n: 10, name: 'Strange Lights', biome: 'prairie', tod: 'dusk',
    brief: 'Deer are running for no reason. Something is hovering over the prairie.',
    spawns: [{ sp: 'whitetail', w: 0.3 }, { sp: 'muledeer', w: 0.2 }, { sp: 'orb', w: 0.3 }, { sp: 'skitter', w: 0.25 }],
    total: 12, need: 7, concurrent: 3, gap: [1, 2.5], classes: null, wind: [1, 4], hp: 100,
  },
  {
    id: 'L11', n: 11, name: 'Crash Site', biome: 'canyon', tod: 'night',
    brief: 'The thing came down in the canyon. What climbed out is coming up the wash.',
    spawns: [{ sp: 'skitter', w: 0.45 }, { sp: 'glider', w: 0.3 }, { sp: 'stalker', w: 0.25 }],
    total: 16, need: 10, concurrent: 3, gap: [0.8, 2], classes: null, wind: [0, 3], hp: 100,
  },
  {
    id: 'L12', n: 12, name: 'The Hive', biome: 'hive', tod: 'alien',
    brief: 'The valley is theirs now. Clear the brood, then bring down the Colossus.',
    spawns: [{ sp: 'brute', w: 0.2 }, { sp: 'stalker', w: 0.2 }, { sp: 'glider', w: 0.2 }, { sp: 'pod', w: 0.2 }, { sp: 'skitter', w: 0.2 }],
    total: 20, need: 12, concurrent: 3, gap: [0.8, 1.8], classes: null, wind: [0, 4], hp: 120,
    finale: 'colossus',
  },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
