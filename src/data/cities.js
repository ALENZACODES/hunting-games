// City Hunt: a special series. The Vyrr, an alien species that hunts for
// sport, have come to five of the world's richest districts. Major Cole
// Navarro leads the response. Each city has 12 scenes; the 12th is the
// city's alpha. Vyrr fire back: watch for the glow of a charging spine,
// shoot the spine out of the air or hold Space to take cover.
//
// Scene types drive the drawn stand-in backdrop until the photo exists:
// street | square | strip | park | interior | rooftop | bridge | waterfront

import { BIOMES } from './levels.js';
import { registerBiomeArt } from './art.js';

export const MAJOR = {
  name: 'Major Cole Navarro',
  unit: 'Joint Task Force Nightfall',
  bio: 'Twenty-two years in special operations, the last six hunting things that should not exist. Built like a heavyweight, calm like a surgeon.',
};

export const CITY_ARMORY = ['m4', 'scar', 'akm', 'sbe3', 'axmc', 'm82'];

// default height ranges (metres) Vyrr use to cling to walls and ledges
const ALT = { street: 16, square: 12, strip: 14, park: 5, interior: 5, rooftop: 3, bridge: 9, waterfront: 6 };
// horizon (fraction of screen height) the scene photos are prompted with
const HORIZON = { street: 0.5, square: 0.5, strip: 0.5, park: 0.5, interior: 0.5, rooftop: 0.46, bridge: 0.5, waterfront: 0.48 };
// Moving light and weather over each scene photo (src/game/ambience.js).
// Defaults come from the time of day and scene type; EXTRA adds what each
// photo shows (wet streets, snow, steam, a waterfall, an old subway).
const OUTDOOR = (type) => type !== 'interior';
function ambienceFor(biomeId, type, tod) {
  const fx = new Set();
  const night = tod === 'night', dusk = tod === 'dusk';
  if (night && type !== 'park') fx.add('neon');
  if ((night || dusk) && ['street', 'strip', 'square', 'bridge'].includes(type)) fx.add('police');
  if (night && ['rooftop', 'waterfront', 'bridge'].includes(type)) fx.add('searchlights');
  if ((night || dusk) && OUTDOOR(type)) fx.add('heli');
  if (type === 'waterfront') fx.add('glints');
  if ((tod === 'day' || tod === 'dawn') && OUTDOOR(type)) fx.add('birds');
  if (tod === 'day' && type === 'interior') fx.add('motes');
  if (tod === 'dawn') fx.add('mist');
  if (type === 'park' && !night) fx.add('leaves');
  for (const e of EXTRA[biomeId] || []) e.startsWith('-') ? fx.delete(e.slice(1)) : fx.add(e);
  return [...fx];
}
const EXTRA = {
  'nyc-01': ['steam'], 'nyc-02': ['steam'], 'nyc-05': ['flicker', '-heli'], 'nyc-06': ['rain', 'steam'], 'nyc-09': ['leaves'], 'nyc-11': ['motes'], 'nyc-12': ['drizzle'],
  'toronto-02': ['drizzle'], 'toronto-06': ['sleet'], 'toronto-08': ['leaves'], 'toronto-09': ['flicker'], 'toronto-12': ['snow'],
  'singapore-02': ['drizzle'], 'singapore-03': ['mist'], 'singapore-09': ['mist', 'motes'], 'singapore-12': ['glints'],
  'hongkong-02': ['drizzle'], 'hongkong-03': ['rain'], 'hongkong-04': ['mist'], 'hongkong-08': ['cloud', 'drizzle'], 'hongkong-11': ['mist'],
  'vegas-03': ['neonflicker'], 'vegas-04': ['neonflicker'], 'vegas-06': ['dust'], 'vegas-09': ['neonflicker'], 'vegas-10': ['dust', '-birds'],
};

// cover photos that show scenery behind the object instead of being cut out;
// the game uses its drawn cover for these until the file is replaced
const SKIP_COVER = new Set(['singapore-11']);

