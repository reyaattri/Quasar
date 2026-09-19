import { test, expect } from "@playwright/test";
import { medicalModules } from "../../src/data/medicalLessons";
for (const [index, lesson] of medicalModules.entries())
  test(`guided biology lesson ${index + 1}: cards, scene, recall, case retry`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Let’s get curious" }).click();
    await page.getByRole("button", { name: "Build my memory toolkit" }).click();
    for (let i = 0; i < 5; i++)
      await page.getByRole("button", { name: "Next lesson" }).click();
    await page.getByRole("button", { name: "Let’s make it stick" }).click();
    await page
      .getByRole("button", { name: "Explore biology foundations" })
      .click();
    await page
      .getByRole("button", {
        name: `Start ${lesson.title.toLowerCase()}`,
        exact: true,
      })
      .click();
    for (const [i, card] of lesson.cards.entries()) {
      await page
        .getByRole("button", { name: "Hide card & recall concept" })
        .click();
      await page
        .getByRole("button", { name: card.choices[card.answer], exact: true })
        .click();
      await page
        .getByRole("button", {
          name: i === 5 ? "Connect the complete scene" : "Next concept",
          exact: true,
        })
        .click();
    }
    await page.waitForFunction(() =>
      Array.from(document.images).every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    );
    await page.screenshot({
      path: `docs/medical-lesson-${index + 1}-scene.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Hide scene & recall the route" })
      .click();
    for (const card of lesson.cards)
      await page.getByRole("button", { name: card.title, exact: true }).click();
    await page.getByRole("button", { name: "Check linked recall" }).click();
    await expect(
      page.getByText("The whole scene is back!", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Solve the field challenge" })
      .click();
    const wrong = (lesson.case.answer + 1) % lesson.case.choices.length;
    await page
      .getByRole("button", { name: lesson.case.choices[wrong], exact: true })
      .click();
    await expect(page.getByText(lesson.case.hint, { exact: true })).toHaveCount(
      0,
    );
    await expect(
      page.getByText(lesson.case.explanation, { exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Try the case again" }).click();
    await page
      .getByRole("button", {
        name: lesson.case.choices[index === 0 ? wrong : lesson.case.answer],
        exact: true,
      })
      .click();
    await expect(
      page.getByText(
        index === 0 ? lesson.case.hint : "You connected the biological clues.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByText(lesson.case.explanation, { exact: true }),
    ).toBeVisible();
  });
