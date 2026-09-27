# Landing hero image

Done: the landing now uses `assets/welcome-hero.webp`, generated on September 27, 2026. Its prompt and origin are in `docs/ARTWORK.md`.

How the landing is built (`src/components/WelcomeScene.tsx`):

1. **The sky is drawn in code.** Its colour runs from deep night down to `HERO.skyEdge`, the colour of the painting's top row, so there is no visible join. The headline sits there, centered, with small twinkling stars.
2. **The painting follows.** Its own four-pointed star lands just under the headline. Its top edge fades into the sky, and its foot fades into night.
3. **The subject choices and the button sit inside the same night section**, so the first screen reads as one scene from the top bar down.

To try a different painting:
- replace the file and keep the 4:5 shape;
- resample `skyEdge` from the new image's top row;
- run `npx playwright test tests/e2e/welcome.spec.ts`, which also refreshes `docs/welcome-refreshed-mobile.png`.
