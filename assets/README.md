# assets/

Art for the game. Everything here is optional: any file that is missing is replaced by a drawn stand-in, so the game always runs. Some gun profiles are free-licensed photos; their credits are in [`weapons/CREDITS.txt`](weapons/CREDITS.txt) and in the Arsenal. Prompts for every file are in [`docs/ART-PROMPTS.md`](../docs/ART-PROMPTS.md) and, for City Hunt, [`docs/CITY-ART-PROMPTS.md`](../docs/CITY-ART-PROMPTS.md).

```
assets/
├── backgrounds/   <biome>.jpg (1536×1024) and optional <biome>_fg.png overlays
├── animals/       birds, small game and big game cut-outs (.png)
├── aliens/        alien cut-outs (.png), including the Vyrr (vyrr_*.png)
├── city/          City Hunt: select.jpg, shared/ police, and one folder per city
│   └── <city>/    scene_NN.jpg + scene_NN_cover.png, key, panorama, medal, story_NN.jpg,
│                  alpha_*.png, hunter_*.png, civilian_N_run.png
├── major/         Major Navarro: portrait, briefing, battle, victory, salute, full_front
├── military/      plates, pop-up targets, drone, vehicle, marksman (.png)
├── weapons/       <id>.png first-person view, <id>_profile.png side view
└── ui/            title.jpg key art behind the main menu
```

## How images are used

- **Cut-outs** (animals, aliens, targets, guns): a transparent background is best. A plain single-colour background also works, because the loader removes it by flood-filling from the edges. Empty margins are trimmed automatically.
- **Facing:** side-view cut-outs must face **right**. The game mirrors them when they move left.
- **Scale:** the trimmed width of a sprite is set to the animal's real body length (`len` in `src/data/species.js`), so a deer is the right size at every distance. Image resolution only affects sharpness.
- **Frames:** wing-flap birds use two files, `<id>_fly_1.png` and `<id>_fly_2.png`. Everything else is one image per pose; the engine adds bob, gallop and fall motion.
- **Guns:** the in-hand view uses `<id>.png` (first-person) when present; otherwise it uses the side-profile photo `<id>_profile.png`, mirrored and angled into the scene; with neither, a drawn stand-in.
- **City Hunt cover overlays** (`scene_NN_cover.png`) keep their full frame. A transparent PNG is best; a plain chroma-green backdrop above the object is keyed out from the top edge down.
- **City Hunt art sets:** a city's alpha, hunter clan and civilians use their own files first and fall back to the shared Vyrr art, then to drawn stand-ins.
- **Backgrounds** are drawn full-screen. If the horizon in an image does not line up with where animals stand, change that biome's `horizon` in `src/data/levels.js`.
- **Local testing:** open the game through a local web server (`npm start`), not by double-clicking `index.html`. Browsers block the image clean-up step on `file://` pages.

Check what is present and what is missing:

```
npm run art
```
