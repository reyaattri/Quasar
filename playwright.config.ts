import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120000,
  use: {
    baseURL: "http://localhost:8081",
    viewport: { width: 390, height: 844 },
    launchOptions: { channel: "chrome" },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run web -- --port 8081",
    env: {EXPO_NO_TELEMETRY:'1',EXPO_OFFLINE:'1',BROWSER:'none'},
    url: "http://localhost:8081",
    reuseExistingServer: true,
    timeout: 180000,
  },
  workers: 1,
});
