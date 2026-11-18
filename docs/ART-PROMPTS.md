# Art prompts

One complete prompt per image the game can use, written to get **real photographs**, not game art. Each prompt gives the camera, lens, light, materials and wear that make a picture read as real, plus the exact file name the game loads.

**Total:** 18 backgrounds · 14 optional foreground overlays · 35 animal images · 8 alien images · 6 military targets · 25 first-person guns · 25 gun profiles · 1 title image (132 files).

The game already runs with drawn stand-ins. Every image you add replaces one stand-in automatically, so you can work in any order. Best order for impact: guns (7), the first three backgrounds and their animals (marsh, lake, farm), then everything else.

---

## How to use

1. Start a new image chat, paste the **Style lock** (section 0), then paste one prompt per message.
2. Ask for 2 or 3 versions when a result is close but not quite real, and keep the most photographic one.
3. Download, rename to the file name shown, save into the folder shown (inside `assets/`).
4. For pairs and poses (wing up / wing down, walk / run / graze), stay in the same chat and use the follow-up prompt so the animal stays identical.
5. Run `npm run art` to see what is done and what is missing, then reload the game.

### Fix-up commands (send in the same chat when a result looks fake)

| Problem | Send this |
|---|---|
| Looks like CGI, too smooth or too shiny | `Make it look like an unedited RAW photograph: keep real texture (individual hairs, feather barbs, wood grain, scratches, fabric weave), add subtle film grain, mute the colours slightly, remove any glow, airbrushing or plastic shine. Change nothing else.` |
| Lighting looks studio or dramatic | `Relight it as soft overcast daylight from the upper left, like a cloudy day outdoors. No rim light, no spotlight, no dramatic contrast. Change nothing else.` |
| Faces the wrong way | `Mirror it horizontally so it faces right. Change nothing else.` |
| Cropped at the edge | `Zoom out so the whole subject fits with clear space on every side. Change nothing else.` |
| Background is not transparent | `Remove the background completely and give me a transparent PNG. Keep the subject exactly the same.` |
| Anatomy is wrong | `Fix the anatomy so it is correct for a real [animal]: exactly four legs, natural joints, correct antler/horn shape. Keep everything else the same.` |
| Gun details are wrong | `Make the gun accurate to the real [model]: [list the features from the prompt]. Correct proportions, no invented parts. Keep the hands, angle and lighting.` |
| Colours too vivid | `Reduce saturation by about 20 percent and make the colours look like a real camera photo on an overcast day.` |

### What the game relies on

| Rule | Why |
|---|---|
| Cut-outs (animals, aliens, targets, guns) on a **transparent** background, or a plain single-colour background. | The game removes plain backgrounds and trims empty margins on load. White subjects (swan, no-shoot target) must not be on white. |
| Animals, aliens and targets in **side view facing right**, shot with a long lens (flat, undistorted profile). | The game mirrors them when they move left and scales them by real body length. |
| **Whole subject in frame**, no ground, no shadow. | The game stands them on its own ground at the right distance. |
| Backgrounds **empty**, level, eye height, horizon where the prompt says. | Targets are placed at real distances on the game's ground line. |
| All daylight cut-outs lit the same way: soft overcast light from the upper left. | Matching light is what makes a cut-out sit in the scene instead of looking pasted on. |

---

## 0. Style lock — paste this first in every new chat

```
I am making art for a photorealistic first-person hunting game. Every image in this chat must look like a real, unedited photograph taken with a professional full-frame camera: true-to-life textures (individual hairs, feather barbs, wood grain, worn metal, fabric weave), natural slightly muted colours, subtle film grain, physically correct light. Never a 3D render, CGI, video-game art, illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No text, logos, brand markings or watermarks.
When I ask for a cut-out: one subject, whole subject visible with space around it, shot with a long telephoto lens so the side view is flat and undistorted, facing RIGHT, soft overcast daylight from the upper left, on a transparent background (PNG) with no ground and no shadow.
When I ask for a background: an empty landscape photographed level at standing eye height, no animals and no people.
Reply with the image only. One image per message.
```

---

## 1. Backgrounds — `assets/backgrounds/` · 1536×1024 · save as `.jpg`

All daylight on purpose: the game tints the same background for dawn, dusk and night. Do not add a visible sun unless the prompt says so.

