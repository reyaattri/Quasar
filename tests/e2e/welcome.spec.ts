import { test, expect } from "@playwright/test";

test("illustrated welcome fits a phone and still enters the lesson flow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const art = page.getByLabel("An explorer enters a moonlit memory garden through green doors");
  await expect(art).toBeVisible();
  await art.locator("img").evaluate(async element => { await (element as HTMLImageElement).decode(); });
  await expect(page.getByLabel("Quasar logo")).toBeVisible();
  await expect(page.getByText("YOUR FIRST MEMORY WALK")).toHaveCount(0);
  await expect(page.getByText("Learn it once. Remember it longer.")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Biology foundations" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: "docs/welcome-refreshed-mobile.png" });
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await expect(page.getByText("Familiar things stick.")).toBeVisible();
});
