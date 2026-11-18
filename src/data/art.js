// Art file map. Every path is relative to /assets.
// Drop an image in with the exact name below and the game uses it instead of
// the drawn stand-in. Missing files are fine: the stand-in is used.
// See assets/README.md and docs/ART-PROMPTS.md.

const FOLDER = { bird: 'animals', quad: 'animals', alien: 'aliens', mil: 'military' };

// pose -> frame count. 1 frame = <id>_<pose>.png, 2 frames = <id>_<pose>_1.png + _2.png
export const POSES = {
  mallard: { fly: 2 }, goose: { fly: 2 }, pheasant: { fly: 2 }, dove: { fly: 2 }, swan: { fly: 2 }, eagle: { fly: 1 },
  turkey: { walk: 1, run: 1 }, rabbit: { run: 1 },
  whitetail: { walk: 1, run: 1, graze: 1 }, doe: { walk: 1, run: 1, graze: 1 }, muledeer: { walk: 1, run: 1, graze: 1 },
  pronghorn: { walk: 1, run: 1 }, elk: { walk: 1, run: 1, graze: 1 }, moose: { walk: 1, run: 1, graze: 1 },
  boar: { walk: 1, run: 1 }, bear: { walk: 1, run: 1 },
  skitter: { run: 1 }, glider: { fly: 2 }, orb: { idle: 1 }, stalker: { walk: 1 }, brute: { walk: 1 }, pod: { fall: 1 }, colossus: { walk: 1 },
  plate: { idle: 1 }, popup: { idle: 1 }, noshoot: { idle: 1 }, drone: { idle: 1 }, vehicle: { idle: 1 }, sniper: { idle: 1 },
};

// optional: a photo of the animal down (lying on its side) and of each bird
// falling. Used when a target is hit, instead of tilting the live pose.
export const EXTRA_POSES = {
  mallard: { fall: 1 }, goose: { fall: 1 }, pheasant: { fall: 1 }, dove: { fall: 1 }, swan: { fall: 1 }, eagle: { fall: 1 },
  turkey: { down: 1 }, rabbit: { down: 1 }, whitetail: { down: 1 }, doe: { down: 1 }, muledeer: { down: 1 }, pronghorn: { down: 1 },
  elk: { down: 1 }, moose: { down: 1 }, boar: { down: 1 }, bear: { down: 1 },
};

// species that reuse another species' art
const ALIAS = { mover: 'popup' };

export function spritePaths(speciesId, family, pose) {
  const id = ALIAS[speciesId] || speciesId;
  const poses = POSES[id];
  if (!poses) return [];
  const folder = FOLDER[family] || 'animals';
  const n = poses[pose] || EXTRA_POSES[id]?.[pose];
  if (!n) return [];
  if (n === 1) return [`${folder}/${id}_${pose}.png`];
  return Array.from({ length: n }, (_, i) => `${folder}/${id}_${pose}_${i + 1}.png`);
}

export function posesFor(speciesId) {
  return Object.keys(POSES[ALIAS[speciesId] || speciesId] || {});
}

export const backgroundPath = (biome) => `backgrounds/${biome}.jpg`;
export const foregroundPath = (biome) => `backgrounds/${biome}_fg.png`;
export const weaponPath = (id) => `weapons/${id}.png`;
export const weaponProfilePath = (id) => `weapons/${id}_profile.png`;
export const TITLE_ART = 'ui/title.jpg';
