# Connect Quasar

## 1. Local and Android

Install dependencies with npm ci. The learning app needs no secrets.

For Android, install Android Studio’s SDK, platform tools and an emulator image. Open Device Manager and start a phone. Set ANDROID_HOME to the installed SDK and JAVA_HOME to Android Studio’s JBR. Run npm run android from the project folder. Open the generated android/ directory in Android Studio if you prefer its build tools.

For a shared APK, use npx eas-cli login, npx eas-cli init, then npx eas-cli build --platform android --profile preview. These steps require your Expo account. Choose your final application identifier before configuring store products. The current development identifier is com.reyaattri.quasar.

The existing machine has Android Studio and a Medium_Phone AVD, but this build session could not read or execute the installed SDK due to operating-system access errors. Native prebuild succeeded; emulator installation was not verified.

## 2. Supabase

Create a project. Copy .env.example to .env and fill only EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY with public client credentials.

Apply supabase/migrations/202609100001_initial.sql and supabase/seed.sql in the SQL editor, or link the Supabase CLI and run migrations/seeding. Enable email/password Auth and configure confirmation email delivery. The schema references Supabase-managed auth.users and storage tables.

The app saves guest and signed-in profiles under separate local keys. A new account initially adopts the current guest study state if it has no local or cloud state. Existing account state is loaded on sign-in. Cloud backups are explicitly initiated in Settings; this MVP does not attempt multi-device concurrent merging. Signing out restores the guest profile.

Deploy the authenticated Edge Functions before testing connected accounts:

```sh
supabase functions deploy generate-mnemonic
supabase functions deploy delete-account
supabase functions deploy grade-explanation
supabase functions deploy generate-quiz
```

The delete function validates the current access token and confirmation value, then deletes the Supabase Auth user with the service role. Foreign-key cascades remove the learner's cloud rows. The app separately clears that account's device cache and signs RevenueCat back into its anonymous state. Verify this flow in a disposable test account before release.

## 3. RevenueCat

Create Android/iOS apps in RevenueCat, connect the corresponding store, and add real subscription products. Attach them to entitlement quasar_pro, create an offering and mark it current.

Set the public platform SDK key in EXPO_PUBLIC_REVENUECAT_ANDROID_KEY or EXPO_PUBLIC_REVENUECAT_IOS_KEY. Configure published privacy and terms URLs in the matching public environment variables before enabling purchase buttons. Products, prices and billing periods come from RevenueCat; the app does not hard-code a price.

Create a development build for actual purchase tests. Web and Expo Go do not count as real sandbox purchase verification. Use the store’s sandbox/license-test account. Verify the checklist in RELEASE-CHECKLIST.md.

## 4. Personalized generation

Deploy the generate-mnemonic Supabase Edge Function. Set server-only secrets: ANTHROPIC_API_KEY, optionally ANTHROPIC_MODEL, REVENUECAT_SECRET_KEY, and optionally REPLICATE_API_TOKEN. Supabase supplies SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

The function validates the Supabase JWT, retrieves the fact from the trusted curriculum, checks quasar_pro against RevenueCat using the Supabase user ID, and atomically limits requests to 10 per UTC database date. RevenueCat login is linked to that same user ID in the native app. Client-provided entitlement flags are never trusted.

The profile fields are sent to Claude only when the learner presses Make this story personal. The app should explain this in the published privacy policy. Flux.2 generation is optional; story generation still works if no Replicate token is configured. A prediction that does not complete during the synchronous wait produces a story-only result. Failed requests consume quota to avoid repeated upstream abuse.

Generated images are saved into a private user-specific Storage path with one-hour signed URLs. Server credentials must never be placed in EXPO_PUBLIC variables.

### AI tutor feedback (Teach-Back)

`grade-explanation` gives Quasar Plus members feedback on a written Teach-Back explanation. It uses the same secrets as `generate-mnemonic` (`ANTHROPIC_API_KEY`, `REVENUECAT_SECRET_KEY`) and shares its 10-requests-per-day quota. It calls Claude through the official Anthropic SDK with structured JSON output, and defaults to `claude-opus-5` with Anthropic's server-side refusal fallback turned on. Set the optional `GRADER_MODEL` secret to use a different model.

Like the story generator, it validates the Supabase session and checks the `quasar_pro` entitlement against RevenueCat on the server. The explanation is treated as untrusted data, and the response is size-checked before it's returned. The app only shows the tutor button to a signed-in Plus member. The on-device key-idea check still decides what counts as mastered; AI feedback is advice, not a grade.

### AI quizzes from notes

`generate-quiz` turns a Plus member's pasted notes (up to 40,000 characters) or a PDF (up to 5 MB) into 8–12 multiple-choice questions. It uses the same secrets, entitlement check and daily quota as the other functions, and defaults to `claude-opus-5` (override with the `QUIZ_MODEL` secret) with structured JSON output. Every question has to carry a supporting quote. For pasted text, the server drops any question whose quote isn't actually in the notes. Quotes from a PDF can't be verified this way, so treat PDF quizzes with a little more care.

The free quick quiz needs none of this: `src/lib/noteQuiz.ts` builds it on the device from "Term: definition" lines and key sentences.

## 5. Analytics

Set EXPO_PUBLIC_POSTHOG_KEY and optionally EXPO_PUBLIC_POSTHOG_HOST. Analytics is opt-in in Settings. Only scene IDs, fact IDs and correctness are captured; names, hometowns, interests and application text are excluded.

## Official integration references

- [Expo native builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [RevenueCat with Expo](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [Supabase React Native auth](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)
- [Claude Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages)
- [Flux.2 on Replicate](https://replicate.com/black-forest-labs/flux-2-pro/api)

## Android preview without an Expo account

The Android preview APK GitHub Actions workflow generates the native project and bundles a standalone release-mode APK using the generated development signing key. Download quasar-android-preview from the workflow artifacts after it succeeds. This is an installable test artifact, not a production-signed Play Store release. No store submission is performed.
