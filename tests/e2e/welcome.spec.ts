import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("welcome hero fits a phone and still enters the lesson flow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByText("WELCOME TO QUASAR")).toBeVisible();
  await expect(page.getByLabel("Quasar logo")).toBeVisible();
  await expect(page.getByText("Learn it once. Remember it longer.")).toBeVisible();
  await expect(page.getByRole("button", { name: "SAT vocabulary" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));
  await page.screenshot({ path: "docs/welcome-refreshed-mobile.png" });
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await expect(page.getByText("Familiar things stick.")).toBeVisible();
});
