// The background track: "Mirrorshade" (loop 1) by cinameng (James Gargette), a dub techno loop released
// under CC0 (public domain). Source: https://opengameart.org/content/mirrorshade
// To use a different track, change these fields and put the file in public/audio/ (see its README).
export const TRACK = {
  title: "Mirrorshade",
  artist: "cinameng",
  src: "/audio/mirrorshade-1.mp3",
  licence: "CC0 1.0",
  sourceUrl: "https://opengameart.org/content/mirrorshade",
} as const;

export const MUSIC_VOLUME_KEY = "agora.music.volume.v1";
export const DEFAULT_MUSIC_VOLUME = 0.5;

// Reads a saved volume, falling back to the default for anything that is not a number from 0 to 1.
export function parseVolume(raw: string | null | undefined): number {
  const value = raw === null || raw === undefined || raw.trim() === "" ? Number.NaN : Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : DEFAULT_MUSIC_VOLUME;
}

// Whether to try playing when the page opens. The music is OFF on a first visit and makes no sound until the
// person presses play. After that it remembers the last choice: if they left it playing it tries to resume
// next time (browsers may still refuse until the page has been used), and if they paused it, it stays quiet.
export const MUSIC_ENABLED_KEY = "agora.music.enabled.v1";

export function parseEnabled(raw: string | null | undefined): boolean {
  return raw === "1";
}
