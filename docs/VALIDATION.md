# Validation record — September 10, 2026

Passed:
- TypeScript strict typecheck.
- Expo web production bundle export.
- Eight automated logic/database tests: curriculum consistency; FSRS failure timing; lapses; date revival; calendar-day streaks; application vocabulary hints; immutable profile updates; schema, seed, RLS and quota enforcement in PGlite.
- Three Chrome end-to-end tests at 390×844 / 360×800: onboarding, all SAT cues, computing cues, failure feedback, written applications, reload persistence, style selection, card review, disabled unconfigured purchase UI, Pi recall, horizontal overflow.
- Native Android project generation with Expo prebuild.

Screenshots: home-mobile.png, scene-mobile.png, computing-mobile.png, mnemonic-mobile.png.

The browser tests exercise the React Native Web build of the same app. They do not substitute for testing an installed Android or iOS binary.

No live Supabase project, RevenueCat store products or generation API credentials were supplied. Those integrations are implemented but live sign-in, purchases, restoration, subscription expiry and model calls remain unverified.

Dependency audit: 10 moderate findings, no high or critical findings, all through Expo’s xcode/uuid build-tool dependency chain. npm’s proposed major downgrade to Expo 46 is incompatible with this SDK and was not applied. Recheck upstream fixes before release.

The exact approved computing file is copied unchanged into assets/cs-storybook.png. Educational text accompanies symbolic artwork: the binary-search picture is a mnemonic, not a literal execution trace or numbered sorted array.

Android debug compilation was attempted twice. It stops in the Gradle generated-class compiler with java.nio.file.AccessDeniedException while closing javax.inject-1.jar inside the writable Gradle cache. The installed SDK also returns access denied. No APK or emulator run is claimed.
