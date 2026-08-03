import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. Auto-starts the dev server. Requires browsers installed once via
 * `npx playwright install`.
 *
 * Runs serially with generous timeouts: the dev server compiles routes on first
 * hit (the 3D hero + booking wizard are heavy), so parallel cold compiles would
 * time out.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/en",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
