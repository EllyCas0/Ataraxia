import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("the daily insight is shown and stays the same when the page is reloaded", async ({ page }) => {
  await open(page, "/discover");
  const card = page.getByRole("link", { name: /Daily insight/ });
  await expect(card).toBeVisible();
  const first = (await card.textContent()) ?? "";
  expect(first).toContain("\u2014");
  for (let i = 0; i < 3; i++) {
    await page.reload();
    await expect(card).toHaveText(first.replace(/\s+/g, " ").trim());
  }
});

test("the insight carousel loops without end in both directions and by keyboard", async ({ page }) => {
  await open(page, "/discover");
  const carousel = page.getByRole("region", { name: "Daily insights from philosophers" });
  const shown = () => carousel.getByRole("link").first().textContent();
  const first = await shown();

  await carousel.getByRole("button", { name: "Next quote" }).click();
  const second = await shown();
  expect(second).not.toBe(first);

  await carousel.getByRole("button", { name: "Previous quote" }).click();
  expect(await shown()).toBe(first);

  // Previous from the first quote wraps to the last, and next from there wraps back to the first.
  await carousel.getByRole("button", { name: "Previous quote" }).click();
  const last = await shown();
  expect(last).not.toBe(first);
  await carousel.getByRole("button", { name: "Next quote" }).click();
  expect(await shown()).toBe(first);

  // Going forward through every quote and around again returns to the start.
  const total = Number(/of (\d+):/.exec((await carousel.locator("[aria-live]").textContent()) ?? "")?.[1]);
  expect(total).toBeGreaterThanOrEqual(8);
  await carousel.focus();
  for (let n = 0; n < total; n++) await page.keyboard.press("ArrowRight");
  expect(await shown()).toBe(first);
});

test("swiping the carousel moves to the next quote without opening it", async ({ page }) => {
  await open(page, "/discover");
  const carousel = page.getByRole("region", { name: "Daily insights from philosophers" });
  const first = await carousel.getByRole("link").first().textContent();
  await carousel.scrollIntoViewIfNeeded();
  const box = (await carousel.boundingBox())!;
  const viewportHeight = page.viewportSize()!.height;
  // Swipe across the middle of the part of the card that is on screen.
  const y = Math.max(box.y, 0) + (Math.min(box.y + box.height, viewportHeight) - Math.max(box.y, 0)) / 2;
  await page.mouse.move(box.x + box.width * 0.8, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, y, { steps: 6 });
  await page.mouse.up();
  await expect(page).toHaveURL(/\/discover$/);
  expect(await carousel.getByRole("link").first().textContent()).not.toBe(first);
});

test("the daily insight opens its reading view with the source", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /Daily insight/ }).click();
  await expect(page).toHaveURL(/\/insights\/[a-z-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText(/^Source:/)).toBeVisible();
  await page.getByRole("link", { name: "Reflect on this" }).click();
  await expect(page).toHaveURL(/\/reflect\/new/);
});

test("an unknown insight is a 404", async ({ page }) => {
  const response = await page.goto("/insights/not-a-real-one");
  expect(response?.status()).toBe(404);
});

test("the home page search opens the idea library with results", async ({ page }) => {
  await open(page, "/discover");
  await page.getByLabel("Search ideas by topic").fill("justice");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/ideas\?q=justice/);
  await expect(page.getByRole("link", { name: /The veil of ignorance/ }).first()).toBeVisible();
});

test("start thinking opens a new conversation", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /Start thinking/ }).click();
  await expect(page).toHaveURL(/\/reflect\/new$/);
});

test("the Try this card opens Reframe", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /Reframe a worried thought/ }).click();
  await expect(page).toHaveURL(/\/reframe$/);
  await expect(page.getByRole("heading", { level: 1, name: "Reframe a worried thought" })).toBeVisible();
});

test("the weekly perspective is still reachable from the idea library", async ({ page }) => {
  await open(page, "/ideas");
  await page.getByRole("link", { name: "This week's human perspective" }).click();
  await expect(page).toHaveURL(/\/weekly$/);
  const cards = page.locator("section[aria-labelledby='perspectives'] > ul > li");
  expect(await cards.count()).toBeGreaterThanOrEqual(2);
  expect(await cards.count()).toBeLessThanOrEqual(3);
  await expect(page.getByLabel(/Your own thoughts/)).toBeVisible();
});

test("a vibe chip opens the ideas in that theme", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /Love & friends/ }).click();
  await expect(page).toHaveURL(/theme=love-relationships/);
  await expect(page.getByRole("status")).toContainText("love and relationships");
});
