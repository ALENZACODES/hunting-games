# HUNTING GAMES

**Play in the browser:** https://alenzacodes.github.io/hunting-games/ (desktop, mouse recommended)

A first-person hunting shooter for the browser. It keeps the classic light-gun loop (targets flush, you have a few shells, hit enough to clear the round) and adds real firearms, scopes, ballistics and an alien turn.

- **100-level hunt campaign in 10 chapters:** ducks, geese, pheasant, doves, turkey, rabbits, whitetail, mule deer, pronghorn, elk, moose, wild boar and black bear, with fog, wind, night vision, thermal, trophy animals and timed levels, then the aliens arrive and the last chapters end at the Colossus.
- **25 real firearms:** shotguns, rimfires, a magnum revolver, lever guns, hunting rifles and military rifles, each with its own caliber, action, magazine, recoil, sway and optic.
- **Scopes that behave like scopes:** duplex, BDC, mil-dot and LPVO reticles at true mil spacing, variable zoom, breath hold, rangefinder, elevation and windage turrets.
- **Ballistics:** time of flight, drag, gravity drop, wind drift, shotgun patterns with a real range limit. An Arcade setting switches it all off.
- **25 Military Ops:** ranges, long-range steel, shoot houses, counter-sniper, night vision, thermal, drone swarms, convoy overwatch, helicopter door gunner, extreme long range, alien defense, a boss walker and an endless last stand.
- **City Hunt (special series):** Major Cole Navarro against the Vyrr, an alien species that hunts for sport, in New York, Toronto, Singapore, Hong Kong and Las Vegas. 60 scenes (12 per city) on streets, rooftops, bridges, waterfronts and interiors, each city ending with its alpha. The Vyrr fire back: shoot their spines out of the air or hold Space to take cover. Civilians and police are no-shoot. Story cards play between scenes. Each scene photo carries its own moving weather and light (rain, sleet, snow, mist, steam, pulsing neon, police lights, searchlights, helicopters, birds, water glints).
- **Career and menus:** a main-menu dashboard with rank and progress, a Continue button, chapter tabs with conditions on every level, detailed briefings, results with a bag tally and records, a detailed pause screen, a Career & Stats screen, Hall of Fame and a full options menu.

The full design is in [`docs/CONCEPT.md`](docs/CONCEPT.md).

## Play

No build step. Serve the folder with any static web server and open it in a desktop browser:

```bash
npm start            # http://localhost:8080
# or
python3 -m http.server 8080
```

It also runs as-is on GitHub Pages (Settings → Pages → deploy from the `main` branch).

### Controls

| Input | Action |
|---|---|
| Mouse | Aim (click the game once to lock the pointer) |
| Left click | Fire (hold for automatic guns) |
| Right click | Aim down sights / scope |
| Mouse wheel | Zoom when scoped · switch gun otherwise |
| R | Reload |
| 1 · 2 · 3 · Q | Select gun · last gun |
| Shift | Hold breath |
| F | Rangefinder and holdover |
| Arrow keys | Dial elevation / windage (0.1 mil) |
| Backspace | Turrets back to zero |
| Space (City Hunt) | Take cover; you reload twice as fast there |
| Esc · P | Pause |

## Art

The game ships with drawn stand-ins for every animal, alien, target, gun and landscape, so it is fully playable without any image files. Photoreal art drops in by file name:

1. Generate images with the prompts in [`docs/ART-PROMPTS.md`](docs/ART-PROMPTS.md) (132 prompts for the campaign and ops) and [`docs/CITY-ART-PROMPTS.md`](docs/CITY-ART-PROMPTS.md) (301 prompts for City Hunt, split by city in `docs/city-art/`). Each prompt names its exact file, and both files include fix-up commands for results that look fake.
2. Save them under `assets/` in the folder the prompt names.
3. Run `npm run art` to see what is in place and what is missing.

The loader removes plain backgrounds, trims empty margins and scales every cut-out to the animal's real body length, so generated images need no manual editing. Details in [`assets/README.md`](assets/README.md).

## Project structure

```
hunting-games/
├── index.html                  page shell
├── styles/main.css             menus, overlays, HUD fonts
├── src/
│   ├── main.js                 boot, canvas scaling, frame loop, app flow
│   ├── data/                   all content is data
│   │   ├── weapons.js          25 firearms and their ballistic figures
│   │   ├── species.js          animals, aliens, targets: size, hitboxes, behaviour, points
│   │   ├── levels.js           biomes and the 100-level campaign (10 chapters)
│   │   ├── ops.js              25 Military Ops
│   │   ├── cities.js           City Hunt: 5 cities, 60 scenes, story beats, Major Navarro
│   │   └── art.js              art file names the game looks for
│   ├── engine/
│   │   ├── assets.js           image loading, background removal, trimming
│   │   ├── audio.js            synthesized gunshots, actions, impacts, ambience
│   │   ├── input.js            mouse/keyboard, pointer lock
│   │   └── storage.js          progress, career stats, high scores, options
│   ├── game/
│   │   ├── view.js             camera geometry (45° FOV, 1.6 m eye height, mils)
│   │   ├── session.js          a round: spawning, ballistics, scoring, goals, HUD
│   │   ├── entities.js         target behaviours and hit tests
│   │   ├── weapon.js           gun state, view model, sights, scope reticles
│   │   ├── render-scene.js     landscapes and foregrounds
│   │   ├── render-targets.js   target drawing (photo sprites or stand-ins)
│   │   └── fx.js               particles
│   └── ui/menus.js             title dashboard, campaign, ops, City Hunt, story cards, briefing, career, arsenal, options, pause, results
├── assets/                     drop-in art (see assets/README.md)
├── docs/
│   ├── CONCEPT.md              game design
│   ├── ART-PROMPTS.md          campaign and ops image prompts with exact file names
│   ├── CITY-ART-PROMPTS.md     City Hunt prompts: index, style locks, Vyrr, police, Major
│   └── city-art/               City Hunt prompts per city (nyc, toronto, singapore, hongkong, vegas)
└── tools/art-status.mjs        art checklist (npm run art)
```

## How the shooting model works

The camera has a 45° horizontal field of view at a 1920×1080 logical resolution, which makes one milliradian 2.318 px at 1×. Targets carry real sizes and distances, so a 1 m deer at 100 m is about 23 px tall and needs the scope at 300 m. Each shot resolves along its flight path: a target is checked when the round reaches its distance, using the target's position at that moment, so moving targets need lead. Drop is measured from a 100 m zero (50 m for rimfire) with sight height included; wind drift uses the lag-time rule. Shotguns fire 9 to 11 pellets in a pattern and need more pellet hits as range grows.

## Notes

- Firearm model names are trademarks of their makers. Each gun also has a generic name, switchable in Options.
- Desktop browsers with a mouse are the target for this version.
