import raw from "./philosophers.json";
import type { Philosopher } from "./types";

export const philosophers: Philosopher[] = raw as Philosopher[];

export function getPhilosopher(slug: string): Philosopher | undefined {
  return philosophers.find((p) => p.slug === slug);
}

export function getPhilosophers(slugs: string[]): Philosopher[] {
  return slugs
    .map((s) => getPhilosopher(s))
    .filter((p): p is Philosopher => Boolean(p));
}

// Best-effort resolve: names in influences/influenced are plain strings and
// may not all be in the (intentionally scoped) database — only link the ones
// that are.
export function resolveNamesToPhilosophers(names: string[]): Philosopher[] {
  return names
    .map((name) => philosophers.find((p) => name.toLowerCase().includes(p.name.toLowerCase().split(" (")[0].toLowerCase())))
    .filter((p): p is Philosopher => Boolean(p));
}
