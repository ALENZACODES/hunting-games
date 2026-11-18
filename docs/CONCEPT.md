# HUNTING GAMES — Game Concept

**Working title:** HUNTING GAMES
**Genre:** First-person (POV) arcade hunting shooter with a realistic ballistics layer
**Platform:** Web (desktop browser, mouse + keyboard). Runs as static files, so it can be hosted on GitHub Pages.
**Inspiration:** the 1980s/90s light-gun duck shooter loop (targets flush, you have a few shells, hit enough to pass the round), rebuilt with photoreal art, real firearms, scopes and modern hunting realism.

---

## 1. The pitch

You start at a marsh at first light with a pump shotgun and a few shells. Mallards flush from the reeds; hit enough of them and the round is cleared. Twelve levels later you are behind a .50 BMG rifle in a valley that no longer belongs to this planet.

The game has three layers:

1. **The hunt campaign.** Twelve levels across marshes, farm country, hardwood ridges, mountains and boreal bog. Ducks, geese, pheasant, turkey, rabbits, whitetail, mule deer, pronghorn, elk, moose, wild boar and black bear.
2. **The turn.** From level 10 the lights in the sky are not stars. Aliens move into the hunting grounds, and the last three levels are a fight.
3. **Military Ops.** Twenty-five unlockable military-style modes run on the same engine: qualification ranges, long-range steel, shoot houses, counter-sniper, night vision, thermal, drone swarms, convoy overwatch, helicopter door gunner, extreme long range, alien defense and an endless last stand.

Everything feeds one **high-score table** (Hall of Fame) plus a best score and star rating for every level and op.

---

## 2. Design pillars

| Pillar | What it means in play |
|---|---|
| **Arcade loop first** | Short rounds, instant restart, a quota bar like the classic light-gun games, combo multipliers, big score pops. |
| **Real-feeling guns** | 25 real firearms with real calibers, actions and magazine sizes. Bolt actions must be cycled, pump guns pumped, doubles broken open. Recoil, sway and reload time differ per gun. |
| **Real-feeling ballistics** | Bullets take time to arrive, drop with distance and drift in wind. Shotgun pellets spread in a pattern and run out of energy past ~50 m. Sounds of impacts arrive late at long range. Each can be switched to Arcade in Options. |
| **Hunting ethics as rules** | Protected species (bald eagle, trumpeter swan) and does in buck-only seasons cost points. Underpowered shots wound and the animal escapes. Vital-zone shots score more. |
| **POV immersion** | First-person gun with hands at the bottom of the screen, scope view with real mil-dot spacing, breath hold, rangefinder and elevation dial. |

---

## 3. How realistic can it look? (honest plan)

"Ultra-realistic, like real 3D people and animals" is reachable in stages. Each stage keeps the same game code and data.

| Stage | Look | How |
|---|---|---|
| **v0 (built now)** | Clean drawn stand-ins for every animal, alien, target and gun, procedural landscapes, full gameplay. | Canvas 2D, no build step. |
| **v1 — Photoreal 2.5D** | Photoreal backgrounds, photoreal cut-out animals with 1–2 frame wing flaps, photoreal first-person guns with gloved hands. Motion comes from the engine (flight paths, gallop bob, fall and tumble). | Generate the images in `docs/ART-PROMPTS.md`, save them under `assets/` with the listed file names. The game finds them automatically, trims empty space and removes plain backgrounds. |
| **v2 — True 3D** | Rigged, animated 3D animals and soldiers, real lighting, full camera look-around. | Move rendering to Three.js or Babylon.js with glTF models (licensed or commissioned rigged animals; humanoid rigs for soldiers). Game rules, guns, levels and ops data carry over unchanged. For console-grade realism, Unreal Engine 5 with MetaHuman and photogrammetry assets. |

Still images alone cannot make smooth, lifelike 3D animation. v1 will look photographic in stills and good in motion; v2 is where "real 3D person" animation lives.

---

## 4. Core loop

1. Pick a level (or op) → **briefing** shows species, legal/protected targets, quota and allowed gun classes.
2. **Loadout:** carry up to three unlocked guns allowed in that level (ops issue their own guns).
3. **Round:** targets appear in waves (two at a time in bird levels). Each one escapes after a few seconds if you miss. The quota bar along the top fills gold for hits and grey for escapes.
4. **Results:** score breakdown, accuracy, vital shots, longest shot in metres, stars (1–3), and initials entry if you made the Hall of Fame.
5. **Progress:** passing a level unlocks the next level, new guns and new Military Ops.

---

## 5. Hunt campaign — 12 levels