**marsh.jpg** · horizon 44 % · Wetlands chapter
```
Landscape photograph of a wide cattail marsh in Ontario just after sunrise. Calm open water across the middle distance reflecting a soft peach and pale-blue sky with thin cloud, a band of brown cattails and reeds along the far shore, low rolling mixed-forest hills on the horizon softened by morning mist. Wet marsh grass and shallow water with floating duckweed across the lower half. Low golden side light, dew on the grass.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 44% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**lake.jpg** · horizon 46 % · Wetlands chapter
```
Landscape photograph of a prairie pothole lake in Saskatchewan on a clear morning. Open blue-grey water with light ripples in the middle distance, bulrushes along the far shore, flat golden grassland beyond, a huge sky with scattered cumulus clouds. Short trampled shoreline grass and mud across the lower half.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 46% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**farm.jpg** · horizon 45 % · Uplands chapter
```
Landscape photograph of the edge of a harvested cornfield in Iowa at midday in autumn. Rows of cut golden corn stubble and scattered husks across the lower half, a dense hedgerow of shrubs and a few bare oak trees in the distance, gently rolling farmland, clear pale-blue sky. Plain natural farmland, no buildings, no machinery.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 45% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**hardwood.jpg** · horizon 43 % · Whitetail Woods chapter, Dangerous Game chapter, Grand Slam chapter, Strange Lights chapter, Thermal Sweep, Stalker Hunt
```
Landscape photograph across an open clearing in an oak and sugar-maple hardwood forest in late October. Orange, red and yellow leaves on the trees along the far edge, grey trunks, a wooded ridge rising behind, brown leaf litter and short grass across the lower half. Bright overcast sky, sun not visible.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 43% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**forestedge.jpg** · horizon 44 % · Uplands chapter, Whitetail Woods chapter, Grand Slam chapter
```
Landscape photograph of a green spring hayfield at the edge of a deciduous forest in Pennsylvania. Fresh green grass and clover across the lower half, a line of newly leafed trees across the middle distance, soft clear morning light, sun not visible.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 44% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**mountain.jpg** · horizon 50 % · High Country chapter, Grand Slam chapter, Strange Lights chapter
```
Landscape photograph of a wide alpine meadow in the Montana Rockies in late summer. Green and gold meadow grass with scattered rocks across the lower half, a few dark spruce and fir trees, grassy slopes rising in the middle distance, rugged grey peaks with snow patches on the horizon, deep-blue sky with light cloud.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 50% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**scrub.jpg** · horizon 46 % · Dangerous Game chapter
```
Landscape photograph of dry south Texas brush country in late afternoon. Sandy pale soil with sparse dry grass and prickly pear across the lower half, low grey-green mesquite and thorny scrub in the middle distance, flat-topped mesas on the horizon, warm hazy sky, sun not visible.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 46% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**valley.jpg** · horizon 50 % · High Country chapter, Grand Slam chapter, Strange Lights chapter
```
Landscape photograph of a broad mountain basin in Colorado elk country at dawn. An open grassy valley floor across the lower half, dark conifer timber on the far slopes, aspen patches turning yellow, jagged peaks behind, soft cool early light with a little mist in the valley, sun not visible.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 50% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**boreal.jpg** · horizon 45 % · Wetlands chapter, Whitetail Woods chapter, Dangerous Game chapter, Grand Slam chapter, Fog of War
```
Landscape photograph of a northern Ontario boreal bog. Sedge grass, sphagnum moss and a calm open pond across the lower half, a dense line of narrow black spruce and tamarack across the middle distance, low hills behind, cool grey overcast sky.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 45% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**prairie.jpg** · horizon 47 % · Uplands chapter, Whitetail Woods chapter, Grand Slam chapter, Strange Lights chapter, Invasion chapter, Convoy Overwatch, Orbital Drop
```
Landscape photograph of open mixed-grass prairie in Alberta. Tall golden grass moving slightly in the wind across the lower half, a few isolated cottonwood trees on the horizon, a huge sky with high thin cloud, sun not visible. No roads, no fences.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 47% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**canyon.jpg** · horizon 47 % · Crash Site chapter, Invasion chapter (the game makes it night)
```
Landscape photograph of a wide desert canyon floor in Utah in late-afternoon light. A flat sandy wash with scattered rocks and dry brush across the lower half, red sandstone mesas and canyon walls on the horizon. In the middle distance, slightly right of centre, a large dark disc-shaped craft about 30 metres across lies crashed and half-buried in the sand, its hull scorched and dented, a thin trail of grey smoke rising. Sun not visible. No people, no creatures.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 47% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**hive.jpg** · horizon 47 % · The Hive chapter, Hive Purge, Colossus (alien light — keep it)
```
Landscape photograph of a valley that has been transformed by an alien organism, at dusk. Dark violet soil covered in glowing pink and teal bioluminescent growths and fleshy pods across the lower half, tall curved black chitin spires rising in the distance, a magenta and purple sky with two moons and faint aurora. Photographed like a real location with a real camera: believable scale, real dust and moisture in the air, long-exposure noise in the shadows. No creatures, no people.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 47% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**range.jpg** · horizon 47 % · Invasion chapter, Qualification Range, Steel Ladder, Moving Target Range, Night Watch, Wind Masters, Speed Steel, Mile High (ELR), Iron Sights Only
```
Landscape photograph of a military desert firing range seen from the firing line. Flat packed sand and gravel across the lower half, low earth berms at several distances, small steel target stands far away, reddish mesas on the horizon, dusty pale-blue sky, sun not visible. No people, no vehicles, no signs.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 47% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**urban.jpg** · horizon 50 % · Shoot House, Hostage Rescue
```
Photograph of a military urban training village seen from an open gravel square. A row of plain two- and three-storey poured-concrete buildings with empty window openings and dark doorways about 40 metres away, weathered grey and sand-coloured walls with water stains, gravel and dust across the lower half, overcast sky. No people, no vehicles, no graffiti, no signs.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 50% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**ridge.jpg** · horizon 50 % · Crash Site chapter, Invasion chapter, Cold Bore, Counter-Sniper, Marksman Gauntlet
```
Landscape photograph from a dry valley floor looking up at a long arid hillside ridge. The ridge fills the upper middle of the frame (its crest about 20 to 30 percent from the top), covered in scattered boulders, rock outcrops and dark green juniper and scrub bushes. Open dry ground across the lower half; the base of the ridge meets the valley floor about halfway down. Bright overcast sky.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 50% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**base.jpg** · horizon 48 % · Crash Site chapter, Invasion chapter, Drone Swarm, Perimeter Breach, Last Stand
```
Landscape photograph looking outward from a remote desert outpost. Flat open desert of sand and small stones across the lower half, a faint dirt track leading away, distant mesas, clear dusty sky, sun not visible. Nothing close to the lens. No people, no vehicles.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 48% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**bridge.jpg** · horizon 46 % · Bridge Defense
```
Landscape photograph of a wide river valley. A long grey steel truss road bridge crosses the river from left to right about 450 metres away, low near the horizon, with conifer-covered hills behind it. Open grassy riverbank and the near edge of the slow brown river across the lower half. Overcast daylight. No vehicles on the bridge, no people.
Frame: 1536x1024 landscape. Camera perfectly level at standing eye height (1.6 m), 35 mm lens at f/11, everything sharp from 15 m to the horizon. The horizon sits about 46% from the top. The lower half is open ground with nothing close to the lens. Natural atmospheric haze makes distant hills paler and bluer. Empty scene: no animals, no birds, no people, no vehicles, no tracks, no fences, no signs.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**heli.jpg** · horizon 36 % · Door Gunner (scrolls sideways)
```
Photograph taken from the open side door of a helicopter about 40 metres above open desert scrubland, looking out sideways toward the horizon. Sandy ground with scattered dry bushes and small washes filling the lower two thirds, distant mesas, clear sky. Even, repeating terrain so the left and right edges look alike. No aircraft parts in frame, no vehicles, no people.
Frame: 1536x1024 landscape, camera level, 35 mm lens at f/11, everything sharp. The horizon sits about 36% from the top. Empty scene: no animals, no people, no vehicles.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 2. Foreground overlays (optional) — `assets/backgrounds/` · 1536×1024 · transparent `.png`

