import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("the library lists at least twenty ideas across many traditions", async ({ page }) => {
  await open(page, "/ideas");
  await expect(page.getByRole("status")).toContainText(/\d+ ideas/);
  const count = Number((await page.getByRole("status").innerText()).match(/(\d+) ideas/)![1]);
  expect(count).toBeGreaterThanOrEqual(20);
  const options = await page.locator("#tradition option").allInnerTexts();
  expect(options.length).toBeGreaterThanOrEqual(12);
});

test("searching finds an idea and explains when nothing matches", async ({ page }) => {
  await open(page, "/ideas");
  await page.getByLabel("Search ideas").fill("ubuntu");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/q=ubuntu/);
  await expect(page.getByRole("link", { name: /Ubuntu: personhood through others/ })).toBeVisible();

  await page.getByLabel("Search ideas").fill("zzzzqxj");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByRole("status")).toContainText("No ideas match");
  await expect(page.getByText("Try fewer words")).toBeVisible();
});

test("the tradition filter narrows the results", async ({ page }) => {
  await open(page, "/ideas");
  await page.getByLabel("Tradition").selectOption("Stoicism");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByRole("link", { name: /dichotomy of control/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /The absurd/ })).toHaveCount(0);
  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page.getByRole("link", { name: /The absurd/ })).toBeVisible();
});

test("a concept page shows every section, including objections and sources", async ({ page }) => {
  await open(page, "/ideas/veil-of-ignorance");
  await expect(page.getByRole("heading", { level: 1, name: "The veil of ignorance" })).toBeVisible();
  for (const heading of ["In plain language", "Core claims", "In everyday life", "Objections and limits", "Something to ask yourself", "Related ideas", "Sources and further reading"]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(page.getByRole("region", { name: "Sources and further reading" })).toContainText("A Theory of Justice");
  await expect(page.getByText(/may simplify a debate/)).toBeVisible();
});

test("discussing an idea starts a conversation with that idea as context", async ({ page }) => {
  await open(page, "/ideas/ubuntu");
  await page.getByRole("link", { name: "Discuss this idea" }).click();
  await expect(page).toHaveURL(/\/reflect\/new\?concept=ubuntu/);
  await expect(page.getByText("Starting from:")).toBeVisible();
  await expect(page.getByLabel("Your message")).toHaveValue(/Ubuntu/);
  await expect(page.getByRole("radio", { name: /Explore an idea/ })).toBeChecked();
});

test("an unknown idea is a real 404", async ({ page }) => {
  const response = await page.goto("/ideas/not-a-real-idea");
  expect(response?.status()).toBe(404);
});

test("unknown or hostile query values are ignored rather than trusted", async ({ page }) => {
  await open(page, "/ideas?theme=%3Cscript%3Ealert(1)%3C%2Fscript%3E&tradition=nope");
  await expect(page.getByRole("status")).toContainText(/\d+ ideas/);
  await open(page, "/reflect/new?concept=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E");
  await expect(page.getByText("Starting from:")).toHaveCount(0);
});
