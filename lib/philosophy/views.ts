import type { ClaimStatus, PhilosophyTenet, TraditionBundle } from "./types";
import { sourcesFor, tenetsOf } from "./registry";

// A tenet with its cross-references already looked up, in plain serialisable form, so the interactive
// client components receive everything they need as props and do not import the content themselves.
export interface TenetView extends PhilosophyTenet {
  concepts: { slug: string; title: string }[];
  thinkers: { id: string; name: string }[];
  sources: { id: string; label: string; url?: string }[];
}

export function tenetViews(bundle: TraditionBundle, conceptLookup: (slug: string) => { title: string } | undefined): TenetView[] {
  return tenetsOf(bundle).map((tenet) => ({
    ...tenet,
    concepts: tenet.relatedConceptIds.flatMap((slug) => {
      const concept = conceptLookup(slug);
      return concept ? [{ slug, title: concept.title }] : [];
    }),
    thinkers: tenet.relatedThinkerIds.flatMap((id) => {
      const thinker = bundle.thinkers.find((t) => t.id === id);
      return thinker ? [{ id, name: thinker.name }] : [];
    }),
    sources: sourcesFor(bundle, tenet.sourceIds).map((source) => ({ id: source.id, label: `${source.author}, ${source.title}`, url: source.url })),
  }));
}

export const STATUS_LABEL: Record<ClaimStatus, string> = {
  classical: "Classical claim",
  interpretation: "Modern interpretation",
  contested: "Contested",
};

export const STATUS_HELP: Record<ClaimStatus, string> = {
  classical: "Held by major thinkers in this tradition, in some form. The card says who.",
  interpretation: "A modern or simplified way of putting things, not stated in these words by the classical authors.",
  contested: "Philosophers disagree about whether it is true, or about whether the classical authors held it.",
};

export const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "tenets", label: "Core Tenets" },
  { id: "perspectives", label: "Critical Perspectives" },
  { id: "reflect", label: "Apply & Reflect" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export function parseSection(value: string | undefined): SectionId {
  return SECTIONS.find((s) => s.id === value)?.id ?? "overview";
}
