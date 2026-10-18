export type PublicationStatus = "draft" | "approved" | "archived";

export const THEME_SLUGS = [
  "meaning-purpose",
  "identity-self-knowledge",
  "ethics-morality",
  "love-relationships",
  "freedom-responsibility",
  "death-impermanence",
  "knowledge-truth",
  "society-technology-humanity",
] as const;

export type ThemeSlug = (typeof THEME_SLUGS)[number];

export interface Theme {
  slug: ThemeSlug;
  name: string;
  description: string;
}

export interface SourceReference {
  kind: "primary" | "secondary";
  author: string;
  title: string;
  year?: string;
  location?: string; // for example a book, section, or chapter
  note?: string;
}

export interface Concept {
  slug: string;
  title: string;
  contentType: "concept" | "philosopher";
  tradition: string;
  philosopher: string;
  summary: string;
  detailedExplanation: string;
  coreClaims: string[];
  practicalApplication: string;
  counterarguments: string[];
  reflectionQuestion: string;
  relatedConcepts: string[]; // slugs
  themes: ThemeSlug[];
  sourceReferences: SourceReference[];
  publicationStatus: PublicationStatus;
}

export interface DailyQuestion {
  slug: string;
  question: string;
  shortDescription: string;
  theme: ThemeSlug;
  relatedConceptSlug?: string;
  activeDate?: string; // YYYY-MM-DD; when set, this question is used on that date
  publicationStatus: PublicationStatus;
}

export interface WeeklyPerspective {
  tradition: string;
  thinker: string;
  position: string;
  reasoning: string;
  conceptSlug?: string;
}

export interface WeeklyPrompt {
  slug: string;
  question: string;
  description: string; // the tension between the perspectives
  perspectives: WeeklyPerspective[];
  activeWeek?: string; // Monday of the week, YYYY-MM-DD
  publicationStatus: PublicationStatus;
}

export interface SeedValue {
  name: string;
  description: string;
}
