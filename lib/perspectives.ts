import raw from "./perspectives.json";
import type { Perspective } from "./types";

export const perspectives: Perspective[] = raw as Perspective[];

export function getPerspective(slug: string): Perspective | undefined {
  return perspectives.find((p) => p.slug === slug);
}

export function getPerspectives(slugs: string[]): Perspective[] {
  return slugs
    .map((s) => getPerspective(s))
    .filter((p): p is Perspective => Boolean(p));
}

export const traditions = Array.from(
  new Set(perspectives.map((p) => p.tradition))
);
