# Release checklist

## Verified locally

- [x] React Native / Expo source compiles with TypeScript.
- [x] Browser bundle exports.
- [x] Six lesson onboarding, both six-cue scenes, recall and application work.
- [x] Missed recall schedules an earlier review; state survives reload.
- [x] Storybook and Doodle selectors work; default computing artwork is the user’s exact file.
- [x] Database migration and seed execute in local PostgreSQL-compatible PGlite.
- [x] RLS prevents cross-account reads/writes; public curriculum is read-only; generation quota is enforced.
- [x] Account deletion UI and authenticated deletion function are included.
- [x] Public privacy, terms, and support pages are included in the web export.
- [x] Android native project generation succeeds.

## Required before a production claim

- [ ] Create and configure Expo/EAS project and final package identifiers.
- [ ] Deploy Supabase schema and confirm real email signup, login, logout, and backup on two devices.
- [ ] Configure RevenueCat store products, current offering and quasar_pro entitlement.
- [ ] Deploy and test the delete-account Edge Function with a disposable account.
- [ ] Make the GitHub repository public for the Next Gen submission path.
- [ ] Publish privacy and terms pages; enter their URLs in app configuration.
- [ ] Build and install on Android/iOS; inspect safe areas, keyboard, back button and accessibility.
- [ ] Complete an actual sandbox purchase and verify active entitlement from CustomerInfo.
- [ ] Cancel a purchase; verify no entitlement is granted.
- [ ] Restore a prior purchase after reinstall/sign-in.
- [ ] Test subscription expiry/revocation and foreground entitlement refresh.
- [ ] Test offline launch and network failure during offers/purchase/restore.
- [ ] Confirm paid server generation rejects unauthenticated and unsubscribed requests.
- [ ] Verify Claude and Replicate live outputs for accuracy and character consistency.
- [ ] Review public repository contents and third-party dependency licenses.
- [ ] Confirm current competition rules and academic-email eligibility with the organizer.
- [ ] Record/review a demo of at most two minutes, then submit through the owner’s account.

No sandbox transaction, academic-email verification, store release or competition submission is asserted complete without evidence.
