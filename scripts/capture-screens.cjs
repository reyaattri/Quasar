// Captures phone-sized README screenshots of the learning loop.
// Run with Metro serving the web build on port 8081: node scripts/capture-screens.cjs
const { chromium } = require("@playwright/test");

const KEY = "quasar.progress.v1";
const out = (name) => `docs/${name}.png`;

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const settle = (ms = 1800) => page.waitForTimeout(ms);
  const button = (name) => page.getByRole("button", { name, exact: true });

  await page.goto("http://localhost:8081");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await settle(4000);
  await page.screenshot({ path: out("landing-worlds-mobile") });

  await page.evaluate((key) => {
    const p = JSON.parse(localStorage.getItem(key));
    const t = Date.now() - 3600_000;
    const at = (s) => new Date(t + s * 1000).toISOString();
    p.onboarded = true;
    p.profile.name = "Reya";
    p.attempts = [];
    for (let c = 0; c < 6; c++)
      p.attempts.push({ conceptId: "bio-0-" + c, mode: "recall", correct: c !== 5, hinted: false, at: at(c),
        ...(c === 5 ? { chose: "To manufacture sunlight", truth: "To transfer usable energy into ATP" } : {}) });
    p.attempts.push({ conceptId: "bio-0-5", mode: "why", correct: false, hinted: false, rung: 2, at: at(10),
      chose: "It is converted directly into ATP", truth: "It is the final electron acceptor at the end of the electron transport chain" });
    p.attempts.push({ conceptId: "bio-case-0", mode: "case", correct: true, hinted: false, at: at(12) });
    p.exam = { label: "Biology exam", date: new Date(Date.now() + 12 * 86_400_000).toISOString() };
    localStorage.setItem(key, JSON.stringify(p));
  }, KEY);
  await page.reload();
  await settle(3500);
  await page.screenshot({ path: out("today-plan-mobile") });

  const center = (text) =>
    page.getByText(text, { exact: false }).first().evaluate((el) => el.scrollIntoView({ block: "center" }));
  await center("YOU KEEP CHOOSING");
  await settle();
  await page.screenshot({ path: out("error-memory-mobile") });

  await button("Explain it back").first().click();
  await settle();
  await page.getByLabel("Your explanation").fill("Respiration moves energy from sugar into ATP, which the cell then uses for work.");
  await button("Check my explanation").click();
  await settle();
  await center("KEY IDEAS FOUND");
  await settle();
  await page.screenshot({ path: out("teach-back-mobile") });

  await button("Ready").click();
  await settle(2500);
  await page.screenshot({ path: out("ready-mobile") });

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
