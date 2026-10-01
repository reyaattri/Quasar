// Expo's web export hard-codes root-absolute asset paths, which break on a GitHub Pages
// project site served from /Quasar/ instead of /. Rewrite them after export, before deploy.
const fs = require("fs");
const path = require("path");
const BASE = "/Quasar";

function walk(dir, out) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|js|json)$/.test(f)) out.push(p);
  }
  return out;
}

const files = walk("dist", []);
let changed = 0;
for (const f of files) {
  let text = fs.readFileSync(f, "utf8");
  const before = text;
  text = text.replace(/(["'(=])\/(_expo\/|assets\/|favicon\.ico)/g, (m, pre, rest) => pre + BASE + "/" + rest);
  if (text !== before) {
    fs.writeFileSync(f, text);
    changed++;
  }
}
console.log("Rewrote " + changed + " of " + files.length + " files");
