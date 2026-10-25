import type { Page } from "@playwright/test";

// Opens a page and waits until React has hydrated it, so the first click or tap is not lost.
// The music is off on a first visit, like it is for a real person. Pass { music: true } to open the page as
// someone who last left it playing, so it tries to resume.
export async function open(page: Page, path: string, options: { music?: boolean } = {}) {
  if (options.music) await page.addInitScript(() => window.localStorage.setItem("agora.music.enabled.v1", "1"));
  await page.goto(path);
  await page.locator("html[data-hydrated='true']").waitFor();
}
