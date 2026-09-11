import { test, expect } from "@playwright/test";

test("medical studio loads all original models and hides cues for recall", async ({ page }) => {
  await page.goto("/medical-room.html?concept=2");
  await expect(page.getByRole("heading", { name: "Two tips, a particular target" })).toBeVisible();
  await expect(page.locator("p#status")).toHaveText("Model ready. Drag to explore.");
  await expect.poll(() => page.locator("model-viewer").evaluate((m: any) => m.loaded && m.modelIsVisible)).toBe(true);
  await page.screenshot({ path: "docs/medical-studio-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Hide model & recall" }).click();
  await expect(page.locator("model-viewer")).toBeHidden();
  await expect(page.locator("#meaning")).toBeHidden();
  await expect(page.getByText("What do the tips of the antibody bind?")).toBeVisible();
  await page.getByText("Reveal the explanation").click();
  await expect(page.locator("#answer")).toBeVisible();
  await page.getByRole("button", { name: "Return to model" }).click();
  for (const name of ["Barrier", "Phagocyte"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator("p#status")).toHaveText("Model ready. Drag to explore.");
    await expect.poll(() => page.locator("model-viewer").evaluate((m: any) => m.loaded && m.modelIsVisible)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("medical cards open the studio without leaving saved lesson", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i=0;i<5;i++) await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await page.getByRole("button", { name: "Explore medical foundations" }).click();
  await page.getByRole("button", { name: "Explore in 3D" }).click();
  await expect(page.frameLocator('iframe').getByRole("heading", {name:"A barrier made of cells"})).toBeVisible();
  await page.getByRole("button", { name: "Back to medical cards" }).click();
  await expect(page.getByText("The defense harbor.")).toBeVisible();
  await expect(page.getByRole("button", {name:"Unfold my phone pass"})).toHaveCount(0);
});

