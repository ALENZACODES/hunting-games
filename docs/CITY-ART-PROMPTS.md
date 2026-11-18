# City Hunt art prompts

One complete prompt per image for the City Hunt series: **301 images** across New York, Toronto, Singapore, Hong Kong and Las Vegas. Every prompt is written for a **real photograph**, not game art, and names the exact file the game loads.

City Hunt already plays with drawn stand-ins. Each file you add replaces one stand-in the next time the page loads, so you can work in any order. `npm run art` lists what is in place and what is missing (the "City:" groups).

| Tier | What | Files | Why first |
|---|---|---|---|
| 1 | The Vyrr (shared) and police | 24 | They appear in every city scene. |
| 2 | Scene backgrounds and cover overlays | 120 | 12 places per city, each with the object you duck behind. |
| 3 | Each city's alpha, hunter clan and civilians | 75 | The boss and the people you must not hit. |
| 4 | Major Navarro, menus, city art and story cards | 82 | Presentation: dossier, results, city pages and the story between scenes. |

---

## How to use

1. Start a new image chat for each group (for example: "Vyrr tracker", "New York scenes", "Spire Warden"). Paste the matching style lock below first.
2. Paste one prompt per message. For a creature or person that appears in several files, keep all of its prompts in the same chat and, after the first image, add: `Same creature (or person) as before, identical design, colours and proportions; only the pose changes.`
3. Download, rename to the file name shown, and save it into the folder shown, inside `assets/`.
4. Run `npm run art`, then reload the game.

### Style lock: scenes and story cards

```
I am making art for a photorealistic first-person game set in real cities at night and day. Every image in this chat must look like a real, unedited photograph from a professional full-frame camera: true-to-life textures (wet asphalt, glass, stone, fabric, skin), natural colour, physically correct light, subtle sensor grain. Never a 3D render, CGI, game art, illustration or painting; no plastic surfaces, no airbrushing, no HDR glow, no oversaturation.
No readable text anywhere: signs, screens and storefronts show abstract colour and light only, with no letters, numbers, logos, brand names or flags. No blood or gore, no injured or dead people.
Reply with the image only. One image per message.
```

### Style lock: cut-outs (Vyrr, people, alphas, medals)

```
I am making cut-out images for a photorealistic game. Every image in this chat must look like a real photograph: true-to-life texture, natural colour, subtle grain; never CGI, a 3D render, game art or an illustration.
Each image is one subject, whole and uncropped, on a transparent background (PNG) with no ground and no shadow; if transparency is not possible, a plain flat light-grey background. Creatures and people are shown in side view facing RIGHT, shot with a long telephoto lens, lit by soft neutral light from the upper left.
The Vyrr are an original alien species, not based on any film or game: no dreadlocks or hair, no masks or helmets, no mandibles or tusks, no shoulder cannons, no laser sights, no mesh clothing, no skulls.
Reply with the image only. One image per message.
```

### What the game relies on

| Rule | Why |
|---|---|
| Scene backgrounds: camera level at 1.6 m, horizon where the prompt says, open ground in the lower half, no people. | The game stands Vyrr, civilians and police on that ground at real distances. |
| Cover overlays: the object fills only the bottom quarter, everything above is transparent (or flat chroma green). | It sits in front of the scene, and fills the lower half of the view when you hold Space. |
| Cut-outs face RIGHT, whole figure in frame. | The game mirrors them when they move left and scales them by real height. |
| Same design across every pose of one creature. | The game swaps poses as it walks, aims, fires, leaps and falls. |
| No readable text or logos. | Keeps the cities generic enough to publish and avoids trademark problems. |

### Fix-up commands (send in the same chat)

| Problem | Send this |
|---|---|
| Looks like CGI or too clean | `Make it look like an unedited RAW photograph: keep real texture and grime, add subtle grain, remove any glow or plastic shine. Change nothing else.` |
| Signs have readable words | `Remove every letter, number and logo from the signs and screens; keep their colour and light. Change nothing else.` |
| The alien looks like a famous movie creature | `Make it an original creature: remove any hair, mask, mandibles or shoulder weapon; keep the smooth eyeless blade-crested head, the ceramic-like plates and the bone quill ridge on the forearm.` |
| Faces the wrong way | `Mirror it horizontally so it faces right. Change nothing else.` |
| Cropped at the edge | `Zoom out so the whole figure fits with clear space on every side. Change nothing else.` |
| Background is not transparent | `Remove the background completely and give me a transparent PNG. Keep the subject exactly the same.` |
| Horizon in the wrong place | `Keep the scene but level the camera at standing eye height so the horizon sits at [N]% from the top.` |
| Major looks like a celebrity | `Change his face so he does not resemble any real person; keep his build, skin tone, greying temples, stubble and eyebrow scar.` |

