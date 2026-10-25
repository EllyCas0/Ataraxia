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

test("the storm is drawn behind the quote, and the quote stays real, selectable text", async ({ page }) => {
  await open(page, "/discover");
  const storm = carousel(page).getByTestId("storm");
  await expect(storm).toBeVisible();
  await expect(storm).toHaveAttribute("aria-hidden", "true");

  // Both the rising blobs and the lightning are animated.
  expect(await storm.locator(".storm-blob").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("storm-rise");
  expect(await storm.locator(".storm-bolt").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("storm-bolt");
  expect(await storm.locator(".storm-bolt").count()).toBeGreaterThanOrEqual(3);

  // The quote is not inside the background, so screen readers and text selection are unaffected.
  await expect(storm.getByText(/\u201c/)).toHaveCount(0);
  await expect(carousel(page).getByRole("link").first()).toContainText("\u2014");
});

test("lightning strikes are single pulses at least 4 seconds apart, so they never strobe", async ({ page }) => {
  await open(page, "/discover");
  const { cycle, starts, fadeOut } = await page.evaluate(() => {
    const strikes = [...document.querySelectorAll<HTMLElement>(".storm-strike")];
    const seconds = (value: string) => parseFloat(value);
    const cycle = seconds(getComputedStyle(strikes[0]).getPropertyValue("--cycle"));
    const starts = strikes.map((el) => seconds(getComputedStyle(el).getPropertyValue("--at")));
    // How long one strike lasts: the bolt is lit from 0% to 4.5% of the cycle.
    return { cycle, starts, fadeOut: cycle * 0.045 };
  });
  expect(cycle).toBeGreaterThan(0);
  const sorted = [...starts].sort((a, b) => a - b);
  const gaps = sorted.map((start, i) => (i === sorted.length - 1 ? sorted[0] + cycle - start : sorted[i + 1] - start));
  for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(4);
  // One strike is over well before the next begins, and well under a second long.
  expect(fadeOut).toBeLessThan(1);
  expect(Math.min(...gaps) - fadeOut).toBeGreaterThan(3);
  // Fewer than one strike per second overall, far below the three-flashes-per-second limit.
  expect(starts.length / cycle).toBeLessThan(1);
});

test("the text stays readable over the background, even with every bolt and flash at full strength", async ({ page }) => {
  test.setTimeout(120_000);
  await open(page, "/discover");
  const region = carousel(page);
  // Worst case: force every bolt and flash fully visible and still, and hide the fixed bars and the words
  // themselves, so only the background behind the words is measured.
  await page.addStyleTag({
    content: `
      body.measuring .fixed, body.measuring header { visibility: hidden !important; }
      body.measuring section[aria-roledescription=carousel] blockquote,
      body.measuring section[aria-roledescription=carousel] a p { visibility: hidden !important; }
      body.measuring .storm-bolt, body.measuring .storm-flash { animation: none !important; opacity: 1 !important; }
    `,
  });

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

    // The blobs move, so sample at two different moments.
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

test("with reduced motion nothing moves and no lightning appears", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/discover");
  const storm = carousel(page).getByTestId("storm");
  for (const selector of [".storm-blob", ".storm-bolt", ".storm-flash"]) {
    expect(await storm.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  }
  // And the bolts are not visible at rest.
  expect(await storm.locator(".storm-bolt").first().evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
});

test("only the visible slide (and the one fading out) draws a storm", async ({ page }) => {
  await open(page, "/discover");
  const region = carousel(page);
  expect(await region.getByTestId("storm").count()).toBe(1);
  await region.getByRole("button", { name: "Next quote" }).click();
  await page.waitForTimeout(100);
  expect(await region.getByTestId("storm").count()).toBeLessThanOrEqual(2);
});

test("a bolt really does flash during the cycle", async ({ page }) => {
  await open(page, "/discover");
  // Jump the first bolt's animation to the middle of its strike and check it is lit.
  const opacity = await page.evaluate(async () => {
    const bolt = document.querySelector<SVGElement>(".storm-bolt")!;
    const animation = bolt.getAnimations()[0];
    animation.pause();
    const timing = animation.effect!.getComputedTiming();
    animation.currentTime = (timing.delay ?? 0) + (timing.duration as number) * 0.008;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    return Number(getComputedStyle(bolt).opacity);
  });
  expect(opacity).toBeGreaterThan(0.9);
});

test("the reading page has a still colour instead of the storm", async ({ page }) => {
  await open(page, "/insights/socrates-unexamined-life");
  await expect(page.getByTestId("storm")).toHaveCount(0);
  const still = page.getByTestId("static-gradient");
  await expect(still).toBeVisible();
  // Nothing on the page's background is animated.
  expect(await still.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("unexamined life");
});