// eye level measured on each of the 60 scene photos (vanishing point of the
// ground, or the far horizon on rooftops and waterfronts)
const MEASURED = {
  'nyc-01': 0.60, 'nyc-02': 0.48, 'nyc-03': 0.52, 'nyc-04': 0.60, 'nyc-05': 0.48, 'nyc-06': 0.60,
  'nyc-07': 0.47, 'nyc-08': 0.56, 'nyc-09': 0.47, 'nyc-10': 0.46, 'nyc-11': 0.55, 'nyc-12': 0.42,
  'hongkong-01': 0.59, 'hongkong-02': 0.46, 'hongkong-03': 0.57, 'hongkong-04': 0.45, 'hongkong-05': 0.52, 'hongkong-06': 0.51,
  'hongkong-07': 0.49, 'hongkong-08': 0.47, 'hongkong-09': 0.49, 'hongkong-10': 0.52, 'hongkong-11': 0.55, 'hongkong-12': 0.46,
  'singapore-01': 0.53, 'singapore-02': 0.56, 'singapore-03': 0.61, 'singapore-04': 0.55, 'singapore-05': 0.50, 'singapore-06': 0.57,
  'singapore-07': 0.58, 'singapore-08': 0.55, 'singapore-09': 0.58, 'singapore-10': 0.56, 'singapore-11': 0.51, 'singapore-12': 0.50,
  'toronto-01': 0.53, 'toronto-02': 0.55, 'toronto-03': 0.55, 'toronto-04': 0.56, 'toronto-05': 0.60, 'toronto-06': 0.56,
  'toronto-07': 0.47, 'toronto-08': 0.58, 'toronto-09': 0.52, 'toronto-10': 0.54, 'toronto-11': 0.55, 'toronto-12': 0.49,
  'vegas-01': 0.53, 'vegas-02': 0.51, 'vegas-03': 0.53, 'vegas-04': 0.58, 'vegas-05': 0.47, 'vegas-06': 0.44,
  'vegas-07': 0.54, 'vegas-08': 0.55, 'vegas-09': 0.55, 'vegas-10': 0.51, 'vegas-11': 0.51, 'vegas-12': 0.44,
};

