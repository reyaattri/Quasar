# Quasar

**Learn through pictures. Remember through practice.**

[Public demo](https://quasar-memory-garden.reyaattri4.chatgpt.site/) · [Setup](docs/SETUP.md) · [Release checklist](docs/RELEASE-CHECKLIST.md)

Quasar is a memory-learning app made with Expo and React Native. It pairs illustrated stories and memory techniques with practice that gradually removes the hints. The goal is to help learners recall an idea, explain it and use it in a new situation.

## What you can try

- **Memory toolkit:** guided examples of memory palaces, number pegs, the Major System and other ways to make information easier to recall.
- **Courses:** vocabulary, biology, calculus and Korean, with illustrations, questions and interactive activities.
- **Cell City:** a six-episode biology story with an explorable map, characters and evidence challenges.
- **Today’s session:** a short plan based on due reviews and learning progress.
- **Teach-Back, Why Ladder and Case Lab:** opportunities to explain and apply what you learned.
- **Notes Quiz:** turn your own notes into practice questions.
- **Memory Garden:** plants grow as you recall and explain concepts. Its flower guide previews growth without changing your results.

Guest learning works without an account. Progress is stored on the device. Optional connected services provide accounts, backups and personalized AI features.

## RevenueCat and Quasar Plus

The app integrates RevenueCat for offerings, purchase and restore flows, and the `quasar_pro` entitlement. Plus provides personalized mnemonic stories and AI learning tools. Server-side AI requests verify entitlement; the client does not grant access by itself.

The purchase interface shows unavailable states when billing is not configured. **A successful purchase and restore have not been verified for this release.** Integration code is not evidence of a completed transaction. See [Go live](docs/GO-LIVE.md) for configuration and sandbox testing.

## Run the source

Use Node.js 22 or newer.

```bash
git clone https://github.com/reyaattri/Quasar.git
cd Quasar
npm ci
npm run web
```

For native development, use the Expo Android/iOS toolchains and `npm run android` or `npm run ios`. Copy `.env.example` to `.env` only if you want to configure connected services. Do not commit private keys. Core lessons and bundled artwork do not require service credentials.

```bash
npm run typecheck
npm test
npm run export:web
```

The current unit suite has 35 tests covering scheduling, curriculum, quizzes, learning progress, database isolation and release surfaces. Browser tests are available with `npm run test:e2e`; they are separate from the unit suite and require their test environment.

## Shipaton 2026 · Next Gen

Prepared for the student category. The public demo is a preview; it may lag behind the latest source. This repository should be the reproducible handoff, including assets, setup instructions and the MIT license.

Before submitting:

- Publish the latest commits and verify that the repository is public and its license is visible.
- Record the current app functioning on its intended platform; upload a public demo video under two minutes.
- Provide a 1024×1024 icon and an unframed 1179×2556 app screenshot.
- Verify a RevenueCat-powered purchase or the applicable monetization requirement.
- Complete Devpost eligibility, academic-email verification and guardian consent if applicable.

Next Gen does not require a store release. The official deadline is September 30, 2026 at 11:45 p.m. PDT. Submission and eligibility are not completed by this README. [Official rules](https://revenuecat-shipaton-2026.devpost.com/rules) · [Next Gen](https://www.shipaton.com/next-gen)

## Project map

| Folder | Contents |
| --- | --- |
| `App.tsx` | Navigation, onboarding, accounts and purchase screens |
| `src/features` | Courses and practice activities |
| `src/components` | Shared interface and artwork components |
| `src/data` | Lesson content and mnemonic examples |
| `src/lib` | Scheduling, progress, planning and service connections |
| `assets` | Bundled illustrations, fonts, audio and icons |
| `supabase` | Database migrations and server functions |
| `public` | Privacy, terms and support pages |
| `docs` | Setup, design notes, artwork provenance and release guides |

## Privacy and content

Guest progress stays local. Cloud backup is an explicit action. Analytics are optional. AI features send the relevant input only when requested; the local quick-quiz path does not need AI. Account deletion is implemented but requires the connected backend to be deployed and tested.

Biology content is educational. SAT practice is original and is not an official College Board question bank. Generated artwork and third-party media are documented in [artwork notes](docs/ARTWORK.md) and `assets/korean/credits.json`.

## License

Source code is licensed under [MIT](LICENSE). Third-party media retain their own licenses and attribution. See [setup](docs/SETUP.md), [AI architecture](docs/AI-ARCHITECTURE.md) and [release checklist](docs/RELEASE-CHECKLIST.md) for the full handoff.
