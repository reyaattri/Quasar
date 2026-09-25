// Interactive go-live helper. Run it yourself: `npm run setup:live`.
// It writes your public keys to .env and, if you choose, sends server secrets to Supabase
// through a temporary file that is deleted straight afterwards. Nothing is printed back.
import { createInterface } from "node:readline";
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
// While a secret is typed, only the prompt itself is ever drawn; typed characters never are.
let muted = false;
let prompt = "";
const write = rl._writeToOutput.bind(rl);
rl._writeToOutput = (s) => {
  if (!muted) return write(s);
  if (s.includes(prompt)) write(prompt);
};

const ask = (q, { secret = false, optional = false, check } = {}) =>
  new Promise((resolve) => {
    const go = () => {
      muted = secret;
      prompt = q;
      rl.question(q, (answer) => {
        muted = false;
        if (secret) process.stdout.write("\n");
        const v = answer.trim();
        if (!v && optional) return resolve("");
        const problem = check?.(v);
        if (!v || problem) {
          console.log(`  ${problem || "This one is required."}`);
          return go();
        }
        resolve(v);
      });
    };
    go();
  });

const run = (args) => {
  const r = spawnSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
  return r.status === 0;
};

console.log(`
Quasar go-live setup
--------------------
You'll need the values from docs/GO-LIVE.md. Keys you paste are hidden as you type.
`);

const supabaseUrl = await ask("Supabase project URL (https://xxxx.supabase.co): ", {
  check: (v) => (/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(v) ? "" : "It should look like https://abcd1234.supabase.co"),
});
const ref = supabaseUrl.replace(/^https:\/\//, "").split(".")[0];
const anon = await ask("Supabase anon (public) key: ", {
  secret: true,
  check: (v) => (v.length > 30 ? "" : "That looks too short for a Supabase key."),
});
const rcWeb = await ask("RevenueCat Web Billing public API key (rcb_…): ", {
  secret: true,
  check: (v) => (v.startsWith("rcb_") ? "" : "Web Billing public keys start with rcb_ (sandbox keys with rcb_sb_)."),
});

const base = existsSync(".env") ? readFileSync(".env", "utf8") : readFileSync(".env.example", "utf8");
const values = {
  EXPO_PUBLIC_SUPABASE_URL: supabaseUrl.replace(/\/$/, ""),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: anon,
  EXPO_PUBLIC_REVENUECAT_WEB_KEY: rcWeb,
};
let env = base;
for (const [k, v] of Object.entries(values)) {
  const line = `${k}=${v}`;
  env = new RegExp(`^${k}=.*$`, "m").test(env) ? env.replace(new RegExp(`^${k}=.*$`, "m"), line) : env.trimEnd() + "\n" + line + "\n";
}
writeFileSync(".env", env);
console.log("\n✓ Wrote .env (it is git-ignored).\n");

const serverNow = (await ask("Send the server secrets to Supabase now? (y/n): ")).toLowerCase().startsWith("y");
if (serverNow) {
  const anthropic = await ask("Anthropic API key (sk-ant-…): ", {
    secret: true,
    check: (v) => (v.startsWith("sk-ant-") ? "" : "Anthropic keys start with sk-ant-."),
  });
  const rcSecret = await ask("RevenueCat secret API key (sk_…): ", {
    secret: true,
    check: (v) => (v.startsWith("sk_") ? "" : "RevenueCat secret keys start with sk_."),
  });
  const replicate = await ask("Replicate token for story pictures (optional, Enter to skip): ", { secret: true, optional: true });
  const file = "supabase/.env.secrets.local";
  writeFileSync(
    file,
    [`ANTHROPIC_API_KEY=${anthropic}`, `REVENUECAT_SECRET_KEY=${rcSecret}`, replicate && `REPLICATE_API_TOKEN=${replicate}`]
      .filter(Boolean)
      .join("\n") + "\n",
  );
  try {
    const ok = run(["supabase", "secrets", "set", "--env-file", file, "--project-ref", ref]);
    console.log(ok ? "\n✓ Server secrets saved in Supabase.\n" : "\n✗ Supabase CLI failed. Run `npx supabase login` first, then try again.\n");
  } finally {
    rmSync(file, { force: true });
  }
}

console.log(`Next steps (see docs/GO-LIVE.md):
  npx supabase link --project-ref ${ref}
  npx supabase db push
  npx supabase functions deploy ai --project-ref ${ref}
  npx supabase functions deploy delete-account --project-ref ${ref}
Then restart the web server so it picks up .env.
`);
rl.close();