| # | Level | Setting | Targets | Quota | Gun classes |
|---|---|---|---|---|---|
| 1 | Marsh Dawn | Cattail marsh, sunrise | Mallard | 6 of 10 | Shotgun |
| 2 | Flyway | Prairie lake, morning | Mallard, Canada goose · *trumpeter swan protected* | 7 of 12 | Shotgun |
| 3 | Cornfield Edge | Farm field, midday | Pheasant, mourning dove, cottontail | 8 of 14 | Shotgun, rimfire |
| 4 | Hardwood Ridge | Oak/maple ridge, autumn | Whitetail buck · *doe not legal (buck-only)* | 4 of 6 | Rifle, lever, handgun |
| 5 | Turkey Hollow | Spring forest edge | Wild turkey | 5 of 8 | Shotgun, rifle |
| 6 | High Meadow | Alpine meadow | Mule deer, pronghorn (150–300 m) | 5 of 8 | Rifle |
| 7 | Boar Thicket | Dry scrub, dusk | Wild boar (wounded boar charge) | 6 of 10 | Any |
| 8 | Elk Basin | Mountain valley, dawn | Elk (200–400 m) | 4 of 6 | Rifle |
| 9 | Northern Bog | Boreal bog | Moose, black bear (charges) · *bald eagle protected* | 5 of 8 | Rifle, lever |
| 10 | Strange Lights | Prairie, dusk | Whitetail, mule deer **+ first aliens** (orbs, skitters) | 7 of 12 | Any |
| 11 | Crash Site | Desert canyon, night | Skitters, gliders, stalkers | 10 of 16 | Any |
| 12 | The Hive | Alien-grown valley | Brutes, stalkers, gliders, drop pods, **Colossus** finale | 12 of 20 | Any |

---

## 6. Species and aliens

**Birds:** mallard, Canada goose, ring-necked pheasant, mourning dove, wild turkey. Protected (penalty): trumpeter swan, bald eagle.
**Small game:** eastern cottontail.
**Big game:** whitetail buck (and doe as a no-shoot in buck-only levels), mule deer, pronghorn, elk, moose, wild boar, black bear.

Every species has a real-world size (so it is the right size at every distance), a minimum gun power for a clean kill, a vital zone (heart–lung for big game), a behaviour (flush, graze-and-spook, run, charge-when-wounded) and a point value.

**Aliens (original designs):**

| Alien | Behaviour | Notes |
|---|---|---|
| Skitter | Fast six-legged ground runner that zig-zags toward you | Weak, dangerous in groups |
| Glider | Manta-like flyer that sweeps the sky | Two hits |
| Orb | Hovering sphere that blinks to new positions | Needs a centre-mass hit |
| Stalker | Tall biped that cloaks and decloaks | Head is the weak point; can only be hit while visible |
| Brute | Armoured heavy that advances slowly | Low-power rounds deflect; glowing back sac is the weak point |
| Drop pod | Falls from the sky | Hatches a skitter if it lands |
| Colossus | Boss walker | Only its three glowing weak points take damage |

---

## 7. The arsenal — 25 real firearms

| # | Firearm | Caliber | Action | Mag | Optic in game | Unlocks |
|---|---|---|---|---|---|---|
| 1 | Remington 870 Wingmaster | 12 ga | Pump | 4 | Bead | Start |
| 2 | Mossberg 500 Field | 12 ga | Pump | 5 | Bead | Start |
| 3 | Browning Citori 725 | 12 ga | Over/under | 2 | Bead | Level 2 |
| 4 | Beretta A400 Xtreme Plus | 12 ga | Semi-auto | 4 | Bead | Level 3 |
| 5 | Benelli Super Black Eagle 3 | 12 ga 3½″ | Semi-auto | 3 | Bead | Level 5 |
| 6 | Ruger 10/22 | .22 LR | Semi-auto | 10 | 3–9× duplex | Level 3 |
| 7 | CZ 457 American | .22 LR | Bolt | 5 | 4–12× mil-dot | Level 3 |
| 8 | Smith & Wesson Model 29 | .44 Magnum | Revolver | 6 | Iron sights | Level 4 |
| 9 | Winchester Model 1894 | .30-30 Win | Lever | 6 | Iron sights | Level 4 |
| 10 | Marlin 1895 | .45-70 Govt | Lever | 4 | 2–7× duplex | Level 8 |
| 11 | Ruger American Rifle | .243 Win | Bolt | 4 | 3–9× duplex | Level 4 |
| 12 | Tikka T3x Lite | 6.5 Creedmoor | Bolt | 3 | 4–12× BDC | Level 5 |
| 13 | Remington Model 700 | .308 Win | Bolt | 4 | 4–12× duplex | Level 4 |
| 14 | Winchester Model 70 | .30-06 Springfield | Bolt | 5 | 3–9× duplex | Level 6 |
| 15 | Sako 85 | .270 Win | Bolt | 4 | 4–16× BDC | Level 6 |
| 16 | Browning X-Bolt | 7mm Rem Mag | Bolt | 3 | 4.5–14× BDC | Level 7 |
| 17 | Browning BAR Mk3 | .30-06 Springfield | Semi-auto | 4 | 3–9× duplex | Level 7 |
| 18 | Savage 110 | .300 Win Mag | Bolt | 3 | 5–20× mil-dot | Level 8 |
| 19 | Weatherby Mark V | .300 Wby Mag | Bolt | 3 | 5–20× BDC | Level 9 |
| 20 | Ruger No. 1 | .375 H&H Mag | Single shot | 1 | 1.5–6× duplex | Level 9 |
| 21 | Colt M4A1 Carbine | 5.56 NATO | Automatic | 30 | Red dot (1.5×/3×) | Level 10 |
| 22 | AKM | 7.62×39 | Automatic | 30 | Iron sights | Level 10 |
| 23 | FN SCAR 17S | 7.62 NATO | Semi-auto | 20 | 1–6× LPVO | Level 11 |
| 24 | Accuracy International AXMC | .338 Lapua Mag | Bolt | 10 | 5–25× mil-dot | Level 11 |
| 25 | Barrett M82A1 | .50 BMG | Semi-auto | 10 | 4–16× mil-dot | Level 12 |

