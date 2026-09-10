import { test, expect, type Page } from "@playwright/test";
import { allFacts } from "../../src/data/content";
async function onboard(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
}
test("custom shopping palace handles eight items, local recall and reload", async ({
  page,
}) => {
  await onboard(page);
  await page
    .getByRole("button", { name: "Explore memory worlds", exact: true })
    .click();
  await page
    .getByLabel("Your shopping items")
    .fill("milk\nbread\nrice\napples\nlemons\neggs\noats\nsoap\ntea");
  await page.getByRole("button", { name: "Build my shopping palace" }).click();
  await expect(page.getByText(/Use up to 8 items/)).toBeVisible();
  await page
    .getByLabel("Your shopping items")
    .fill("milk\nbread\nrice\napples\nlemons\neggs\noats\nsoap");
  await page.getByRole("button", { name: "Build my shopping palace" }).click();
  await expect(
    page.getByText("Your shopping-list adventure", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("STOP 1 / 8", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Hide cue & recall", exact: true })
    .click();
  await page.getByLabel("Which shopping item lives here?").fill("milk");
  await page.getByRole("button", { name: "Check memory", exact: true }).click();
  await expect(
    page.getByText("That belongs here. Well remembered."),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Explore memory worlds", exact: true })
    .click();
  await expect(page.getByLabel("Your shopping items")).toHaveValue(
    "milk\nbread\nrice\napples\nlemons\neggs\noats\nsoap",
  );
});
test("medical symbols have recall questions and save genuine results", async ({
  page,
}) => {
  await onboard(page);
  await page
    .getByRole("button", { name: "Explore medical foundations" })
    .click();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll(
          (images) =>
            images.length > 0 &&
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
        ),
    )
    .toBe(true);
  await page.screenshot({ path: "docs/medical-mobile.png" });
  for (const choice of [
    "A physical barrier to entry",
    "Engulfing a microbe",
    "Antibodies recognize particular targets",
  ]) {
    await page.getByRole("button", { name: "Hide scene & recall" }).click();
    await page.getByRole("button", { name: choice, exact: true }).click();
    await expect(
      page.getByText("Correct. Connect the symbol back to the biology."),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: choice.startsWith("Antibodies")
          ? "Revisit the harbor"
          : "Next scene",
        exact: true,
      })
      .click();
  }
  await expect(page.getByText("3 of 3 concepts recalled")).toBeVisible();
});
test("SAT requires five recalls before each contextual question and resumes saved progress", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Start a five-word session" }).click();
  await page.screenshot({
    path: "docs/sat-flashcard-mobile.png",
    fullPage: true,
  });
  const facts = allFacts.filter((f) => f.sceneId === "market");
  for (let i = 0; i < 10; i++) {
    await expect(
      page.getByText("Now use the meaning.", { exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Hide card & test recall" }).click();
    await page
      .getByRole("button", {
        name: facts[i].choices[facts[i].answer],
        exact: true,
      })
      .click();
    await page
      .getByRole("button", {
        name: (i + 1) % 5 === 0 ? "Try the context challenge" : "Next word",
        exact: true,
      })
      .click();
    if ((i + 1) % 5 === 0) {
      await expect(
        page.getByText("Now use the meaning.", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(/not an official or released 2026/),
      ).toBeVisible();
      if (i === 4) {
        await page.reload();
        await page
          .getByRole("button", { name: "Start a five-word session" })
          .click();
        await expect(
          page.getByText("Now use the meaning.", { exact: true }),
        ).toBeVisible();
      }
      await page
        .getByRole("button", {
          name: i === 4 ? "B. resilient" : "D. pragmatic",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: i === 4 ? "Learn the next five words" : "Finish session",
          exact: true,
        })
        .click();
    }
  }
  await expect(
    page.getByText("That’s a good day for your vocabulary."),
  ).toBeVisible();
});
test("palace movement, hidden answers, incorrect recall, full route and persistence work", async ({
  page,
}) => {
  await onboard(page);
  await page
    .getByRole("button", { name: "Explore memory worlds", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Choose Midnight rooftops", exact: true })
    .click();
  await page.getByRole("button", { name: "Enter world", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Music on", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Music on", exact: true }).click();
  await page.getByRole("button", { name: "Music off", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Recall the whole route" }),
  ).toBeDisabled();
  const answers = ["14", "15", "92", "65", "35", "89"];
  await page.screenshot({ path: "docs/palace-mobile.png", fullPage: true });
  for (let i = 0; i < 6; i++) {
    await page
      .getByRole("button", { name: "Hide cue & recall", exact: true })
      .click();
    await expect(
      page.getByText(["Tyre", "Doll", "Bun", "Shell", "Mule", "VIP"][i], {
        exact: true,
      }),
    ).toHaveCount(0);
    if (i === 0) {
      await page.getByLabel("Which two digits live here?").fill("99");
      await page
        .getByRole("button", { name: "Check memory", exact: true })
        .click();
      await expect(page.getByText(/Not yet. Picture the action/)).toBeVisible();
    }
    await page.getByLabel("Which two digits live here?").fill(answers[i]);
    await page
      .getByRole("button", { name: "Check memory", exact: true })
      .click();
    await expect(
      page.getByText("That belongs here. Well remembered."),
    ).toBeVisible();
    if (i < 5)
      await page
        .getByRole("button", { name: "Walk to next stop", exact: true })
        .click();
  }
  await page
    .getByRole("button", { name: "Recall the whole route", exact: true })
    .click();
  const places = [
    "Entrance steps",
    "Ramen kiosk",
    "Vending machine",
    "Greenhouse",
    "Antenna tower",
    "Moon gate",
  ];
  for (let i = 0; i < 6; i++)
    await page.getByLabel(`${i + 1}. ${places[i]}`).fill(answers[i]);
  await page
    .getByRole("button", { name: "Check whole route", exact: true })
    .click();
  await expect(page.getByText(/You recalled 3.141592653589/)).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Explore memory worlds", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Choose Midnight rooftops", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Continue your walk", exact: true })
    .click();
  await expect(page.getByText("STOP 6 / 6", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
