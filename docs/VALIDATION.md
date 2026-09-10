# September 10 learning-world update

TypeScript and ten logic/database checks pass. Seven browser tests pass at phone sizes, covering onboarding, both legacy scenes, recall, application, both SAT five-word batches, context gating, reload persistence, palace movement, wrong answers, full-route recall and music controls. Audio controls were exercised in a browser; native audio remains unverified.

# Validation record — September 10, 2026

Passed:

- TypeScript strict typecheck.
- Expo web production bundle export.
- Ten automated logic/database tests, including pi ordering and custom-list validation: curriculum consistency; FSRS failure timing; lapses; date revival; calendar-day streaks; application vocabulary hints; immutable profile updates; schema, seed, RLS and quota enforcement in PGlite.
- Seven Chrome end-to-end tests: onboarding, legacy scenes, FSRS review, SAT five-word batches and context gates, palace movement, wrong and right answers, full-route recall, music controls, reload persistence and phone overflow.
- Native Android project generation with Expo prebuild.

Screenshots: home-mobile.png, scene-mobile.png, computing-mobile.png, mnemonic-mobile.png.

The browser tests exercise the React Native Web build of the same app. They do not substitute for testing an installed Android or iOS binary.

No live Supabase project, RevenueCat store products or generation API credentials were supplied. Those integrations are implemented but live sign-in, purchases, restoration, subscription expiry and model calls remain unverified.

Dependency audit: 10 moderate findings, no high or critical findings, all through Expo’s xcode/uuid build-tool dependency chain. npm’s proposed major downgrade to Expo 46 is incompatible with this SDK and was not applied. Recheck upstream fixes before release.

The exact approved computing file is copied unchanged into assets/cs-storybook.png. Educational text accompanies symbolic artwork: the binary-search picture is a mnemonic, not a literal execution trace or numbered sorted array.

Android debug compilation was attempted twice. It stops in the Gradle generated-class compiler with java.nio.file.AccessDeniedException while closing javax.inject-1.jar inside the writable Gradle cache. The installed SDK also returns access denied. No APK or emulator run is claimed.

Latest validation adds custom eight-item lists, medical recall, continuous/guided movement, full-screen palace view and explicit image-loading checks. Final screenshots were visually inspected; atlas rendering uses explicit stretch sizing to avoid blank clipped panels on web. GitHub synchronization is pending authorization from automatic approval review; native workflows are prepared locally, not claimed as run.
