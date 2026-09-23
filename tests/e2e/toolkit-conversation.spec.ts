import { test, expect } from "@playwright/test";
import { toolkitConversations } from "../../src/data/toolkitConversations";
test.use({ reducedMotion: "reduce" });

test("toolkit conversations teach, hide cues, and allow a supported retry", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByText("YOUR FIRST MEMORY WALK")).toBeVisible();
  await expect(page.getByLabel("Quasar logo")).toBeVisible();
  await page.screenshot({ path: "docs/welcome-refreshed-mobile.png" });
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (const [index, lesson] of toolkitConversations.entries()) {
    await expect(page.getByText(lesson.title, { exact: true })).toBeVisible();
    await expect(page.getByText(lesson.method, { exact: true })).toBeVisible();
    await expect(page.getByText(lesson.definition, { exact: true })).toBeVisible();
    const image = page.getByLabel(`${lesson.title} illustration`);
    await expect(image).toBeVisible();
    if (index === 0) {
      await image.locator("image").evaluate(async element => {
        const source = element.getAttribute("href") || element.getAttribute("xlink:href");
        const bitmap = new window.Image();
        bitmap.src = source!;
        await bitmap.decode();
      });
      await image.screenshot({ path: "docs/toolkit-conversation-art.png" });
    }
    await page.getByRole("button", { name: "Show me how" }).click();
    await expect(page.getByText(lesson.reveal, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Let me try without the picture" }).click();
    await expect(image).toHaveCount(0);
    await page.getByRole("button", { name: lesson.choices[(lesson.answer + 1) % 3], exact: true }).click();
    await expect(page.getByText(lesson.retry, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Give me a glimpse" }).click();
    await expect(image).toBeVisible();
    await page.getByRole("button", { name: "Hide the picture" }).click();
    await expect(image).toHaveCount(0);
    await page.getByRole("button", { name: lesson.choices[lesson.answer], exact: true }).click();
    await expect(page.getByText(lesson.why, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if (index === 0) await page.screenshot({ path: "docs/toolkit-conversation-mobile.png" });
    await page.getByRole("button", { name: index === 5 ? "Let’s make it stick" : "Next lesson", exact: true }).click();
  }
  await expect(page.getByText("Your memory toolkit", { exact: true })).toBeVisible();
});
