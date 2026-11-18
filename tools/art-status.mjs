// Lists every art file the game looks for and whether it exists yet.
// Usage: npm run art   (or: node tools/art-status.mjs)

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { POSES, EXTRA_POSES, spritePaths, backgroundPath, foregroundPath, weaponPath, weaponProfilePath, TITLE_ART } from '../src/data/art.js';
import { SPECIES } from '../src/data/species.js';
import { BIOMES } from '../src/data/levels.js';
import { WEAPONS } from '../src/data/weapons.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const groups = {
  'Backgrounds': Object.keys(BIOMES).map(backgroundPath),
  'Foreground overlays (optional)': Object.entries(BIOMES).filter(([, b]) => b.fg && b.fg !== 'none').map(([id]) => foregroundPath(id)),
  'Animals, aliens, targets': Object.keys(POSES).flatMap((id) => Object.keys(POSES[id]).flatMap((pose) => spritePaths(id, SPECIES[id].family, pose))),
  'Down and falling poses (optional)': Object.keys(EXTRA_POSES).flatMap((id) => Object.keys(EXTRA_POSES[id]).flatMap((pose) => spritePaths(id, SPECIES[id].family, pose))),
  'Guns, first-person (optional; profiles are used instead)': WEAPONS.map((w) => weaponPath(w.id)),
  'Guns, profile (Arsenal)': WEAPONS.map((w) => weaponProfilePath(w.id)),
  'Title art': [TITLE_ART],
};

let have = 0, total = 0;
for (const [name, files] of Object.entries(groups)) {
  const done = files.filter((f) => existsSync(join(root, f)));
  have += done.length; total += files.length;
  console.log(`\n${name}  ${done.length}/${files.length}`);
  for (const f of files) console.log(`  ${existsSync(join(root, f)) ? '✔' : '·'} assets/${f}`);
}
console.log(`\n${have} of ${total} art files in place.`);
