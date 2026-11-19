// Art file map. Every path is relative to /assets.
// Drop an image in with the exact name below and the game uses it instead of
// the drawn stand-in. Missing files are fine: the stand-in is used.
// See assets/README.md and docs/ART-PROMPTS.md.

const FOLDER = { bird: 'animals', quad: 'animals', alien: 'aliens', mil: 'military', human: 'city/shared' };

// pose -> frame count. 1 frame = <id>_<pose>.png, 2 frames = <id>_<pose>_1.png + _2.png
export const POSES = {
  mallard: { fly: 2 }, goose: { fly: 2 }, pheasant: { fly: 2 }, dove: { fly: 2 }, swan: { fly: 2 }, eagle: { fly: 1 },
  turkey: { walk: 1, run: 1 }, rabbit: { run: 1 },
  whitetail: { walk: 1, run: 1, graze: 1 }, doe: { walk: 1, run: 1, graze: 1 }, muledeer: { walk: 1, run: 1, graze: 1 },
  pronghorn: { walk: 1, run: 1 }, elk: { walk: 1, run: 1, graze: 1 }, moose: { walk: 1, run: 1, graze: 1 },
  boar: { walk: 1, run: 1 }, bear: { walk: 1, run: 1 },
  skitter: { run: 1 }, glider: { fly: 2 }, orb: { idle: 1 }, stalker: { walk: 1 }, brute: { walk: 1 }, pod: { fall: 1 }, colossus: { walk: 1 },
  plate: { idle: 1 }, popup: { idle: 1 }, noshoot: { idle: 1 }, drone: { idle: 1 }, vehicle: { idle: 1 }, sniper: { idle: 1 },
  // City Hunt
  vyrr_tracker: { walk: 2, run: 1, leap: 1, crouch: 1, fire: 1, down: 1 },
  vyrr_hunter: { walk: 2, aim: 1, fire: 1, cloak: 1, down: 1 },
  vyrr_hound: { run: 2, pounce: 1, down: 1 },
  vyrr_seeker: { idle: 1, fire: 1, down: 1 },
  vyrr_spine: { fly: 1 },
};

// optional: a photo of the animal down (lying on its side) and of each bird
// falling. Used when a target is hit, instead of tilting the live pose.
export const EXTRA_POSES = {
  mallard: { fall: 1 }, goose: { fall: 1 }, pheasant: { fall: 1 }, dove: { fall: 1 }, swan: { fall: 1 }, eagle: { fall: 1 },
  turkey: { down: 1 }, rabbit: { down: 1 }, whitetail: { down: 1 }, doe: { down: 1 }, muledeer: { down: 1 }, pronghorn: { down: 1 },
  elk: { down: 1 }, moose: { down: 1 }, boar: { down: 1 }, bear: { down: 1 },
};

// species that reuse another species' art
const ALIAS = { mover: 'popup', spine: 'vyrr_spine' };

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

// City Hunt scenes register their own art path on the biome (BIOMES[id].art)
let BIOME_ART = {};
export function registerBiomeArt(map) { BIOME_ART = map; }
export const backgroundPath = (biome) => (BIOME_ART[biome] ? `${BIOME_ART[biome]}.jpg` : `backgrounds/${biome}.jpg`);
export const foregroundPath = (biome) => (BIOME_ART[biome] ? `${BIOME_ART[biome]}_cover.png` : `backgrounds/${biome}_fg.png`);
export const weaponPath = (id) => `weapons/${id}.png`;
export const weaponProfilePath = (id) => `weapons/${id}_profile.png`;
export const TITLE_ART = 'ui/title.jpg';

// ── City Hunt art ───────────────────────────────────────────────────────
// Per-entity art sets (an entity carries `artBase`, e.g. 'city/nyc/alpha'):
// each pose is <artBase>_<pose>.png, or _1/_2 for two-frame poses.
export const BASE_POSES = {
  alpha: { walk: 2, fire: 1, roar: 1, leap: 1, down: 1 }, // the city's boss
  hunter: { walk: 1, fire: 1, down: 1 }, // the city's own hunter clan
  civilian: { run: 1 },
  officer: { run: 1 },
};

