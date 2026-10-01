const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { PGlite } = require("@electric-sql/pglite");
test("database schema seeds and row-level security isolates accounts", async () => {
  const db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid,bucket_id text,name text);alter table storage.objects enable row level security;create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name,'/') $$;grant usage on schema public,auth to anon,authenticated,service_role;`,
  );
  await db.exec(
    fs.readFileSync("supabase/migrations/202609100001_initial.sql", "utf8"),
  );
  await db.exec(fs.readFileSync("supabase/seed.sql", "utf8"));
  assert.equal(
    (await db.query("select count(*)::int as n from facts")).rows[0].n,
    10,
  );
  const alice = "11111111-1111-4111-8111-111111111111",
    bob = "22222222-2222-4222-8222-222222222222";
  await db.exec(
    `insert into auth.users values ('${alice}'),('${bob}');set role authenticated;set request.jwt.claim.sub='${alice}';`,
  );
  await db.query("insert into learning_states(user_id,state) values($1,$2)", [
    alice,
    { version: 1 },
  ]);
  await assert.rejects(() =>
    db.query("insert into learning_states(user_id,state) values($1,$2)", [
      bob,
      { version: 1 },
    ]),
  );
  await db.exec(`set request.jwt.claim.sub='${bob}';`);
  assert.equal(
    (await db.query("select * from learning_states")).rows.length,
    0,
  );
  await db.exec("set role anon");
  assert.equal((await db.query("select * from scenes")).rows.length, 1);
  await assert.rejects(() =>
    db.exec("insert into facts values ('bad','bad','bad',0)"),
  );
  await assert.rejects(() =>
    db.query("select consume_generation_quota($1)", [alice]),
  );
  await db.exec("reset role");
  for (let i = 0; i < 10; i++)
    assert.equal(
      (await db.query("select consume_generation_quota($1) as ok", [alice]))
        .rows[0].ok,
      true,
    );
  assert.equal(
    (await db.query("select consume_generation_quota($1) as ok", [alice]))
      .rows[0].ok,
    false,
  );

  // AI gateway: per-task quotas, service-role only, and a request log readable only by its owner.
  await db.exec(
    fs.readFileSync("supabase/migrations/202609250001_ai_gateway.sql", "utf8"),
  );
  const quota = async (uid, task) =>
    (await db.query("select consume_ai_quota($1,$2) as ok", [uid, task])).rows[0].ok;
  for (let i = 0; i < 5; i++) assert.equal(await quota(alice, "quiz"), true);
  assert.equal(await quota(alice, "quiz"), false, "quiz stops at 5 a day");
  assert.equal(await quota(alice, "tutor"), true, "limits are per task");
  assert.equal(await quota(bob, "quiz"), true, "limits are per learner");
  assert.equal(await quota(alice, "unknown"), false, "unknown tasks get nothing");
  await db.query(
    "insert into ai_requests(user_id,task,model,status,input_tokens,output_tokens) values($1,'quiz','claude-opus-5','ok',900,700),($2,'tutor','claude-opus-5','ok',300,200)",
    [alice, bob],
  );
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${alice}';`);
  assert.equal((await db.query("select * from ai_requests")).rows.length, 1);
  assert.equal((await db.query("select * from ai_usage")).rows.length, 2);
  await assert.rejects(() => db.query("select consume_ai_quota($1,'quiz')", [alice]));
  await assert.rejects(() =>
    db.query("insert into ai_requests(user_id,task,status) values($1,'quiz','ok')", [alice]),
  );
  await db.exec("reset role");
  await db.close();
});
