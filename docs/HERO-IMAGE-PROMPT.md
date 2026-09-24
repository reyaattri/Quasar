# Landing hero image

The landing currently uses `assets/palace-worlds.png` as a placeholder: the hero glides between the dojo, ruins and neon worlds. It's meant to be replaced by a single portrait illustration made for the first screen.

## Prompt

> Hero illustration for the first screen of Quasar, a mobile memory-learning app. Portrait 4:5 (1600×2000). A student at a small wooden desk at dusk. Their open notebook unfolds into a tiny walkable memory world: a winding paper path rises from the pages through three distinct places (a quiet Japanese dojo garden, sunlit ancient Egyptian ruins, a neon rooftop city at night). Each place holds one oversized, impossible object: a giant glossy apple on the dojo gate, a milk bottle sitting politely on a stone chair, a loaf of bread waving from a lit window. Handmade gouache and fine pencil storybook style, warm paper texture. Palette: deep forest green #294D3B, sage #E6EBD9, warm yellow #F2CB6C, peach #F3D5BC, cream #FBF8EF, with soft lamplight. Leave the top ~20% as calm sky. Main subject readable at small phone size. No text, no letters, no logos, no UI, no watermark. Original characters that don't resemble any existing brand or franchise.

The three objects are the original Memory Walk cues (Door → an enormous apple, Chair → milk takes a seat, Window → bread waves hello), so the hero still carries the first memory walk without a text card.

## Swapping it in

1. Save the image as `assets/welcome-hero.png` (PNG, about 1600×2000).
2. In `src/components/WelcomeScene.tsx`, update `HERO`:
   ```ts
   source: require("../../assets/welcome-hero.png"),
   width: 1600,
   height: 2000,
   captions: ["YOUR FIRST MEMORY WALK"],
   label: "A student's notebook unfolds into a path through a dojo, ancient ruins and a neon city.",
   ```
   With one caption the image sits still and the progress dots are hidden.
3. Run `node scripts/capture-screens.cjs` with Metro on port 8081 to refresh `docs/landing-worlds-mobile.png`, and record the new file's origin in `docs/ARTWORK.md`.
