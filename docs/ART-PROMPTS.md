# Art prompts

Prompts for every image the game can use, each with the exact file name it must be saved as. The game already runs with drawn stand-ins; each image you add replaces one stand-in automatically, so you can add art in any order.

**Total:** 18 backgrounds · 14 optional foreground overlays · 35 animal images · 8 alien images · 6 military targets · 25 first-person guns · 25 gun profiles · 1 title image.

---

## How to use this file

1. Start a new image chat and paste the **Style lock** (section 0) once.
2. Paste one prompt at a time. Download the result, rename it to the file name shown, and put it in the folder shown (all folders are inside `assets/`).
3. For two-frame sets (wing flaps), make frame 1 first, then send the **frame 2 follow-up** in the same chat so the bird stays identical.
4. Run `npm run art` to see which files are present and which are still missing.
5. Reload the game. If a background's horizon sits higher or lower than the game expects, change that biome's `horizon` value in `src/data/levels.js` (0 = top of the image, 1 = bottom).

### What the game relies on

| Rule | Why |
|---|---|
| Cut-outs (animals, aliens, targets, guns) on a **transparent** background. A plain single-colour background (white, grey or green) also works. | The game removes plain backgrounds and trims empty margins on load. |
| Animals, aliens and targets in **pure side view, facing right**. | The game flips them when they move left. |
| **Whole subject in frame**, nothing cropped, nothing touching the edges, no ground, no shadow. | The game places feet on its own ground and scales by real body length. |
| Backgrounds **empty of animals and people**, level horizon, eye level. | Targets are placed by the game at real distances. |
| Backgrounds in **daylight** (except where noted). | The game tints them for dawn, dusk and night, and the same background is reused at different times. |
| No text, logos, watermarks or borders. | |

---

## 0. Style lock — paste this first

```
I am making photorealistic art for a first-person hunting video game. For every image in this chat:
- Photorealistic, like a professional wildlife or outdoor photograph on a full-frame camera. Natural colours, sharp focus, realistic textures and fur/feathers.
- Soft natural daylight from the upper left unless I say otherwise.
- No text, no logos, no brand markings, no watermarks, no borders, no frames.
- When I ask for a cut-out: one subject only, the whole subject visible and centred with empty space around it, nothing cropped, pure side view facing RIGHT, on a fully transparent background (PNG). No ground, no shadow, no reflection.
- When I ask for a background: an empty landscape at eye level from a standing person, a level horizon, no animals and no people.
Reply with the image only.
```

---

## 1. Backgrounds — `assets/backgrounds/` · 1536×1024 landscape · save as `.jpg`

Each prompt names the horizon height the game expects. Keep the lower half open ground so targets have somewhere to stand.

**marsh.jpg** · horizon 44 % · Level 1
```
Background, 1536x1024 landscape. A wide cattail marsh at sunrise seen at eye level: calm open water across the middle distance, a band of reeds and cattails on the far shore, low rolling wooded hills on the horizon, soft golden sunrise light and a pastel sky with a few clouds. The horizon is perfectly level about 44% from the top. The lower half is open marsh grass and shallow water with nothing close to the camera. No animals, no birds, no people.
```

**lake.jpg** · horizon 46 % · Level 2
```
Background, 1536x1024 landscape. A prairie lake in the northern Great Plains on a clear morning, seen at eye level: open water in the middle distance, reeds along the far shore, flat grassland beyond, a big blue sky with light cumulus clouds. Level horizon about 46% from the top. Lower half is open short grass and shoreline. No animals, no birds, no people.
```

**farm.jpg** · horizon 45 % · Level 3
```
Background, 1536x1024 landscape. The edge of a harvested cornfield in the Midwest at midday, seen at eye level: golden corn stubble across the lower half, a hedgerow and a few farm trees in the distance, gentle low hills, clear sky. Level horizon about 45% from the top. No buildings in the foreground, no animals, no people.
```

**hardwood.jpg** · horizon 43 % · Level 4, Thermal Sweep, Stalker Hunt
```
Background, 1536x1024 landscape. An oak and maple hardwood ridge in peak autumn colour, seen at eye level across an open forest clearing: orange, red and yellow trees along the far edge, a mid-height wooded ridge behind, leaf-covered open ground in the lower half. Bright overcast daylight, sun not visible. Level horizon about 43% from the top. No animals, no people.
```