---

## Tier 1 · The Vyrr and police

### Vyrr tracker, hunter, hound, seeker and spine — `assets/aliens/`

Make each creature in its own chat so its design stays identical across poses.

**`assets/aliens/vyrr_tracker_walk_1.png`** · 1024x1536
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: Walking, frame 1 of a two-frame walk cycle: left leg forward, right leg back, arms swinging opposite.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_tracker_walk_2.png`** · 1024x1536
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: Walking, frame 2 of a two-frame walk cycle: right leg forward, left leg back, arms swinging opposite.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_tracker_run.png`** · 1024x1536
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: Running flat out, body leaning forward, one foot pushing off the ground, arms pumping.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_tracker_leap.png`** · 1536x1024
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: In mid-air in a long horizontal leap between rooftops, legs tucked under, arms reaching forward, crest swept back.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_tracker_crouch.png`** · 1024x1536
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: Crouched low on its haunches as if perched on a ledge, knees high, one hand down for balance, head turned toward the viewer.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_tracker_fire.png`** · 1024x1536
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: Standing braced, right forearm thrust forward at shoulder height, a single bone spine just leaving the quill ridge in a burst of amber sparks, chest pore blazing.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_tracker_down.png`** · 1536x1024
```
A Vyrr tracker: a tall, lean alien hunter about 2.6 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: charcoal-olive plates, amber light-pores, a single crest blade.
Pose: Collapsed and lying on its side on the ground, motionless, limbs folded, crest touching the ground, light-pores dark. No wounds, no blood.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hunter_walk_1.png`** · 1024x1536
```
A Vyrr hunter: a tall, lean alien hunter about 2.8 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: blue-black plates with a faint oily sheen, orange light-pores, a longer crest of two swept blades, quill ridges on both forearms.
Pose: Walking, frame 1 of a two-frame walk cycle: left leg forward, right leg back, arms swinging opposite.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hunter_walk_2.png`** · 1024x1536
```
A Vyrr hunter: a tall, lean alien hunter about 2.8 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: blue-black plates with a faint oily sheen, orange light-pores, a longer crest of two swept blades, quill ridges on both forearms.
Pose: Walking, frame 2 of a two-frame walk cycle: right leg forward, left leg back, arms swinging opposite.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hunter_aim.png`** · 1024x1536
```
A Vyrr hunter: a tall, lean alien hunter about 2.8 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: blue-black plates with a faint oily sheen, orange light-pores, a longer crest of two swept blades, quill ridges on both forearms.
Pose: Standing, right forearm raised straight forward at shoulder height, the quill ridge opened up and starting to glow amber at its base: about to fire.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hunter_fire.png`** · 1024x1536
```
A Vyrr hunter: a tall, lean alien hunter about 2.8 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: blue-black plates with a faint oily sheen, orange light-pores, a longer crest of two swept blades, quill ridges on both forearms.
Pose: Standing braced, right forearm thrust forward at shoulder height, a single bone spine just leaving the quill ridge in a burst of amber sparks, chest pore blazing.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hunter_cloak.png`** · 1024x1536
```
A Vyrr hunter: a tall, lean alien hunter about 2.8 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: blue-black plates with a faint oily sheen, orange light-pores, a longer crest of two swept blades, quill ridges on both forearms.
Pose: Walking, with its body almost invisible: it looks like clear glass, only its edges visible as a refraction shimmer that bends the light, and the amber light-pores still glowing.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hunter_down.png`** · 1536x1024
```
A Vyrr hunter: a tall, lean alien hunter about 2.8 metres tall. Digitigrade legs with a high backward-bending ankle and long two-toed feet, a narrow waist, long arms with three long fingers. Its body is armoured in overlapping plates of matte chitin that look like scorched ceramic and weathered horn, with fine scratches, chips and dust; thin grey-brown fibrous skin shows at the joints. The head is a smooth eyeless wedge that sweeps back into a blade-like crest; small glowing light-pores sit in a row along each side of the head and one in the centre of the chest. A ridge of pale bone quills, its spine launcher, grows out of the right forearm. Colour: blue-black plates with a faint oily sheen, orange light-pores, a longer crest of two swept blades, quill ridges on both forearms.
Pose: Collapsed and lying on its side on the ground, motionless, limbs folded, crest touching the ground, light-pores dark. No wounds, no blood.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hound_run_1.png`** · 1536x1024
```
A Vyrr hound: an original alien hunting beast about 1.4 metres long and 0.9 metres high at the shoulder, lean like a greyhound crossed with a monitor lizard. Four long digitigrade legs, a narrow deep chest, a long whip tail. Matte dark-brown chitin plates like scorched ceramic along the back and flanks, a row of short raised bone quills down the spine, sinewy grey-brown skin at the joints, no fur. A blunt eyeless head with one amber light-pore on each side and a long closed jaw line.
Pose: Galloping, frame 1 of 2: all four legs gathered under the body, back arched, tail out straight.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hound_run_2.png`** · 1536x1024
```
A Vyrr hound: an original alien hunting beast about 1.4 metres long and 0.9 metres high at the shoulder, lean like a greyhound crossed with a monitor lizard. Four long digitigrade legs, a narrow deep chest, a long whip tail. Matte dark-brown chitin plates like scorched ceramic along the back and flanks, a row of short raised bone quills down the spine, sinewy grey-brown skin at the joints, no fur. A blunt eyeless head with one amber light-pore on each side and a long closed jaw line.
Pose: Galloping, frame 2 of 2: fully stretched out, front legs reaching forward and back legs kicked back, tail streaming.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hound_pounce.png`** · 1536x1024
```
A Vyrr hound: an original alien hunting beast about 1.4 metres long and 0.9 metres high at the shoulder, lean like a greyhound crossed with a monitor lizard. Four long digitigrade legs, a narrow deep chest, a long whip tail. Matte dark-brown chitin plates like scorched ceramic along the back and flanks, a row of short raised bone quills down the spine, sinewy grey-brown skin at the joints, no fur. A blunt eyeless head with one amber light-pore on each side and a long closed jaw line.
Pose: Pouncing: launched off its back legs, front legs and head thrust forward, jaw open showing rows of small pale teeth.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_hound_down.png`** · 1536x1024
```
A Vyrr hound: an original alien hunting beast about 1.4 metres long and 0.9 metres high at the shoulder, lean like a greyhound crossed with a monitor lizard. Four long digitigrade legs, a narrow deep chest, a long whip tail. Matte dark-brown chitin plates like scorched ceramic along the back and flanks, a row of short raised bone quills down the spine, sinewy grey-brown skin at the joints, no fur. A blunt eyeless head with one amber light-pore on each side and a long closed jaw line.
Pose: Collapsed on its side on the ground, motionless, legs folded, light-pores dark. No wounds, no blood.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_seeker_idle.png`** · 1024x1024
```
A Vyrr seeker: an original floating alien organism about 80 cm across. A matte black-brown chitin shell shaped like a closed seed pod, ringed by three thin curved bone fins that orbit it, and a horizontal slit on its front through which a hot amber core glows. It hovers with no visible support; faint heat shimmer around the core.
Pose: Hovering calmly, fins turning slowly, core glowing a steady amber.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view, the slit facing RIGHT. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_seeker_fire.png`** · 1024x1024
```
A Vyrr seeker: an original floating alien organism about 80 cm across. A matte black-brown chitin shell shaped like a closed seed pod, ringed by three thin curved bone fins that orbit it, and a horizontal slit on its front through which a hot amber core glows. It hovers with no visible support; faint heat shimmer around the core.
Pose: Firing: the core flares white-hot, the slit wide open, a bone spine bursting out of it toward the right in a shower of sparks.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view, the slit facing RIGHT. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_seeker_down.png`** · 1024x1024
```
A Vyrr seeker: an original floating alien organism about 80 cm across. A matte black-brown chitin shell shaped like a closed seed pod, ringed by three thin curved bone fins that orbit it, and a horizontal slit on its front through which a hot amber core glows. It hovers with no visible support; faint heat shimmer around the core.
Pose: Dead and fallen, lying tilted on the ground, shell cracked open along one seam, fins still, core dark. No wounds, no gore.
It is an original creature, not based on any film or game: no dreadlocks or hair, no mask or helmet, no mandibles or tusks, no shoulder cannon, no laser sights, no mesh or net clothing, no skulls, no human weapons.
Side view, the slit facing RIGHT. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/aliens/vyrr_spine_fly.png`** · 1536x1024 · the projectile the Vyrr fire at you
```
A single Vyrr spine in flight: a slender bone quill about 50 cm long, pale ivory fading to amber, a needle-sharp tip at the right end and a glowing amber-hot base at the left end trailing a short streak of orange sparks and heat haze. Pointing horizontally to the RIGHT, side view.
Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

### Police — `assets/city/shared/` (no-shoot targets, used in every city)

**`assets/city/shared/officer_1_run.png`** · 1024x1536
```
Photograph of a city police officer, an adult man in his thirties, in a plain dark-navy uniform shirt and trousers, duty belt and a peaked cap. Running for cover, mid-stride with one foot off the ground, arms pumping, both hands empty, glancing back over the shoulder. Full body visible from head to feet. No readable text, badges or patches with words.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/city/shared/officer_2_run.png`** · 1024x1536
```
Photograph of a police officer, an adult woman in her thirties, in a fluorescent yellow high-visibility jacket over a dark uniform, hair tied back. Running for cover, mid-stride with one foot off the ground, arms pumping, both hands empty, glancing back over the shoulder. Full body visible from head to feet. No readable text, badges or patches with words.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/city/shared/swat_run.png`** · 1024x1536
```
Photograph of a tactical police officer, an adult man, in dark grey tactical clothing, a helmet and a plain plate carrier. Running for cover, mid-stride with one foot off the ground, arms pumping, both hands empty, glancing back over the shoulder. Full body visible from head to feet. No readable text, badges or patches with words.
Side view facing RIGHT, shot with a long telephoto lens so the profile is flat and undistorted. Soft, neutral light from the upper left, the same in every image of this set, so the figure fits both day and night scenes.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