Each gun also carries: muzzle velocity, a drag figure, power class, recoil, sway, cycle time, reload time and reload style (shell-by-shell or magazine). A **generic name** ("Pump Shotgun 12 ga", "Bolt Rifle .308") is stored for every gun and can be switched on in Options.

> **Note on names.** Firearm model names are their makers' trademarks. They are fine for a concept and a free prototype; a commercial release should either license them or ship with the generic names (already built in).

---

## 8. Scopes, sights and shooting model

- **Sight types:** shotgun bead, iron sights, red dot, low-power variable (LPVO) and hunting/tactical scopes with **duplex**, **BDC** and **mil-dot** reticles.
- **Real reticle spacing:** one mil on the reticle equals one milliradian in the world at the current magnification, so holdovers work like a real scope.
- **Zoom:** mouse wheel changes magnification inside each scope's real range.
- **Sway and breath:** the sight drifts with the gun's sway figure. Hold **Shift** to hold your breath (about 4 seconds), then the sway gets worse while you recover.
- **Recoil:** each shot kicks the sight up by the gun's recoil figure; heavy magnums take longer to settle.
- **Rangefinder (F):** reads the distance to whatever is under the crosshair and gives a hold in mils. With **Auto-dial** on, the scope dials it for you.
- **Turrets:** Arrow Up/Down dial elevation, Left/Right dial windage, in 0.1-mil clicks.
- **Ballistics:** time of flight with drag, gravity drop (scopes zeroed at 100 m, rimfire at 50 m), wind drift using the lag-time rule. Shotguns fire 9–11 pellets in a pattern and lose killing power past their range.
- **Arcade mode** (Options): hits are instant with no drop or wind.

---

## 9. Military Ops — 25 modes

| # | Op | Goal | Issued guns | Unlock |
|---|---|---|---|---|
| 1 | Qualification Range | Pop-up targets 25–300 m; hit 20 of 30 | M4A1, Model 700 | Pass L2 |
| 2 | Steel Ladder | Clear 8 plates 100–800 m in 90 s | Model 700, T3x | Pass L2 |
| 3 | Cold Bore | 5 plates at unknown range, 5 rounds total | AXMC | Pass L2 |
| 4 | Moving Target Range | Running pop-ups; lead them | SCAR 17S, M4A1 | Pass L4 |
| 5 | Shoot House | Close pop-ups, hostiles vs no-shoots, 60 s | M4A1, Mossberg 500 | Pass L4 |
| 6 | Hostage Rescue | Mostly no-shoots; hit 10 hostiles, no mistakes | M4A1 | Pass L4 |
| 7 | Counter-Sniper | Find the scope glint on the ridge before they fire | AXMC, Savage 110 | Pass L6 |
| 8 | Night Watch | Night vision, pop-ups 50–250 m | M4A1, SCAR 17S | Pass L6 |
| 9 | Thermal Sweep | Thermal optic; hostiles in brush, wildlife is no-shoot | SCAR 17S, AXMC | Pass L6 |
| 10 | Fog of War | Targets fade in and out of fog | AKM, M4A1 | Pass L6 |
| 11 | Drone Swarm | Quadcopters dive at you; survive 90 s | M4A1, SBE3 | Pass L8 |
| 12 | Convoy Overwatch | Stop drones and skitters before they reach the convoy | SCAR 17S, M4A1 | Pass L8 |
| 13 | Bridge Defense | Disable vehicles crossing at 300–600 m (engine block) | M82A1, AXMC | Pass L8 |
| 14 | Door Gunner | Moving, bobbing helicopter platform; ground targets | M4A1, SCAR 17S | Pass L8 |
| 15 | Wind Masters | Plates 300–900 m in a gusting crosswind | AXMC, Savage 110 | Pass L10 |
| 16 | Speed Steel | 6 close plates, fastest time | M4A1, AKM | Pass L10 |
| 17 | Marksman Gauntlet | Everything mixed, 60 rounds total | SCAR 17S, AXMC | Pass L10 |
| 18 | Mile High (ELR) | Plates at 1,000–1,600 m; dial or miss | M82A1, AXMC | Pass L10 |
| 19 | Perimeter Breach | Aliens charge the outpost wire; survive 120 s | M4A1, SCAR 17S, M82A1 | Pass L11 |
| 20 | Orbital Drop | Shoot drop pods before they land | M4A1, AKM | Pass L11 |
| 21 | Stalker Hunt | Cloaking stalkers in the treeline | AXMC, SCAR 17S | Pass L11 |
| 22 | Hive Purge | Score as much as you can in 120 s | AKM, SBE3, SCAR 17S | Pass L11 |
| 23 | Colossus | Bring the boss walker down before it reaches the line | M82A1, AXMC | Pass L12 |
| 24 | Iron Sights Only | No optics; pop-ups to 300 m | AKM, Model 1894 | Pass L12 |
| 25 | Last Stand | Endless waves of everything | All military | Pass L12 |

