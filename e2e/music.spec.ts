import { expect, test } from "@playwright/test";
import { open } from "./helpers";

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

const playButton = /Play music: Drone Logic by Daniel Avery/;
const isPaused = (page: import("@playwright/test").Page) => page.evaluate(() => document.querySelector("audio")!.paused);

test("the music control plays, pauses, and sets the volume", async ({ page }) => {
  await page.route("**/audio/drone-logic.mp3", (route) => route.fulfill({ status: 200, contentType: "audio/wav", body: silentWav() }));
  await open(page, "/discover");

  // Nothing plays by itself.
  expect(await isPaused(page)).toBe(true);
  await expect(page.getByText("Drone Logic")).toHaveCount(0);

  await page.getByRole("button", { name: playButton }).click();
  await expect(page.getByRole("button", { name: /Pause music/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Drone Logic", { exact: true })).toBeVisible();
  expect(await isPaused(page)).toBe(false);

  await page.getByLabel("Music volume").fill("0.2");
  expect(await page.evaluate(() => document.querySelector("audio")!.volume)).toBeCloseTo(0.2, 1);

  await page.getByRole("button", { name: /Pause music/ }).click();
  await expect(page.getByRole("button", { name: playButton })).toHaveAttribute("aria-pressed", "false");
  expect(await isPaused(page)).toBe(true);
});

test("the music keeps playing when moving between pages", async ({ page }) => {
  await page.route("**/audio/drone-logic.mp3", (route) => route.fulfill({ status: 200, contentType: "audio/wav", body: silentWav() }));
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
  await page.route("**/audio/drone-logic.mp3", (route) => route.fulfill({ status: 404, body: "" }));
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
