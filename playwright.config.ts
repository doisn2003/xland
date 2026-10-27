import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure", actionTimeout: 20000 },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
  webServer: [{
    command: "node --import tsx scripts/web-test-server.mjs",
    cwd: "../../xland-server",
    url: "http://127.0.0.1:3311/health/ready",
    reuseExistingServer: false,
    timeout: 120_000,
  }, {
    command: "pnpm start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { XLAND_API_BASE_URL: "http://127.0.0.1:3311/api/v1", XLAND_WEB_ORIGIN: "http://127.0.0.1:3100", XLAND_ENABLE_BOOKING_WRITE: "true", XLAND_ENABLE_EVENT_REGISTRATION: "true" },
  }],
});
