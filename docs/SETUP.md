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
supabase functions deploy ai
supabase functions deploy delete-account
```

The delete function validates the current access token and confirmation value, then deletes the Supabase Auth user with the service role. Foreign-key cascades remove the learner's cloud rows. The app separately clears that account's device cache and signs RevenueCat back into its anonymous state. Verify this flow in a disposable test account before release.

## 3. RevenueCat

Create Android/iOS apps in RevenueCat, connect the corresponding store, and add real subscription products. Attach them to entitlement quasar_pro, create an offering and mark it current.

Set the public SDK key in EXPO_PUBLIC_REVENUECAT_ANDROID_KEY, EXPO_PUBLIC_REVENUECAT_IOS_KEY or, for the web build, EXPO_PUBLIC_REVENUECAT_WEB_KEY (a RevenueCat Billing key; sandbox keys start with rcb_sb_ and use Stripe test cards). On web the learner signs in before subscribing, and signing in replaces Restore purchases. Configure published privacy and terms URLs in the matching public environment variables before enabling purchase buttons. Products, prices and billing periods come from RevenueCat; the app does not hard-code a price.

On phones, create a development build for purchase tests; Expo Go can't make real purchases. On the web, RevenueCat Billing sandbox purchases are real RevenueCat transactions made with Stripe test cards. Use the store’s sandbox/license-test account. Verify the checklist in RELEASE-CHECKLIST.md.

## 4. AI features (Quasar Plus)

All AI features go through one Edge Function, `ai`. It verifies the Supabase session, checks the `quasar_pro` entitlement with RevenueCat on the server, validates the input, spends a per-feature daily quota, calls Claude through the official Anthropic SDK with structured JSON output, checks the answer and logs the request. The four tasks are the AI tutor, AI quizzes from notes, personalized stories and new memory hooks. Details and a diagram are in [AI-ARCHITECTURE.md](AI-ARCHITECTURE.md).

Apply `supabase/migrations/202609250001_ai_gateway.sql` after the initial migration. Server-only secrets:

- `ANTHROPIC_API_KEY` (required)
- `REVENUECAT_SECRET_KEY` (required; a V1 secret key)
- `REPLICATE_API_TOKEN` (optional, for story pictures)
- `AI_MODEL` (optional; defaults to `claude-opus-5`)

Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never put server credentials in `EXPO_PUBLIC_*` variables. `npm run setup:live` writes `.env` and sets these secrets without echoing them. The step-by-step path to a live sandbox purchase on the web is [GO-LIVE.md](GO-LIVE.md).

What the learner sends is treated as untrusted data. Profile fields go to Claude only when the learner presses *Make this story personal*; a Teach-Back explanation only on *Ask the AI tutor*; notes only on *Make an AI quiz*. The free quick quiz is built on the device by `src/lib/noteQuiz.ts`. Story pictures are stored privately with one-hour signed URLs.

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
