const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: {
      dir: "../../work/demo-capture",
      size: { width: 390, height: 844 },
    },
  });
  const page = await context.newPage();
  const pause = (ms = 1000) => page.waitForTimeout(ms);
  const click = async (name) => {
    await page.getByRole("button", { name, exact: true }).click();
    await pause();
  };
  await page.goto("http://localhost:8081");
  await click("Let’s get curious");
  await page.getByLabel("What should we call you?").fill("Alex");
  await click("Build my memory toolkit");
  for (let i = 0; i < 5; i++) await click("Next lesson");
  await click("Let’s make it stick");
  await click("Start a five-word session");
  await pause(3000);
  await page
    .getByRole("button", { name: "Hide card & test recall" })
    .scrollIntoViewIfNeeded();
  await pause(3000);
  await click("Hide card & test recall");
  await click("One that is clear and easy to follow");
  await click("Next word");
  await pause(2500);
  await click("Today");
  await click("Explore memory worlds");
  await click("Enter world");
  await pause(2500);
  await click("Walk to next stop");
  await page.getByText("Doll", { exact: true }).waitFor();
  await page.getByText("Doll", { exact: true }).scrollIntoViewIfNeeded();
  await pause(4000);
  await click("Worlds");
  await page.getByLabel("Your shopping items").fill("Milk\nTomatoes\nBread");
  await click("Build my shopping palace");
  await pause(2500);
  await page
    .getByRole("button", { name: "Hide cue & recall" })
    .scrollIntoViewIfNeeded();
  await pause(3000);
  await click("Worlds");
  await click("Today");
  await click("Explore medical foundations");
  await pause(3000);
  await page
    .getByRole("button", { name: "Hide scene & recall" })
    .scrollIntoViewIfNeeded();
  await pause(2000);
  await click("Hide scene & recall");
  await click("A physical barrier to entry");
  await click("Next scene");
  await pause(3000);
  const video = page.video();
  await context.close();
  await video.saveAs("docs/quasar-demo.webm");
  await browser.close();
  console.log("Recorded updated Quasar demo.");
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