**forestedge.jpg** · horizon 44 % · Level 5
```
Background, 1536x1024 landscape. A green spring field at the edge of a deciduous forest, seen at eye level: fresh green grass across the lower half, a line of leafing trees across the middle distance, soft clear daylight. Level horizon about 44% from the top. No animals, no people.
```

**mountain.jpg** · horizon 50 % · Level 6
```
Background, 1536x1024 landscape. A wide alpine meadow in the Rocky Mountains on a clear summer day, seen at eye level: green and gold meadow grass across the lower half, scattered dark conifers, gentle grassy slopes rising in the middle distance, snow-capped peaks on the horizon. Level horizon about 50% from the top. No animals, no people.
```

**scrub.jpg** · horizon 46 % · Level 7
```
Background, 1536x1024 landscape. Dry Texas brush country in late afternoon light, seen at eye level: sandy open ground with sparse dry grass across the lower half, low mesquite and scrub bushes in the middle distance, flat-topped mesas on the horizon. Level horizon about 46% from the top. No animals, no people.
```

**valley.jpg** · horizon 50 % · Level 8
```
Background, 1536x1024 landscape. A broad mountain basin at dawn in elk country, seen at eye level from one side of the basin: an open grassy valley floor across the lower half, dark conifer timber on the far slopes, rugged peaks behind, soft early light. Level horizon about 50% from the top. No animals, no people.
```

**boreal.jpg** · horizon 45 % · Level 9, Fog of War
```
Background, 1536x1024 landscape. A northern Canadian boreal bog in daylight, seen at eye level: sedge grass and a calm open pond in the lower half, a dense line of black spruce and tamarack across the middle distance, low hills behind, cool overcast sky. Level horizon about 45% from the top. No animals, no people.
```

**prairie.jpg** · horizon 47 % · Level 10, Convoy Overwatch, Orbital Drop
```
Background, 1536x1024 landscape. Wide open mixed-grass prairie in daylight, seen at eye level: tall golden grass across the lower half, a few isolated trees on the horizon, a huge sky with high thin clouds, sun not visible. Level horizon about 47% from the top. No roads, no animals, no people.
```

**canyon.jpg** · horizon 47 % · Level 11 (the game turns it to night)
```
Background, 1536x1024 landscape. A wide desert canyon floor in the American Southwest in late-afternoon daylight, seen at eye level: a flat sandy wash with scattered rocks across the lower half, red sandstone mesas and canyon walls on the horizon. In the middle distance, slightly right of centre, a large dark disc-shaped craft lies crashed and half-buried in the sand with a thin trail of smoke. Sun not visible. Level horizon about 47% from the top. No people, no creatures.
```

**hive.jpg** · horizon 47 % · Level 12, Hive Purge, Colossus (alien light — keep as is)
```
Background, 1536x1024 landscape. An alien-transformed valley at dusk, seen at eye level: dark violet ground covered in glowing pink and teal bioluminescent growths across the lower half, tall curved black spires rising in the distance, a magenta and purple sky with two moons and faint aurora. Eerie but photographic, like a real landscape photo of another world. Level horizon about 47% from the top. No creatures, no people.
```

**range.jpg** · horizon 47 % · Military ranges, Night Watch, Iron Sights Only
```
Background, 1536x1024 landscape. A military desert firing range in clear daylight, seen at eye level from the firing line: flat sandy ground across the lower half, low earth berms at several distances, small target stands far away, reddish mesas on the horizon, sun not visible. Level horizon about 47% from the top. No people, no vehicles, no text or signs.
```

**urban.jpg** · horizon 50 % · Shoot House, Hostage Rescue
```
Background, 1536x1024 landscape. A military urban training village in daylight, seen at eye level from an open street: a row of plain two- and three-storey concrete buildings with empty window openings and doorways about 40 metres away, a flat gravel square across the lower half. Level horizon about 50% from the top. No people, no vehicles, no signs or graffiti.
```

**ridge.jpg** · horizon 50 % · Counter-Sniper, Cold Bore, Marksman Gauntlet
```
Background, 1536x1024 landscape. A long arid hillside ridge in daylight seen from the valley floor at eye level: the ridge rises across the whole upper middle of the frame (its crest roughly 20-30% from the top), covered in scattered rocks and dark green scrub bushes, open dry ground across the lower half. Level horizon line where the valley floor meets the ridge base about 50% from the top. No people.
```

