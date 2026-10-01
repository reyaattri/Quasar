import { test, expect } from "@playwright/test";
import { PI_DECIMALS } from "../../src/data/piCourse";
async function onboard(page: any) {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
}
test("pi rooms hide pegs, catch omissions and persist the 100-digit milestone", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: "Open the π memory course" }).click();
  await page
    .getByRole("button", { name: "Enter π room 1", exact: true })
    .click();
  await page.getByRole("button", { name: "Hide the digits & scene" }).click();
  await expect(page.getByText("Tyre", { exact: true })).toBeHidden();
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Next π landmark" }).click();
  await page.getByRole("button", { name: "Recall this room" }).click();
  await page.getByLabel("Digits from memory").fill("141592653");
  await page.getByRole("button", { name: "Check my π recall" }).click();
  await expect(page.getByText(/Not yet. Revisit Till/)).toBeVisible();
  await page.getByLabel("Digits from memory").fill("14 15 92 65 35");
  await page.getByRole("button", { name: "Check my π recall" }).click();
  await expect(
    page.getByText("Every digit is in the right place."),
  ).toBeVisible();
  await page.getByRole("button", { name: "All π rooms" }).click();
  await page.getByRole("button", { name: "Recall all 100 digits" }).click();
  await page.getByLabel("Digits from memory").fill(PI_DECIMALS);
  await page.getByRole("button", { name: "Check my π recall" }).click();
  await expect(
    page.getByText("Every digit is in the right place."),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: "Open the π memory course" }).click();
  await expect(
    page.getByText(/ROOM 10 · DIGITS 91–100 · RECALLED/),
  ).toBeVisible();
  await page.screenshot({ path: "docs/pi-course-mobile.png" });
});
test("calculus animations explain transformations and converge numerically", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Explore", exact: true }).click();
  await page.getByRole("button", { name: "Open calculus lessons" }).click();
  await page.getByRole("button", { name: "Start the slope detective" }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await page.getByRole("button", { name: "Animate the rule" }).click();
  await expect(page.getByLabel("Power transformation stage 3")).toBeVisible({
    timeout: 8000,
  });
  await page.getByRole("button", { name: "All calculus lessons" }).click();
  await page
    .getByRole("button", { name: "Start the accumulation station" })
    .click();
  await expect(
    page.getByText("Rectangle total = 7.000 L", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Use right edges" }).click();
  await expect(
    page.getByText("Rectangle total = 9.000 L", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Animate thinner slices" }).click();
  await expect(
    page.getByText("Rectangle total = 8.125 L", { exact: true }),
  ).toBeVisible({ timeout: 8000 });
  await page.getByText("MAKE THE ESTIMATE SETTLE").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/calculus-interactive-mobile.png" });
});
