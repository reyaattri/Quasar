# Quasar

An Expo / React Native mnemonic learning app. Learn a technique, explore an illustrated scene, recall the idea, and apply it in context.

## Run locally

Requires Node 22+ and npm.

```sh
npm ci
npm run web             # browser preview
npm start               # Metro for a native development client
npm run android         # generates/builds Android and installs on an emulator
```

The learning experience works without API keys. Data stays on the device until you sign in and choose **Back up progress**. No fake purchases or invented progress are used.

## Included

- Subject selection, six optional personalization questions, six original technique lessons.
- One illustrated SAT hotspot scene plus focused vocabulary, memory-world and medical activities.
- Storybook and Doodle styles for the SAT scene, with varied watercolor, ink, pixel and vector artwork elsewhere.
- Mnemonic details with focused cue imagery, three-option recall, current mastery, and per-scene written application reflections.
- Ten SAT flashcards, genuine ts-fsrs scheduling, persistence, due reviews, streaks and accuracy.
- Ten original ink-cartoon SAT vocabulary cards with sound/meaning hooks in two five-word batches, each followed by an original digital-SAT-style context question. These are not official 2026 exam questions.
- Three illustrated memory worlds: Japanese dojo, Egyptian ruins and neon rooftops. Each full-world map has six enterable rooms with its own fixed landmarks, supplied mnemonic cue, walking controls, hidden recall and saved progress.
- Personal shopping-palace builder for up to eight items, with individual action cues and ordered recall.
- A three-concept medical foundation lesson plus a rotatable 3D studio, a sourced nine-label heart model and compatible-device room-placement entry.
- User-supplied pixel START/BACK/NEXT button artwork with press animations.
- Pi uses the major system to encode 12 decimal digits as six consonant-sound objects. The guided pair path teaches room → landmark → action → object → digits before ordered recall.
- Fun & Flex includes interactive card-order, names-and-faces, linked-pair and fictional-passphrase practice. Card practice supports 6, 12 or all 52 cards.
- Original optional music, reduced-motion support, animated character artwork and openly licensed Space Grotesk typography. Memory lessons also appear on the home screen.
- Named guide lore and computer-science curriculum have been removed. Math and Chemistry remain future curriculum.
- Supabase email/password auth integration, private account backups, RLS-protected schema, curriculum seed and private image storage.
- RevenueCat native SDK offerings, purchases, restore, entitlement checks and subscription management. Missing configuration disables payment rather than simulating success.
- Optional PostHog events, disabled by default; no profile fields or written answers in analytics.
- Supabase Edge Function for Claude-generated personalized mnemonics and optional Flux.2 illustrations through Replicate. Server verifies RevenueCat entitlement and enforces a daily quota.

## What is not yet account-verified

No Expo, Supabase, RevenueCat, Apple, Google Play, Claude or Replicate project credentials were provided. Therefore live account sync, generation, and real sandbox purchases still require deployment/configuration and device testing. See [setup](docs/SETUP.md) and [release checklist](docs/RELEASE-CHECKLIST.md). Academic eligibility and competition submission are owner actions; nothing has been submitted.

The app contains a focused SAT vocabulary MVP, **not** a complete SAT exam preparation curriculum. Application answers are self-assessed against examples, not inaccurately advertised as AI-graded.

## Checks

```sh
npm run typecheck
npm test
npm run test:e2e       # Chrome required locally; starts/reuses Metro
npm run export:web
npm run seed:sql
```

[Validation record](docs/VALIDATION.md) identifies exactly what was tested and what still needs real accounts/device access.

## Project map

- `App.tsx` — mobile shell, navigation, onboarding, screens, learning flow.
- `src/components/Scene.tsx` — reusable scene and focused fact illustration.
- `src/components/RoomInterior.tsx` — distinct room interiors for all three worlds.
- `src/features/FunFlex.tsx` — cards, faces, pairs and story-chain recall games.
- `src/data/content.ts` — reviewed local curriculum; `art.ts` maps bundled styles.
- `src/lib/progress.ts` — FSRS scheduling, mastery, streaks, serialization.
- `src/lib/services.ts` — persistence, Supabase, RevenueCat, PostHog integrations.
- `supabase/` — migration, seed, authenticated generation function.
- `tests/` — learning logic and end-to-end mobile viewport coverage.

[Design decisions](docs/DESIGN.md) · [Artwork provenance](docs/ARTWORK.md) · [Demo script](docs/DEMO.md)

## Repository and secrets

The intended repository is `reyaattri/quasar`. A local Git repository is initialized. Never commit `.env`, service-role keys, RevenueCat secret keys, signing keys, or account credentials. Native directories are generated from Expo configuration; `npx expo prebuild --platform android` recreates the Android Studio project.