**base.jpg** · horizon 48 % · Drone Swarm, Perimeter Breach, Last Stand
```
Background, 1536x1024 landscape. The view outward from a remote desert forward outpost in daylight, at eye level: flat open desert across the lower half, a dirt track, distant mesas, a clear sky, sun not visible. Level horizon about 48% from the top. Nothing close to the camera, no people, no vehicles.
```

**bridge.jpg** · horizon 46 % · Bridge Defense
```
Background, 1536x1024 landscape. A wide river valley in daylight seen at eye level: a long steel truss road bridge crosses the river from left to right about 450 metres away, close to the horizon, with conifer-covered hills behind it and open grassy riverbank across the lower half. Level horizon about 46% from the top. No vehicles on the bridge, no people.
```

**heli.jpg** · horizon 36 % · Door Gunner (scrolls sideways — keep both side edges similar)
```
Background, 1536x1024 landscape. Aerial view from a helicopter about 40 metres above open desert scrubland, looking out sideways toward the horizon: sandy ground with scattered bushes filling the lower two thirds, distant mesas, clear sky. Level horizon about 36% from the top. Even, repeating terrain so the left and right edges look alike. No vehicles, no people.
```

---

## 2. Foreground overlays (optional) — `assets/backgrounds/` · 1536×1024 · transparent `.png`

These sit in front of the targets (birds flush out from behind the reeds). If an overlay looks wrong, delete it and the drawn foreground comes back.

Template — replace the bracketed part:
```
Cut-out overlay, 1536x1024 landscape, fully transparent background. Only along the bottom 30% of the frame: [VEGETATION], photographed close to the camera, slightly out of focus, tops uneven. Everything above that band is completely transparent. No sky, no ground plane, no animals.
```

| File | [VEGETATION] |
|---|---|
| `marsh_fg.png` | dense cattails and marsh reeds with brown cattail heads |
| `lake_fg.png` | tall lakeshore reeds and bulrushes |
| `farm_fg.png` | standing dry corn stalks and leaves at the field edge |
| `hardwood_fg.png` | low autumn brush, ferns and fallen leaves |
| `forestedge_fg.png` | tall fresh green spring grass |
| `mountain_fg.png` | alpine grass and small wildflowers |
| `scrub_fg.png` | dry thorny brush clumps in the bottom corners |
| `valley_fg.png` | tall meadow grass, slightly golden |
| `boreal_fg.png` | sedge grass and Labrador tea shrubs |
| `prairie_fg.png` | tall golden prairie grass |
| `canyon_fg.png` | large sandstone boulders in the bottom corners only |
| `hive_fg.png` | glowing alien tendrils and bioluminescent pods |
| `ridge_fg.png` | dark green scrub bushes in the bottom corners |
| `base_fg.png` | a low wall of tan sandbags with coils of razor wire on top |

---

## 3. Birds — `assets/animals/` · 1024×1024 · transparent `.png`

Wing-flap pairs: send the main prompt for `_1`, then the follow-up for `_2` in the same chat.

**mallard_fly_1.png**
```
Cut-out: a drake mallard duck in flight, pure side view facing right, wings raised high at the top of the wingbeat, green head, white neck ring, chestnut breast, grey body, blue speculum visible. Whole bird visible, transparent background.
```
**mallard_fly_2.png** — follow-up
```
The exact same duck, same size, colours, position and framing, but with the wings fully down at the bottom of the wingbeat. Transparent background.
```

**goose_fly_1.png**
```
Cut-out: a Canada goose in flight, pure side view facing right, long black neck stretched forward, white chin strap, grey-brown body, wings raised high. Whole bird visible, transparent background.
```
**goose_fly_2.png** — follow-up: `The exact same goose, same framing, wings fully down. Transparent background.`

**pheasant_fly_1.png**
```
Cut-out: a rooster ring-necked pheasant flushing in flight, pure side view facing right, copper body, iridescent green head, red face wattle, white neck ring, very long barred tail, wings raised. Whole bird visible, transparent background.
```
**pheasant_fly_2.png** — follow-up: `The exact same pheasant, same framing, wings fully down. Transparent background.`

