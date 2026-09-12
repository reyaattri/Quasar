const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (m, f) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(f, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    f,
  );
const { allFacts, scenes, lessons } = require("../src/data/content.ts");
const q = (v) => "'" + v.replaceAll("'", "''") + "'";
let sql =
  "-- Generated curriculum. Run npm run seed:sql after content changes.\n";
sql +=
  "insert into subjects(id,name,is_available) values ('sat','SAT vocabulary',true),('medical','Medical foundations',true),('math','Math',false),('chem','Chemistry',false) on conflict(id) do nothing;\n";
const insert = (table, cols, values) => {
  sql +=
    "insert into " +
    table +
    "(" +
    cols +
    ") values (" +
    values.map((v) => (typeof v === "number" ? v : q(v))).join(",") +
    ") on conflict(id) do nothing;\n";
};
for (const s of scenes)
  insert("scenes", "id,subject_id,title", [
    s.id,
    s.id === "market" ? "sat" : "cs",
    s.title,
  ]);
for (const [i, f] of allFacts.entries()) {
  insert("facts", "id,topic_id,fact_text,order_index", [
    f.id,
    f.sceneId,
    f.word + ": " + f.definition,
    i,
  ]);
  insert("mnemonics", "id,fact_id,technique_type,style,story_text", [
    f.id,
    f.id,
    f.technique,
    "storybook",
    f.story,
  ]);
}
for (const s of scenes)
  for (const f of s.facts)
    insert(
      "scene_hotspots",
      "id,scene_id,x_position,y_position,fact_id,mnemonic_id,label",
      [f.id, s.id, f.x, f.y, f.id, f.id, f.cue],
    );
for (const [i, l] of lessons.entries())
  insert(
    "technique_lessons",
    "id,title,technique_type,explanation_text,order_index",
    [i + 1, l.title, l.type, l.body + " " + l.example, i],
  );
fs.writeFileSync("supabase/seed.sql", sql);
console.log(`Seed written: ${allFacts.length} facts, ${scenes.length} scenes, ${lessons.length} lessons.`);
