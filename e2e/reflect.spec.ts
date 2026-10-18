import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("a new conversation offers three modes and starter prompts", async ({ page }) => {
  await open(page, "/reflect/new");
  const modes = page.getByRole("radiogroup", { name: "Conversation mode" }).getByRole("radio");
  await expect(modes).toHaveCount(3);
  await expect(modes.nth(0)).toBeChecked();

  await modes.nth(2).click();
  await expect(page.getByRole("radio", { name: /Challenge my assumptions/ })).toBeChecked();

  await page.getByRole("button", { name: "Is forgiveness always a virtue?" }).click();
  await expect(page.getByLabel("Your message")).toHaveValue("Is forgiveness always a virtue?");
  await expect(page.getByRole("radio", { name: /Explore an idea/ })).toBeChecked();
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
