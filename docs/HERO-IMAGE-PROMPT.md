# Landing hero image

Done: the landing uses `assets/welcome-hero.webp`, a light morning painting generated on September 27, 2026. Its prompts and origin are in `docs/ARTWORK.md`.

How the landing is built (`src/components/WelcomeScene.tsx`):

1. **The headline sits on the page's cream, above the painting**, centered, never over the busy artwork. "Remember it longer." is in the landing violet (`VIOLET`).
2. **The painting follows.** Its pale sky dissolves up into the cream and its desk dissolves down into the cream, so it has no frame.
3. **The subject choices and a violet pixel button sit just below.**

To try a different painting:
- keep it 4:5, with a very pale sky at the top, so the fade into cream stays invisible;
- run `npx playwright test tests/e2e/welcome.spec.ts`, which also refreshes `docs/welcome-refreshed-mobile.png`.
