# Art and animation pipeline for the memory worlds

Quasar's worlds need two kinds of art:
- **Scenes:** the place, drawn once per episode.
- **Characters:** the same six faces in every episode, who talk, react and celebrate.

This guide covers both, from creating accounts to seeing the art in the app.

## What to use

| Need | Tool | Why |
| --- | --- | --- |
| Episode scenes and world maps | The image generator you already use (ChatGPT images), with the style block below | Matches the existing biology atlas; nothing new to learn |
| Characters that move, now | **Pose sheets**: the same character drawn in 4 poses, animated in code with Reanimated and Moti (already installed) | Works on web, iOS and Android today, with no new accounts and no native rebuild |
| Characters that really animate, later | **[Rive](https://rive.app)**: rigged characters with a state machine (idle → talking → worried → celebrating) | Tiny files, runs at 60 fps, and one file reacts to the app's state. It's the tool built for interactive characters |
| Glow, particles, lighting | Reanimated and Moti now. [React Native Skia](https://shopify.github.io/react-native-skia/) if we need shaders | Already in the stack |

**For the Shipaton deadline (Sept 30), use pose sheets.** Rive is the better long-term tool, but rigging six characters is days of work. Pose sheets give most of the effect this week, and they become the source art for Rive later.

Lottie isn't recommended here. It plays back pre-made animations, while Rive's state machines let a character respond to the learner (for example, look worried after a wrong answer).

---

## Path A: pose sheets (this week)

### 1. Generate the art

For each character, generate **four separate images**, one pose each:

| Pose | Used when |
| --- | --- |
| `idle` | Standing in the scene |
| `talk` | Their line is on screen |
| `worried` | A wrong answer, or the blackout episode |
| `happy` | A right answer, or an episode solved |

Each image should be:
- square, 1024 × 1024;
- the whole figure, centered, with the same framing and scale in all four poses;
- a **transparent background**. If the generator can't do that, use a flat pure-white background and I'll cut it out.

Paste the **style block** first, then the **character line** and the pose.

### 2. Save them with these names

```
assets/cell-city/chars/osei-idle.png   osei-talk.png   osei-worried.png   osei-happy.png
assets/cell-city/chars/nell-idle.png   …
assets/cell-city/chars/ribo-…   mara-…   kip-…   gly-…
assets/cell-city/hub.png
assets/cell-city/e1.png … e6.png
```

### 3. Tell me they're there

I'll then:
1. swap the episode placeholders in `src/features/CellCity.tsx` for the new scenes;
2. replace the initials badges with the characters;
3. animate them in code: a small breathing bob while idle, a squash-and-stretch between `idle` and `talk` on each line, a shake into `worried` after a miss, and a hop into `happy` on a right answer.

All of the motion respects the device's reduce-motion setting.

---

## Path B: Rive (after Shipaton)

### 1. Create the account

1. Go to [rive.app](https://rive.app) and **Sign up** (Google or email).
2. Start on the free plan. Before you build anything big, check on the pricing page whether your plan lets you **export `.riv` files for use in an app**; that's the only feature we need.
3. Use the editor in the browser, or install the desktop app from the same site.

### 2. Learn the three ideas you need (about an hour)

- **Artboard:** one canvas per character. Make it 512 × 512.
- **Bones and meshes:** let an imported picture bend (arm swings, head tilts).
- **State machine:** the logic that picks an animation based on *inputs* that the app sets.

Rive's own "Getting started" videos and the Community files (search "character state machine") show all three.

### 3. Build each character

1. **Import** the character's pose-sheet art.
   - Import it as separate parts: head, body, arms, eyes and mouth, each as its own transparent PNG.
   - To get the parts, generate them with the same prompt, or ask me to split an image.
2. **Rig:** add bones to the arms and head, and a mesh on the body, so they can bend.
3. **Animate** four timelines, named exactly:
   - `idle` (loop, 2–3 s, a gentle breath and a blink);
   - `talk` (loop, mouth open/close);
   - `worried`;
   - `happy` (one-shot, about 1 s).
4. **State machine**, named exactly `Character`, with these inputs:
   - `talking`: Boolean. When true, play `talk`.
   - `mood`: Number. `0` = calm (idle), `1` = happy, `2` = worried.
   - `celebrate`: Trigger. Plays `happy` once, then returns to idle.

The names are the contract between your file and the app code. If they match, I can plug the file in without changing anything in Rive.

### 4. Export

*File → Export → Export for runtime* (`.riv`). Save each file as:

```
assets/rive/osei.riv  nell.riv  ribo.riv  mara.riv  kip.riv  gly.riv
```

### 5. What I do with the files

- Add Rive's runtimes:
  - **web:** `@rive-app/react-canvas`;
  - **iOS and Android:** Rive's React Native runtime.
- Write one `Character` component with two platform versions (`.web.tsx` and `.native.tsx`), since the runtimes differ.
- Drive the inputs from the story:
  - `talking` while that character's line is on screen;
  - `mood = 2` after a wrong answer and throughout the blackout episode;
  - `celebrate` on a right answer and when an episode is solved.
- Keep the pose-sheet images as the fallback for reduce-motion and for Expo Go.

**Note:** Rive's React Native runtime is native code. It works in a development build or a store build, but **not in Expo Go**. The web preview works either way.

---

## Prompts for Cell City

### Style block (paste first, every time)

> Hand-inked cartoon illustration with warm watercolor washes, confident black outlines, light crosshatching, cream paper texture. Friendly, expressive, slightly exaggerated proportions, like a clever science picture book for teenagers. Warm palette: lavender, sage green, ochre yellow, soft orange, deep navy for night. No text, no letters, no logos, no watermark.

This matches the existing biology atlas (`assets/bio-cells-world.png`), so new art sits next to the current panels.

### Characters

Each one is designed so its look carries the real biology.

| Id | Character | Prompt line (add the pose at the end) |
| --- | --- | --- |
| `osei` | Mayor Osei (the whole cell) | A warm, round-bodied city mayor shaped like a whole cell: a translucent lavender body with tiny organelles visible inside like rooms of a house, a sash and a small ceremonial chain, a clipboard. Pose: … |
| `nell` | Archivist Nell (nucleus) | An elderly archivist whose body is a round domed library with a double wall dotted with small round doorways (nuclear pores). Reading glasses, a key ring, long ribbons of blueprint paper tucked under one arm. She never lets the originals go. Pose: … |
| `ribo` | Rho & Bo (ribosome) | Two cheerful builders who fit together like a clamp: a large round one (Rho) on top and a smaller one (Bo) underneath, holding a ribbon of work-order tape between them and snapping colored beads onto a growing chain. Tool belts, matching caps. Pose: … |
| `mara` | Gatekeeper Mara (cell membrane) | A border guard whose uniform is made of two layers of round-headed, wavy-tailed figures standing shoulder to shoulder (a phospholipid bilayer), holding a gate that is a tunnel-shaped protein. Tiny oxygen molecules slip past her ankles while a charged ion waits at the gate. Pose: … |
| `kip` | Foreman Kip (mitochondrion) | A bean-shaped orange power-station foreman in a yellow hard hat, with folded inner walls visible like corridors (cristae), overalls and a big wrench. Rows of small smiling batteries (ATP) behind him. Pose: … |
| `gly` | Courier Gly (glycolysis) | A quick street courier on a cargo bike carrying a six-block fuel parcel (glucose) that she is snapping cleanly into two three-block halves (pyruvate). A little satchel of batteries, and small delivery vans waiting behind. Pose: … |

Pose endings:
- `idle`: "standing relaxed, facing the viewer, full body."
- `talk`: "mid-sentence, mouth open, one hand gesturing, full body."
- `worried`: "worried, eyebrows up, hands close to the chest, full body."
- `happy`: "delighted, arms up, a small hop, full body."

Always add: "Single character, centered, full body, transparent background, 1024×1024."

### Scenes (16:9, 1536 × 864)

| File | Prompt (after the style block) |
| --- | --- |
| `hub.png` | A bird's-eye map of Cell City at dusk: a domed Archive at the center with round doorways, busy workshop streets, bean-shaped power stations with glowing windows, and a flexible city wall around everything with guarded tunnel gates. The east side's lights are flickering. |
| `e1.png` | Welcome to Cell City. Daytime streets: the domed Archive with ribbons of copied blueprints leaving through its round doorways; two clamp-shaped builders reading a ribbon and snapping beads into a chain; a bean-shaped power station in the distance; the city wall with a guard. |
| `e2.png` | Cytoplasm streets. A courier on a cargo bike pays a toll of two small batteries to crack open a six-block fuel parcel, which splits into two three-block halves; four batteries come back out; loaded delivery vans drive toward a power station. |
| `e3.png` | Inside the power station. A roundabout where fuel is stripped (small grey exhaust puffs of CO₂) and vans are loaded; along the folded inner wall, a line of pumps pushes small glowing protons up behind a dam; at the end of the line a figure made of oxygen catches the electrons; a turbine set into the dam spins as protons rush through, charging rows of batteries. |
| `e4.png` | The Great Blackout. The same power station at night, lights out, the turbine still; the foreman holds a flashlight showing three possible faults: an empty spot where the oxygen catcher should stand, a jammed turbine, a crack in the dam with water trickling past. |
| `e5.png` | The control room: a wall of three district gauges (oxygen use, water level behind the dam, van queues, lactate barrels), the mayor and the foreman leaning over a desk of readings, the player's magnifying glass in the foreground. |
| `e6.png` | Restore the City. Dawn: districts lighting up one by one across the map, the turbine spinning, the characters celebrating on a rooftop. |

When the art is in `assets/cell-city/`, tell me and I'll wire it in, replacing the placeholder panels listed in `episodeArt` in `src/features/CellCity.tsx`.
