import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("journal creation, editing and deletion survive reloads", async ({ page }, testInfo) => {
  await open(page, "/my-philosophy");
  await expect(page.getByText("Saved in this browser. Not synced between devices.").first()).toBeVisible();
  await page.getByRole("button", { name: "New entry" }).click();
  await page.getByLabel("Title (optional)").fill("Persistence test");
  await page.getByLabel("Reflection", { exact: true }).fill("My first reflection.");
  await page.getByRole("button", { name: "Save entry", exact: true }).click();
  await page.reload();
  await expect(page.getByText("My first reflection.", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("journal-persisted.png"), fullPage: true });
  await page.getByRole("button", { name: "Edit Persistence test", exact: true }).click();
  await page.getByLabel("Reflection", { exact: true }).fill("My revised reflection.");
  await page.getByRole("button", { name: "Save entry", exact: true }).click();
  await page.reload();
  await expect(page.getByText("My revised reflection.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete Persistence test", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete entry", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Persistence test", exact: true })).toHaveCount(0);
});

test("saved ideas sync between tabs, survive reload and can be removed", async ({ page, context }) => {
  test.setTimeout(60_000);
  await open(page, "/ideas/dichotomy-of-control");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute("aria-pressed", "true");
  const library = await context.newPage();
  await open(library, "/my-philosophy");
  const saved = library.getByRole("region", { name: "Saved for later" });
  await expect(saved.getByRole("link", { name: "The dichotomy of control", exact: true })).toBeVisible();
  await saved.getByRole("button", { name: /Remove/ }).click();
  await page.bringToFront();
  await expect(page.getByRole("button", { name: "Save", exact: true })).toHaveAttribute("aria-pressed", "false");
  await library.bringToFront();
  await library.reload();
  await expect(saved.getByRole("link", { name: "The dichotomy of control", exact: true })).toHaveCount(0);
});

test("example insights persist without duplicates and can be removed", async ({ page }) => {
  await open(page, "/reflect");
  await expect(page.getByRole("heading", { name: "Example conversations", exact: true })).toBeVisible();
  await expect(page.getByText("Read-only", { exact: true })).toHaveCount(3);
  await page.getByRole("link", { name: /Worrying about things/ }).click();
  await expect(page.getByText(/Read-only example. Save responses/)).toBeVisible();
  await expect(page.getByLabel("Your message")).toBeDisabled();
  await page.getByRole("button", { name: "Save insight", exact: true }).click();
  await page.getByRole("button", { name: "Save insight", exact: true }).click();
  await open(page, "/my-philosophy");
  const saved = page.getByRole("region", { name: "Saved for later" });
  await expect(saved.locator("li")).toHaveCount(1);
  await page.reload();
  await expect(saved).toContainText("Epictetus");
  await saved.getByRole("button", { name: /Remove/ }).click();
  await page.reload();
  await expect(saved.locator("li")).toHaveCount(0);
});

test("unavailable chat is explained before input and sends no requests", async ({ page }) => {
  let requests = 0;
  page.on("request", (request) => { if (request.url().endsWith("/api/chat")) requests++; });
  await open(page, "/reflect?concept=dichotomy-of-control");
  test.skip(await page.getByLabel("Your message").isEnabled(), "This environment has live chat configured");
  await expect(page.getByRole("status").filter({ hasText: "Chat is not available yet" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send message", exact: true })).toBeDisabled();
  expect(requests).toBe(0);
});

test("failed storage writes keep the journal draft and report failure", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Full", "QuotaExceededError"); };
  });
  await open(page, "/my-philosophy");
  await page.getByRole("button", { name: "New entry" }).click();
  await page.getByLabel("Reflection", { exact: true }).fill("Keep this draft");
  await page.getByRole("button", { name: "Save entry", exact: true }).click();
  await expect(page.getByText(/Could not save in this browser/)).toBeVisible();
  await expect(page.getByLabel("Reflection", { exact: true })).toHaveValue("Keep this draft");
});

test("invalid stored content does not crash or get silently overwritten", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("stoa.journal.v1", "broken-json"));
  await open(page, "/my-philosophy");
  await page.getByRole("button", { name: "New entry" }).click();
  await page.getByLabel("Reflection", { exact: true }).fill("A new draft");
  await page.getByRole("button", { name: "Save entry", exact: true }).click();
  await expect(page.getByText(/Could not save in this browser/)).toBeVisible();
  await expect(page.getByLabel("Reflection", { exact: true })).toHaveValue("A new draft");
});