---

## Tier 4 (shared) · Major Navarro and the City Hunt screen

### Major Cole Navarro — `assets/major/`

An original character. Make all six in one chat and keep his face identical. If a result looks like a real person, use the fix-up command above.

**`assets/major/portrait.jpg`** · 1024x1536 portrait · City Hunt dossier
```
Portrait photograph, chest up, of Major Cole Navarro, an original fictional character who must not resemble any real actor, athlete or public figure: a man in his early fifties, about 1.88 m tall, with the heavy, muscular build of a veteran heavyweight bodybuilder: very broad shoulders, a thick neck, a huge chest and arms. Light-brown, sun-tanned skin; a square jaw; close-cropped dark-brown hair greying at the temples; short dark stubble; deep-set hazel eyes; a small old scar through his left eyebrow; a calm, focused expression. He wears a charcoal-grey combat shirt with the sleeves pushed up, a dark olive plate carrier with plain pouches (no text, no patches with words), tan tactical trousers, tan boots, a black wristwatch and a radio earpiece. He stands on a wet city street at night, the background lights soft and out of focus, rain on his shoulders, looking just past the camera. 85 mm lens at f/2, natural street light from one side.
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/major/briefing.jpg`** · 1536x1024 · scene briefing banner
```
Photograph of Major Cole Navarro, an original fictional character who must not resemble any real actor, athlete or public figure: a man in his early fifties, about 1.88 m tall, with the heavy, muscular build of a veteran heavyweight bodybuilder: very broad shoulders, a thick neck, a huge chest and arms. Light-brown, sun-tanned skin; a square jaw; close-cropped dark-brown hair greying at the temples; short dark stubble; deep-set hazel eyes; a small old scar through his left eyebrow; a calm, focused expression. He wears a charcoal-grey combat shirt with the sleeves pushed up, a dark olive plate carrier with plain pouches (no text, no patches with words), tan tactical trousers, tan boots, a black wristwatch and a radio earpiece. At night inside a mobile command post, he leans over a lit table covered with a paper city map and a tablet, on the right third of the frame; screens behind him glow with abstract maps; two officers out of focus in the background. Cinematic but natural light from the table and screens. Keep his face and the map in the middle horizontal band of the frame (the game crops the top and bottom).
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/major/battle.jpg`** · 1536x1024 · results after a failed scene
```
Photograph of Major Cole Navarro, an original fictional character who must not resemble any real actor, athlete or public figure: a man in his early fifties, about 1.88 m tall, with the heavy, muscular build of a veteran heavyweight bodybuilder: very broad shoulders, a thick neck, a huge chest and arms. Light-brown, sun-tanned skin; a square jaw; close-cropped dark-brown hair greying at the temples; short dark stubble; deep-set hazel eyes; a small old scar through his left eyebrow; a calm, focused expression. He wears a charcoal-grey combat shirt with the sleeves pushed up, a dark olive plate carrier with plain pouches (no text, no patches with words), tan tactical trousers, tan boots, a black wristwatch and a radio earpiece. He crouches behind a concrete barrier on a city street at night in heavy rain, holding a carbine upright against his chest with the muzzle pointing at the sky, looking over the barrier toward a faint amber glow far down the street. Rain streaks, wet reflections, 35 mm lens.
If the image tool declines because of the rifle, leave the rifle out and keep everything else.
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
No blood, no wounds, no gore, no injured or dead people.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/major/victory.jpg`** · 1536x1024 · results after a cleared scene
```
Photograph of Major Cole Navarro, an original fictional character who must not resemble any real actor, athlete or public figure: a man in his early fifties, about 1.88 m tall, with the heavy, muscular build of a veteran heavyweight bodybuilder: very broad shoulders, a thick neck, a huge chest and arms. Light-brown, sun-tanned skin; a square jaw; close-cropped dark-brown hair greying at the temples; short dark stubble; deep-set hazel eyes; a small old scar through his left eyebrow; a calm, focused expression. He wears a charcoal-grey combat shirt with the sleeves pushed up, a dark olive plate carrier with plain pouches (no text, no patches with words), tan tactical trousers, tan boots, a black wristwatch and a radio earpiece. He stands on a skyscraper roof at dawn, seen in three-quarter view from behind, looking out over a huge city, a carbine slung across his back with the muzzle pointing down, wind moving his shirt, warm golden light.
If the image tool declines because of the rifle, leave the rifle out and keep everything else.
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/major/salute.jpg`** · 1536x1024 · results after an alpha falls
```
Photograph of Major Cole Navarro, an original fictional character who must not resemble any real actor, athlete or public figure: a man in his early fifties, about 1.88 m tall, with the heavy, muscular build of a veteran heavyweight bodybuilder: very broad shoulders, a thick neck, a huge chest and arms. Light-brown, sun-tanned skin; a square jaw; close-cropped dark-brown hair greying at the temples; short dark stubble; deep-set hazel eyes; a small old scar through his left eyebrow; a calm, focused expression. He wears a charcoal-grey combat shirt with the sleeves pushed up, a dark olive plate carrier with plain pouches (no text, no patches with words), tan tactical trousers, tan boots, a black wristwatch and a radio earpiece. He stands at attention and salutes on a rooftop helipad at sunrise, the city behind him soft and out of focus, a serious and tired expression. No flags, no insignia with text.
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

**`assets/major/full_front.png`** · 1024x1536 portrait · cut-out on each city page
```
Full-body photograph of Major Cole Navarro, an original fictional character who must not resemble any real actor, athlete or public figure: a man in his early fifties, about 1.88 m tall, with the heavy, muscular build of a veteran heavyweight bodybuilder: very broad shoulders, a thick neck, a huge chest and arms. Light-brown, sun-tanned skin; a square jaw; close-cropped dark-brown hair greying at the temples; short dark stubble; deep-set hazel eyes; a small old scar through his left eyebrow; a calm, focused expression. He wears a charcoal-grey combat shirt with the sleeves pushed up, a dark olive plate carrier with plain pouches (no text, no patches with words), tan tactical trousers, tan boots, a black wristwatch and a radio earpiece. He stands relaxed, facing the camera, arms at his sides, no weapon. Whole body from head to boots in frame. Soft light from the upper left.
Isolate it on a transparent background (PNG): no ground, no cast shadow, no scenery; the whole figure in frame with clear space on every side, nothing cropped. If transparency is not possible, use a plain flat light-grey background.
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

