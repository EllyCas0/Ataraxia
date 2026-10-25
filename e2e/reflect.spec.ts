import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("a starter can be edited and sent with conversation history", async ({ page }) => {
  const requests: { mode: string; messages: { content: string }[] }[] = [];
  await page.route("**/api/chat", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ json: { content: "Which part matters most to you?" } });
  });
  await open(page, "/reflect/new");
  await page.getByRole("button", { name: "Help me examine a difficult decision.", exact: true }).click();
  const composer = page.getByLabel("Your message");
  await expect(composer).toBeEnabled();
  await composer.fill("Should I change careers?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("log")).toContainText("Which part matters most to you?");
  expect(requests[0].mode).toBe("examine_dilemma");
  await composer.fill("Having time for family.");
  await composer.press("Enter");
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].messages).toHaveLength(3);
});

test("a failed send restores the draft for retry", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ status: 503, json: { error: "Replies are unavailable. Please retry." } }));
  await open(page, "/reflect/new");
  await page.getByLabel("Your message").fill("What makes a life meaningful?");
  await page.getByRole("button", { name: "Send message" }).click();
  // Next.js keeps an empty role="alert" route announcer on the page, so pick the error message by its text.
  await expect(page.getByRole("alert").filter({ hasText: "Please retry" })).toBeVisible();
  await expect(page.getByLabel("Your message")).toHaveValue("What makes a life meaningful?");
  await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();
});

test("a new conversation starts in one simple style, with the others one press away", async ({ page }) => {
  await open(page, "/reflect/new");
  await expect(page.getByText("Style:")).toContainText("Explore an idea");
  // The three styles are hidden until asked for.
  await expect(page.getByRole("radiogroup", { name: "Conversation mode" })).toHaveCount(0);

  const change = page.getByRole("button", { name: "Change style" });
  await expect(change).toHaveAttribute("aria-expanded", "false");
  await change.click();
  await expect(page.getByRole("button", { name: "Hide styles" })).toHaveAttribute("aria-expanded", "true");
  const modes = page.getByRole("radiogroup", { name: "Conversation mode" }).getByRole("radio");
  await expect(modes).toHaveCount(3);
  await expect(modes.nth(0)).toBeChecked();

  await modes.nth(2).click();
  await expect(page.getByRole("radio", { name: /Challenge my assumptions/ })).toBeChecked();
  await expect(page.getByText("Style:")).toContainText("Challenge my assumptions");
  await page.getByRole("button", { name: "Hide styles" }).click();
  await expect(page.getByRole("radiogroup", { name: "Conversation mode" })).toHaveCount(0);
  await expect(page.getByText("Style:")).toContainText("Challenge my assumptions");
});

test("there are three starter prompts, one for each style, and a starter sets the style", async ({ page }) => {
  await open(page, "/reflect/new");
  const starters = page.locator("section[aria-labelledby='starters-heading']").getByRole("button");
  await expect(starters).toHaveCount(3);
  await page.getByRole("button", { name: "What am I assuming without realizing it?" }).click();
  await expect(page.getByLabel("Your message")).toHaveValue("What am I assuming without realizing it?");
  await expect(page.getByText("Style:")).toContainText("Challenge my assumptions");
});

test("a conversation opened from a question or an idea picks its style and says so", async ({ page }) => {
  await open(page, "/reflect/new?concept=eudaimonia");
  await expect(page.getByText("Style:")).toContainText("Explore an idea");
  await expect(page.getByText("Starting from:")).toBeVisible();
  await open(page, "/reflect/new?question=breaking-a-promise");
  await expect(page.getByText("Style:")).toContainText("Examine a dilemma");
  await expect(page.getByLabel("Your message")).not.toHaveValue("");
});

test("the Reflect page has one main button and a way to reframe a worry", async ({ page }) => {
  await open(page, "/reflect");
  await expect(page.getByRole("link", { name: "New conversation" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Reframe a worried thought" })).toBeVisible();
});

test("every conversation page says the replies are AI-generated and not therapy", async ({ page }) => {
  await open(page, "/reflect/new");
  await expect(page.getByText(/not therapy, medical advice, or crisis support/)).toBeVisible();
  await open(page, "/reflect/demo-worry");
  await expect(page.getByText("AI-generated").first()).toBeVisible();
});

test("a conversation shows messages, follow-ups, and a confirmation before clearing", async ({ page }) => {
  await open(page, "/reflect/demo-worry");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Worrying");
  await expect(page.getByRole("button", { name: "Save insight" }).first()).toBeVisible();
  await expect(page.getByText("You could ask")).toBeVisible();

  await page.getByRole("button", { name: "Clear conversation" }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("cannot be undone");
  await dialog.getByRole("button", { name: "Keep it" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("picking a follow-up puts it in the message box", async ({ page }) => {
  await open(page, "/reflect/demo-worry");
  await page.getByRole("button", { name: "Where might this idea fall short?" }).click();
  await expect(page.getByLabel("Your message")).toHaveValue("Where might this idea fall short?");
});

test("the list of conversations links to each one", async ({ page }) => {
  await open(page, "/reflect");
  await page.getByRole("link", { name: /Is it ever right to break a promise/ }).click();
  await expect(page).toHaveURL(/\/reflect\/demo-promise$/);
});

test("an unknown conversation is a real 404", async ({ page }) => {
  const response = await page.goto("/reflect/not-a-conversation");
  expect(response?.status()).toBe(404);
});
