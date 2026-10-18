import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("the question of the day is shown and stays the same when the page is reloaded", async ({ page }) => {
  await open(page, "/discover");
  const heading = page.locator("section[aria-labelledby='qotd-heading'] h2").first();
  await expect(heading).toBeVisible();
  const first = await heading.innerText();
  expect(first.endsWith("?")).toBe(true);

  for (let i = 0; i < 3; i++) {
    await page.reload();
    await expect(heading).toHaveText(first);
  }
});

test("considering the daily question opens a conversation that starts from it", async ({ page }) => {
  await open(page, "/discover");
  const question = await page.locator("section[aria-labelledby='qotd-heading'] h2").first().innerText();
  await page.getByRole("link", { name: /Consider this question/ }).click();
  await expect(page).toHaveURL(/\/reflect\/new\?question=/);
  await expect(page.getByText("Starting from:")).toBeVisible();
  await expect(page.getByLabel("Your message")).toHaveValue(question);
});

test("today's topic links to the ideas in that theme", async ({ page }) => {
  await open(page, "/discover");
  await page.locator("section[aria-labelledby='qotd-heading'] a").first().click();
  await expect(page).toHaveURL(/\/ideas\?theme=/);
  await expect(page.getByRole("status")).toContainText("ideas");
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

test("the weekly card opens the comparison", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /^This week:/ }).click();
  await expect(page).toHaveURL(/\/weekly$/);
  const cards = page.locator("section[aria-labelledby='perspectives'] > ul > li");
  expect(await cards.count()).toBeGreaterThanOrEqual(2);
  expect(await cards.count()).toBeLessThanOrEqual(3);
  await expect(page.getByLabel(/Your own thoughts/)).toBeVisible();
});
