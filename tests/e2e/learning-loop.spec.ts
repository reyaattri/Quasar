import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });

const KEY = "quasar.progress.v1";

test("a repeated biology mistake flows from Today into Teach-Back, repair and Ready", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByText("WELCOME TO QUASAR").waitFor();
  await page.evaluate((key) => {
    const p = JSON.parse(localStorage.getItem(key)!);
    p.onboarded = true;
    localStorage.setItem(key, JSON.stringify(p));
  }, KEY);
  await page.reload();

  await page.getByRole("button", { name: "Review", exact: true }).click();
  const start = page.getByRole("button", { name: /^Start: Cells: tiny worlds at work/ });
  await expect(start).toBeVisible();
  await start.click();
  await page.getByRole("button", { name: "Hide card & recall concept" }).click();
  await page.getByRole("button", { name: "Having DNA at all" }).click();
  await expect(page.getByText("Reconnect the picture to the mechanism.")).toBeVisible();

  await page.evaluate((key) => {
    const p = JSON.parse(localStorage.getItem(key)!);
    p.attempts.push({ conceptId: "bio-0-0", mode: "recall", correct: false, hinted: false,
      chose: "Having DNA at all", truth: "A membrane-bound nucleus", at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(p));
  }, KEY);
  await page.reload();

  await expect(page.getByText("1 idea needs repair", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Repair: One room or many rooms\?/ })).toBeVisible();
  await expect(page.getByText("“Having DNA at all”")).toBeVisible();

  await page.getByRole("button", { name: "Explain it back", exact: true }).click();
  await page.getByLabel("Your explanation").fill("Eukaryotic cells keep their DNA inside a nucleus.");
  await page.getByRole("button", { name: "Check my explanation" }).click();
  await expect(page.getByText("1 OF 3 KEY IDEAS FOUND")).toBeVisible();
  await expect(page.getByText("If a bacterium has no nucleus, where is its DNA?")).toBeVisible();
  await expect(page.getByText("Prokaryotes have no nucleus; their DNA sits in a nucleoid region.")).toHaveCount(0);

  await page.getByLabel("Your explanation").fill(
    "Eukaryotic cells keep their DNA inside a nucleus. Bacteria have no nucleus; their DNA is in a nucleoid. Both have ribosomes.",
  );
  await page.getByRole("button", { name: "Check again" }).click();
  await expect(page.getByText("3 OF 3 KEY IDEAS FOUND")).toBeVisible();
  await page.getByRole("button", { name: "Defend it: one follow-up question" }).click();
  await page.getByRole("button", { name: "A membrane-bound nucleus" }).click();
  await page.getByRole("button", { name: "Finish" }).click();
  await page.getByRole("button", { name: "Back to my session" }).click();

  await expect(page.getByText("“Having DNA at all”")).toHaveCount(0);
  await page.getByRole("button", { name: "Ready", exact: true }).click();
  await expect(page.getByText("Factual recall")).toBeVisible();
  await expect(page.getByText("1 recurring mistake repaired by a later unaided answer.")).toBeVisible();
  await expect(page.getByText("MEMORY GARDEN")).toBeVisible();
  await page.getByRole("button", { name: "One room or many rooms?: Leaves" }).click();
  await expect(page.getByText("Explain it in Teach-Back or the Why Ladder to grow a bud.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test("Case Lab records a new case, and a long break opens a gentle recovery plan", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByText("WELCOME TO QUASAR").waitFor();
  await page.evaluate((key) => {
    const p = JSON.parse(localStorage.getItem(key)!);
    p.onboarded = true;
    const old = new Date(Date.now() - 10 * 86_400_000).toISOString();
    p.attempts = Array.from({ length: 6 }, (_, c) => ({ conceptId: `bio-1-${c}`, mode: "recall", correct: true, hinted: false, at: old }));
    localStorage.setItem(key, JSON.stringify(p));
  }, KEY);
  await page.reload();

  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByText("Welcome back. Let's start small.")).toBeVisible();
  await expect(page.getByText(/It's been 10 days, and nothing is lost\./)).toBeVisible();

  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: /^Case Lab/ }).click();
  await page.getByRole("button", { name: /^The mutation that changed nothing, New/ }).click();
  await page.getByRole("button", { name: "It stays the same, because the genetic code is redundant" }).click();
  await expect(page.getByText("You connected the biological clues.")).toBeVisible();
  await page.getByRole("button", { name: "All cases" }).click();
  await expect(page.getByRole("button", { name: /^The mutation that changed nothing, Solved$/ })).toBeVisible();
});
