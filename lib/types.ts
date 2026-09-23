export type Domain =
  | "ethics"
  | "political-philosophy"
  | "metaphysics"
  | "epistemology"
  | "philosophy-of-mind"
  | "philosophy-of-history"
  | "aesthetics"
  | "philosophy-of-religion";

export interface Tradition {
  id: string;
  name: string;
  region: string;
  blurb: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface Philosopher {
  slug: string;
  name: string;
  dates: string;
  region: string;
  period: string;
  traditions: string[]; // Tradition ids
  domains: Domain[];
  majorWorks: string[];
  centralQuestions: string[];
  keyConcepts: KeyConcept[];
  majorArguments: string[];
  frame: string; // a general, reusable lens this thinker applies to a question — NOT a quotation
  influences: string[]; // plain names; may not all be in the database
  influenced: string[]; // plain names; may not all be in the database
  context: string;
  criticisms: string[];
  relevance: string;
  primarySources: string[];
  secondarySources: string[];
}

export type Difficulty = "intro" | "intermediate" | "advanced";

export interface Question {
  slug: string;
  text: string;
  domain: Domain;
  tags: string[];
  difficulty: Difficulty;
}

export type CouncilMode = "compare" | "socratic" | "steelman" | "historical";

export interface CouncilModeInfo {
  id: CouncilMode;
  label: string;
  hint: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  question: string;
  initialPosition: string;
  reasoning: string;
  counterargument: string;
  revisedPosition: string;
  remainingUncertainty: string;
  philosopherSlugs: string[];
}

// --- Personal Philosophy profile ---

export type ProfileDimension = "ethics" | "epistemology" | "metaphysics" | "political-philosophy";

export interface PositionOption {
  id: string;
  label: string;
  blurb: string;
}

export interface ProfileState {
  ethics: string[];
  epistemology: string[];
  metaphysics: string[];
  "political-philosophy": string[];
  notes: Record<string, string>; // positionId -> user's own note (optional)
}

// --- Argument Analyzer ---

export interface AnalyzerFlag {
  label: string;
  detail: string;
  matches: string[];
}

export interface AnalyzerResult {
  claim: string;
  evidenceFlags: AnalyzerFlag[];
  logicFlags: AnalyzerFlag[];
  rhetoricFlags: AnalyzerFlag[];
  valueFlags: AnalyzerFlag[];
  uncertaintyFlags: AnalyzerFlag[];
  relatedPhilosophers: Philosopher[];
}
