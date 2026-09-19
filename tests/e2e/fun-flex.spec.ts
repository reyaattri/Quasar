import { test, expect, Page } from "@playwright/test";
import { people, phrase, pairs, deck } from "../../src/data/funGames";
async function explore(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await page.getByRole("button", { name: "Explore", exact: true }).click();
}
test("Fun and Flex card sequence stays fixed and scores exact order", async ({
  page,
}) => {
  await explore(page);
  await page.getByRole("button", { name: "Play The card cabinet" }).click();
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  const seen: string[] = [];
  for (let i = 0; i < 6; i++) {
    const label = await page
      .getByTestId("playing-card")
      .getAttribute("aria-label");
    seen.push(deck.find((c) => c.name === label)!.id);
    if (i === 0) await page.screenshot({ path: "docs/fun-cards-mobile.png" });
    await page
      .getByRole("button", {
        name: i === 5 ? "Hide everything & recall" : "Next item",
        exact: true,
      })
      .click();
  }
  for (let i = 0; i < 6; i++)
    await page.getByLabel("Card " + (i + 1), { exact: true }).fill(seen[i]);
  await page.getByRole("button", { name: "Check my recall" }).click();
  await expect(page.getByText("6 / 6", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Start a new round" }).click();
  await page.getByRole("button", { name: "Full deck · 52" }).click();
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  await expect(
    page.getByText("1 / 52 · LOOK → LINK → PLACE", { exact: true }),
  ).toBeVisible();
});
test("Names require both face association and meeting order", async ({
  page,
}) => {
  await explore(page);
  await page.getByRole("button", { name: "Play Nice to meet who?" }).click();
  await page
    .getByRole("button", { name: "Start practice", exact: true })
    .click();
  const seen: string[] = [];
  for (let i = 0; i < 6; i++) {
    const text = await page.getByText(/^Meet \w+\.$/).innerText();
    seen.push(text.slice(5, -1));
    if (i === 0) await page.screenshot({ path: "docs/fun-faces-mobile.png" });
    await page
      .getByRole("button", {
        name: i === 5 ? "Hide everything & recall" : "Next item",
        exact: true,
      })
      .click();
  }
  const labels = await page
    .locator('[aria-label^="Portrait:"]')
    .evaluateAll((els) =>
      els.map((e) => e.getAttribute("aria-label")).slice(-6),
    );
  expect(labels).toHaveLength(6);
  for (let i = 0; i < 6; i++) {
    const person = people.find((p) => labels[i] === "Portrait: " + p.feature)!;
    await page
      .getByLabel(`Person ${i + 1} name`, { exact: true })
      .fill(person.name);
    await page
      .getByLabel(`Person ${i + 1} meeting position`, { exact: true })
      .fill(String(seen.indexOf(person.name) + 1));
  }
  await page.getByRole("button", { name: "Check my recall" }).click();
  await expect(page.getByText("6 / 6", { exact: true })).toBeVisible();
});
test("Linked pairs and fictional phrase hide cues before recall", async ({
  page,
}) => {
  await explore(page);
  for (const [title, values] of [
    ["Name twins", pairs.map((p) => p[1])],
    ["A story with a secret", phrase],
  ] as const) {
    await page.getByRole("button", { name: "Play " + title }).click();
    await page
      .getByRole("button", { name: "Start practice", exact: true })
      .click();
    for (let i = 0; i < 6; i++)
      await page
        .getByRole("button", {
          name: i === 5 ? "Hide everything & recall" : "Next item",
          exact: true,
        })
        .click();
    for (let i = 0; i < 6; i++)
      await page.getByRole("textbox").nth(i).fill(values[i]);
    await page.getByRole("button", { name: "Check my recall" }).click();
    await expect(page.getByText("6 / 6", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Back to Explore" }).click();
  }
});
