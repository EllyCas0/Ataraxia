import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { PNG } from "pngjs";
import { open } from "./helpers";

const carousel = (page: Page) => page.getByRole("region", { name: "Daily insights from philosophers" });

// Relative luminance of an sRGB colour (WCAG), used to check how light the background is behind the text.
function luminance(r: number, g: number, b: number): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

// Contrast of white text against the lightest 1% of pixels (and the average) in the picture.
function worstContrastWithWhite(png: Buffer): { worst: number; average: number } {
  const { data, width, height } = PNG.sync.read(png);
  const values: number[] = [];
  for (let i = 0; i < width * height; i++) values.push(luminance(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]));
  values.sort((a, b) => a - b);
  const lightest = values[Math.floor(values.length * 0.99)];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const contrast = (l: number) => 1.05 / (l + 0.05);
  return { worst: contrast(lightest), average: contrast(mean) };
}

test("the lava lamp is drawn behind the quote, and the quote is still on top and readable text", async ({ page }) => {
  await open(page, "/discover");
  const lamp = carousel(page).getByTestId("lava-lamp");
  await expect(lamp).toBeVisible();
  await expect(lamp).toHaveAttribute("aria-hidden", "true");

  // The animation is running.
  const animated = await lamp.locator(".lamp-blob").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(animated).toBe("lamp-rise");

  // The quote is not inside the lamp, so screen readers and text selection are unaffected.
  await expect(lamp.getByText(/“/)).toHaveCount(0);
  await expect(carousel(page).getByRole("link").first()).toContainText("—");
});

test("the text stays readable over the moving background, on several schools' colours", async ({ page }) => {
  test.setTimeout(120_000);
  await open(page, "/discover");
  const region = carousel(page);
  // Hide the fixed bars (navigation, music) and the words themselves, so only the background behind the words is measured.
  await page.addStyleTag({ content: "body.measuring .fixed, body.measuring header { visibility: hidden !important; } body.measuring section[aria-roledescription=carousel] blockquote, body.measuring section[aria-roledescription=carousel] a p { visibility: hidden !important; }" });

  for (let slide = 0; slide < 6; slide++) {
    await region.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.evaluate(() => document.body.classList.add("measuring"));

    const area = await region.getByRole("link").first().evaluate((link) => {
      const boxes = [...link.querySelectorAll("blockquote, p")].filter((el) => !el.textContent?.startsWith("Daily insight")).map((el) => el.getBoundingClientRect());
      const top = Math.min(...boxes.map((r) => r.top));
      const bottom = Math.max(...boxes.map((r) => r.bottom));
      const card = link.getBoundingClientRect();
      return { x: card.left + 8, y: top, width: card.width - 16, height: bottom - top };
    });
    expect(area.y).toBeGreaterThanOrEqual(0);
    expect(area.y + area.height).toBeLessThanOrEqual(page.viewportSize()!.height);

    // The background moves, so sample it at two different moments.
    for (const wait of [300, 2000]) {
      await page.waitForTimeout(wait);
      const { worst, average } = worstContrastWithWhite(await page.screenshot({ clip: area, animations: "allow" }));
      expect(worst, `slide ${slide}, +${wait} ms: lightest part of the background behind the text`).toBeGreaterThanOrEqual(4.5);
      expect(average, `slide ${slide}, +${wait} ms: average background`).toBeGreaterThanOrEqual(7);
    }

    await page.evaluate(() => document.body.classList.remove("measuring"));
    await region.getByRole("button", { name: "Next quote" }).click();
    await page.waitForTimeout(700);
  }
});

test("with reduced motion the lava lamp stands still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/discover");
  const blob = carousel(page).getByTestId("lava-lamp").locator(".lamp-blob").first();
  expect(await blob.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  const kaleido = carousel(page).getByTestId("lava-lamp").locator(".lamp-kaleido").first();
  expect(await kaleido.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});

test("only the visible slide (and the one fading out) draws a lamp", async ({ page }) => {
  await open(page, "/discover");
  const region = carousel(page);
  expect(await region.getByTestId("lava-lamp").count()).toBe(1);
  await region.getByRole("button", { name: "Next quote" }).click();
  await page.waitForTimeout(100);
  expect(await region.getByTestId("lava-lamp").count()).toBeLessThanOrEqual(2);
});

test("the reading page shows the lava lamp too", async ({ page }) => {
  await open(page, "/insights/socrates-unexamined-life");
  await expect(page.getByTestId("lava-lamp")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("unexamined life");
});
