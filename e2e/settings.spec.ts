import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("settings remembers appearance and shares volume with the music player", async ({ page }) => {
  await open(page, "/discover");
  const trigger = page.getByRole("button", { name: "Settings", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await dialog.getByLabel("Theme", { exact: true }).selectOption("light");
  await expect(page.locator("html")).toHaveClass(/light/);
  await dialog.getByRole("slider").fill("0.25");
  await expect.poll(() => page.locator("audio").evaluate((audio: HTMLAudioElement) => audio.volume)).toBe(0.25);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
  await trigger.click();
  await expect(dialog.getByRole("slider")).toHaveValue("0.25");
  await dialog.getByLabel("Theme", { exact: true }).selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/light/);
});
