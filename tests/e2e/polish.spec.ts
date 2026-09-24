import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, reducedMotion: "reduce" });
test("progress journal and secret story artwork fit the mobile frame", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for(let i=0;i<5;i++) await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await page.getByRole("button", { name: "Ready", exact: true }).click();
  await expect(page.getByText("Next to revisit", { exact: true })).toHaveCount(0);
  await page.waitForFunction(() => Array.from(document.images).every(i => i.complete));
  await page.screenshot({ path: "docs/progress-hanging-mobile.png" });
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: "Play A story with a secret" }).click();
  await expect(page.getByText("Fictional practice · not a usable password")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
