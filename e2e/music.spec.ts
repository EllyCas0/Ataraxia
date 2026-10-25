import { expect, test } from "@playwright/test";
import { open } from "./helpers";
import { TRACK } from "../lib/music";

// A tiny silent WAV (0.2 s), so the player has something real to play without the licensed track.
function silentWav(): Buffer {
  const sampleRate = 8000;
  const samples = sampleRate / 5;
  const data = Buffer.alloc(samples * 2);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const playButton = new RegExp(`Play music: ${TRACK.title} by ${TRACK.artist}`);
const isPaused = (page: import("@playwright/test").Page) => page.evaluate(() => document.querySelector("audio")!.paused);

const stubAudio = (page: import("@playwright/test").Page) => page.route(`**${TRACK.src}`, (route) => route.fulfill({ status: 200, contentType: "audio/wav", body: silentWav() }));
const playCalls = (page: import("@playwright/test").Page) => page.evaluate(() => (window as unknown as { __playCalls: number }).__playCalls);

// Counts calls to audio.play() and can make them fail the way a browser does before the person has
// interacted with the page (NotAllowedError).
async function stubPlay(page: import("@playwright/test").Page, blocked: boolean) {
  await page.addInitScript((block) => {
    const original = HTMLMediaElement.prototype.play;
    const w = window as unknown as { __playCalls: number };
    w.__playCalls = 0;
    HTMLMediaElement.prototype.play = function () {
      w.__playCalls += 1;
      if (block && w.__playCalls === 1) return Promise.reject(new DOMException("blocked", "NotAllowedError"));
      return original.call(this);
    };
  }, blocked);
}

test("on a first visit nothing plays, and the button invites you to press play", async ({ page }) => {
  await stubAudio(page);
  await stubPlay(page, false);
  await open(page, "/discover");
  expect(await isPaused(page)).toBe(true);
  expect(await playCalls(page)).toBe(0);
  await expect(page.getByRole("button", { name: playButton })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByText(TRACK.title, { exact: true })).toHaveCount(0);
  // Staying on the page and using it does not start the music either.
  await page.getByRole("heading", { level: 1 }).click();
  await page.keyboard.press("Tab");
  expect(await isPaused(page)).toBe(true);
});

test("the music control plays, pauses, and sets the volume", async ({ page }) => {
  await stubAudio(page);
  await open(page, "/discover");

  await page.getByRole("button", { name: playButton }).click();
  await expect(page.getByRole("button", { name: /Pause music/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(TRACK.title, { exact: true })).toBeVisible();
  expect(await isPaused(page)).toBe(false);

  await page.getByLabel("Music volume").fill("0.2");
  expect(await page.evaluate(() => document.querySelector("audio")!.volume)).toBeCloseTo(0.2, 1);

  await page.getByRole("button", { name: /Pause music/ }).click();
  await expect(page.getByRole("button", { name: playButton })).toHaveAttribute("aria-pressed", "false");
  expect(await isPaused(page)).toBe(true);
});

test("the music keeps playing when moving between pages", async ({ page }) => {
  await stubAudio(page);
  await open(page, "/discover");
  await page.getByRole("button", { name: playButton }).click();
  await expect(page.getByRole("button", { name: /Pause music/ })).toBeVisible();

  const nav = page.getByRole("navigation", { name: "Primary" }).filter({ visible: true });
  await nav.getByRole("link", { name: "My Philosophy" }).click();
  await expect(page).toHaveURL(/\/my-philosophy/);
  await expect(page.getByRole("button", { name: /Pause music/ })).toBeVisible();
  expect(await isPaused(page)).toBe(false);
});

test("a missing audio file shows a clear message instead of failing silently", async ({ page }) => {
  await page.route(`**${TRACK.src}`, (route) => route.fulfill({ status: 404, body: "" }));
  await open(page, "/discover");
  await page.getByRole("button", { name: playButton }).click();
  await expect(page.getByRole("status").filter({ hasText: "Audio file not found" })).toBeVisible();
});

test("the music control sits in the bottom-left corner and does not cover the navigation", async ({ page }) => {
  await open(page, "/discover");
  const button = await page.getByRole("button", { name: playButton }).boundingBox();
  const viewport = page.viewportSize()!;
  expect(button!.x).toBeLessThan(viewport.width / 3);
  expect(button!.y).toBeGreaterThan(viewport.height / 2);
  const nav = await page.getByRole("navigation", { name: "Primary" }).filter({ visible: true }).boundingBox();
  const overlaps = button!.x < nav!.x + nav!.width && button!.x + button!.width > nav!.x && button!.y < nav!.y + nav!.height && button!.y + button!.height > nav!.y;
  expect(overlaps).toBe(false);
});

test("the real track file is served as audio", async ({ request }) => {
  const response = await request.get(TRACK.src);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("audio");
  expect((await response.body()).length).toBeGreaterThan(100_000);
});

test("someone who left it playing gets it back next visit, and someone who paused it does not", async ({ page }) => {
  await stubAudio(page);
  await stubPlay(page, false);
  await open(page, "/discover");
  expect(await playCalls(page)).toBe(0);

  // Press play: that choice is remembered.
  await page.getByRole("button", { name: playButton }).click();
  await expect(page.getByRole("button", { name: /Pause music/ })).toBeVisible();
  await page.reload();
  await page.locator("html[data-hydrated='true']").waitFor();
  await expect(page.getByRole("button", { name: /Pause music/ })).toHaveAttribute("aria-pressed", "true");
  expect(await playCalls(page)).toBeGreaterThanOrEqual(1);

  // Pause: that choice is remembered too.
  await page.getByRole("button", { name: /Pause music/ }).click();
  await page.reload();
  await page.locator("html[data-hydrated='true']").waitFor();
  expect(await isPaused(page)).toBe(true);
  expect(await playCalls(page)).toBe(0);
});

test("if the browser refuses to resume, the music just stays paused, with no error and no click needed to dismiss it", async ({ page }) => {
  await stubAudio(page);
  await stubPlay(page, true);
  await open(page, "/discover", { music: true });
  expect(await playCalls(page)).toBe(1);
  expect(await isPaused(page)).toBe(true);
  await expect(page.getByRole("status").filter({ hasText: "Audio file not found" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: playButton })).toBeVisible();

  // Using the page does not start it; only the button does, and it plays once.
  await page.getByRole("heading", { level: 1 }).click();
  expect(await isPaused(page)).toBe(true);
  await page.getByRole("button", { name: playButton }).click();
  await expect(page.getByRole("button", { name: /Pause music/ })).toBeVisible();
  expect(await isPaused(page)).toBe(false);
});
