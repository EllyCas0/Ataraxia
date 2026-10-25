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

const styleChip = (page: import("@playwright/test").Page, label?: string) => page.getByRole("button", { name: label ? new RegExp(`Change style, now ${label}`) : /Change style/ });

test("a new conversation starts in one simple style, with the others one press away", async ({ page }) => {
  await open(page, "/reflect/new");
  await expect(styleChip(page, "Explore an idea")).toBeVisible();
  // The three styles are hidden until asked for.
  await expect(page.getByRole("radiogroup", { name: "Conversation mode" })).toHaveCount(0);

  await expect(styleChip(page)).toHaveAttribute("aria-expanded", "false");
  await styleChip(page).click();
  await expect(styleChip(page)).toHaveAttribute("aria-expanded", "true");
  const modes = page.getByRole("radiogroup", { name: "Conversation mode" }).getByRole("radio");
  await expect(modes).toHaveCount(3);
  await expect(modes.nth(0)).toBeChecked();

  // Choosing a style closes the panel and the chip names the new one.
  await modes.nth(2).click();
  await expect(page.getByRole("radiogroup", { name: "Conversation mode" })).toHaveCount(0);
  await expect(styleChip(page, "Challenge my assumptions")).toBeVisible();
  await expect(styleChip(page)).toHaveAttribute("aria-expanded", "false");

  // Opening it again and pressing the chip once more closes it without changing anything.
  await styleChip(page).click();
  await expect(page.getByRole("radio", { name: /Challenge my assumptions/ })).toBeChecked();
  await styleChip(page).click();
  await expect(page.getByRole("radiogroup", { name: "Conversation mode" })).toHaveCount(0);
  await expect(styleChip(page, "Challenge my assumptions")).toBeVisible();
});

test("there are three starter prompts, one for each style, and a starter sets the style", async ({ page }) => {
  await open(page, "/reflect/new");
  const starters = page.locator("section[aria-labelledby='starters-heading']").getByRole("button");
  await expect(starters).toHaveCount(3);
  await page.getByRole("button", { name: "What am I assuming without realizing it?" }).click();
  await expect(page.getByLabel("Your message")).toHaveValue("What am I assuming without realizing it?");
  await expect(styleChip(page, "Challenge my assumptions")).toBeVisible();
});

test("a conversation opened from a question or an idea picks its style and says so", async ({ page }) => {
  await open(page, "/reflect/new?concept=eudaimonia");
  await expect(styleChip(page, "Explore an idea")).toBeVisible();
  await expect(page.getByText("Starting from:")).toBeVisible();
  await open(page, "/reflect/new?question=breaking-a-promise");
  await expect(styleChip(page, "Examine a dilemma")).toBeVisible();
  await expect(page.getByLabel("Your message")).not.toHaveValue("");
});

test("the new-conversation page asks what is on your mind and puts the message box first", async ({ page }) => {
  await open(page, "/reflect/new");
  await expect(page).toHaveTitle("New conversation · Stoa");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("What's on your mind?");
  await expect(page.getByText("Bring a question, an idea, or a decision.")).toHaveCount(0);

  const box = (await page.getByLabel("Your message").boundingBox())!;
  const starters = (await page.getByRole("heading", { level: 2, name: "Need a place to start?" }).boundingBox())!;
  const notice = (await page.getByText(/not therapy, medical advice, or crisis support/).boundingBox())!;
  const title = (await heading.boundingBox())!;
  // Headline, then the box, then the starters, then the notice.
  expect(title.y).toBeLessThan(box.y);
  expect(box.y).toBeLessThan(starters.y);
  expect(starters.y).toBeLessThan(notice.y);
  // The box is roomy: at least about four lines of text tall, and high up the page.
  expect(box.height).toBeGreaterThanOrEqual(100);
  expect(box.y).toBeLessThan(page.viewportSize()!.height * 0.5);
});

test("the style chip and the send button sit inside the message box", async ({ page }) => {
  await open(page, "/reflect/new");
  const outer = (await page.getByLabel("Your message").locator("xpath=..").boundingBox())!;
  const chip = (await styleChip(page).boundingBox())!;
  const send = (await page.getByRole("button", { name: "Send message" }).boundingBox())!;
  for (const inner of [chip, send]) {
    expect(inner.x).toBeGreaterThanOrEqual(outer.x);
    expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
    expect(inner.y).toBeGreaterThanOrEqual(outer.y);
    expect(inner.y + inner.height).toBeLessThanOrEqual(outer.y + outer.height);
  }
  // The chip is at the left, the send button at the right.
  expect(chip.x).toBeLessThan(send.x);
});

test("the send button looks clearly off when empty and clearly on when there is text", async ({ page }) => {
  await open(page, "/reflect/new");
  const send = page.getByRole("button", { name: "Send message" });
  const look = () => send.evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, opacity: getComputedStyle(el).opacity }));
  await expect(send).toBeDisabled();
  const off = await look();
  expect(off.opacity).toBe("1"); // greyed by colour, not faded into the lime
  await page.getByLabel("Your message").fill("Is it ever right to lie?");
  await expect(send).toBeEnabled();
  const on = await look();
  expect(on.bg).not.toBe(off.bg);
  await page.getByLabel("Your message").fill("   ");
  await expect(send).toBeDisabled();
});

test("the keyboard hint is inside the box on wide screens, and a problem is shown below it", async ({ page, isMobile }) => {
  await open(page, "/reflect/new");
  const hint = page.getByText("Enter to send · Shift+Enter for a new line");
  if (isMobile) await expect(hint).toBeHidden();
  else {
    await expect(hint).toBeVisible();
    const outer = (await page.getByLabel("Your message").locator("xpath=..").boundingBox())!;
    const h = (await hint.boundingBox())!;
    expect(h.y + h.height).toBeLessThanOrEqual(outer.y + outer.height);
  }
  await page.getByLabel("Your message").fill("x".repeat(4001));
  await expect(page.getByRole("status").filter({ hasText: "1 characters too long" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send message" })).toBeDisabled();
});

test("the AI notice is still there, as a quiet line", async ({ page }) => {
  await open(page, "/reflect/new");
  const notice = page.getByText(/not therapy, medical advice, or crisis support/);
  await expect(notice).toBeVisible();
  // No box around it on this page.
  expect(await notice.locator("xpath=..").evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe("0px");
});

test("the starter prompts go away once a conversation has begun", async ({ page }) => {
  await page.route("**/api/chat", (route) => route.fulfill({ json: { content: "What do you mean by meaningful?" } }));
  await open(page, "/reflect/new");
  await expect(page.getByRole("heading", { level: 2, name: "Need a place to start?" })).toBeVisible();
  await page.getByLabel("Your message").fill("What makes a life meaningful?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("log")).toContainText("What do you mean by meaningful?");
  await expect(page.getByRole("heading", { level: 2, name: "Need a place to start?" })).toHaveCount(0);
  await expect(page.getByLabel("Your message")).toBeVisible();
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