export const CITIES = [
  {
    id: 'nyc', name: 'New York', district: 'Manhattan', tagline: 'Midtown to the Financial District, eight million people and something hunting them.',
    alpha: 'The Spire Warden', neon: ['#ff2d55', '#00c2ff', '#ffd60a'], water: false,
    scenes: [
      ['Times Square', 'square', 'night', 'Screens still running, streets emptying. The first Vyrr are on the billboards.'],
      ['Fifth Avenue', 'street', 'dusk', 'Shoppers running down the avenue. Keep fire off the civilians.'],
      ['The Mall, Central Park', 'park', 'dawn', 'Hounds in the elm rows. They come low and fast.'],
      ['Grand Central Concourse', 'interior', 'day', 'They are in the station. Watch the balconies.'],
      ['Subway Platform', 'interior', 'night', 'A dead train, a dark tunnel and spines coming out of it.'],
      ['Wall Street', 'street', 'night', 'Rain on the stone canyons. Hunters cloak between the columns.'],
      ['Water Tower Rooftops', 'rooftop', 'dusk', 'Roof to roof. They jump the gaps. So do their shots.'],
      ['Brooklyn Bridge', 'bridge', 'night', 'They climb the cables. Nowhere to hide on the walkway.'],
      ['The High Line', 'park', 'dusk', 'The elevated park, cut off at both ends.'],
      ['Midtown Helipad', 'rooftop', 'night', 'Seekers circling the helipad. Clear the sky.'],
      ['SoHo Cast-Iron Row', 'street', 'day', 'Fire escapes everywhere. They love fire escapes.'],
      ['Top of the Rock', 'rooftop', 'night', 'The Spire Warden is waiting above the city.'],
    ],
    story: [
      ['start', 'Manhattan, 02:10. Twelve people missing from Times Square in nine minutes. No bodies, no witnesses who make sense.'],
      ['start', 'Major Cole Navarro lands at the Battery with a six-gun armory and one order: find them, stop them.'],
      ['start', 'Thermal drones catch them first: tall shapes moving across the billboards, invisible to the eye.'],
      ['after3', 'They are not looting. They are hunting. They choose the strongest-looking targets first.'],
      ['after3', 'A spine from one of them punches through a squad car door. Navarro orders everyone into cover.'],
      ['after6', 'Under Wall Street, a trophy wall: helmets, badges, a firefighter’s axe. Arranged with care.'],
      ['after6', 'The hunters are falling back toward Midtown. Something larger is calling them.'],
      ['boss', 'On the observation deck at the top of Rockefeller Center, the Spire Warden stands in the rain, watching him come.'],
      ['boss', 'It drops its cloak on purpose. It wants a fair fight.'],
      ['end', 'The Warden falls across the deck. The hunters in the streets go silent and withdraw.'],
      ['end', 'At dawn the city counts its missing. Fewer than it feared.'],
      ['end', 'Navarro is already reading the next report: Toronto, Yorkville. Same pattern.'],
    ],
  },
  {
    id: 'toronto', name: 'Toronto', district: 'Yorkville', tagline: 'Boutiques, galleries and quiet money. The Vyrr came for the quiet.',
    alpha: 'The Frostcrest', neon: ['#ffffff', '#7fd1ff', '#ffb347'], water: false,
    scenes: [
      ['Yorkville Avenue', 'street', 'dusk', 'Patios emptying fast. Hunters on the Victorian rooftops.'],
      ['Bloor Street', 'street', 'night', 'The luxury strip. Glass storefronts, and something reflected in them.'],
      ['Village of Yorkville Park', 'park', 'day', 'Hounds in the birch grove around the big granite rock.'],
      ['The Museum Crystal', 'square', 'night', 'The crystal facade lights up the plaza. They are climbing it.'],
      ['Hazelton Courtyard', 'square', 'dusk', 'A small courtyard with too many balconies.'],
      ['Cumberland Terrace', 'street', 'night', 'Freezing rain. Cloaks show up as shimmer in the sleet.'],
      ['Hotel Rooftop Bar', 'rooftop', 'night', 'The terrace bar thirty floors up. Seekers circling the heaters.'],
      ['Philosopher’s Walk', 'park', 'dawn', 'A ravine path through the trees. They hunt from the slopes.'],
      ['Bay Station Platform', 'interior', 'night', 'The trains have stopped. The tunnel has not.'],
      ['Queen’s Park Circle', 'park', 'day', 'Open lawns in front of the Legislature. No cover but the trees.'],
      ['Yorkville Village Mall', 'interior', 'day', 'Escalators, skylights and glass rails. Watch above you.'],
      ['Tower Crown, Bloor-Yorkville', 'rooftop', 'night', 'The Frostcrest has taken the highest roof in the neighbourhood.'],
    ],
    story: [
      ['start', 'Toronto, first snow of the year. A gallery owner on Yorkville Avenue reports a man-shaped hole in the falling snow.'],
      ['start', 'Navarro arrives on Bloor Street with a joint team. The patios are still lit; the tables are empty.'],
      ['start', 'Snow gives them away: every cloaked hunter leaves a shape in the flurries.'],
      ['after3', 'These ones are paler, thicker plated. Built for the cold. Somebody planned this.'],
      ['after3', 'A police cruiser burns on Cumberland. The officers made it out because Navarro told them to stay low.'],
      ['after6', 'In the ravine below Philosopher’s Walk, nests woven from fallen branches and broken glass.'],
      ['after6', 'The tracks all lead uptown, toward the tallest tower in Yorkville.'],
      ['boss', 'On the crown of the tower, in a blizzard, the Frostcrest unfolds to its full height.'],
      ['boss', 'Ice hangs from its plates. Its eyes are the only warm thing up there.'],
      ['end', 'The Frostcrest goes over the parapet and does not come back up.'],
      ['end', 'Yorkville wakes up to plows, sirens and a city that will not talk about it.'],
      ['end', 'A satellite picks up the same heat signature over Marina Bay. Navarro is on the next flight.'],
    ],
  },
  {
    id: 'singapore', name: 'Singapore', district: 'Marina Bay', tagline: 'The most orderly city on earth, and the hunters are rearranging it.',
    alpha: 'The Tidecaller', neon: ['#b388ff', '#00e5ff', '#ffd54f'], water: true,
    scenes: [
      ['Marina Bay Promenade', 'waterfront', 'night', 'The light show stops mid-cycle. Hunters along the water.'],
      ['Orchard Road', 'street', 'night', 'Malls and giant screens. The crowds are still getting out.'],
      ['Supertree Grove', 'park', 'night', 'Lit canopies above, hounds below.'],
      ['The SkyPark Deck', 'rooftop', 'dusk', 'Fifty-seven floors up, beside the infinity pool.'],
      ['Helix Bridge', 'bridge', 'night', 'The double-helix walkway. They climb the steel.'],
      ['Raffles Place', 'square', 'day', 'The financial district at noon. They do not care about daylight.'],
      ['Luxury Mall Atrium', 'interior', 'day', 'Five floors of glass balconies around an open atrium.'],
      ['Esplanade Waterfront', 'waterfront', 'dusk', 'The spiked domes behind you, the bay in front.'],
      ['Cloud Forest Dome', 'interior', 'day', 'Mist, a waterfall and walkways in the canopy.'],
      ['Merlion Park', 'waterfront', 'dawn', 'Dawn over the bay and a hunter on the statue.'],
      ['Clarke Quay', 'waterfront', 'night', 'Riverside bars and coloured lights. Civilians everywhere.'],
      ['SkyPark at Midnight', 'rooftop', 'night', 'The Tidecaller is waiting on the roof above the bay.'],
    ],
    story: [
      ['start', 'Singapore, 21:40. The Marina Bay light show freezes on a single frame and stays there.'],
      ['start', 'Navarro lands on a closed expressway. The city has already cleared half the bay. It is very good at this.'],
      ['start', 'Hunters are moving along the promenade in the open. They want to be seen here.'],
      ['after3', 'In the Supertree Grove they have hung their prey’s gear from the canopies like decorations.'],
      ['after3', 'The SkyPark deck is theirs. From up there they can see the whole bay.'],
      ['after6', 'The hunters here are sleek, almost amphibious. Some of them came out of the water.'],
      ['after6', 'A signal pulses from the top of the hotel towers, and every hunter in the city turns toward it.'],
      ['boss', 'Midnight on the SkyPark. The Tidecaller rises out of the infinity pool.'],
      ['boss', 'Water runs off its plates in sheets. The pool lights turn it into a silhouette.'],
      ['end', 'The Tidecaller sinks back into the pool and the water goes still.'],
      ['end', 'The light show restarts at 05:12, exactly where it stopped.'],
      ['end', 'Hong Kong reports the hunters in the neon. Navarro goes north.'],
    ],
  },
  {
    id: 'hongkong', name: 'Hong Kong', district: 'Central & Victoria Harbour', tagline: 'Vertical city, neon canyons, nowhere to run but up.',
    alpha: 'The Neon Matriarch', neon: ['#ff3b6b', '#00f0ff', '#ffe600'], water: true,
    scenes: [
      ['Queen’s Road Central', 'street', 'night', 'Trams stopped, towers lit. Hunters on the footbridges.'],
      ['Victoria Harbour Promenade', 'waterfront', 'night', 'The skyline across the water and spines coming from it.'],
      ['Mong Kok Neon Street', 'street', 'night', 'Signs over every inch of sky. Perfect cover for a cloak.'],
      ['Victoria Peak Lookout', 'park', 'dusk', 'The whole city below you, and they came up the hill.'],
      ['Mid-Levels Escalator', 'street', 'day', 'A covered escalator through the hillside. One way in.'],
      ['Star Ferry Pier', 'waterfront', 'dusk', 'The ferries are adrift. Something is on the pier roof.'],
      ['Temple Street Night Market', 'street', 'night', 'Stalls, lanterns and a crowd that will not stop running.'],
      ['Skyscraper Helipad', 'rooftop', 'night', 'Four hundred metres up. Seekers in the cloud.'],
      ['Lan Kwai Fong', 'street', 'night', 'Steep bar street, music still playing.'],
      ['Causeway Bay Crossing', 'square', 'day', 'The busiest crossing in the city, empty except for them.'],
      ['Hong Kong Park', 'park', 'day', 'Waterfalls and towers. The hounds are in the trees.'],
      ['Above the Harbour', 'rooftop', 'night', 'The Neon Matriarch has the tallest roof in the city.'],
    ],
    story: [
      ['start', 'Hong Kong, 23:00, typhoon signal raised. The harbour is black and the neon is still on.'],
      ['start', 'Navarro takes a police launch across the water. Every footbridge in Central has a shape on it.'],
      ['start', 'The neon breaks their cloaks: colour bends around them like a lens.'],
      ['after3', 'Mong Kok is a maze. They herd people into dead ends and wait.'],
      ['after3', 'From the Peak you can see the hunters moving through the city like light through fibre.'],
      ['after6', 'They have cut the ferries loose. The harbour is full of drifting boats with nobody aboard.'],
      ['after6', 'All of them are climbing now, toward the tallest roof above the harbour.'],
      ['boss', 'The Neon Matriarch waits on the helipad, lit from below by a whole city of signs.'],
      ['boss', 'Her plates are scored with marks: one for every city they have hunted before this one.'],
      ['end', 'The Matriarch falls into the cloud and the city lights flicker once, all at the same time.'],
      ['end', 'The typhoon passes before dawn. So do the hunters.'],
      ['end', 'One last signal from the Nevada desert. Las Vegas. Navarro knows it is the last one.'],
    ],
  },
  {
    id: 'vegas', name: 'Las Vegas', district: 'The Strip', tagline: 'The brightest street on earth and the last hunting ground.',
    alpha: 'The High Roller', neon: ['#ff2fd1', '#2fffe0', '#ffcc00'], water: false,
    scenes: [
      ['The Strip', 'strip', 'night', 'Eight lanes of neon and no traffic. They are on the marquees.'],
      ['Fountain Lake', 'waterfront', 'night', 'The fountains still fire on schedule. So do they.'],
      ['Casino Floor', 'interior', 'night', 'Slot machines, chandeliers and nowhere to see far.'],
      ['Fremont Street Canopy', 'strip', 'night', 'Under the giant light canopy downtown.'],
      ['Resort Pool Deck', 'rooftop', 'day', 'Cabanas, palms and a hundred-degree afternoon.'],
      ['Rooftop Helipad', 'rooftop', 'dusk', 'The sun sets behind the mountains. They come with it.'],
      ['South Strip Median', 'strip', 'dusk', 'Palm trees and a long open median.'],
      ['Monorail Station', 'interior', 'night', 'An elevated platform with glass on both sides.'],
      ['Neon Sign Graveyard', 'square', 'night', 'Old giant signs in the dirt. They hide among the letters.'],
      ['Red Rock Overlook', 'park', 'day', 'Out in the desert, the hunters’ landing zone.'],
      ['Wedding Chapel Row', 'street', 'night', 'Little chapels and big lights.'],
      ['The Tower Top', 'rooftop', 'night', 'The High Roller has climbed the highest tower on the Strip.'],
    ],
    story: [
      ['start', 'Las Vegas, 01:00. The Strip has never been this quiet. Every sign is still on.'],
      ['start', 'Navarro rolls in with what is left of the task force. This is where they all came from.'],
      ['start', 'Every one of them is wearing trophies now. They know who he is.'],
      ['after3', 'On the casino floor they have stacked the chips from every table into one tall column. A message.'],
      ['after3', 'Fremont Street’s canopy is showing nothing but static. They are in the light.'],
      ['after6', 'Out at Red Rock, scorched glass in a perfect circle: the landing site.'],
      ['after6', 'The last of them climb the tallest tower on the Strip. Their leader is already at the top.'],
      ['boss', 'The High Roller stands on the tower’s rim, the whole valley of lights spread under it.'],
      ['boss', 'It sets down one trophy at its feet: a Nightfall patch. It is waiting for the last one.'],
      ['end', 'The High Roller falls into the light. Every sign on the Strip goes dark, and then comes back on.'],
      ['end', 'Five cities. One Major. The hunt is over, for now.'],
      ['end', 'Navarro sits on the tower edge until sunrise. Somewhere above the atmosphere, something is watching the replay.'],
    ],
  },
];

