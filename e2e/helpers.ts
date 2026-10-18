import type { Page } from "@playwright/test";

// Opens a page and waits until React has hydrated it, so the first click or tap is not lost.
export async function open(page: Page, path: string) {
  await page.goto(path);
  await page.locator("html[data-hydrated='true']").waitFor();
}
