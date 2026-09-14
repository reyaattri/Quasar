import { test, expect } from "@playwright/test";
import { readingPractice } from "../../src/data/koreanPractice";
import { calculusLessons } from "../../src/data/calculusLessons";
async function onboard(page: any) {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
}
test("calculus worked examples and retryable application checks", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: "Open calculus lessons" }).click();
  for (const [i, lesson] of calculusLessons.entries()) {
    await page
      .getByRole("button", { name: `Start ${lesson.title.toLowerCase()}` })
      .click();
    if (i === 0) {
      await page
        .getByRole("button", { name: "Bring footprints closer" })
        .click();
      await expect(page.getByText(/Average slope: 2.50/)).toBeVisible();
      await page.screenshot({ path: "docs/calculus-mobile.png" });
    }
    for (let j = 0; j < 4; j++)
      await page
        .getByRole("button", { name: "Next step", exact: true })
        .click();
    await page.getByRole("button", { name: "Try the application" }).click();
    await page
      .getByRole("button", { name: lesson.choices[0], exact: true })
      .click();
    await expect(page.getByText(/Try again\./)).toBeVisible();
    await page
      .getByRole("button", { name: lesson.choices[lesson.answer], exact: true })
      .click();
    await expect(
      page.getByLabel("You connected the idea!", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "All calculus lessons" }).click();
  }
});
test("Korean tracing and conversations never require microphone success", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: "Open Korean practice" }).click();
  const audioResponse = page.waitForResponse(
    (r) => r.url().includes(".ogg") && r.ok(),
  );
  await page
    .getByRole("button", { name: "Listen to the Korean example" })
    .click();
  const recording = await audioResponse;
  expect((await recording.body()).length).toBeGreaterThan(1000);
  await expect(page.getByText(/Korean speaker recording\./)).toBeVisible();
  const canvas = page.getByLabel("Finger tracing canvas");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.move(box!.x + 80, box!.y + 40);
  await page.mouse.down();
  await page.mouse.move(box!.x + 80, box!.y + 180, { steps: 12 });
  await page.mouse.move(box!.x + 200, box!.y + 180, { steps: 12 });
  await page.mouse.up();
  await expect(canvas.locator('path[stroke="#294D3B"]')).toHaveCount(2);
  await page
    .getByRole("button", { name: "Hide guide & draw from memory" })
    .click();
  await page.screenshot({ path: "docs/korean-tracing-mobile.png" });
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next letter" }).click();
  await page.getByRole("button", { name: "Build a syllable" }).click();
  for (const [i, q] of readingPractice.entries()) {
    await page.getByRole("button", { name: "Hide the hint & answer" }).click();
    await page
      .getByRole("button", { name: q.choices[(q.answer + 1) % 3], exact: true })
      .click();
    await expect(page.getByText(/Try again. Say the parts/)).toBeVisible();
    await page
      .getByRole("button", { name: q.choices[q.answer], exact: true })
      .click();
    if (i < readingPractice.length - 1)
      await page.getByRole("button", { name: "Next reading question" }).click();
  }
  await page
    .getByRole("button", {
      name: "I can read these words · try a conversation",
    })
    .click();
  for (let i = 0; i < 2; i++)
    await page
      .getByRole("button", { name: "I’m ready for the next exchange" })
      .click();
  await page.getByRole("button", { name: "Recall what you learned" }).click();
  await expect(
    page.getByText("Which vowel has its short arm pointing right?"),
  ).toBeVisible();
});
test("RNA pairs bases, explains directions, and provides real structure", async ({
  page,
}) => {
  await onboard(page);
  await page
    .getByRole("button", { name: "Explore medical foundations" })
    .click();
  await page.getByRole("button", { name: "Open the RNA detail lab" }).click();
  await page.getByRole("button", { name: "C", exact: true }).click();
  await expect(page.getByText(/Try the complementary/)).toBeVisible();
  for (const base of "AUGCCU")
    await page.getByRole("button", { name: base, exact: true }).click();
  await expect(page.getByText("Your RNA reads 5′-AUGCCU-3′.")).toBeVisible();
  await page.getByRole("button", { name: "Next detail" }).click();
  await expect(
    page.getByText("Read the template from 3′ to 5′", { exact: true }),
  ).toBeVisible();
  const frame = page.frameLocator(
    'iframe[title="Experimental RNA polymerase structure"]',
  );
  await expect(frame.locator("#status")).toHaveText(/1Y1W ready/, {
    timeout: 30000,
  });
  await page.screenshot({ path: "docs/rna-lesson-mobile.png" });
});
