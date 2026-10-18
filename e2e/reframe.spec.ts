import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("the example thought can be viewed through each of the four lenses", async ({ page }) => {
  await open(page, "/reframe");
  const slider = page.getByRole("slider", { name: "Reframing lens" });
  await expect(slider).toHaveAttribute("aria-valuetext", /Anxious/);
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuetext", /Stoic/);
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuetext", /Cosmic/);
});

test("a worry typed by the person is reframed, and they can go back to the example", async ({ page }) => {
  await open(page, "/reframe");
  await page.getByLabel("A worry of your own").fill("I will fail my exam tomorrow");
  await page.getByRole("button", { name: /^Reframe/ }).click();
  await expect(page.getByText("Showing your own thought.")).toBeVisible();
  await expect(page.getByText(/I will fail my exam tomorrow/).first()).toBeAttached();
  await page.getByRole("button", { name: "Back to the example" }).click();
  await expect(page.getByText("Showing an example.")).toBeVisible();
});

test("a thought about self-harm gets a support message, not a reframe", async ({ page }) => {
  await open(page, "/reframe");
  await page.getByLabel("A worry of your own").fill("I want to end my life");
  await page.getByRole("button", { name: /^Reframe/ }).click();
  await expect(page.getByText("A moment first")).toBeVisible();
  await expect(page.getByRole("link", { name: "Find a helpline near you" })).toBeVisible();
  await expect(page.getByRole("slider")).toBeHidden();
});

test("the page states that it is not therapy", async ({ page }) => {
  await open(page, "/reframe");
  await expect(page.getByText(/not therapy or advice/)).toBeVisible();
});