// story beat → when it plays
export const STORY_AT = { start: 'before scene 1', after3: 'after scene 3', after6: 'after scene 6', boss: 'before scene 12', end: 'after scene 12' };

// ── generated scenes (levels) ───────────────────────────────────────────
function buildScene(city, i, row) {
  const [name, type, tod, brief] = row;
  const n = i + 1;
  const sid = String(n).padStart(2, '0');
  const biomeId = `${city.id}-${sid}`;
  // register the scene as a biome so the renderer can use it like any other
  BIOMES[biomeId] = {
    name: `${name}, ${city.name}`, horizon: MEASURED[biomeId] ?? HORIZON[type], city: city.id, sceneType: type, neon: city.neon,
    water: type === 'waterfront' || (type === 'bridge' && city.water), fg: 'cover', fgTop: 0.74, noCoverArt: SKIP_COVER.has(biomeId),
    art: `city/${city.id}/scene_${sid}`, ambience: ambienceFor(biomeId, type, tod),
  };
  const altMax = ALT[type];
  const boss = n === 12;
  const total = 10 + i;
  const need = Math.round(total * (0.58 + i * 0.018));
  const hunterLane = { d: [30, 90], alt: [0, altMax] };
  const spawns = [
    { sp: 'vyrr_tracker', w: 0.45, lane: { d: [22, 70], alt: [0, altMax] } },
    i >= 1 && { sp: 'vyrr_hound', w: 0.25 },
    i >= 2 && { sp: 'vyrr_hunter', w: 0.35, lane: hunterLane, clan: city.id },
    i >= 4 && { sp: 'vyrr_seeker', w: 0.2 },
    { sp: 'civilian', w: 0.3, city: city.id },
    i >= 3 && { sp: 'officer', w: 0.1 },
  ].filter(Boolean);
  const cond = [];
  if (tod === 'night') cond.push('night');
  if (i % 4 === 3) cond.push('swarm');
  if (boss) cond.push('boss');
  return {
    id: `C-${city.id}-${sid}`, n, city: city.id, cityName: city.name, name, biome: biomeId, tod: tod === 'night' ? 'citynight' : tod, sceneType: type,
    brief, cond, spawns, total, need, concurrent: 2 + Math.min(2, Math.floor(i / 4)) + (i % 4 === 3 ? 1 : 0),
    gap: [+(1.2 - i * 0.04).toFixed(2), +(2.4 - i * 0.07).toFixed(2)], wind: [0, 3], diff: +(1.1 + i * 0.04).toFixed(2),
    hp: 100 + i * 5, cover: true, issue: CITY_ARMORY, kind: 'city',
    ...(boss ? { finale: 'vyrr_alpha', finaleDef: { city: city.id, as: { name: city.alpha } } } : {}),
  };
}

export const CITY_LEVELS = CITIES.flatMap((c) => c.scenes.map((row, i) => buildScene(c, i, row)));
registerBiomeArt(Object.fromEntries(Object.entries(BIOMES).filter(([, b]) => b.art).map(([k, b]) => [k, b.art])));
export const CITY_LEVEL_BY_ID = Object.fromEntries(CITY_LEVELS.map((l) => [l.id, l]));
export const CITY_BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c]));
export const cityLevels = (cityId) => CITY_LEVELS.filter((l) => l.city === cityId);