**dove_fly_1.png**
```
Cut-out: a mourning dove in fast flight, pure side view facing right, slim grey-brown body, long pointed tail, wings raised. Whole bird visible, transparent background.
```
**dove_fly_2.png** — follow-up: `The exact same dove, same framing, wings fully down. Transparent background.`

**swan_fly_1.png**
```
Cut-out: a trumpeter swan in flight, pure side view facing right, all-white plumage, long straight neck, black bill, broad white wings raised. Whole bird visible, transparent background.
```
**swan_fly_2.png** — follow-up: `The exact same swan, same framing, wings fully down. Transparent background.`

**eagle_fly.png**
```
Cut-out: an adult bald eagle gliding, side view facing right with the wings spread wide and slightly raised, white head and tail, dark brown body, yellow beak. Whole bird visible, transparent background.
```

---

## 4. Small game and big game — `assets/animals/` · 1024×1024 (1536×1024 for elk and moose) · transparent `.png`

Each animal has a walking pose, a running pose and (for deer-type animals) a head-down grazing pose. Make the walk pose first, then ask for the others in the same chat so the animal stays the same.

Follow-ups to use after the walk pose:
- **run:** `The exact same animal, same size and framing, now running at full gallop, legs extended. Transparent background.`
- **graze:** `The exact same animal, same size and framing, standing still with its head lowered to the ground, feeding. Transparent background.`

| File(s) | Walk prompt (the subject sentence) |
|---|---|
| `turkey_walk.png`, `turkey_run.png` | `Cut-out: a wild turkey gobbler walking, pure side view facing right, bronze iridescent body feathers, bare blue and red head, red wattle, beard on the chest, tail folded. Whole bird visible, transparent background.` |
| `rabbit_run.png` | `Cut-out: an eastern cottontail rabbit mid-hop, pure side view facing right, brown-grey fur, white cotton tail, ears up. Whole animal visible, transparent background.` |
| `whitetail_walk.png`, `whitetail_run.png`, `whitetail_graze.png` | `Cut-out: a mature white-tailed deer buck walking, pure side view facing right, reddish-brown autumn coat, white throat patch, symmetrical 8-point antlers. Whole animal visible including hooves, transparent background.` |
| `doe_walk.png`, `doe_run.png`, `doe_graze.png` | `Cut-out: a white-tailed deer doe (no antlers) walking, pure side view facing right, tan-brown coat, white throat, large ears. Whole animal visible including hooves, transparent background.` |
| `muledeer_walk.png`, `muledeer_run.png`, `muledeer_graze.png` | `Cut-out: a mule deer buck walking, pure side view facing right, grey-brown coat, very large ears, white rump patch, black-tipped tail, forked antlers. Whole animal visible including hooves, transparent background.` |
| `pronghorn_walk.png`, `pronghorn_run.png` | `Cut-out: a pronghorn buck walking, pure side view facing right, tan back, white belly and rump, white bands on the throat, short black pronged horns. Whole animal visible, transparent background.` |
| `elk_walk.png`, `elk_run.png`, `elk_graze.png` | `Cut-out, 1536x1024: a bull Rocky Mountain elk walking, pure side view facing right, tan body, dark brown neck mane, light rump patch, large swept-back 6x6 antlers. Whole animal visible including antler tips and hooves, transparent background.` |
| `moose_walk.png`, `moose_run.png`, `moose_graze.png` | `Cut-out, 1536x1024: a bull moose walking, pure side view facing right, very dark brown coat, humped shoulders, long legs, long drooping muzzle, dewlap bell under the throat, broad palmate antlers. Whole animal visible, transparent background.` |
| `boar_walk.png`, `boar_run.png` | `Cut-out: a wild boar walking, pure side view facing right, coarse dark grey-brown bristly coat, heavy wedge-shaped head, small tusks, ridge of bristles along the back. Whole animal visible, transparent background.` |
| `bear_walk.png`, `bear_run.png` | `Cut-out: an adult American black bear walking, pure side view facing right, glossy black fur, brown muzzle, rounded ears. Whole animal visible, transparent background.` |

---

## 5. Aliens — `assets/aliens/` · 1024×1024 (colossus 1024×1536) · transparent `.png`