These sit in front of the targets (birds flush from behind the reeds). If one looks wrong in the game, delete it and the drawn foreground comes back.

**marsh_fg.png**
```
Photograph of dense cattails and marsh reeds with brown cattail heads, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**lake_fg.png**
```
Photograph of tall lakeshore bulrushes and reeds, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**farm_fg.png**
```
Photograph of standing dry corn stalks with curled brown leaves at the field edge, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**hardwood_fg.png**
```
Photograph of low autumn brush, bracken ferns and a few fallen branches with red and brown leaves, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**forestedge_fg.png**
```
Photograph of tall fresh green spring grass and clover, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**mountain_fg.png**
```
Photograph of alpine grass with a few small yellow and purple wildflowers, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**scrub_fg.png**
```
Photograph of dry thorny brush clumps in the bottom-left and bottom-right corners only, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**valley_fg.png**
```
Photograph of tall meadow grass turning golden, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**boreal_fg.png**
```
Photograph of sedge grass and small Labrador tea shrubs, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**prairie_fg.png**
```
Photograph of tall golden prairie grass and seed heads, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**canyon_fg.png**
```
Photograph of large weathered sandstone boulders in the bottom-left and bottom-right corners only, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**hive_fg.png**
```
Photograph of glowing pink and teal alien tendrils and bioluminescent pods, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**ridge_fg.png**
```
Photograph of dark green juniper and scrub bushes in the bottom-left and bottom-right corners only, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**base_fg.png**
```
Photograph of a low wall of worn tan sandbags with coils of razor wire on top, very close to the camera, along the bottom 30 percent of a 1536x1024 landscape frame only. Shot at f/2.8 so it is softly out of focus, uneven natural tops, real plant texture. Everything above that band is fully transparent (PNG): no sky, no background, no ground plane, no animals.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 3. Birds — `assets/animals/` · 1024×1024 · transparent `.png`

Make `_1` first, then send the `_2` follow-up in the same chat so the bird stays identical.

**mallard_fly_1.png**
```
Cut-out: An adult drake mallard duck in flight in breeding plumage: glossy iridescent green head, narrow white neck ring, chestnut breast, pale grey flanks with fine vermiculation, black curled tail feathers, yellow bill, orange feet tucked, violet-blue speculum bordered in white on the wing. Wings raised high at the top of the upstroke.
Shot like real bird-in-flight photography: 600 mm lens, 1/4000 s freezing every feather, the eye tack-sharp, seen from the side and very slightly below so both wings are visible, facing right. Soft overcast sky light from the upper left.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**mallard_fly_2.png** · follow-up
```
The exact same bird, identical size, plumage, position, light and framing, but with the wings pushed fully down at the bottom of the downstroke, primary feathers bent by the air. Transparent background.
```

**goose_fly_1.png**
```
Cut-out: An adult Canada goose in flight: black head and long black neck stretched forward, white cheek strap, grey-brown back with pale feather edging, pale breast, black tail with a white band underneath, broad dark wings. Wings raised high at the top of the upstroke.
Shot like real bird-in-flight photography: 600 mm lens, 1/4000 s freezing every feather, the eye tack-sharp, seen from the side and very slightly below so both wings are visible, facing right. Soft overcast sky light from the upper left.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**goose_fly_2.png** · follow-up
```
The exact same bird, identical size, plumage, position, light and framing, but with the wings pushed fully down at the bottom of the downstroke, primary feathers bent by the air. Transparent background.
```

