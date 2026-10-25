import { describe, expect, it } from "vitest";
import { DEFAULT_MUSIC_VOLUME, TRACK, parseEnabled, parseVolume } from "@/lib/music";

describe("music", () => {
  it("names the track and points to a file under /audio", () => {
    expect(TRACK.title.length).toBeGreaterThan(0);
    expect(TRACK.artist.length).toBeGreaterThan(0);
    expect(TRACK.src.startsWith("/audio/")).toBe(true);
  });

  it("only ships a track whose file exists and whose licence is recorded", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    expect(existsSync(join(process.cwd(), "public", TRACK.src))).toBe(true);
    expect(TRACK.licence.length).toBeGreaterThan(0);
    expect(TRACK.sourceUrl.startsWith("https://")).toBe(true);
  });

  it("accepts saved volumes from 0 to 1", () => {
    expect(parseVolume("0")).toBe(0);
    expect(parseVolume("0.25")).toBe(0.25);
    expect(parseVolume("1")).toBe(1);
  });

  it("falls back to the default for anything else", () => {
    for (const bad of [null, undefined, "", "  ", "loud", "-0.1", "1.5", "NaN", "Infinity"]) expect(parseVolume(bad)).toBe(DEFAULT_MUSIC_VOLUME);
  });

  it("stays off on a first visit and only tries to resume if the person last left it playing", () => {
    expect(parseEnabled(null)).toBe(false);
    expect(parseEnabled(undefined)).toBe(false);
    expect(parseEnabled("")).toBe(false);
    expect(parseEnabled("garbage")).toBe(false);
    expect(parseEnabled("0")).toBe(false);
    expect(parseEnabled("1")).toBe(true);
  });
});
