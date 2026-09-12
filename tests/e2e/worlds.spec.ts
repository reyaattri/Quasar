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
    page.getByRole("button", { name: "Inspect memory", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Inspect memory", exact: true })
    .click();
  await page.getByRole("button", { name: /Open memory on/ }).click();
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
    "Tag microbes, recruit inflammation, form a membrane pore",
    "The antibody's antigen specificity",
  ]) {
    await page.getByRole("button", { name: "Hide scene & recall" }).click();
    await page.getByRole("button", { name: choice, exact: true }).click();
    await expect(
      page.getByText("Correct. Connect the symbol back to the biology."),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: choice.startsWith("The antibody")
          ? "Solve the patient case"
          : "Next scene",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByText("Why do the infections keep returning?"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "X-linked agammaglobulinemia (XLA)" })
    .click();
  await expect(page.getByText("The pattern points to XLA.")).toBeVisible();
  await page.getByRole("button", { name: "Return to the two stories" }).click();
  await expect(page.getByText("2 of 2 concepts recalled")).toBeVisible();
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
    await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
    if (i === 3) {
      await expect(page.getByText(/RESILIENT soldier/)).toBeVisible();
      await page.screenshot({
        path: "docs/sat-resilient-mobile.png",
        fullPage: true,
      });
    }
    if (i === 5) {
      await expect(
        page.getByText(/porcupine’s shadow is AMBIGUOUS/),
      ).toBeVisible();
      await page.screenshot({
        path: "docs/sat-ambiguous-mobile.png",
        fullPage: true,
      });
    }
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
      await expect(
        page.getByText("Context cracked!", { exact: true }),
      ).toBeVisible();
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
test("illustrated worlds enter rooms, recall all stops and persist", async ({
  page,
}) => {
  test.setTimeout(120000);
  await onboard(page);
  await page
    .getByRole("button", { name: "Explore memory worlds", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Choose Midnight rooftops", exact: true })
    .click();
  await page.getByRole("button", { name: "Enter world", exact: true }).click();
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  await page.screenshot({ path: "docs/palace-mobile.png" });
  await page.getByRole("button", { name: "Music on", exact: true }).click();
  await page.getByRole("button", { name: "Music off", exact: true }).click();
  await page
    .getByRole("button", { name: "Inspect memory", exact: true })
    .click();
  const answers = ["14", "15", "92", "65", "35", "89"];
  const places = [
    "Entrance steps",
    "Ramen stall",
    "Vending arcade",
    "Neon greenhouse",
    "Antenna workshop",
    "Moon observatory",
  ];
  for (let i = 0; i < 6; i++) {
    await expect(
      page.getByText(places[i], { exact: true }).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /Open memory on/ }).click();
    await expect(
      page.getByRole("button", { name: "Hide cue & recall", exact: true }),
    ).toBeVisible({ timeout: 15000 });
    if (i === 1) await page.screenshot({ path: "docs/palace-hover-card.png" });
    await page
      .getByRole("button", { name: "Hide cue & recall", exact: true })
      .click();
    if (i === 0) {
      await page.getByLabel("Which two digits live here?").fill("99");
      await page
        .getByRole("button", { name: "Check memory", exact: true })
        .click();
      await expect(page.getByText(/Not yet. Reconstruct/)).toBeVisible();
    }
    await page.getByLabel("Which two digits live here?").fill(answers[i]);
    await page
      .getByRole("button", { name: "Check memory", exact: true })
      .click();
    await expect(
      page.getByText("That belongs here. Well remembered."),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Back to exploring", exact: true })
      .click();
    if (i === 1)
      await page.screenshot({ path: "docs/palace-interior-mobile.png" });
    await page.getByRole("button", { name: "Leave room", exact: true }).click();
    if (i < 5)
      await page
        .getByRole("button", { name: "Walk to next stop", exact: true })
        .click();
  }
  await page
    .getByRole("button", { name: "Recall the whole route", exact: true })
    .click();
  for (let i = 0; i < 6; i++)
    await page.getByLabel(i + 1 + ". " + places[i]).fill(answers[i]);
  await page
    .getByRole("button", { name: "Check whole route", exact: true })
    .click();
  await expect(page.getByText(/You recalled 3.141592653589/)).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Explore memory worlds", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Continue your walk", exact: true })
    .click();
  await expect(page.getByText("Midnight rooftops", { exact: true })).toBeVisible();
  await expect(page.getByText("6/6 recalled", { exact: true })).toBeVisible();
});