**pheasant_fly_1.png**
```
Cut-out: A rooster ring-necked pheasant flushing in flight: iridescent bottle-green head with small ear tufts, bright red facial wattle, crisp white neck ring, copper-gold body with dark scalloped markings, very long pointed barred tail, short rounded wings. Wings raised high at the top of the upstroke.
Shot like real bird-in-flight photography: 600 mm lens, 1/4000 s freezing every feather, the eye tack-sharp, seen from the side and very slightly below so both wings are visible, facing right. Soft overcast sky light from the upper left.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**pheasant_fly_2.png** · follow-up
```
The exact same bird, identical size, plumage, position, light and framing, but with the wings pushed fully down at the bottom of the downstroke, primary feathers bent by the air. Transparent background.
```

**dove_fly_1.png**
```
Cut-out: A mourning dove in fast flight: slim body, small head, soft greyish-buff plumage, black spots on the upper wing, long pointed tail with white tips, pointed wings. Wings raised high at the top of the upstroke.
Shot like real bird-in-flight photography: 600 mm lens, 1/4000 s freezing every feather, the eye tack-sharp, seen from the side and very slightly below so both wings are visible, facing right. Soft overcast sky light from the upper left.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**dove_fly_2.png** · follow-up
```
The exact same bird, identical size, plumage, position, light and framing, but with the wings pushed fully down at the bottom of the downstroke, primary feathers bent by the air. Transparent background.
```

**swan_fly_1.png**
```
Cut-out: An adult trumpeter swan in flight: pure white plumage with a faint rusty tint on the head, all-black bill, long straight neck stretched forward, huge white wings, black feet trailing. Wings raised high at the top of the upstroke.
Shot like real bird-in-flight photography: 600 mm lens, 1/4000 s freezing every feather, the eye tack-sharp, seen from the side and very slightly below so both wings are visible, facing right. Soft overcast sky light from the upper left.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat dark-green background (never white).
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**swan_fly_2.png** · follow-up
```
The exact same swan, identical size, plumage, position, light and framing, but with the wings pushed fully down at the bottom of the downstroke, primary feathers bent by the air. Transparent background (or plain dark green, never white).
```

**eagle_fly.png**
```
Cut-out: an adult bald eagle gliding with wings spread wide and level: bright white head and tail, dark chocolate-brown body and wings, slightly separated primary 'finger' feathers at the wing tips, hooked yellow bill, yellow feet tucked under the tail.
Shot like real bird-in-flight photography: 600 mm lens, 1/4000 s freezing every feather, the eye tack-sharp, seen from the side and very slightly below so both wings are visible, facing right. Soft overcast sky light from the upper left.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 4. Small game and big game — `assets/animals/` · transparent `.png`

1024×1024, except elk and moose at 1536×1024. Make the walk pose first, then send the follow-ups in the same chat.

**turkey_walk.png**
```
Cut-out, 1024x1024: An adult wild turkey gobbler walking: dark bronze body feathers with a copper and green iridescent sheen, barred black-and-white wing feathers, bare blue-white head with red wattles and a hanging snood, a long black beard hanging from the chest, tail folded, long reddish-pink legs. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**turkey_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now running fast with its neck stretched forward and wings slightly open. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**rabbit_run.png**
```
Cut-out, 1024x1024: an eastern cottontail rabbit mid-hop: grey-brown agouti fur, rusty nape, white fluffy tail, long ears up, hind legs extended.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**whitetail_walk.png**
```
Cut-out, 1024x1024: A mature white-tailed deer buck walking, in November coat: grey-brown body, white throat patch, white belly, white ring around the eye and a white band behind the black nose, thick rut-swollen neck, symmetrical 10-point antlers with long tines, black hooves, tail down. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**whitetail_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now bounding at full speed, tail raised showing its white underside, legs extended. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**whitetail_graze.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now standing still with its head lowered to the ground, feeding, facing right. Transparent background.
```

**doe_walk.png**
```
Cut-out, 1024x1024: An adult white-tailed deer doe walking, no antlers: slim neck, tan-grey coat, white throat patch, white belly, large ears, black nose, tail down. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**doe_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now bounding at full speed with its white tail raised, legs extended. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**doe_graze.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now standing still with its head lowered to the ground, feeding, facing right. Transparent background.
```

**muledeer_walk.png**
```
Cut-out, 1024x1024: A mature mule deer buck walking: grey-brown coat, very large mule-like ears, dark forehead, white rump patch, short rope-like tail with a black tip, forked (bifurcated) 4x4 antlers, black hooves. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**muledeer_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now stotting, bouncing with all four feet off the ground together, the typical mule deer gait. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**muledeer_graze.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now standing still with its head lowered to the ground, feeding, facing right. Transparent background.
```

