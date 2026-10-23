import { expect, test } from "@playwright/test";
import { open } from "./helpers";

test("the home page leads to Discover", async ({ page }) => {
  await open(page, "/");
  await expect(page).toHaveURL(/\/discover$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the main destinations are reachable from the navigation", async ({ page, isMobile }) => {
  await open(page, "/discover");
  const nav = page.getByRole("navigation", { name: "Primary" }).filter({ visible: true });
  await expect(nav.getByRole("link", { name: "Discover" })).toHaveAttribute("aria-current", "page");

  await nav.getByRole("link", { name: "Reflect" }).click();
  await expect(page).toHaveURL(/\/reflect$/);
  await expect(page.getByRole("heading", { level: 1, name: "Reflect" })).toBeVisible();

  await nav.getByRole("link", { name: "My Philosophy" }).click();
  await expect(page).toHaveURL(/\/my-philosophy/);
  await expect(page.getByRole("heading", { level: 1, name: "My Philosophy" })).toBeVisible();

  await nav.getByRole("link", { name: "Discover" }).click();
  await expect(page).toHaveURL(/\/discover$/);
  expect(isMobile !== undefined).toBe(true);
});

test("a new conversation can be started from anywhere", async ({ page }) => {
  for (const path of ["/discover", "/ideas", "/my-philosophy"]) {
    await page.goto(path);
    const entry = page.getByRole("link", { name: "Start a new conversation" }).filter({ visible: true });
    await expect(entry).toHaveCount(1);
    await entry.click();
    await expect(page).toHaveURL(/\/reflect\/new$/);
    await expect(page.getByRole("heading", { level: 1, name: "New conversation" })).toBeVisible();
  }
});

test("desktop shows a sidebar and mobile shows a bottom bar, never both", async ({ page, isMobile }) => {
  await open(page, "/discover");
  const navs = page.getByRole("navigation", { name: "Primary" });
  await expect(navs.filter({ visible: true })).toHaveCount(1);
  const box = await navs.filter({ visible: true }).boundingBox();
  expect(box).not.toBeNull();
  if (isMobile) {
    expect(box!.y).toBeGreaterThan(300); // pinned to the bottom of the screen
    expect(box!.width).toBeGreaterThan(300);
  } else {
    expect(box!.x).toBeLessThan(100); // pinned to the left
    expect(box!.width).toBeLessThan(120); // compact
  }
});

test("the skip link moves focus to the main content", async ({ page }) => {
  await open(page, "/discover");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("an unknown page shows a friendly not-found screen", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /isn.t here/i })).toBeVisible();
});

test("the page does not scroll sideways", async ({ page }) => {
  for (const path of ["/discover", "/ideas", "/ideas/ubuntu", "/weekly", "/reflect/demo-worry", "/my-philosophy?tab=values"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(1);
  }
});

test("the navigation has a Natural Law link that opens the Natural Law page and marks it as current", async ({ page }) => {
  await open(page, "/discover");
  const nav = page.getByRole("navigation", { name: "Primary" }).filter({ visible: true });
  await expect(nav.getByRole("link", { name: "Natural Law" })).not.toHaveAttribute("aria-current", "page");

  await nav.getByRole("link", { name: "Natural Law" }).click();
  await expect(page).toHaveURL(/\/ethics\/natural-law$/);
  await expect(page.getByRole("heading", { level: 1, name: "Natural Law" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Natural Law" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Discover" })).not.toHaveAttribute("aria-current", "page");

  // It stays marked on the other Natural Law sections and on the Ethics index.
  await open(page, "/ethics/natural-law?section=tenets");
  await expect(nav.getByRole("link", { name: "Natural Law" })).toHaveAttribute("aria-current", "page");
  await open(page, "/ethics");
  await expect(nav.getByRole("link", { name: "Natural Law" })).toHaveAttribute("aria-current", "page");
});

test("every navigation item fits on the screen, in the sidebar and in the bottom bar", async ({ page }) => {
  await open(page, "/discover");
  const nav = page.getByRole("navigation", { name: "Primary" }).filter({ visible: true });
  const viewport = page.viewportSize()!;
  const links = nav.getByRole("link");
  expect(await links.count()).toBe(4);
  for (let i = 0; i < 4; i++) {
    const box = (await links.nth(i).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  }
});
