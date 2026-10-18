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

test("reflecting on the daily question opens a conversation that starts from it", async ({ page }) => {
  await open(page, "/discover");
  const question = await page.locator("section[aria-labelledby='qotd-heading'] h2").first().innerText();
  await page.getByRole("link", { name: /Reflect on this with the AI/ }).click();
  await expect(page).toHaveURL(/\/reflect\/new\?question=/);
  await expect(page.getByText("Starting from:")).toBeVisible();
  await expect(page.getByLabel("Your message")).toHaveValue(question);
});

test("browse-by-theme links filter the idea library", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: /Death and impermanence/ }).first().click();
  await expect(page).toHaveURL(/theme=death-impermanence/);
  await expect(page.getByRole("status")).toContainText("in death and impermanence");
  await expect(page.getByRole("link", { name: /Impermanence/ }).first()).toBeVisible();
});

test("the weekly perspective card opens the comparison", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: "Compare the perspectives" }).click();
  await expect(page).toHaveURL(/\/weekly$/);
  const cards = page.locator("section[aria-labelledby='perspectives'] > ul > li");
  expect(await cards.count()).toBeGreaterThanOrEqual(2);
  expect(await cards.count()).toBeLessThanOrEqual(3);
  await expect(page.getByLabel(/Your own thoughts/)).toBeVisible();
});

test("featured ideas open their detail page", async ({ page }) => {
  await open(page, "/discover");
  const card = page.locator("section[aria-label='Featured ideas'] a").first();
  const title = await card.locator("h3").innerText();
  await card.click();
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
});
