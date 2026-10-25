import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { open } from "./helpers";

const TITLES = [
  "Objective Morality",
  "Human Nature",
  "Practical Reason",
  "Human Flourishing",
  "Basic Human Goods",
  "Justice",
  "The Common Good",
  "Virtue",
  "Moral Responsibility",
  "Moral Limits of Authority",
];

const card = (page: Page, n: number) => page.locator(`#tenet-${n}`);
// The card's own expand/collapse button lives inside its heading (the "Reflect" button does not).
const toggle = (page: Page, n: number) => card(page, n).getByRole("heading", { level: 3 }).getByRole("button");

test("Natural Law can be reached from Discover through Ideas", async ({ page }) => {
  await open(page, "/discover");
  await page.getByRole("link", { name: "Browse ideas" }).click();
  await page.getByRole("link", { name: "Natural Law: a guided tour" }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law$/);
  await expect(page.getByRole("heading", { level: 1, name: "Natural Law" })).toBeVisible();
});

test("the Ethics category lists Natural Law and the breadcrumb leads back to it", async ({ page }) => {
  await open(page, "/ethics/natural-law");
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Ethics" }).click();
  await expect(page).toHaveURL(/\/ethics$/);
  await expect(page.getByRole("heading", { level: 1, name: "Ethics" })).toBeVisible();
  // Scoped to the page content, which has the card for the tour.
  await page.locator("#main").getByRole("link", { name: /Natural Law/ }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law$/);
});

test("the ethics theme in the idea library points to the Natural Law tour", async ({ page }) => {
  await open(page, "/ideas?theme=ethics-morality");
  await page.getByRole("link", { name: /Go deeper into Natural Law/ }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law$/);
});

test("the overview covers the definition, central question, thinkers, history, and key distinctions", async ({ page }) => {
  await open(page, "/ethics/natural-law");
  await expect(page.getByRole("heading", { name: "What is Natural Law?" })).toBeVisible();
  await expect(page.getByText("Are there objective moral principles grounded in human nature, reason, or the natural order?")).toBeVisible();
  for (const thinker of ["Aristotle", "The Stoics", "Cicero", "Thomas Aquinas", "John Locke"]) {
    await expect(page.locator("#thinkers").locator("..").getByRole("heading", { level: 3, name: thinker })).toBeVisible();
  }
  for (const term of ["Natural law", "Natural rights", "Positive law", "Scientific laws of nature"]) {
    await expect(page.locator("#distinctions").locator("..").locator("dt", { hasText: term })).toBeVisible();
  }
  await expect(page.getByText(/synthesized introductory framework/)).toBeVisible();
  await expect(page.getByText(/not an official list/)).toBeVisible();
});

test("the overview starts with where it comes from, then the four ideas that are easy to mix up", async ({ page }) => {
  await open(page, "/ethics/natural-law");
  const headings = await page.locator("#main").getByRole("heading", { level: 2 }).allInnerTexts();
  expect(headings.slice(0, 4)).toEqual(["Where it comes from", "Four ideas that are easy to mix up", "What is Natural Law?", "How to read this module"]);
  expect(headings).toContain("Major thinkers");
  // Both are on screen without scrolling past the definition.
  const history = (await page.getByRole("heading", { level: 2, name: "Where it comes from" }).boundingBox())!;
  const definition = (await page.getByRole("heading", { level: 2, name: "What is Natural Law?" }).boundingBox())!;
  expect(history.y).toBeLessThan(definition.y);
  await expect(page.locator("#history").locator("..").getByRole("listitem")).toHaveCount(6);
  await expect(page.locator("#distinctions").locator("..").locator("dt")).toHaveText(["Natural law", "Natural rights", "Positive law", "Scientific laws of nature"]);
});

