const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { spawnSync } = require("node:child_process");
const out = path.resolve(".test-build");
for (const rel of [
  "src/data/content.ts",
  "src/data/palaces.ts",
  "src/data/palaceRooms.ts",
  "src/data/landmarkPegs.ts",
  "src/data/worldCues.ts",
  "src/data/piCourse.ts",
  "src/lib/shoppingPalace.ts",
  "src/lib/progress.ts",
  "src/data/medicalLessons.ts",
  "src/data/lessonCoaching.ts",
  "src/data/biologyUnderstanding.ts",
  "src/lib/learning.ts",
  "src/lib/planner.ts",
  "tests/progress.test.ts",
  "tests/learning.test.ts",
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
    path.join(out, "tests/learning.test.js"),
    "tests/database.test.cjs",
    "tests/release.test.cjs",
  ],
  { stdio: "inherit" },
);
process.exitCode = r.status ?? 1;
