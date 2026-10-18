// The background track. The audio file is NOT in the repository: add a copy you have the right to
// publish as public/audio/drone-logic.mp3 (see public/audio/README.md).
export const TRACK = {
  title: "Drone Logic",
  artist: "Daniel Avery",
  src: "/audio/drone-logic.mp3",
} as const;

export const MUSIC_VOLUME_KEY = "agora.music.volume.v1";
export const DEFAULT_MUSIC_VOLUME = 0.5;

// Reads a saved volume, falling back to the default for anything that is not a number from 0 to 1.
export function parseVolume(raw: string | null | undefined): number {
  const value = raw === null || raw === undefined || raw.trim() === "" ? Number.NaN : Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : DEFAULT_MUSIC_VOLUME;
}
