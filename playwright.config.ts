import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// Tests run against a production build in real Google Chrome (no browser download needed).
// Run `npm run build` first, or use `npm run e2e`, which builds for you.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    // Real browsers block sound until the person interacts with the page. The tests allow it so the
    // "starts by itself" case can be checked; the blocked case is tested by stubbing audio.play().
    launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/discover`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
