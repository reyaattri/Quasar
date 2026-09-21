const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("@playwright/test");

async function main() {
  const root = path.resolve(__dirname, "..");
  const svg = fs.readFileSync(path.join(root, "assets", "icon.svg"), "utf8");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await page.locator("svg").screenshot({ path: path.join(root, "assets", "icon.png") });
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
