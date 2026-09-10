import { test, expect } from "@playwright/test";
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
  await page.screenshot({ path: "docs/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Start exploring" }).click();
  await page.screenshot({ path: "docs/scene-mobile.png", fullPage: true });
  const words = [
    "Lucid",
    "Meticulous",
    "Ephemeral",
    "Resilient",
    "Avarice",
    "Ambiguous",
  ];
  const answers = [
    "One that is clear and easy to follow",
    "check every citation and punctuation mark",
    "A soap bubble",
    "adapts and recovers",
    "Hoarding wealth at others’ expense",
    "duck could mean a bird or an action",
  ];
  for (let i = 0; i < words.length; i++) {
    await page
      .getByRole("button", { name: "Explore " + words[i], exact: true })
      .click();
    await page.getByRole("button", { name: "Try recalling it" }).click();
    await page.getByRole("button", { name: answers[i], exact: true }).click();
    await page.getByRole("button", { name: "Check my answer" }).click();
    await expect(page.getByText("Correct.", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Back to the scene" }).click();
  }
  await page
    .getByRole("button", { name: "Try the application question" })
    .click();
  await page
    .getByLabel("Your explanation")
    .fill(
      "The meticulous writer revised each detail to create a lucid explanation.",
    );
  await page.getByRole("button", { name: "Compare with an example" }).click();
  await page
    .getByRole("button", { name: "I’ve checked my explanation" })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Continue learning" }).click();
  await expect(page.getByText("6 / 6 concepts recalled")).toBeVisible();
  await page.getByRole("button", { name: "Doodle", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Doodle", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Practice all 16 cards" }).click();
  await page.getByRole("button", { name: "Reveal the memory" }).click();
  await page.getByRole("button", { name: "Need another look" }).click();
  await expect(page.getByText("2 / 16", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Open settings" }).click();
  await page.getByRole("button", { name: "Explore Quasar Plus" }).click();
  await expect(
    page.getByText("Subscriptions are not available here yet."),
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

test("computing scene supports missed recall, both styles, and application; pi checks digits", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page
    .getByRole("button", { name: /Computer science Echo’s sorting workshop/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Try the application question" }),
  ).toHaveCount(0);
  await page.screenshot({ path: "docs/computing-mobile.png" });
  await page
    .getByRole("button", { name: "Explore Algorithm", exact: true })
    .click();
  await page.screenshot({ path: "docs/mnemonic-mobile.png" });
  await page.getByRole("button", { name: "Try recalling it" }).click();
  await page
    .getByRole("button", { name: "A random pile of notes", exact: true })
    .click();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(
    page.getByText("Let’s review this one.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to the scene" }).click();
  await expect(
    page.getByRole("button", { name: "Explore Algorithm", exact: true }),
  ).toBeVisible();
  const rows = [
    ["Queue", "A"],
    ["Stack", "C"],
    ["Recursion", "A reachable base case"],
    ["Binary search", "Data sorted by the searched key"],
    ["Hash map", "Keys with values"],
  ];
  for (const [word, choice] of rows) {
    await page
      .getByRole("button", { name: "Explore " + word, exact: true })
      .click();
    await page.getByRole("button", { name: "Try recalling it" }).click();
    await page.getByRole("button", { name: choice, exact: true }).click();
    await page.getByRole("button", { name: "Check my answer" }).click();
    await page.getByRole("button", { name: "Back to the scene" }).click();
  }
  await page
    .getByRole("button", { name: "Try the application question" })
    .click();
  await page
    .getByLabel("Your explanation")
    .fill(
      "Use a queue for first in first out parcels and a stack to undo the most recent edit.",
    );
  await page.getByRole("button", { name: "Compare with an example" }).click();
  await page
    .getByRole("button", { name: "I’ve checked my explanation" })
    .click();
  await page.getByRole("button", { name: "Today", exact: true }).click();
  await page
    .getByRole("button", { name: /A little slice of infinity/ })
    .click();
  await page.getByRole("button", { name: "Hide & try recalling" }).click();
  await page.getByLabel("Digits after 3.").fill("141592653589793");
  await page.getByRole("button", { name: "Check digits" }).click();
  await expect(
    page.getByText("All 15 digits! A little slice of infinity is yours."),
  ).toBeVisible();
});
