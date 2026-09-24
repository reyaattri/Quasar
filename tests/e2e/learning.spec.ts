import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
test("new learner completes course, recalls a scene, reflects, and persists mastery", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByLabel("What should we call you?").fill("Sam");
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, Sam." }),
  ).toBeVisible();
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete));
  await page.screenshot({ path: "docs/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(
    page.getByRole("button", { name: "Hide card & test recall" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hide card & test recall" }).click();
  await page
    .getByRole("button", {
      name: "One that is clear and easy to follow",
      exact: true,
    })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Practice all 10 cards" }).click();
  await page.getByRole("button", { name: "Reveal the memory" }).click();
  await page.getByRole("button", { name: "Need another look" }).click();
  await expect(page.getByText("2 / 10", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open settings" }).click();
  await page.getByRole("button", { name: "Explore Quasar Plus" }).click();
  await expect(
    page.getByText("Purchases open once Plus is connected."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Restore purchases" }),
  ).toBeDisabled();
});
test("small viewport has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});

test("Explore has illustrated active subjects and no computer science", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await expect(
    page.getByText("A little play. A lot to remember."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Play The card cabinet" }),
  ).toBeVisible();
  await expect(page.getByText("A loose lid. A lucid idea.")).toHaveCount(0);
  await expect(page.getByText(/Computer science|More CS/)).toHaveCount(0);
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  await page.screenshot({ path: "docs/explore-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Open the memory toolkit" }).click();
  await page.screenshot({ path: "docs/lesson-mobile.png", fullPage: true });
});
