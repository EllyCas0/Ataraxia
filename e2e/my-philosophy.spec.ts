import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("the privacy notice appears on title hover and there are three areas", async ({ page }) => {
  await open(page, "/my-philosophy");
  await expect(page.getByLabel("Privacy")).toBeHidden();
  await page.getByRole("button", { name: "My Philosophy", exact: true }).hover();
  await expect(page.getByLabel("Privacy")).toContainText("private to you");
  await expect(page.getByRole("tab")).toHaveCount(3);
  for (const name of ["Journal & saved", "My values", "History"]) {
    await expect(page.getByRole("tab", { name })).toBeVisible();
  }
  await expect(page.getByRole("tab", { name: "Saved insights" })).toHaveCount(0);
});

test("the tab in the address is opened, and unknown tabs fall back to the journal", async ({ page }) => {
  await open(page, "/my-philosophy?tab=values");
  await expect(page.getByRole("tab", { name: "My values" })).toHaveAttribute("aria-selected", "true");
  await open(page, "/my-philosophy?tab=banana");
  await expect(page.getByRole("tab", { name: "Journal & saved" })).toHaveAttribute("aria-selected", "true");
});

test("an old link to the saved tab opens the journal tab, which now includes saved items", async ({ page }) => {
  await open(page, "/my-philosophy?tab=saved");
  await expect(page.getByRole("tab", { name: "Journal & saved" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { level: 2, name: "Saved for later" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Remove “Bad faith”/ })).toBeVisible();
});

test("journal entries can be created, edited, and deleted", async ({ page }) => {
  await open(page, "/my-philosophy");
  await page.getByRole("button", { name: "New entry" }).click();
  await page.getByLabel(/Title/).fill("A test thought");
  await page.getByLabel("Reflection").fill("First version of the thought.");
  await page.getByRole("button", { name: "Save entry" }).click();
  const entry = page.locator("li", { hasText: "A test thought" });
  await expect(entry).toContainText("First version of the thought.");

  await entry.getByRole("button", { name: /Edit A test thought/ }).click();
  await page.getByLabel("Reflection").fill("Second, better version.");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(entry).toContainText("Second, better version.");
  await expect(entry).toContainText("edited");

  await entry.getByRole("button", { name: /Delete A test thought/ }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete entry" }).click();
  await expect(page.locator("li", { hasText: "A test thought" })).toHaveCount(0);
});

test("an empty journal entry cannot be saved", async ({ page }) => {
  await open(page, "/my-philosophy");
  await page.getByRole("button", { name: "New entry" }).click();
  await expect(page.getByRole("button", { name: "Save entry" })).toBeDisabled();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByLabel("Reflection")).toHaveCount(0);
});

test("values can be ranked, reordered, and limited to five", async ({ page }) => {
  await open(page, "/my-philosophy?tab=values");
  const ranked = page.locator("ol").first().locator("li");
  await expect(ranked).toHaveCount(3);

  await page.getByRole("button", { name: "Move Curiosity up" }).click();
  await expect(ranked.first()).toContainText("Curiosity");

  await page.getByRole("button", { name: "Courage" }).click();
  await page.getByLabel("Or add your own").fill("Stewardship");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(ranked).toHaveCount(5);
  await expect(page.getByText("You have 5 values")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add" })).toBeDisabled();

  await page.getByRole("button", { name: "Remove Courage" }).click();
  await expect(ranked).toHaveCount(4);
});

test("a duplicate custom value is rejected with a clear message", async ({ page }) => {
  await open(page, "/my-philosophy?tab=values");
  await page.getByLabel("Or add your own").fill("  truth ");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("#custom-value-error")).toContainText("already on your list");
});

test("saved items sit under the journal and can be removed, and history lists everything", async ({ page }) => {
  await open(page, "/my-philosophy");
  const saved = page.locator("section[aria-labelledby='saved-heading']");
  const items = saved.locator("ul > li");
  const before = await items.count();
  expect(before).toBeGreaterThan(0);
  await page.getByRole("button", { name: /^Remove “Bad faith”/ }).click();
  await expect(items).toHaveCount(before - 1);

  await page.getByRole("tab", { name: "History" }).click();
  await expect(page.getByRole("tabpanel").locator("ol > li").first()).toBeVisible();
});
