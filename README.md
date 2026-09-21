![Quasar animated wordmark](docs/readme-wordmark.svg)

**See it live:** [quasar-memory-garden.reyaattri4.chatgpt.site](https://quasar-memory-garden.reyaattri4.chatgpt.site/)

Quasar is an illustrated memory-learning app built with Expo and React Native. Learners turn an idea into a distinct scene, recall it without the picture, and use it in a question or activity. The web link is a playable preview of the same app source used for Android and iOS.

## Try it

Open the public link and choose a starting subject. The guided Memory Toolkit introduces six named techniques with an example and a recall turn. Explore also includes SAT vocabulary, three enterable memory worlds, biology, calculus, Korean, Pi, and short memory games. Progress is saved locally on the device or browser.

![Quasar mobile welcome](docs/welcome-refreshed-mobile.png)

## Run the whole app locally

Use Node 22 or newer and npm. Every bundled illustration, audio file, font, lesson, and test is in this repository; no account key is needed for the local learning experience.

```sh
git clone https://github.com/reyaattri/Quasar.git
cd Quasar
npm ci
npm run web
```

For a native development build, run `npm start` or `npm run android` after installing the appropriate Expo/Android toolchain. Expo generates the native `android/` and `ios/` directories; they are intentionally ignored by Git.

## Verify a change

```sh
npm run typecheck
npm test
npm run test:e2e
npm run export:web
```

The browser tests use Chrome and start or reuse a Metro server on port 8081. `EXPO_NO_TELEMETRY=1` avoids Expo writing telemetry settings outside restricted workspaces. The web export is written to ignored `dist/`.

## Project map

| Path | Purpose |
| --- | --- |
| `App.tsx` | Navigation, onboarding, shared shell, and screen composition |
| `src/components/` | Reusable illustrations, world rooms, the Quasar mark, and interface elements |
| `src/features/` | SAT, toolkit, memory palace, biology, calculus, Korean, Pi, and games |
| `src/data/` | Lesson text, cues, rooms, and artwork mappings |
| `src/lib/` | Local progress, scheduling, and optional service integrations |
| `assets/` | Bundled original and user-provided art, music, fonts, and app icon |
| `supabase/` | Optional account backup and personalized-generation backend |
| `tests/` | Data and mobile-viewport browser tests |
| `.openai/hosting.json` | Existing Sites project configuration for the web preview |

The full development handoff is in [CLAUDE.md](CLAUDE.md), with account setup in [docs/SETUP.md](docs/SETUP.md), art provenance in [docs/ARTWORK.md](docs/ARTWORK.md), and validation notes in [docs/VALIDATION.md](docs/VALIDATION.md).

## Optional connected features

The core lessons work offline after loading. Supabase sign-in and backups, RevenueCat purchases, and server-generated personalized mnemonics need credentials and account configuration. Their absence does not turn on fake purchases or fabricate cloud sync. See [setup](docs/SETUP.md) and the [release checklist](docs/RELEASE-CHECKLIST.md) before a store release.

Artwork and learning copy are bundled for this project. SAT context practice is original and is not an official College Board question bank. Biology and medical activities are educational, not clinical guidance.
