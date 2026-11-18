// Biomes (backgrounds) and the 100-level hunt campaign (10 chapters of 10).
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

// ── Campaign ────────────────────────────────────────────────
// Each chapter lists its target pool (`from` = the level within the chapter
// where a species first appears) and ten levels: [name, biome, time of day,
// conditions, one-line brief]. Conditions:
//   fog      fog bank (targets fade with distance)
//   wind     strong, gusting wind
//   timed    quota must be met against the clock
//   trophy   a trophy animal can appear (worth triple)
//   far      big game held at long range
//   swarm    more targets at once, faster waves
//   night    dark, no optic help
//   nv       night with a night-vision optic
//   thermal  night with a thermal optic
//   boss     the Colossus walks in once the quota is met
// Difficulty rises inside each chapter and from chapter to chapter: targets
// move faster, leave sooner, and the quota asks for a larger share.

export const CHAPTERS = [
  {
    n: 1, name: 'Wetlands', tag: 'Ducks, geese and swans over marsh and open water.', classes: ['shotgun'], kind: 'birds',
    pool: [{ sp: 'mallard', w: 1, from: 0 }, { sp: 'swan', w: 0.15, from: 1 }, { sp: 'goose', w: 0.55, from: 2 }, { sp: 'eagle', w: 0.1, from: 6 }],
    trophy: 'goose',
    levels: [
      ['Marsh Dawn', 'marsh', 'dawn', '', 'Mallards flushing off the marsh at first light. Swing through and lead them.'],
      ['Flyway', 'lake', 'day', '', 'Ducks working the lake. Trumpeter swans are protected.'],
      ['Cattail Point', 'marsh', 'day', '', 'Canada geese join the ducks. Geese need a full pattern.'],
      ['Big Water', 'lake', 'dawn', 'wind', 'A crosswind is pushing birds fast across the open water.'],
      ['Fogbound Slough', 'marsh', 'dawn', 'fog', 'Fog on the slough. Birds appear late and close.'],
      ['Limit Morning', 'lake', 'day', 'timed', 'The flight is on. Fill the quota before it ends.'],
      ['North Wind', 'boreal', 'day', 'wind', 'Cold north wind and an eagle hunting the pond. Do not shoot the eagle.'],
      ['Blind on the Bay', 'lake', 'dusk', 'swarm', 'Big flocks at dusk. More birds in the air at once.'],
      ['Last Light Pass', 'marsh', 'dusk', 'wind timed', 'Wind and failing light. Make every shell count.'],
      ['Opening Day', 'lake', 'dawn', 'trophy timed swarm', 'Opening morning. A trophy honker is in the flight.'],
    ],
  },
  {
    n: 2, name: 'Uplands', tag: 'Pheasants, doves, rabbits and spring gobblers on farm country.', classes: ['shotgun', 'rimfire'], kind: 'birds',
    pool: [{ sp: 'pheasant', w: 0.5, from: 0 }, { sp: 'dove', w: 0.35, from: 1 }, { sp: 'rabbit', w: 0.3, from: 2 }, { sp: 'turkey', w: 0.35, from: 5 }],
    trophy: 'pheasant',
    levels: [
      ['Cornfield Edge', 'farm', 'day', '', 'Roosters flush low from the stubble. Stay on them.'],
      ['Dove Field', 'farm', 'day', '', 'Doves come in fast and erratic over the cut corn.'],
      ['Fencerow Rabbits', 'farm', 'dawn', '', 'Cottontails break from the fence line. Rabbits zig-zag.'],
      ['Stubble Flush', 'prairie', 'day', 'wind', 'Wind across the stubble and birds riding it.'],
      ['Prairie Roosters', 'prairie', 'dawn', 'timed', 'A fast walk through the grass. Fill the bag before the end of the strip.'],
      ['Gobbler Ridge', 'forestedge', 'dawn', '', 'Spring gobblers on the field edge. Head and neck is the vital zone.'],
      ['Hedgerow Run', 'farm', 'dusk', 'swarm', 'Everything moves at dusk. Birds and rabbits at once.'],
      ['Morning Mist', 'forestedge', 'dawn', 'fog', 'Mist hangs in the hollow. Shots come close and quick.'],
      ['Sorghum Strip', 'farm', 'day', 'wind timed', 'Hard wind and a clock. Pick shots fast.'],
      ['Field Trial', 'prairie', 'day', 'trophy timed swarm', 'The field trial. A trophy rooster is somewhere in the cover.'],
    ],
  },
  {
    n: 3, name: 'Whitetail Woods', tag: 'Buck-only whitetail in the hardwoods. Does are not legal.', classes: ['rifle', 'lever', 'handgun'], kind: 'big',
    pool: [{ sp: 'whitetail', w: 0.6, from: 0 }, { sp: 'doe', w: 0.5, from: 0 }, { sp: 'turkey', w: 0.2, from: 6 }],
    trophy: 'whitetail',
    levels: [
      ['Hardwood Ridge', 'hardwood', 'dawn', '', 'Bucks moving along the ridge. Wait for the antlers.'],
      ['Oak Flats', 'hardwood', 'day', '', 'Acorns are dropping and the deer are feeding in the open.'],
      ['Creek Bottom', 'forestedge', 'dawn', '', 'Deer cross the creek bottom. Range them before you shoot.'],
      ['Morning Fog', 'hardwood', 'dawn', 'fog', 'Fog in the timber. Antlers are hard to see past 80 metres.'],
      ['Pinch Point', 'forestedge', 'day', 'swarm', 'A funnel between two woodlots. Several deer at once.'],
      ['The Rut', 'hardwood', 'day', 'trophy', 'Bucks are chasing. A mature buck may show.'],
      ['Cedar Swamp', 'boreal', 'day', '', 'Thick swamp edge. Gobblers wander through too.'],
      ['Last Day Buck', 'prairie', 'dusk', 'timed far', 'Last evening of the season, long shots across the open.'],
      ['Windy Ridge', 'hardwood', 'day', 'wind far', 'Wind across the ridge. Hold into it at long range.'],
      ['The Monarch', 'hardwood', 'dusk', 'trophy far timed', 'The biggest buck on the property is moving. Do not miss.'],
    ],
  },
  {
    n: 4, name: 'High Country', tag: 'Mule deer, pronghorn and elk in big open country.', classes: ['rifle'], kind: 'big',
    pool: [{ sp: 'muledeer', w: 0.55, from: 0, lane: { d: [140, 260], alt: [0, 22] } }, { sp: 'pronghorn', w: 0.45, from: 2 }, { sp: 'elk', w: 0.5, from: 4, lane: { d: [200, 400], alt: [0, 28] } }, { sp: 'eagle', w: 0.08, from: 5 }],
    trophy: 'elk',
    levels: [
      ['High Meadow', 'mountain', 'day', '', 'Mule deer feed on the slopes. Range them and hold over.'],
      ['Sage Slopes', 'mountain', 'dawn', '', 'Bucks bedding on the sidehill. Watch for the stott.'],
      ['Antelope Flats', 'mountain', 'day', 'wind', 'Pronghorn cross the flats at speed. Lead them.'],
      ['Sagebrush Wind', 'valley', 'day', 'wind', 'The wind never stops up here. Read the meter.'],
      ['Elk Basin', 'valley', 'dawn', 'far', 'Bulls on the far side of the basin, 200 to 400 metres.'],
      ['Timberline', 'mountain', 'dusk', 'fog', 'Cloud drops onto the ridge. Shoot through the gaps.'],
      ['Bugle Creek', 'valley', 'dawn', 'trophy', 'Bulls are bugling. A royal bull is close.'],
      ['Crosswind Canyon', 'mountain', 'day', 'wind far', 'Long shots in a strong crosswind.'],
      ['Long Ridge', 'valley', 'day', 'far timed swarm', 'Everything on the mountain is moving at once.'],
      ['Royal Bull', 'valley', 'dawn', 'trophy far wind timed', 'The royal bull of the basin. One chance.'],
    ],
  },
  {
    n: 5, name: 'Dangerous Game', tag: 'Hogs, black bear and moose. Wounded animals fight back.', classes: null, kind: 'big', hp: 100,
    pool: [{ sp: 'boar', w: 0.6, from: 0 }, { sp: 'bear', w: 0.45, from: 2 }, { sp: 'moose', w: 0.45, from: 5 }],
    trophy: 'bear',
    levels: [
      ['Boar Thicket', 'scrub', 'dusk', '', 'Wild hogs run the scrub. A wounded boar will come for you.'],
      ['Hog Night', 'scrub', 'night', 'nv', 'Night vision issued. Hogs come out after dark.'],
      ['Bruin Ridge', 'hardwood', 'day', '', 'Black bear on the ridge. Use enough gun.'],
      ['Brush Country', 'scrub', 'day', 'swarm', 'A big sounder of hogs breaks cover at once.'],
      ['Thermal Hogs', 'scrub', 'night', 'thermal', 'Thermal optic. Hogs glow white in the brush.'],
      ['Moose Pond', 'boreal', 'day', '', 'Moose feeding in the bog. They are tougher than they look.'],
      ['Charge', 'boreal', 'dusk', 'timed', 'Bears and hogs at close range. Keep your health.'],
      ['Northern Bog', 'boreal', 'day', 'fog', 'Fog on the bog with bear and moose in it.'],
      ['Big Bruin', 'hardwood', 'dusk', 'trophy', 'A record black bear is working the edge.'],
      ['Dangerous Ground', 'scrub', 'night', 'nv swarm timed', 'Everything at once, at night. Survive and fill the quota.'],
    ],
  },
  {
    n: 6, name: 'Grand Slam', tag: 'Every species, every condition. The full hunter’s test.', classes: null, kind: 'mixed', hp: 100,
    pool: [{ sp: 'whitetail', w: 0.3, from: 0 }, { sp: 'doe', w: 0.25, from: 0 }, { sp: 'muledeer', w: 0.25, from: 0 }, { sp: 'pronghorn', w: 0.2, from: 2 }, { sp: 'elk', w: 0.2, from: 3 }, { sp: 'boar', w: 0.2, from: 1 }, { sp: 'bear', w: 0.15, from: 4 }, { sp: 'moose', w: 0.15, from: 5 }, { sp: 'turkey', w: 0.15, from: 2 }, { sp: 'eagle', w: 0.08, from: 0 }],
    trophy: 'elk',
    levels: [
      ['Big Country', 'prairie', 'day', '', 'Deer of every kind on open prairie. Does are still not legal.'],
      ['Four Seasons', 'forestedge', 'dawn', 'wind', 'Wind, hogs and deer on the field edge.'],
      ['Long Range Ladder', 'valley', 'day', 'far', 'Everything past 200 metres. Dial and send it.'],
      ['The Gauntlet', 'mountain', 'day', 'swarm', 'Animals moving through the pass all at once.'],
      ['Fog Valley', 'valley', 'dawn', 'fog', 'Fog in the valley, big game inside it.'],
      ['Crosswind', 'prairie', 'day', 'wind far', 'Strong crosswind at long range.'],
      ['North to South', 'boreal', 'dusk', 'trophy', 'From bog to prairie, a trophy bull is among them.'],
      ['Dawn to Dusk', 'hardwood', 'dusk', 'timed swarm', 'A full day’s hunting compressed into minutes.'],
      ['Every Animal', 'mountain', 'dawn', 'wind far timed', 'Every species, wind and range. Prove it.'],
      ['Grand Slam', 'valley', 'dusk', 'trophy far wind timed swarm', 'The Grand Slam. The last normal day of hunting.'],
    ],
  },
  {
    n: 7, name: 'Strange Lights', tag: 'Something is in the sky over the hunting grounds.', classes: null, kind: 'mixed', hp: 100,
    pool: [{ sp: 'whitetail', w: 0.25, from: 0 }, { sp: 'muledeer', w: 0.2, from: 0 }, { sp: 'orb', w: 0.35, from: 0 }, { sp: 'elk', w: 0.15, from: 2 }, { sp: 'skitter', w: 0.3, from: 3 }, { sp: 'glider', w: 0.25, from: 6 }],
    trophy: 'muledeer',
    levels: [
      ['Strange Lights', 'prairie', 'dusk', '', 'Deer are running for no reason. Something hovers over the prairie.'],
      ['Gone Quiet', 'prairie', 'night', 'night', 'No birds, no wind. Lights low on the horizon.'],
      ['Hovering', 'mountain', 'dusk', '', 'Orbs over the meadow. They blink away when watched.'],
      ['Something in the Grass', 'prairie', 'dusk', 'swarm', 'Small fast things in the grass. They come straight at you.'],
      ['Lights Over the Ridge', 'hardwood', 'night', 'nv', 'Night vision shows what the eye cannot.'],
      ['The Scattering', 'valley', 'dawn', 'fog', 'Fog, panicked elk and things moving inside it.'],
      ['Gliders', 'prairie', 'dusk', 'wind', 'Something big is flying low over the grass.'],
      ['Animals Running', 'mountain', 'day', 'timed swarm', 'Every animal on the mountain is fleeing downhill.'],
      ['First Contact', 'prairie', 'night', 'thermal', 'Thermal optic. They are warmer than anything that lives here.'],
      ['Abduction Field', 'prairie', 'night', 'nv swarm timed', 'The lights land. Hold the field.'],
    ],
  },
  {
    n: 8, name: 'Crash Site', tag: 'The thing came down in the canyon. What climbed out is hunting.', classes: null, kind: 'aliens', hp: 100,
    pool: [{ sp: 'skitter', w: 0.45, from: 0 }, { sp: 'glider', w: 0.3, from: 1 }, { sp: 'stalker', w: 0.3, from: 2 }, { sp: 'orb', w: 0.2, from: 4 }, { sp: 'pod', w: 0.25, from: 5 }],
    trophy: null,
    levels: [
      ['Crash Site', 'canyon', 'night', '', 'The wreck still smokes. Skitters come up the wash.'],
      ['The Wash', 'canyon', 'dusk', '', 'Gliders sweep the canyon floor.'],
      ['Wreckage', 'canyon', 'night', 'swarm', 'They pour out of the hull.'],
      ['Stalker Country', 'ridge', 'dusk', '', 'Tall ones on the ridge. Hit them only when they are visible.'],
      ['Canyon Echo', 'canyon', 'day', 'wind', 'Wind howls down the canyon. Hold into it.'],
      ['Pod Rain', 'canyon', 'night', 'nv', 'Pods falling all over the canyon. Shoot them before they land.'],
      ['Ridge Line', 'ridge', 'day', 'far', 'Stalkers on the high ridge, far away.'],
      ['Gliders at Dusk', 'canyon', 'dusk', 'swarm timed', 'The sky fills with gliders.'],
      ['Last Patrol', 'base', 'night', 'thermal', 'The outpost goes dark. Thermal only.'],
      ['Ground Zero', 'canyon', 'night', 'swarm timed wind', 'Back to the wreck. End it.'],
    ],
  },
  {
    n: 9, name: 'Invasion', tag: 'Brutes, drop pods and stalkers across the whole region.', classes: null, kind: 'aliens', hp: 120,
    pool: [{ sp: 'skitter', w: 0.4, from: 0 }, { sp: 'brute', w: 0.2, from: 0 }, { sp: 'stalker', w: 0.25, from: 1 }, { sp: 'pod', w: 0.25, from: 2 }, { sp: 'glider', w: 0.2, from: 3 }, { sp: 'orb', w: 0.15, from: 4 }],
    trophy: null,
    levels: [
      ['Perimeter', 'base', 'dusk', '', 'Brutes test the wire. Low-power rounds bounce off them.'],
      ['Outpost', 'base', 'day', 'swarm', 'They found the outpost.'],
      ['Drop Zone', 'prairie', 'night', 'nv', 'Pods are landing on the prairie.'],
      ['Brute Force', 'range', 'day', 'far', 'Brutes crossing the range. Aim for the glowing sac.'],
      ['Overrun', 'base', 'night', 'swarm timed', 'The outpost is overrun. Hold until help comes.'],
      ['Night Siege', 'base', 'night', 'thermal', 'Thermal optic. They are coming over the wall.'],
      ['Scorched Prairie', 'prairie', 'dusk', 'wind fog', 'Smoke and wind across the burning prairie.'],
      ['Holding Line', 'ridge', 'day', 'swarm', 'Hold the ridge line.'],
      ['Breach', 'canyon', 'night', 'swarm timed', 'They broke through the canyon.'],
      ['Colossus Rising', 'range', 'dusk', 'boss', 'Fill the quota, then a walker the size of a building arrives.'],
    ],
  },
  {
    n: 10, name: 'The Hive', tag: 'The valley is theirs now. Take it back.', classes: null, kind: 'aliens', hp: 120,
    pool: [{ sp: 'skitter', w: 0.35, from: 0 }, { sp: 'glider', w: 0.2, from: 0 }, { sp: 'stalker', w: 0.25, from: 0 }, { sp: 'orb', w: 0.2, from: 1 }, { sp: 'brute', w: 0.2, from: 2 }, { sp: 'pod', w: 0.2, from: 3 }],
    trophy: null,
    levels: [
      ['The Hive', 'hive', 'alien', '', 'The valley glows. Everything here is hostile.'],
      ['Spires', 'hive', 'alien', 'far', 'Stalkers among the spires, far out.'],
      ['Brood', 'hive', 'alien', 'swarm', 'The brood hatches all at once.'],
      ['Glow Fields', 'hive', 'alien', 'fog', 'Spore fog over the glowing fields.'],
      ['Nest', 'hive', 'alien', 'swarm timed', 'Burn down the nest before it empties.'],
      ['Deep Hive', 'hive', 'alien', 'wind', 'Storm winds inside the valley.'],
      ['Swarm', 'hive', 'alien', 'swarm', 'Everything they have, at once.'],
      ['Queen’s Road', 'hive', 'alien', 'far timed', 'The road to the heart of the hive.'],
      ['The Heart', 'hive', 'alien', 'swarm timed wind', 'The heart of the hive. Do not stop shooting.'],
      ['Final Stand', 'hive', 'alien', 'boss swarm', 'The last Colossus. Bring it down and the valley is free.'],
    ],
  },
];

