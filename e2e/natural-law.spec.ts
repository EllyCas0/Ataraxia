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

test("Natural Law can be reached from the Ethics category", async ({ page }) => {
  await open(page, "/ideas");
  await page.getByRole("link", { name: "Ethics: guided tours" }).click();
  await expect(page).toHaveURL(/\/ethics$/);
  await expect(page.getByRole("heading", { level: 1, name: "Ethics" })).toBeVisible();
  // Scoped to the page content: the side navigation also has a "Natural Law" link.
  await page.locator("#main").getByRole("link", { name: /Natural Law/ }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law$/);
  await expect(page.getByRole("heading", { level: 1, name: "Natural Law" })).toBeVisible();
});

test("the ethics theme in the idea library points to the Natural Law tour", async ({ page }) => {
  await open(page, "/ideas?theme=ethics-morality");
  await page.getByRole("link", { name: /Natural Law: a guided tour/ }).click();
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

test("the four sections are reachable and the current one is marked", async ({ page }) => {
  await open(page, "/ethics/natural-law");
  const nav = page.getByRole("navigation", { name: "Natural Law sections" });
  await expect(nav.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  for (const [name, url] of [
    ["Core Tenets", /section=tenets/],
    ["Critical Perspectives", /section=perspectives/],
    ["Apply & Reflect", /section=reflect/],
  ] as const) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(url);
    await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
  }
  await open(page, "/ethics/natural-law?section=nonsense");
  await expect(nav.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
});

test("all ten tenet cards render with a title, a short definition, and a status label", async ({ page }) => {
  await open(page, "/ethics/natural-law?section=tenets");
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
  await open(page, "/ethics/natural-law?section=tenets");
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
  await open(page, "/ethics/natural-law?section=tenets");
  const button = toggle(page, 2);
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("each tenet has a status, and Aquinas's views are kept distinct from the broader framework", async ({ page }) => {
  await open(page, "/ethics/natural-law?section=tenets");
  await expect(card(page, 5).getByText("Modern interpretation")).toBeVisible();
  await expect(card(page, 10).getByText("Contested")).toBeVisible();
  await toggle(page, 5).click();
  await expect(card(page, 5).getByText(/does not give a list of 'basic goods'/)).toBeVisible();
  await expect(card(page, 5).getByText(/simplified synthesis of these lists/)).toBeVisible();
});

test("related ideas and thinkers are links", async ({ page }) => {
  await open(page, "/ethics/natural-law?section=tenets");
  await toggle(page, 3).click();
  await card(page, 3).getByRole("link", { name: "Virtue as a mean" }).click();
  await expect(page).toHaveURL(/\/ideas\/golden-mean/);
  await page.goBack();
  await page.locator("html[data-hydrated='true']").waitFor();
  await toggle(page, 3).click();
  await card(page, 3).getByRole("link", { name: "Aristotle" }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law\?section=overview#thinker-aristotle/);
});

test("a reflection can be written, saved, edited, and survives a refresh", async ({ page }) => {
  await open(page, "/ethics/natural-law?section=tenets");
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
  await open(page, "/ethics/natural-law?section=tenets");
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

test("saved reflections can be revisited and edited in Apply & Reflect", async ({ page }) => {
  await open(page, "/ethics/natural-law?section=tenets");
  await card(page, 4).getByRole("button", { name: "Reflect on Human Flourishing" }).click();
  await card(page, 4).getByRole("textbox").fill("A life with good friends and work that matters.");
  await card(page, 4).getByRole("button", { name: "Save reflection" }).click();

  await page.getByRole("navigation", { name: "Natural Law sections" }).getByRole("link", { name: "Apply & Reflect" }).click();
  await page.locator("html[data-hydrated='true']").waitFor();
  await expect(page.getByTestId("reflection-progress")).toHaveText("1 of 10 questions reflected on so far");
  const saved = page.getByTestId("saved-reflection");
  await expect(saved).toHaveCount(1);
  await expect(saved).toContainText("A life with good friends and work that matters.");
  await expect(page.getByTestId("open-question")).toHaveCount(9);
  // Each open question comes with a scenario.
  await expect(page.getByTestId("open-question").first()).toContainText("Scenario");

  await saved.getByRole("button", { name: "Edit your reflection on Human Flourishing" }).click();
  await saved.getByRole("textbox").fill("Friends, work that matters, and time to rest.");
  await saved.getByRole("button", { name: "Save changes" }).click();
  await page.reload();
  await page.locator("html[data-hydrated='true']").waitFor();
  await expect(page.getByTestId("saved-reflection")).toContainText("Friends, work that matters, and time to rest.");

  // Answering a new question moves it into the revisit list.
  await page.getByRole("button", { name: "Reflect on Justice" }).click();
  await page.getByRole("textbox").fill("Fairness matters even when the law is silent.");
  await page.getByRole("button", { name: "Save reflection" }).click();
  await expect(page.getByTestId("reflection-progress")).toHaveText("2 of 10 questions reflected on so far");
  await expect(page.getByTestId("saved-reflection")).toHaveCount(2);
});

test("critical perspectives include criticisms, debates, and arguments in support", async ({ page }) => {
  await open(page, "/ethics/natural-law?section=perspectives");
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
  await open(page, "/ethics/natural-law?section=tenets");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const first = (await card(page, 1).boundingBox())!;
  const second = (await card(page, 2).boundingBox())!;
  if (isMobile) expect(second.y).toBeGreaterThan(first.y + first.height - 1);
  else expect(Math.abs(second.y - first.y)).toBeLessThan(40); // two columns on desktop: side by side
});
