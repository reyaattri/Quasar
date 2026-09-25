# Go live: Quasar Plus with a real sandbox purchase on the web

This takes about 45 minutes the first time. You'll finish with:
- a Stripe test-mode purchase through RevenueCat, made in the app's web preview;
- the `quasar_pro` entitlement granted to your account;
- the AI tutor, AI quizzes, personalized stories and new memory hooks all working.

No real money moves.

You create the accounts and paste the keys yourself; nobody else should see them. Keys go into `npm run setup:live`, which hides them as you type.

## 1. Supabase (you already have an account)

1. Create a project (or use an existing one). Note the **Project URL** and the **anon public key** under *Project Settings → API*.
2. In *SQL Editor*, run these three files in order, pasting each one and pressing Run:
   - `supabase/migrations/202609100001_initial.sql`, skipped if this project already has Quasar's tables;
   - `supabase/migrations/202609250001_ai_gateway.sql`;
   - `supabase/seed.sql`.
3. *Authentication → Sign In / Providers → Email*: for the demo, turn off **Confirm email** so a new account can sign in straight away.
4. In the Quasar folder, run:
   ```bash
   npx supabase login
   ```
   It opens your browser to approve the CLI.

## 2. Anthropic (Claude)

1. Sign in at console.anthropic.com.
2. Under *Billing*, add a little credit; $5 covers a lot of testing.
3. Under *API Keys*, create a key named "Quasar". Copy it; it starts with `sk-ant-`.

## 3. Stripe (test mode only)

Create a free account at stripe.com. You don't need to activate payments; RevenueCat's sandbox uses Stripe **test mode**.

## 4. RevenueCat

1. Create a free account and a project called **Quasar**.
2. *Apps & providers → Add → Web → RevenueCat Billing*. Connect your Stripe account when asked.
3. In that web app, create a **product**: for example identifier `quasar_plus_monthly`, a monthly subscription at $4.99.
4. *Product catalog → Entitlements → New*: identifier **`quasar_pro`** (exactly this). Attach the product.
5. *Product catalog → Offerings → New*: identifier `default`. Add a **Monthly** package containing the product, and make this offering **Current**.
6. *API keys*:
   - Copy the RevenueCat Billing **sandbox public key**; it starts with `rcb_sb_`.
   - Create a **secret API key**; it starts with `sk_`. If asked for an API version, choose **V1**, because the server calls the v1 subscribers endpoint.

## 5. Connect everything

In the Quasar folder:

```bash
npm run setup:live
```

Paste the values when asked. The script writes `.env` (git-ignored) and, if you say yes, stores the server secrets in Supabase. Then deploy the functions, replacing `YOUR_REF` with the part of your project URL before `.supabase.co`:

```bash
npx supabase functions deploy ai --project-ref YOUR_REF
```

```bash
npx supabase functions deploy delete-account --project-ref YOUR_REF
```

If the CLI complains about Docker, add `--use-api` to each deploy command.

Restart the web server so it reads `.env`.

## 6. Try it

1. Open the app. In *Settings*, create an account.
2. Go to *Explore Quasar Plus*. You should see your RevenueCat offering with its price.
3. Tap it. A Stripe checkout opens. Pay with test card **4242 4242 4242 4242**, any future expiry date and any CVC.
4. The app says *Quasar Plus is active*. Now try:
   - **Teach-Back:** check an explanation, then *Ask the AI tutor for feedback*.
   - **Explore → Notes → Quiz:** paste notes, then *Make an AI quiz*.
   - **Review:** on an Error Memory card, *Write me a new memory hook*. You need to miss a biology question twice first.
   - **SAT deck:** open a word, then *Make this story personal*.
5. In Supabase, the table `ai_requests` shows each call with its model and token counts. `npx supabase functions logs ai --project-ref YOUR_REF` shows server logs.

## If something doesn't work

| What you see | Likely cause |
| --- | --- |
| "Purchases open once Plus is connected" | `EXPO_PUBLIC_REVENUECAT_WEB_KEY` missing from `.env`, or the server wasn't restarted |
| "No subscription offers are available" | The `default` offering isn't marked Current, or has no package |
| Purchase succeeds but features stay locked | The entitlement isn't named exactly `quasar_pro`, or the product isn't attached to it |
| "This needs an active Quasar Plus subscription" from an AI feature | The server can't see the entitlement: check `REVENUECAT_SECRET_KEY` (a V1 secret key) |
| "The AI is unavailable right now" | `ANTHROPIC_API_KEY` missing or without credit; check the function logs |
