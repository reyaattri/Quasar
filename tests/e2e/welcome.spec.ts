import { test, expect } from "@playwright/test";

test("illustrated welcome fits a phone and still enters the lesson flow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByText("A PLACE FOR WHAT YOU LEARN")).toBeVisible();
  await expect(page.getByLabel("Quasar logo")).toBeVisible();
  await expect(page.getByText("Remember through imagination.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({ path: "docs/welcome-refreshed-mobile.png" });
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await expect(page.getByText("What would you like to remember?")).toBeVisible();
  await expect(page.getByRole("button", { name: "SAT vocabulary" })).toBeVisible();
});
