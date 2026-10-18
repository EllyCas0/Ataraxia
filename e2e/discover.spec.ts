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

test("start reflecting opens a new conversation", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /Start reflecting/ }).click();
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
