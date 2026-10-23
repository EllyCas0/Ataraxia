import { naturalLawBundle } from "./natural-law";
import type { PhilosophySource, PhilosophyTenet, PhilosophyThinker, TraditionBundle } from "./types";

// Every tradition available in the app. To add one (say, Utilitarianism), write a content file shaped
// like natural-law.ts and add its bundle here. Nothing else needs to change.
export const bundles: TraditionBundle[] = [naturalLawBundle];

export function getBundle(id: string): TraditionBundle | undefined {
  return bundles.find((bundle) => bundle.tradition.id === id);
}

export function bundlesInCategory(category: string, all: TraditionBundle[] = bundles): TraditionBundle[] {
  return all.filter((bundle) => bundle.tradition.category.toLowerCase() === category.toLowerCase());
}

/** The tenets of a tradition, in their framework order. */
export function tenetsOf(bundle: TraditionBundle): PhilosophyTenet[] {
  return [...bundle.tenets].sort((a, b) => a.number - b.number);
}

export function thinkersOf(bundle: TraditionBundle): PhilosophyThinker[] {
  return bundle.tradition.thinkerIds.map((id) => bundle.thinkers.find((thinker) => thinker.id === id)).filter((t): t is PhilosophyThinker => Boolean(t));
}

export function sourcesFor(bundle: TraditionBundle, ids: string[]): PhilosophySource[] {
  return ids.map((id) => bundle.sources.find((source) => source.id === id)).filter((s): s is PhilosophySource => Boolean(s));
}

/** Finds the tenet with this id in any tradition, for example to label a saved reflection. */
export function findTenet(tenetId: string, all: TraditionBundle[] = bundles): { bundle: TraditionBundle; tenet: PhilosophyTenet } | undefined {
  for (const bundle of all) {
    const tenet = bundle.tenets.find((t) => t.id === tenetId);
    if (tenet) return { bundle, tenet };
  }
  return undefined;
}