**pronghorn_walk.png**
```
Cut-out, 1024x1024: An adult pronghorn buck walking: tan-orange upper body, white belly, white rump and flanks, two white bands across the throat, black cheek patch, short black horns with a forward-pointing prong, slender legs. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**pronghorn_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now running at full speed across flat ground, legs extended, white rump hair flared. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**elk_walk.png**
```
Cut-out, 1536x1024: A mature bull Rocky Mountain elk walking: tan-gold body, dark chocolate-brown neck with a shaggy mane, pale yellowish rump patch, dark legs, huge 6x6 antlers sweeping back over the shoulders with ivory-tipped tines. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**elk_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now trotting fast with its head up and antlers laid back. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**elk_graze.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now standing still with its head lowered to the ground, feeding, facing right. Transparent background.
```

**moose_walk.png**
```
Cut-out, 1536x1024: A mature bull moose walking: very dark brown-black coat, tall humped shoulders, long pale-grey lower legs, long overhanging muzzle, a hanging dewlap (bell) under the throat, broad palmated antlers with many points. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**moose_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now trotting fast with long strides, head forward. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**moose_graze.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now standing still with its head lowered to the ground, feeding, facing right. Transparent background.
```

**boar_walk.png**
```
Cut-out, 1024x1024: An adult Eurasian wild boar walking: coarse dark grey-brown bristly coat, a raised mane of long bristles along the spine, heavy wedge-shaped head, small upright ears, short curved white tusks from the lower jaw, mud on the legs. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**boar_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now charging at full speed, head low, bristles raised. Captured at 1/4000 s, sharp, facing right. Transparent background.
```

**bear_walk.png**
```
Cut-out, 1024x1024: An adult American black bear walking: thick glossy black coat, tan-brown muzzle, small rounded ears, heavy shoulders, large paws with dark claws. Whole animal visible including hooves/feet and antler tips.
Shot like a real wildlife photograph: 600 mm telephoto lens from about 80 metres at the animal's shoulder height, so the body is a flat, true side profile facing right with no wide-angle distortion; 1/2000 s at f/5.6. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**bear_run.png** · follow-up
```
The exact same animal, identical size, coat, markings, antlers, light and framing, now running at full speed in a bounding gallop, fur rippling. Captured at 1/4000 s, sharp, facing right. Transparent background.
```


---

## 5. Aliens — `assets/aliens/` · transparent `.png`

Original designs. The trick to making them feel real is to describe them as **practical creatures photographed on location**, with real materials and weight.

**skitter_run.png**
```
Cut-out, 1024x1024: a dog-sized alien creature running low to the ground on six segmented insect-like legs, side view facing right. Flat dark glossy carapace with faintly glowing cyan stripes along the back, a small armoured head with mandibles and two glowing cyan eyes, mud on the legs.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**glider_fly_1.png**
```
Cut-out, 1024x1024: an alien flyer shaped like a manta ray with a 3-metre wingspan, side view facing right, wing tips curled upward. Dark violet leathery skin with a row of softly glowing purple spots, a long thin whip tail, translucent wing edges.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**glider_fly_2.png** · follow-up
```
The exact same creature, identical size, colours, light and framing, but with the wing tips curled downward. Transparent background.
```

