const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("release surfaces include legal, support, and account deletion flows", () => {
  for (const page of ["privacy", "terms", "support"]) {
    const html = fs.readFileSync(`public/${page}.html`, "utf8");
    assert.match(html, /<meta name="viewport"/);
    assert.match(html, /Quasar/i);
  }
  const app = fs.readFileSync("App.tsx", "utf8");
  assert.match(app, /Delete account and cloud data/);
  assert.match(app, /Permanently delete account/);
  const deletion = fs.readFileSync("supabase/functions/delete-account/index.ts", "utf8");
  assert.match(deletion, /auth\.admin\.deleteUser/);
  assert.match(deletion, /confirmation !== "DELETE"/);
});