const BASE = {
  birds: { total: 10, per: 0.5, conc: 2, gap: [0.8, 1.7], wind: [0, 2], secs: 5 },
  big: { total: 6, per: 0.4, conc: 2, gap: [1.6, 3.5], wind: [0, 3], secs: 10 },
  mixed: { total: 10, per: 0.5, conc: 3, gap: [1, 2.4], wind: [1, 3], secs: 8 },
  aliens: { total: 14, per: 0.7, conc: 3, gap: [0.8, 1.8], wind: [0, 3], secs: 5 },
};

const TROPHY = {
  goose: { name: 'Trophy giant Canada goose', points: 600, len: 1.12 },
  pheasant: { name: 'Trophy longtail rooster', points: 600, len: 0.95 },
  whitetail: { name: 'Trophy whitetail buck', points: 1500, len: 2.2 },
  elk: { name: 'Trophy royal bull elk', points: 2000, len: 2.95 },
  bear: { name: 'Trophy black bear', points: 2200, len: 2.05 },
  muledeer: { name: 'Trophy mule deer buck', points: 1600, len: 2.3 },
};

function buildLevel(ch, ci, row) {
  const [name, biome, tod0, condStr, brief] = row;
  const n = (ch.n - 1) * 10 + ci + 1;
  const cond = condStr ? condStr.split(' ') : [];
  const has = (c) => cond.includes(c);
  const b = BASE[ch.kind];
  const diff = +(1 + (ch.n - 1) * 0.05 + ci * 0.03).toFixed(2);
  const total = Math.round(b.total + ci * b.per + (has('swarm') ? 2 : 0) + (has('timed') ? 1 : 0));
  const need = Math.min(total, Math.round(total * (0.58 + ci * 0.022)));
  const far = has('far') ? 1.45 : 1;
  const spawns = ch.pool.filter((p) => p.from <= ci).map((p) => {
    const s = { sp: p.sp, w: p.w };
    if (p.lane || far > 1) {
      const lane = p.lane || null;
      if (lane) s.lane = { ...lane };
      if (far > 1 && ['muledeer', 'whitetail', 'doe', 'elk', 'moose', 'pronghorn', 'bear', 'stalker', 'brute'].includes(p.sp)) {
        const L = s.lane || { d: DEFAULT_LANES[p.sp] };
        s.lane = { ...L, d: [Math.round(L.d[0] * far), Math.min(650, Math.round(L.d[1] * far))] };
      }
    }
    return s;
  });
  if (has('trophy') && ch.trophy) {
    const base = spawns.find((s) => s.sp === ch.trophy) || { sp: ch.trophy };
    spawns.push({ sp: ch.trophy, w: 0.14, lane: base.lane, as: { ...TROPHY[ch.trophy], trophy: true } });
  }
  let tod = tod0, filter = null;
  if (has('nv')) { tod = 'night'; filter = 'nv'; }
  if (has('thermal')) { tod = 'night'; filter = 'thermal'; }
  if (has('night')) tod = 'night';
  const wind = [b.wind[0] + (has('wind') ? 3 : 0), b.wind[1] + ci * 0.3 + (has('wind') ? 5 : 0)].map((v) => +v.toFixed(1));
  const conc = b.conc + (has('swarm') ? 1 : 0) + (ci >= 7 && ch.kind !== 'big' ? 1 : 0);
  const gapMul = (1 - ci * 0.035) * (has('swarm') ? 0.7 : 1);
  const lvl = {
    id: 'L' + n, n, chapter: ch.n, name, biome, tod, brief, cond,
    spawns, total, need, concurrent: conc,
    gap: [+(b.gap[0] * gapMul).toFixed(2), +(b.gap[1] * gapMul).toFixed(2)],
    classes: ch.classes, wind, diff,
  };
  if (filter) lvl.filter = filter;
  if (has('fog')) lvl.fog = 0.65;
  if (has('timed')) lvl.timeLimit = Math.round(total * b.secs + 25);
  if (ch.hp) lvl.hp = ch.hp;
  if (has('boss')) { lvl.finale = 'colossus'; lvl.hp = Math.max(lvl.hp || 0, 150); }
  return lvl;
}

// default distance bands used when a level pushes big game further out
const DEFAULT_LANES = { whitetail: [60, 140], doe: [60, 140], muledeer: [120, 260], pronghorn: [150, 300], elk: [200, 400], moose: [120, 260], bear: [60, 150], stalker: [80, 200], brute: [120, 200] };

export const LEVELS = CHAPTERS.flatMap((ch) => ch.levels.map((row, ci) => buildLevel(ch, ci, row)));
export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
export const LEVEL_COUNT = LEVELS.length;
export const chapterOf = (n) => CHAPTERS[Math.floor((n - 1) / 10)];

export const CONDITION_LABELS = {
  fog: 'Fog', wind: 'High wind', timed: 'Timed', trophy: 'Trophy', far: 'Long range', swarm: 'Swarm',
  night: 'Night', nv: 'Night vision', thermal: 'Thermal', boss: 'Boss',
};