### City Hunt screen — `assets/city/`

**`assets/city/select.jpg`** · 1536x1024 · background of the City Hunt screen
```
Night aerial photograph from a helicopter about 600 metres up over a vast, dense, glittering city skyline at the edge of a bay, low cloud lit orange from below, two searchlight beams crossing the cloud. The city is not identifiable. Darker in the centre of the frame, where a menu will sit.
No readable text anywhere: every sign, screen, billboard, storefront and vehicle shows only abstract colour, light and shapes, with no letters, numbers, logos, brand names or flags.
It must look like a real, unedited photograph from a professional full-frame camera: true-to-life texture and fine detail, natural colour, physically correct light, subtle sensor grain. Not a 3D render, not CGI, not game art, not an illustration or painting; no plastic or waxy surfaces, no airbrushing, no HDR glow, no oversaturation. No watermarks.
```

---

## Per-city prompts

Each city has its own file with all of its prompts in tier order: scenes and covers (tier 2), its alpha, hunter clan and civilians (tier 3), then its city art and story cards (tier 4).

| City | File | Images |
|---|---|---|
| New York · Manhattan | [city-art/nyc.md](city-art/nyc.md) | 54 |
| Toronto · Yorkville | [city-art/toronto.md](city-art/toronto.md) | 54 |
| Singapore · Marina Bay | [city-art/singapore.md](city-art/singapore.md) | 54 |
| Hong Kong · Central & Victoria Harbour | [city-art/hongkong.md](city-art/hongkong.md) | 54 |
| Las Vegas · The Strip | [city-art/vegas.md](city-art/vegas.md) | 54 |
