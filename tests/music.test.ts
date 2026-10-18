import { describe, expect, it } from "vitest";
import { DEFAULT_MUSIC_VOLUME, TRACK, parseVolume } from "@/lib/music";

describe("music", () => {
  it("names the track and points to a file under /audio", () => {
    expect(TRACK.title).toBe("Drone Logic");
    expect(TRACK.artist).toBe("Daniel Avery");
    expect(TRACK.src.startsWith("/audio/")).toBe(true);
  });

  it("accepts saved volumes from 0 to 1", () => {
    expect(parseVolume("0")).toBe(0);
    expect(parseVolume("0.25")).toBe(0.25);
    expect(parseVolume("1")).toBe(1);
  });

  it("falls back to the default for anything else", () => {
    for (const bad of [null, undefined, "", "  ", "loud", "-0.1", "1.5", "NaN", "Infinity"]) expect(parseVolume(bad)).toBe(DEFAULT_MUSIC_VOLUME);
  });
});
