// A reusable content model for "traditions" (Natural Law first; Utilitarianism, Stoicism, and so on later).
// A tradition is plain data (see registry.ts). Adding another one means adding a content file and
// registering it: no page, component, or storage code needs to change.

export interface PhilosophyTradition {
  id: string;
  name: string;
  /** The branch this belongs to, for example "Ethics". The /ethics page lists every tradition with this category. */
  category: string;
  summary: string;
  centralQuestion: string;
  historicalContext: string;
  tenetIds: string[];
  /** Ordered list of thinkers shown on the overview. */
  thinkerIds: string[];
}

/**
 * How firmly a statement belongs to the tradition's own history:
 * - "classical":      held by major thinkers of the tradition, in some form (the card says which).
 * - "interpretation": a modern or synthesized way of putting things, not stated in these words by the classical authors.
 * - "contested":      philosophers disagree about whether it is true, or about whether the classical authors held it.
 */
export type ClaimStatus = "classical" | "interpretation" | "contested";

export interface PhilosophyTenet {
  id: string;
  traditionId: string;
  /** 1-based position in the framework. */
  number: number;
  title: string;
  /** One sentence, shown on the collapsed card. */
  definition: string;
  /** A fuller explanation, in plain language. */
  explanation: string;
  status: ClaimStatus;
  /** Where the idea comes from, in a sentence each. */
  origins: string[];
  /** What Aquinas himself said, when that differs from the broader framework. Empty when it does not apply. */
  aquinasNote?: string;
  example: string;
  reflectionQuestion: string;
  /** Slugs of concepts in the Explore Ideas library (lib/content/concepts.ts). */
  relatedConceptIds: string[];
  /** Ids of thinkers in the same tradition. */
  relatedThinkerIds: string[];
  criticisms: string[];
  sourceIds: string[];
}

export interface PhilosophyThinker {
  id: string;
  name: string;
  years: string;
  role: string;
  contribution: string;
  sourceIds: string[];
}

export interface PhilosophySource {
  id: string;
  author: string;
  title: string;
  sourceType: "primary" | "secondary";
  url?: string;
  notes: string;
}

export interface PhilosophyDistinction {
  term: string;
  meaning: string;
  /** How it differs from the tradition's own idea. */
  contrast: string;
}

export interface TimelineEntry {
  period: string;
  who: string;
  idea: string;
  thinkerId?: string;
}

export type PerspectiveKind = "criticism" | "defence" | "debate";

export interface CriticalPerspective {
  id: string;
  kind: PerspectiveKind;
  title: string;
  summary: string;
  detail: string;
  sourceIds: string[];
}

export interface TraditionOverview {
  definition: string;
  /** Explains how the tenets on the cards relate to what the philosophers actually said. */
  frameworkNote: string;
  distinctions: PhilosophyDistinction[];
  timeline: TimelineEntry[];
}

export interface TraditionBundle {
  tradition: PhilosophyTradition;
  overview: TraditionOverview;
  tenets: PhilosophyTenet[];
  thinkers: PhilosophyThinker[];
  perspectives: CriticalPerspective[];
  sources: PhilosophySource[];
}

/** A person's saved reflection on one tenet. Stored on this device for now, so userId is "local". */
export interface UserReflection {
  id: string;
  userId: string;
  tenetId: string;
  response: string;
  createdAt: string;
  updatedAt: string;
}
