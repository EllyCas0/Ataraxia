import type { Page } from "@playwright/test";

// Opens a page and waits until React has hydrated it, so the first click or tap is not lost.
// The background music would otherwise start by itself and its controls could get in the way of
// unrelated tests, so it is switched off unless a test asks for it with { music: true }.
export async function open(page: Page, path: string, options: { music?: boolean } = {}) {
  if (!options.music) await page.addInitScript(() => window.localStorage.setItem("agora.music.enabled.v1", "0"));
  await page.goto(path);
  await page.locator("html[data-hydrated='true']").waitFor();
}