**orb_idle.png**
```
Cut-out, 1024x1024: a hovering alien sphere about one metre across. Smooth dark brushed-metal shell with fine seams through which a bright blue-white core glows, a thin luminous ring orbiting it, faint heat shimmer.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**stalker_walk.png**
```
Cut-out, 1024x1024: a tall thin alien biped about 2.8 metres tall, mid-stride, side view facing right. Long reverse-jointed legs, long arms ending in curved claws, an elongated head swept backwards, dark green-black skin with a wet sheen, two glowing green eyes.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**brute_walk.png**
```
Cut-out, 1536x1024: a massive armoured alien beast the size of a pickup truck, walking on four thick legs, side view facing right. Hunched back covered in dark overlapping armour plates with scars, a large glowing orange sac on its upper back, a heavy low head with tusks.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**pod_fall.png**
```
Cut-out, 1024x1024: an alien drop pod falling nose-down, a dark scorched metallic capsule about 2 metres tall with glowing yellow seams, a short trail of fire and heat glow from its lower end, sparks.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**colossus_walk.png**
```
Cut-out, 1024x1536 portrait: an alien walking machine the size of a building, side view. A dark armoured dome body on three long jointed legs, three glowing red weak-point vents (one on top of the dome, one on the left side, one low on the right side), dust falling from the joints.
Photographed like a still from a big-budget live-action film that used a full-size practical creature: real wet glossy skin, light passing through thin membranes, dirt and scratches, believable weight and anatomy. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 6. Military targets — `assets/military/` · 1024×1024 · transparent `.png`

**plate_idle.png**
```
Cut-out: a round AR500 steel shooting target plate about 50 cm across, painted light grey with a few dark bullet splash marks, hanging from chains on a short steel stand with two feet, front view. Real worn paint and rust spots.
Shot with a 300 mm lens from a distance so the view is flat and undistorted. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**popup_idle.png**
```
Cut-out: a military pop-up training target, an olive-drab plastic E-type silhouette of a person's head and torso mounted upright on a low mechanical lifter box, front view. Real scuffs, dust and patched bullet holes.
Shot with a 300 mm lens from a distance so the view is flat and undistorted. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**noshoot_idle.png**
```
Cut-out: a white plastic no-shoot training target in the shape of a person with both hands raised, a thick blue painted border, mounted on a low stand, front view. Real scuffs and dust.
Shot with a 300 mm lens from a distance so the view is flat and undistorted. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat dark-green background (never white).
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**drone_idle.png**
```
Cut-out: a small military quadcopter drone in flight, side view facing right. Matte dark grey carbon-fibre body and arms, four rotors with natural motion blur, a camera gimbal underneath, a small red light, real screws and cable ties.
Shot with a 300 mm lens from a distance so the view is flat and undistorted. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**vehicle_idle.png**
```
Cut-out, 1536x1024: a generic modern 8-wheeled armoured personnel carrier, pure side view facing right. Olive-drab paint with dust and mud on the lower hull, a small remote turret with a gun barrel, no markings, no flags, no numbers.
Shot with a 300 mm lens from a distance so the view is flat and undistorted. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sniper_idle.png**
```
Cut-out, 1536x1024: a marksman lying prone behind a rifle, fully covered in a leafy ghillie suit made of burlap strands and dry grass, pure side view facing right, rifle barrel pointing right, face not visible.
Shot with a 300 mm lens from a distance so the view is flat and undistorted. Soft overcast daylight from the upper left (about 5600 K), gentle natural shading on the underside, no hard shadows, no rim light.
Isolate it on a transparent background (PNG): no ground, no shadow, no scenery. The whole subject is in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 7. Guns, first-person — `assets/weapons/<id>.png` · 1536×1024 · transparent `.png`

This is the gun in your hands while you play, so it matters most. The game places it in the bottom-right corner. Each prompt is complete; paste it as is.

**rem870.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Remington 870 Wingmaster 12-gauge pump shotgun: high-gloss American walnut stock and ribbed fore-end with cut checkering, deep blued steel receiver with light holster wear on the edges, long vent-rib barrel with a small brass front bead. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**moss500.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Mossberg 500 Field 12-gauge pump shotgun: matte black synthetic stock and ribbed fore-end, anodised receiver with the safety on top of the tang, matte blued vent-rib barrel, brass front bead. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**citori725.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Browning Citori 725 12-gauge over-and-under shotgun: oil-finished figured walnut with fine checkering, silver receiver with light scroll engraving, gloss blued stacked barrels with a vent rib, white front bead. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**a400.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Beretta A400 Xtreme Plus semi-automatic 12-gauge shotgun covered in a brown marsh-grass camouflage pattern, soft rubber grip panels, long vent-rib barrel, fibre-optic front sight. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sbe3.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Benelli Super Black Eagle 3 semi-automatic 12-gauge shotgun in a muted waterfowl camouflage pattern, slim receiver, rubber comb insert, long vent-rib barrel, red fibre-optic bead. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**ruger1022.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Ruger 10/22 Carbine semi-automatic .22 rifle: satin birch hardwood stock, black alloy receiver, barrel band near the muzzle, rotary magazine flush under the receiver, compact 3-9x rimfire scope in low rings. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**cz457.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a CZ 457 American bolt-action .22 rifle: checkered walnut stock, blued barrel and receiver, short bolt handle, 4-12x scope in low rings. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sw29.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Smith & Wesson Model 29 .44 Magnum revolver with a long 8-inch deep-blued barrel and checkered walnut target grips, adjustable rear sight, held out in front in a firm two-handed grip with both arms extended; the revolver sits in the lower centre-right of the frame pointing into the scene. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and grip are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**win94.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Winchester Model 1894 lever-action .30-30 rifle: straight-grip walnut stock, blued receiver with worn edges, tube magazine under the barrel, large lever loop, buckhorn rear iron sight and a brass front bead, no scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**marlin1895.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Marlin 1895 lever-action .45-70 rifle: walnut pistol-grip stock, blued steel, side loading gate, big lever loop, 2-7x scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**rugeramerican.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Ruger American bolt-action rifle: matte black synthetic stock, matte blued barrel, three-lug bolt, 3-9x40 scope in black rings. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**tikka.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Tikka T3x Lite bolt-action rifle: grey synthetic stock with textured grip panels, stainless fluted barrel and action, 4-12x scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**rem700.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Remington Model 700 bolt-action rifle: satin walnut stock with checkering, blued barrel and receiver, smooth bolt knob, 4-12x40 hunting scope in steel rings. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**win70.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Winchester Model 70 Featherweight bolt-action rifle: classic walnut stock with a schnabel fore-end tip, blued steel, controlled-round-feed bolt, 3-9x hunting scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sako85.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Sako 85 Hunter bolt-action rifle: oiled walnut stock, blued barrel and action, detachable magazine, 4-16x hunting scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**xbolt.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Browning X-Bolt Hunter bolt-action magnum rifle: satin walnut stock, matte blued long barrel, safety on the top tang, 4.5-14x hunting scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**bar.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Browning BAR Mk3 semi-automatic hunting rifle: oil-finished walnut stock and fore-end, plain matte alloy receiver, detachable magazine, 3-9x hunting scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**savage110.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Savage 110 bolt-action magnum rifle: dark grey synthetic stock, matte black barrel with a muzzle brake, 5-20x scope with exposed turrets. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**weatherby.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Weatherby Mark V Deluxe bolt-action magnum rifle: high-gloss Claro walnut Monte Carlo stock with a rosewood fore-end tip, high-polish blued barrel, 5-20x scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**ruger1.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Ruger No. 1 single-shot rifle: falling-block action with the lever under the grip, two-piece walnut stock with a schnabel fore-end, quarter rib with integral scope rings, 1.5-6x scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**m4.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Colt M4A1 carbine: black anodised aluminium, collapsible stock, flat-top upper with Picatinny rail, free-float rail handguard, 30-round magazine, compact red-dot sight, worn edges on the anodising. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**akm.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding an AKM rifle: laminated reddish-brown wood stock, handguard and pistol grip, stamped steel receiver with a dull black finish worn silver at the edges, curved 30-round magazine, slant muzzle brake, open tangent rear sight. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**scar.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding an FN SCAR 17S rifle in flat dark earth: folding adjustable stock, polymer lower, aluminium upper with full-length top rail, 1-6x low-power variable scope, 20-round magazine. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**axmc.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding an Accuracy International AXMC sniper rifle in .338 Lapua: dark earth aluminium chassis, folding stock with adjustable cheek piece, long fluted barrel with a muzzle brake, bipod folded, large 5-25x56 tactical scope with exposed turrets. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**m82.png**
```
Cut-out, 1536x1024 landscape: a first-person photograph from the shooter's own eye of two hands holding a Barrett M82A1 .50 BMG anti-materiel rifle: massive black rifle with a rectangular upper receiver, large double-chamber muzzle brake, folding bipod, carry handle, 10-round magazine, 4-16x tactical scope. The stock comes in from the bottom-right corner, tucked into the shooter's shoulder, and the barrel points into the scene toward the centre of the frame, the muzzle ending a little right of centre and slightly below the middle. The hands wear worn brown leather shooting gloves with creases, stitching and scuffs; a little of a waxed olive canvas hunting jacket sleeve shows at the wrists. Shot with a 24 mm lens at f/8 from the shooter's eye position so the gun recedes naturally in perspective; the hands and stock are sharp, the muzzle very slightly softer. Natural outdoor daylight from the upper left: soft reflections on the metal, real wood grain and checkering, honest wear, a few scratches. Only the hands, sleeves and the gun are in frame, accurate proportions of the real gun, no invented parts.
Transparent background (PNG): no scenery, no ground. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 8. Guns, side profile (Arsenal screen) — `assets/weapons/<id>_profile.png` · 1536×1024 · transparent `.png`