export function basePaths(artBase, kind, pose) {
  const n = BASE_POSES[kind]?.[pose];
  if (!artBase || !n) return [];
  // people: the first running photo plus an optional opposite-stride frame
  if ((kind === 'civilian' || kind === 'officer') && pose === 'run') return [`${artBase}_run.png`, `${artBase}_run_2.png`];
  if (n === 1) return [`${artBase}_${pose}.png`];
  return Array.from({ length: n }, (_, i) => `${artBase}_${pose}_${i + 1}.png`);
}

export const CITY_IDS = ['nyc', 'toronto', 'singapore', 'hongkong', 'vegas'];
export const CIVILIANS_PER_CITY = 6;
export const STORY_PER_CITY = 12;
export const OFFICER_BASES = ['city/shared/officer_1', 'city/shared/officer_2', 'city/shared/swat'];
// Major Navarro: where each picture appears
export const MAJOR = {
  portrait: 'major/portrait.jpg', // City Hunt dossier
  briefing: 'major/briefing.jpg', // scene briefing banner
  battle: 'major/battle.jpg', // results after a failed scene
  victory: 'major/victory.jpg', // results after a cleared scene
  salute: 'major/salute.jpg', // results after an alpha falls
  standing: 'major/full_front.png', // cut-out on each city page
};
export const MAJOR_ART = Object.values(MAJOR);
export const CITY_SELECT_ART = 'city/select.jpg';
export const cityArt = (city, file) => `city/${city}/${file}`;
export const storyArt = (city, i) => `city/${city}/story_${String(i + 1).padStart(2, '0')}.jpg`;

// every City Hunt file, grouped (used by the art checklist)
export function cityArtManifest() {
  const pad = (n) => String(n).padStart(2, '0');
  const groups = {};
  for (const c of CITY_IDS) {
    const files = [];
    for (let i = 1; i <= 12; i++) files.push(`city/${c}/scene_${pad(i)}.jpg`, `city/${c}/scene_${pad(i)}_cover.png`);
    files.push(`city/${c}/key.jpg`, `city/${c}/panorama.jpg`, `city/${c}/medal.png`);
    for (let i = 0; i < STORY_PER_CITY; i++) files.push(storyArt(c, i));
    for (let i = 1; i <= CIVILIANS_PER_CITY; i++) files.push(`city/${c}/civilian_${i}_run.png`);
    for (const pose of Object.keys(BASE_POSES.alpha)) files.push(...basePaths(`city/${c}/alpha`, 'alpha', pose));
    for (const pose of Object.keys(BASE_POSES.hunter)) files.push(...basePaths(`city/${c}/hunter`, 'hunter', pose));
    groups[`City: ${c}`] = files;
  }
  const vyrr = [];
  for (const id of ['vyrr_tracker', 'vyrr_hunter', 'vyrr_hound', 'vyrr_seeker', 'vyrr_spine']) {
    for (const pose of Object.keys(POSES[id])) vyrr.push(...spritePaths(id, 'alien', pose));
  }
  groups['City: Vyrr (shared)'] = vyrr;
  groups['City: officers'] = OFFICER_BASES.map((b) => `${b}_run.png`);
  groups['City: Major Navarro'] = MAJOR_ART;
  groups['City: select screen'] = [CITY_SELECT_ART];
  return groups;
}

// Optional second running frame (opposite stride) for every civilian and officer.
export function strideManifest() {
  return [...CITY_IDS.flatMap((c) => Array.from({ length: CIVILIANS_PER_CITY }, (_, i) => `city/${c}/civilian_${i + 1}_run_2.png`)),
    ...OFFICER_BASES.map((b) => `${b}_run_2.png`)];
}

// Free-licensed photos used for some gun profiles (full credits in
// assets/weapons/CREDITS.txt); shown under the gun in the Arsenal.
export const PHOTO_CREDITS = {
  win70: { by: 'Michael E. Cumpston, touch-up by Francis Flinch', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Super2012b.jpg' },
  m82: { by: 'Zachi Evenor and MathKnight', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Barrett-M82A1-Independence-Day-2017-IZE-048-white.jpg' },
};