Original designs. Keep them photographic: real-looking materials, wet chitin, real light.

| File | Prompt |
|---|---|
| `skitter_run.png` | `Cut-out: a photorealistic alien creature about the size of a large dog, pure side view facing right, running low to the ground on six segmented insect-like legs, flat dark glossy carapace with glowing cyan stripes along the back, small head with mandibles and two glowing cyan eyes. Whole creature visible, transparent background.` |
| `glider_fly_1.png` | `Cut-out: a photorealistic alien flyer shaped like a manta ray with a 3-metre wingspan, side view facing right, wing tips curled upward, dark violet leathery skin with a row of glowing purple spots, long thin tail. Whole creature visible, transparent background.` |
| `glider_fly_2.png` | follow-up: `The exact same creature, same framing, wing tips now curled downward. Transparent background.` |
| `orb_idle.png` | `Cut-out: a hovering alien orb about one metre across, smooth dark metallic sphere with a bright glowing blue-white core visible through seams, a thin luminous ring around it. Whole object visible, transparent background.` |
| `stalker_walk.png` | `Cut-out: a photorealistic tall thin alien biped about 2.8 metres tall, pure side view facing right, mid-stride on long reverse-jointed legs, long arms with claws, elongated head swept backwards, dark green-black skin, two glowing green eyes. Whole creature visible, transparent background.` |
| `brute_walk.png` | `Cut-out: a photorealistic massive armoured alien beast the size of a truck, pure side view facing right, walking on four thick legs, hunched back covered in dark overlapping armour plates, a large glowing orange sac on its upper back, heavy low head with tusks. Whole creature visible, transparent background.` |
| `pod_fall.png` | `Cut-out: an alien drop pod falling nose-down, a dark metallic capsule about 2 metres tall with glowing yellow seams, a short trail of fire and heat glow from its lower end. Whole object visible, transparent background.` |
| `colossus_walk.png` | `Cut-out, 1024x1536 portrait: a photorealistic alien walking machine the size of a building, side view, a dark armoured dome body on three long jointed legs, three glowing red weak-point vents (one on top of the dome, one on the left side, one low on the right side). Whole machine visible from the top of the dome to the feet, transparent background.` |

---

## 6. Military targets — `assets/military/` · 1024×1024 · transparent `.png`

| File | Prompt |
|---|---|
| `plate_idle.png` | `Cut-out: a round steel shooting target plate about 50 cm across, painted light grey, hanging from a short steel stand with two feet, front view. Whole object visible, transparent background.` |
| `popup_idle.png` | `Cut-out: a military pop-up training target, a tan cardboard silhouette of a person's head and torso mounted on a low olive-green stand, front view, with faint scoring rings on the chest. Whole object visible, transparent background.` |
| `noshoot_idle.png` | `Cut-out: a white cardboard "no-shoot" training target in the shape of a person with both hands raised, outlined in blue, mounted on a low stand, front view. Whole object visible, transparent background.` |
| `drone_idle.png` | `Cut-out: a small military quadcopter drone in flight, side view facing right, dark grey body, four rotors with motion blur, a camera pod underneath, a small red light. Whole drone visible, transparent background.` |
| `vehicle_idle.png` | `Cut-out: a generic modern 8-wheeled armoured personnel carrier, pure side view facing right, olive drab paint, small turret with a gun barrel, no markings, no flags, no numbers. Whole vehicle visible, transparent background.` |
| `sniper_idle.png` | `Cut-out: a marksman lying prone behind a rifle, fully covered in a leafy ghillie suit, pure side view facing right, rifle barrel pointing right, face not visible. Whole figure visible, transparent background.` |

---

## 7. Guns

### 7a. First-person view — `assets/weapons/<id>.png` · 1536×1024 · transparent

This is the gun you see in your hands while playing. The game places it in the bottom-right corner.

Template — replace `[GUN]`:
```
Cut-out, 1536x1024 landscape, transparent background. First-person view from behind a hunter's right shoulder: two hands in dark brown leather shooting gloves holding [GUN]. The stock enters from the bottom-right corner and the barrel points toward the centre of the frame, ending a little right of centre. Only the hands, forearms in a dark olive jacket sleeve, and the gun are visible. Photorealistic, no text, no engraved brand markings.
```