Shown on the Arsenal screen. Use the same gun descriptions as section 7.

**rem870_profile.png**
```
Studio product photograph of a Remington 870 Wingmaster 12-gauge pump shotgun: high-gloss American walnut stock and ribbed fore-end with cut checkering, deep blued steel receiver with light holster wear on the edges, long vent-rib barrel with a small brass front bead. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**moss500_profile.png**
```
Studio product photograph of a Mossberg 500 Field 12-gauge pump shotgun: matte black synthetic stock and ribbed fore-end, anodised receiver with the safety on top of the tang, matte blued vent-rib barrel, brass front bead. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**citori725_profile.png**
```
Studio product photograph of a Browning Citori 725 12-gauge over-and-under shotgun: oil-finished figured walnut with fine checkering, silver receiver with light scroll engraving, gloss blued stacked barrels with a vent rib, white front bead. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**a400_profile.png**
```
Studio product photograph of a Beretta A400 Xtreme Plus semi-automatic 12-gauge shotgun covered in a brown marsh-grass camouflage pattern, soft rubber grip panels, long vent-rib barrel, fibre-optic front sight. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sbe3_profile.png**
```
Studio product photograph of a Benelli Super Black Eagle 3 semi-automatic 12-gauge shotgun in a muted waterfowl camouflage pattern, slim receiver, rubber comb insert, long vent-rib barrel, red fibre-optic bead. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**ruger1022_profile.png**
```
Studio product photograph of a Ruger 10/22 Carbine semi-automatic .22 rifle: satin birch hardwood stock, black alloy receiver, barrel band near the muzzle, rotary magazine flush under the receiver, compact 3-9x rimfire scope in low rings. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**cz457_profile.png**
```
Studio product photograph of a CZ 457 American bolt-action .22 rifle: checkered walnut stock, blued barrel and receiver, short bolt handle, 4-12x scope in low rings. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sw29_profile.png**
```
Studio product photograph of a Smith & Wesson Model 29 .44 Magnum revolver with a long 8-inch deep-blued barrel and checkered walnut target grips, adjustable rear sight. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**win94_profile.png**
```
Studio product photograph of a Winchester Model 1894 lever-action .30-30 rifle: straight-grip walnut stock, blued receiver with worn edges, tube magazine under the barrel, large lever loop, buckhorn rear iron sight and a brass front bead, no scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**marlin1895_profile.png**
```
Studio product photograph of a Marlin 1895 lever-action .45-70 rifle: walnut pistol-grip stock, blued steel, side loading gate, big lever loop, 2-7x scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**rugeramerican_profile.png**
```
Studio product photograph of a Ruger American bolt-action rifle: matte black synthetic stock, matte blued barrel, three-lug bolt, 3-9x40 scope in black rings. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**tikka_profile.png**
```
Studio product photograph of a Tikka T3x Lite bolt-action rifle: grey synthetic stock with textured grip panels, stainless fluted barrel and action, 4-12x scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**rem700_profile.png**
```
Studio product photograph of a Remington Model 700 bolt-action rifle: satin walnut stock with checkering, blued barrel and receiver, smooth bolt knob, 4-12x40 hunting scope in steel rings. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**win70_profile.png**
```
Studio product photograph of a Winchester Model 70 Featherweight bolt-action rifle: classic walnut stock with a schnabel fore-end tip, blued steel, controlled-round-feed bolt, 3-9x hunting scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**sako85_profile.png**
```
Studio product photograph of a Sako 85 Hunter bolt-action rifle: oiled walnut stock, blued barrel and action, detachable magazine, 4-16x hunting scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**xbolt_profile.png**
```
Studio product photograph of a Browning X-Bolt Hunter bolt-action magnum rifle: satin walnut stock, matte blued long barrel, safety on the top tang, 4.5-14x hunting scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**bar_profile.png**
```
Studio product photograph of a Browning BAR Mk3 semi-automatic hunting rifle: oil-finished walnut stock and fore-end, plain matte alloy receiver, detachable magazine, 3-9x hunting scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**savage110_profile.png**
```
Studio product photograph of a Savage 110 bolt-action magnum rifle: dark grey synthetic stock, matte black barrel with a muzzle brake, 5-20x scope with exposed turrets. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**weatherby_profile.png**
```
Studio product photograph of a Weatherby Mark V Deluxe bolt-action magnum rifle: high-gloss Claro walnut Monte Carlo stock with a rosewood fore-end tip, high-polish blued barrel, 5-20x scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**ruger1_profile.png**
```
Studio product photograph of a Ruger No. 1 single-shot rifle: falling-block action with the lever under the grip, two-piece walnut stock with a schnabel fore-end, quarter rib with integral scope rings, 1.5-6x scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**m4_profile.png**
```
Studio product photograph of a Colt M4A1 carbine: black anodised aluminium, collapsible stock, flat-top upper with Picatinny rail, free-float rail handguard, 30-round magazine, compact red-dot sight, worn edges on the anodising. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**akm_profile.png**
```
Studio product photograph of an AKM rifle: laminated reddish-brown wood stock, handguard and pistol grip, stamped steel receiver with a dull black finish worn silver at the edges, curved 30-round magazine, slant muzzle brake, open tangent rear sight. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**scar_profile.png**
```
Studio product photograph of an FN SCAR 17S rifle in flat dark earth: folding adjustable stock, polymer lower, aluminium upper with full-length top rail, 1-6x low-power variable scope, 20-round magazine. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**axmc_profile.png**
```
Studio product photograph of an Accuracy International AXMC sniper rifle in .338 Lapua: dark earth aluminium chassis, folding stock with adjustable cheek piece, long fluted barrel with a muzzle brake, bipod folded, large 5-25x56 tactical scope with exposed turrets. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```

**m82_profile.png**
```
Studio product photograph of a Barrett M82A1 .50 BMG anti-materiel rifle: massive black rifle with a rectangular upper receiver, large double-chamber muzzle brake, folding bipod, carry handle, 10-round magazine, 4-16x tactical scope. Pure left-side profile, muzzle pointing right, the whole gun in frame with space around it. Shot with a 90 mm lens at f/11 under large softboxes: accurate proportions and true colours, crisp detail on the checkering, screws, sling swivels and scope turrets, real wood grain and metal finish. No hands, no props.
Transparent background (PNG); if not possible, a plain flat light-grey background.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## 9. Title key art — `assets/ui/title.jpg` · 1536×1024

Shown behind the main menu. Keep the centre calm, because the menu sits on top of it.

**title.jpg**
```
Cinematic photograph, 1536x1024 landscape. A lone hunter in a blaze-orange vest over an olive canvas jacket, seen from behind and slightly to the right, standing on a misty marsh bank at sunrise holding a scoped rifle at low ready, looking out over the water toward distant wooded hills where several strange glowing lights hang low in the sky. Warm golden sunrise light on the left, a cold blue-green glow from the lights on the right. Shot on a 35 mm lens at f/2.8, real mist, real dew, natural film grain. Darker edges, the centre of the frame calm and uncluttered.
It must look like a real, unedited photograph: true-to-life textures and fine detail, natural slightly muted colours, subtle film grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy look, no airbrushed smoothness, no HDR glow, no oversaturation. No text, no logos, no watermarks.
```


---

## Checking your progress

```
npm run art
```

Lists every art file the game looks for, marks which ones exist, and counts what is left.