Room for five more (to reach 30): Vehicle Ambush, Rooftop Overwatch, Sniper Duel, Blizzard Range and Alien Night Siege.

---

## 10. Scoring

- **Base points** per species/target, multiplied by **distance** (1 + metres ÷ 100) and **vital zone** (×1.5).
- **Combo:** consecutive hits raise a multiplier up to ×5; a miss resets it.
- **Penalties:** protected species −1,000; doe in a buck-only level −500; wounded-and-escaped −200; no-shoot target −750.
- **End bonuses:** accuracy bonus, time bonus in timed modes, and clear bonus.
- **Stars:** 1 = pass, 2 = 85 % of the quota or better, 3 = perfect quota with 60 %+ accuracy.
- **Hall of Fame:** top 10 across all modes with three-letter initials, plus a best score for every level and op.

---

## 11. Options

Mouse sensitivity, scope sensitivity, aim-down-sights hold/toggle, ballistics (Realistic / Arcade), auto-dial on range, reticle colour, master and effects volume, show FPS, reduce flashes (accessibility), generic gun names, reset progress, and a preview switch that unlocks everything.

---

## 12. Controls

| Input | Action |
|---|---|
| Mouse | Aim |
| Left click | Fire (hold for automatic guns) |
| Right click | Aim down sights / scope |
| Mouse wheel | Zoom (scoped) · switch gun (not scoped) |
| R | Reload |
| 1 / 2 / 3, Q | Select gun / last gun |
| Shift | Hold breath |
| F | Rangefinder + hold |
| Arrow keys | Dial elevation / windage |
| Backspace | Reset turrets to zero |
| Esc / P | Pause |

---

## 13. Audio

Synthesized in the browser (no files needed for v0): caliber-scaled gunshots with an outdoor echo tail, shotgun boom, pump/bolt/lever cycling, shell inserts, dry fire, steel ring and bullet-impact sounds that arrive late at long range (speed of sound), alien calls, and a wind bed that follows the level's wind. Recorded sounds can replace any of them later.

---

## 14. Technology

- Plain HTML, CSS and JavaScript modules; Canvas 2D renderer at a 1920×1080 logical resolution, scaled to the window.
- All content is data: `src/data/weapons.js`, `species.js`, `levels.js`, `ops.js`, `art.js`. Adding a gun, animal, level or op is a data change.
- Art loads from `assets/` by file name, with drawn stand-ins when a file is missing.
- Save data (progress, high scores, options) in the browser's local storage.

---

## 15. Roadmap

1. **v0 — playable prototype** (this commit): full loop, 12 levels, 25 guns, 25 ops, high scores, options, drawn stand-ins.
2. **v1 — photoreal art pass:** generate and drop in the images from `docs/ART-PROMPTS.md`; tune horizons per background.
3. **v1.1 — sound pass:** recorded gunshots per caliber, animal calls, ambience.
4. **v1.2 — mobile:** touch aiming, on-screen scope/reload buttons.
5. **v2 — 3D:** Three.js/Babylon renderer with rigged glTF animals, aliens and soldiers.
6. **Online leaderboard** (optional): a small serverless endpoint for global high scores.
