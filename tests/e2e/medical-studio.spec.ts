import { test, expect } from "@playwright/test";

test("medical studio loads all original models and hides cues for recall", async ({
  page,
}) => {
  await page.goto("/medical-room.html?concept=2");
  await expect(
    page.getByRole("heading", { name: "Two tips, a particular target" }),
  ).toBeVisible();
  await expect(page.locator("p#status")).toHaveText(
    "Model ready. Drag to explore.",
  );
  await expect
    .poll(() =>
      page
        .locator("model-viewer")
        .evaluate((m: any) => m.loaded && m.modelIsVisible),
    )
    .toBe(true);
  await page.screenshot({
    path: "docs/medical-studio-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Hide model & recall" }).click();
  await expect(page.locator("model-viewer")).toBeHidden();
  await expect(page.locator("#meaning")).toBeHidden();
  await expect(
    page.getByText("What do antibody binding sites recognize?"),
  ).toBeVisible();
  await page.getByText("Reveal the explanation").click();
  await expect(page.locator("#answer")).toBeVisible();
  await page.getByRole("button", { name: "Return to model" }).click();
  for (const name of ["Barrier", "Phagocyte"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator("p#status")).toHaveText(
      "Model ready. Drag to explore.",
    );
    await expect
      .poll(() =>
        page
          .locator("model-viewer")
          .evaluate((m: any) => m.loaded && m.modelIsVisible),
      )
      .toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("medical cards open the studio without leaving saved lesson", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s get curious" }).click();
  await page.getByRole("button", { name: "Build my memory toolkit" }).click();
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next lesson" }).click();
  await page.getByRole("button", { name: "Let’s make it stick" }).click();
  await page
    .getByRole("button", { name: "Explore medical foundations" })
    .click();
  await page.getByRole("button", { name: "Explore in 3D" }).click();
  await expect(
    page
      .frameLocator("iframe")
      .getByRole("heading", { name: "A cell that engulfs" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to medical cards" }).click();
  await expect(page.getByText("Inside the immunity club.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Unfold my phone pass" }),
  ).toHaveCount(0);
});

test("sourced heart loads locally, labels named structures, and explains unavailable AR", async ({
  page,
}) => {
  await page.route("https://www.gstatic.com/**", (route) => route.abort());
  await page.goto("/medical-room.html?concept=3");
  await expect(page.locator("p#status")).toHaveText(
    "Model ready. Drag to explore.",
    { timeout: 30000 },
  );
  await expect
    .poll(() =>
      page
        .locator("model-viewer")
        .evaluate((m: any) => m.loaded && m.modelIsVisible),
    )
    .toBe(true);
  await expect(page.locator("#anatomy-labels button")).toHaveCount(23);
  await page
    .locator("#anatomy-labels")
    .getByRole("button", { name: "Left ventricle", exact: true })
    .click();
  await expect(page.locator('[slot="hotspot-selected"]')).toHaveText(
    "Left ventricle",
  );
  await page.screenshot({
    path: "docs/heart-anatomy-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Play blood-flow route", exact: true })
    .click();
  await expect(page.locator("#flow-status")).toContainText(
    "Superior vena cava",
  );
  await expect(page.locator('[slot="hotspot-flow"]')).toBeVisible();
  await page
    .getByRole("button", { name: "Pause blood-flow route", exact: true })
    .click();
  await page
    .getByRole("button", { name: "View in your room", exact: true })
    .click();
  await expect(page.locator("p#status")).toContainText("compatible phone");
  await page.getByRole("button", { name: "Hide model & recall" }).click();
  await expect(page.locator("#anatomy-labels")).toBeHidden();
});

test("physiology lab responds to site, heart rate, wavelength and motion", async ({
  page,
}) => {
  await page.goto("/medical-room.html?concept=4");
  await expect(
    page.getByRole("heading", { name: "Interactive pulse physiology lab" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Fingertip", exact: true }).click();
  await page.locator("#hr").fill("120");
  await page.locator("#wavelength").selectOption("ir");
  await page.locator("#motion").selectOption("run");
  await expect(page.locator("#lab-readout")).toContainText(
    "Fingertip · infrared light · run",
  );
  await expect(page.locator("#wave-path")).toHaveAttribute("d", /^M0,/);
  await page.screenshot({
    path: "docs/physiology-lab-mobile.png",
    fullPage: true,
  });
});