test("the three sections are reachable, the current one is marked, and there is no Apply & Reflect page", async ({ page }) => {
  await open(page, "/ethics/natural-law");
  const nav = page.getByRole("navigation", { name: "Natural Law sections" });
  await expect(nav.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  for (const [name, url] of [
    ["Core Tenets", /\/ethics\/natural-law\/tenets$/],
    ["Critical Perspectives", /\/ethics\/natural-law\/perspectives$/],
  ] as const) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(url);
    await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
  }
  await expect(nav.getByRole("link")).toHaveText(["Overview", "Core Tenets", "Critical Perspectives"]);
  await expect(nav.getByRole("link", { name: "Apply & Reflect" })).toHaveCount(0);
  // The Apply & Reflect page is gone for good: its address is a real 404, and an old ?section=reflect link just shows the overview.
  expect((await page.goto("/ethics/natural-law/reflect"))?.status()).toBe(404);
  await page.goto("/ethics/natural-law?section=reflect");
  await expect(page).toHaveURL(/\/ethics\/natural-law\?section=reflect$/);
  await expect(page.getByRole("heading", { level: 2, name: "Where it comes from" })).toBeVisible();
  // An unknown section is a real 404, not a quiet fallback.
  expect((await page.goto("/ethics/natural-law/nonsense"))?.status()).toBe(404);
  expect((await page.goto("/ethics/natural-law/tenets/extra"))?.status()).toBe(404);
  // Old links that chose the section with ?section= still work.
  await page.goto("/ethics/natural-law?section=perspectives");
  await expect(page).toHaveURL(/\/ethics\/natural-law\/perspectives/);
  await expect(page.getByRole("heading", { level: 2, name: "Major criticisms" })).toBeVisible();
});

test("all ten tenet cards render with a title, a short definition, and a status label", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  const cards = page.getByRole("list", { name: "Core tenets" }).locator("> li");
  await expect(cards).toHaveCount(10);
  for (let n = 1; n <= 10; n++) {
    await expect(card(page, n).getByRole("heading", { level: 3 })).toContainText(TITLES[n - 1]);
    await expect(card(page, n).getByText(/Classical claim|Modern interpretation|Contested/).first()).toBeVisible();
  }
  // Collapsed cards do not show the long explanation yet.
  await expect(card(page, 1).getByText("A real-world example")).toHaveCount(0);
});

test("a tenet card expands to show every part, and collapses again", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  const one = card(page, 1);
  await toggle(page, 1).click();
  const region = one.getByRole("region");
  await expect(toggle(page, 1)).toHaveAttribute("aria-expanded", "true");
  for (const heading of ["Explained", "Where it comes from", "What Aquinas specifically said", "A real-world example", "Challenges to consider", "Reflect", "Related ideas", "Related thinkers", "Sources"]) {
    await expect(region.getByRole("heading", { level: 4, name: heading })).toBeVisible();
  }
  await expect(region.getByText(/participation in the eternal law|part of God's eternal law/)).toBeVisible();
  await toggle(page, 1).click();
  await expect(one.getByRole("region")).toHaveCount(0);
  await expect(toggle(page, 1)).toHaveAttribute("aria-expanded", "false");
});

test("cards can be opened and closed from the keyboard", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  const button = toggle(page, 2);
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("each tenet has a status, and Aquinas's views are kept distinct from the broader framework", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  await expect(card(page, 5).getByText("Modern interpretation")).toBeVisible();
  await expect(card(page, 10).getByText("Contested")).toBeVisible();
  await toggle(page, 5).click();
  await expect(card(page, 5).getByText(/does not give a list of 'basic goods'/)).toBeVisible();
  await expect(card(page, 5).getByText(/simplified synthesis of these lists/)).toBeVisible();
});

test("related ideas and thinkers are links", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  await toggle(page, 3).click();
  await card(page, 3).getByRole("link", { name: "Virtue as a mean" }).click();
  await expect(page).toHaveURL(/\/ideas\/golden-mean/);
  await page.goBack();
  await page.locator("html[data-hydrated='true']").waitFor();
  await toggle(page, 3).click();
  await card(page, 3).getByRole("link", { name: "Aristotle" }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law#thinker-aristotle/);
});

test("a reflection can be written, saved, edited, and survives a refresh", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  await card(page, 1).getByRole("button", { name: "Reflect on Objective Morality" }).click();
  const box = card(page, 1).getByRole("textbox");
  await expect(box).toBeFocused();
  await expect(card(page, 1).getByRole("button", { name: "Save reflection" })).toBeDisabled();

  await box.fill("I think some things are wrong whatever anyone says, like cruelty for fun.");
  await card(page, 1).getByRole("button", { name: "Save reflection" }).click();
  await expect(card(page, 1).getByRole("status")).toContainText("Saved");
  await expect(card(page, 1).getByText("Reflection saved")).toBeVisible();

  // The page never grades the answer.
  await expect(card(page, 1).getByText(/correct|incorrect|wrong answer/i)).toHaveCount(0);

  await page.reload();
  await page.locator("html[data-hydrated='true']").waitFor();
  await expect(card(page, 1).getByText("Reflection saved")).toBeVisible();
  await card(page, 1).getByRole("button", { name: "Revisit reflection on Objective Morality" }).or(card(page, 1).getByRole("button", { name: "Reflect on Objective Morality" })).click();
  await expect(card(page, 1).getByRole("textbox")).toHaveValue("I think some things are wrong whatever anyone says, like cruelty for fun.");

  await card(page, 1).getByRole("textbox").fill("I changed my mind a little: it depends on the context.");
  await expect(card(page, 1).getByRole("status")).toContainText("Unsaved changes");
  await card(page, 1).getByRole("button", { name: "Save changes" }).click();
  await page.reload();
  await page.locator("html[data-hydrated='true']").waitFor();
  await toggle(page, 1).click();
  await expect(card(page, 1).getByRole("textbox")).toHaveValue("I changed my mind a little: it depends on the context.");
});

