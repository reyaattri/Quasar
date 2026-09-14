import { test, expect } from "@playwright/test";
async function onboard(page: any) {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
}
for (const world of ["The quiet dojo", "Beyond the dunes", "Midnight rooftops"])
  test(`full room and uncovered art: ${world}`, async ({ page }) => {
    await onboard(page);
    await page
      .getByRole("button", { name: "Explore memory worlds", exact: true })
      .click();
    await page
      .getByRole("button", { name: `Choose ${world}`, exact: true })
      .click();
    await page
      .getByRole("button", { name: "Enter world", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Inspect memory", exact: true })
      .click();
    const scene = page.getByTestId("palace-scene").last();
    const box = await scene.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(391);
    expect(box!.width / box!.height).toBeGreaterThan(0.9);
    expect(box!.width / box!.height).toBeLessThan(1.1);
    await page.waitForFunction(() =>
      Array.from(document.images).every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    );
    await page.screenshot({
      path: `docs/framing-${world.replaceAll(" ", "-")}.png`,
    });
    await page.getByRole("button", { name: /Open memory on/ }).click();
    const art = page.getByTestId("memory-art");
    await expect(art).toBeVisible();
    await page.waitForFunction(() =>
      Array.from(document.images).every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    );
    await expect(art).toHaveText("");
    await page.screenshot({
      path: `docs/object-${world.replaceAll(" ", "-")}.png`,
    });
  });
test("immune model labels attach to geometry and molecular viewers are selectable", async ({
  page,
}) => {
  await page.goto("/medical-room.html?concept=1");
  await expect(page.locator("#anatomy-labels button")).not.toHaveCount(0);
  await page
    .locator("#anatomy-labels")
    .getByRole("button", { name: "Nucleus", exact: true })
    .click();
  await expect(page.locator('[slot="hotspot-selected"]')).toHaveText("Nucleus");
  await page
    .getByRole("button", { name: "Human IgG antibody", exact: true })
    .click();
  await expect(page.locator("#molecule-view")).toHaveAttribute(
    "src",
    /pdb=1HZH/,
  );
  await page
    .getByRole("button", { name: "Complement C9 pore", exact: true })
    .click();
  await expect(page.locator("#molecule-view")).toHaveAttribute(
    "src",
    /pdb=5FMW/,
  );
  await page
    .getByRole("button", { name: "Close molecular view", exact: true })
    .click();
  await expect(page.locator("#molecule-view")).toBeHidden();
});