### 7b. Side profile (Arsenal screen) — `assets/weapons/<id>_profile.png` · 1536×1024 · transparent

Template — replace `[GUN]`:
```
Cut-out, 1536x1024 landscape, transparent background. Product photograph of [GUN], pure side profile (left side), muzzle pointing right, whole gun visible, evenly lit on no background. Photorealistic, no text, no engraved brand markings.
```

| id (file name) | [GUN] |
|---|---|
| `rem870` | a Remington 870 Wingmaster pump-action 12-gauge shotgun with a glossy walnut stock and fore-end and a blued steel receiver and barrel with a vent rib |
| `moss500` | a Mossberg 500 Field pump-action 12-gauge shotgun with a black synthetic stock and fore-end and a matte blued barrel |
| `citori725` | a Browning Citori 725 over-and-under 12-gauge shotgun with a high-grade walnut stock and a silver receiver |
| `a400` | a Beretta A400 Xtreme Plus semi-automatic 12-gauge shotgun in brown marsh camouflage |
| `sbe3` | a Benelli Super Black Eagle 3 semi-automatic 12-gauge shotgun in a muted camouflage finish |
| `ruger1022` | a Ruger 10/22 semi-automatic .22 rifle with a walnut-stained hardwood stock and a compact rifle scope |
| `cz457` | a CZ 457 American bolt-action .22 rifle with a walnut stock and a 4-12x rifle scope |
| `sw29` | a Smith & Wesson Model 29 .44 Magnum revolver with a long blued barrel and wooden grips (held in both hands) |
| `win94` | a Winchester Model 1894 lever-action rifle with a walnut stock, blued steel, iron sights, no scope |
| `marlin1895` | a Marlin 1895 lever-action .45-70 rifle with a walnut stock and a low-power hunting scope |
| `rugeramerican` | a Ruger American bolt-action rifle with a black synthetic stock and a 3-9x hunting scope |
| `tikka` | a Tikka T3x Lite bolt-action rifle with a grey synthetic stock, stainless barrel and a 4-12x scope |
| `rem700` | a Remington Model 700 bolt-action rifle with a walnut stock, blued barrel and a 4-12x hunting scope |
| `win70` | a Winchester Model 70 bolt-action rifle with a classic walnut stock and a 3-9x scope |
| `sako85` | a Sako 85 bolt-action rifle with a walnut stock and a 4-16x scope |
| `xbolt` | a Browning X-Bolt bolt-action magnum rifle with a satin walnut stock and a 4.5-14x scope |
| `bar` | a Browning BAR Mk3 semi-automatic hunting rifle with a walnut stock, a plain alloy receiver and a 3-9x scope |
| `savage110` | a Savage 110 bolt-action magnum rifle with a dark synthetic stock and a 5-20x scope |
| `weatherby` | a Weatherby Mark V bolt-action magnum rifle with a high-gloss walnut Monte Carlo stock and a 5-20x scope |
| `ruger1` | a Ruger No. 1 falling-block single-shot rifle with a walnut stock and a 1.5-6x scope |
| `m4` | a Colt M4A1 carbine in black with a collapsible stock, quad rail and a compact red-dot sight |
| `akm` | an AKM rifle with laminated wood furniture, a curved magazine and iron sights |
| `scar` | an FN SCAR 17S rifle in flat dark earth with a 1-6x low-power variable scope |
| `axmc` | an Accuracy International AXMC sniper rifle with a tan chassis, folding stock, muzzle brake and a large 5-25x tactical scope |
| `m82` | a Barrett M82A1 .50 calibre anti-materiel rifle in black with a large muzzle brake, bipod and a 4-16x tactical scope |

---

## 8. Title key art — `assets/ui/title.jpg` · 1536×1024

Shown behind the main menu. Keep the centre calm, because the menu sits on top of it.

```
Photorealistic cinematic key art, 1536x1024 landscape. A lone hunter in an orange and olive jacket seen from behind and slightly to the right, standing on a marsh bank at sunrise holding a rifle, looking out over misty water toward distant hills where strange glowing lights hang low in the sky. Warm golden light on the left, cold alien glow on the right. Strong dark vignette, the centre of the frame calm and uncluttered. No text, no logos.
```

---

## Checking your progress

```
npm run art
```

Lists every art file the game looks for, marks which ones exist, and counts what is left.