test("discarding changes restores the saved text, and a reflection can be deleted after confirming", async ({ page }) => {
  await open(page, "/ethics/natural-law/tenets");
  await card(page, 2).getByRole("button", { name: "Reflect on Human Nature" }).click();
  await card(page, 2).getByRole("textbox").fill("Reason and relationships.");
  await card(page, 2).getByRole("button", { name: "Save reflection" }).click();
  await card(page, 2).getByRole("textbox").fill("Something else entirely");
  await card(page, 2).getByRole("button", { name: "Discard changes" }).click();
  await expect(card(page, 2).getByRole("textbox")).toHaveValue("Reason and relationships.");

  await card(page, 2).getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Keep it" }).click();
  await expect(card(page, 2).getByRole("textbox")).toHaveValue("Reason and relationships.");
  await card(page, 2).getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete reflection" }).click();
  await expect(card(page, 2).getByText("Reflection saved")).toHaveCount(0);
});

test("critical perspectives include criticisms, debates, and arguments in support", async ({ page }) => {
  await open(page, "/ethics/natural-law/perspectives");
  for (const heading of ["Major criticisms", "Open debates", "Arguments in support"]) await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible();
  for (const title of ["The is–ought problem", "Cultural and historical bias", "Religious and secular versions", "Individual freedom and the common good"]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
  const isOught = page.locator("details", { hasText: "The is–ought problem" });
  await expect(isOught).not.toHaveAttribute("open", "");
  await isOught.locator("summary").click();
  await expect(isOught).toHaveAttribute("open", "");
  await expect(isOught.getByText(/Hume observed/)).toBeVisible();
  await expect(isOught.getByRole("link", { name: /Natural Law Theories|Hume|Finnis/ }).first().or(isOught.getByText(/Sources:/))).toBeVisible();
});

test("an unknown tradition is a 404", async ({ page }) => {
  const response = await page.goto("/ethics/not-a-tradition");
  expect(response?.status()).toBe(404);
});

test("the page fits the screen and the tenet cards stack on a phone", async ({ page, isMobile }) => {
  await open(page, "/ethics/natural-law/tenets");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const first = (await card(page, 1).boundingBox())!;
  const second = (await card(page, 2).boundingBox())!;
  if (isMobile) expect(second.y).toBeGreaterThan(first.y + first.height - 1);
  else expect(Math.abs(second.y - first.y)).toBeLessThan(40); // two columns on desktop: side by side
});
