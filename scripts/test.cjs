const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { spawnSync } = require("node:child_process");
const out = path.resolve(".test-build");
for (const rel of [
  "src/data/content.ts",
  "src/data/palaces.ts",
  "src/lib/shoppingPalace.ts",
  "src/lib/progress.ts",
  "tests/progress.test.ts",
]) {
  const target = path.join(out, rel.replace(/\.ts$/, ".js"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(
    target,
    ts.transpileModule(fs.readFileSync(rel, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
  );
}
const r = spawnSync(
  process.execPath,
  [
    "--test",
    path.join(out, "tests/progress.test.js"),
    "tests/database.test.cjs",
  ],
  { stdio: "inherit" },
);
process.exitCode = r.status ?? 1;
