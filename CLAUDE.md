# Quasar handoff

This repository is the complete Expo/React Native source for Quasar. Start with `README.md`, then `App.tsx`, `src/features/`, and `src/data/`. The public web preview is https://quasar-memory-garden.reyaattri4.chatgpt.site/. The same source builds the mobile app; `android/`, `ios/`, `dist/`, and `node_modules/` are generated and intentionally excluded from Git.

## Product intent

Quasar teaches through a clear explanation, a distinctive visual mnemonic, hidden-cue recall, and application. Keep the visual style varied by subject and world. A cue must depict the exact object or relationship the learner needs to remember. Avoid generic repeated mascots, decorative emojis, text walls, and copy borrowed from Sketchy, Brilliant, Teuida, or other references. Preserve the user's selected SAT artwork and existing world imagery unless a new request changes them.

The landing hero is `src/components/WelcomeScene.tsx`. It currently glides between the three worlds in `assets/palace-worlds.png` as a placeholder until the owner generates the portrait hero described in `docs/HERO-IMAGE-PROMPT.md`; swapping means editing the `HERO` constant. The owner rejected both a static three-stop memory-walk text card and a text caption under the hero, so keep the hero image-led and don't restack explanatory copy under it. `assets/welcome-garden.png` is kept for provenance and is not shown.

The biology learning loop (see `docs/PRODUCT-VISION.md`) lives in `src/lib/learning.ts` (attempt log, Error Memory, readiness), `src/lib/planner.ts` (Today's priority formula), `src/data/biologyUnderstanding.ts` (Teach-Back key ideas and Why Ladders) and `src/features/` (`TodayPlan`, `TeachBack`, `WhyLadder`, `CaseLab`, `ErrorMemory`, `Ready`, `MemoryGarden`). The Today plan lives on the Review tab; Home keeps only a slim link to it, because the owner didn't want Home to open with plan chips. Case Lab content is in `src/data/caseLab.ts`. Plus-only AI tutor feedback is the `grade-explanation` Supabase function (official Anthropic SDK, structured output); it is advice only, and the on-device keyword check still decides mastery. Keep measurement honest: attempts that used a hint never count as mastered, and keyword checks are labelled as keyword checks. Motion uses Reanimated and Moti through the `Reveal`, `Pulse`, `PressableScale` and `Meter` components in `src/components/Reveal.tsx`, and each of them respects reduced motion. The logo has no punctuation dot: `src/components/QuasarMark.tsx` matches `assets/icon.svg`; `assets/icon.png` is generated from that SVG with `node scripts/render-icon.cjs`.

## Local setup and checks

Use Node 22+ and `npm ci`. `npm run web` serves the browser app; `npm start` starts Expo; `npm run android` generates/builds Android on a configured machine. No secrets are needed to experience the bundled lessons. After code changes, run `npm run typecheck`, relevant tests, and `EXPO_NO_TELEMETRY=1 npm run export:web`. End-to-end tests use Chrome and port 8081 (`playwright.config.ts`). Do not commit generated `dist/`, `android/`, or local credentials.

## Main implementation

- `App.tsx`: shell, responsive navigation, onboarding, home, review, progress, and feature entry points.
- `src/components/`: code-native UI, interactive palace rooms and objects, shared graphics, progress, welcome art, and logo.
- `src/features/`: lesson and game flows. Keep content-specific logic with the feature rather than expanding `App.tsx` unnecessarily.
- `src/data/`: bundled curriculum, mnemonic cues, world/room mappings, art coordinates, and toolkit scripts. This is the first place to edit lesson wording.
- `src/lib/`: persistence, FSRS-style scheduling, and optional integrations.
- `assets/`: original generated illustrations, user-provided image assets, procedural audio, fonts, and the app icon. `docs/ARTWORK.md` and related art records describe provenance.
- `supabase/`: optional schema, seed, and generation function. See `docs/SETUP.md`; never place server secrets in `EXPO_PUBLIC_*`.

## Deployment and accounts

`.openai/hosting.json` identifies the existing Sites project; preserve its `project_id`. Build with `npm run export:web` and deploy that exact committed source. The public URL above is the web preview, not an Android/iOS store release. `origin` points to `https://github.com/reyaattri/Quasar.git`; push authenticated commits there. GitHub, Supabase, RevenueCat, Expo/EAS, and app-store accounts are separate. Public app access does not configure paid features or account backups. See `docs/RELEASE-CHECKLIST.md` for those remaining steps.

## Working safely

Run `git status` before committing. `docs/*.png` includes intentional mobile QA captures; commit them only when they represent the current app. Do not overwrite user-supplied source art. Keep `.env`, signing keys, tokens, and generated native/build directories out of Git. Any new reference-inspired educational content should be original and scientifically checked. The memory app should explain the real relationship first, then use humor to make that relationship stick.
