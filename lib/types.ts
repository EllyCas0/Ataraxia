export type Tradition =
  | "Western"
  | "Eastern"
  | "Modern & Contemporary"
  | "Interdisciplinary (Science)";

export interface Perspective {
  slug: string;
  name: string;
  tradition: Tradition;
  emoji: string;
  period: string;
  coreQuestion: string;
  coreIdea: string;
  centralIdeas: string[];
  keyThinkers: string[];
  historicalContext: string;
  application: string;
  criticisms: string[];
  relatedPhilosophies: { agrees: string[]; disagrees: string[] };
  furtherQuestions: string[];
}

export type DialogueMode = "socratic" | "scientist" | "devil" | "perspective";

export interface DialogueModeInfo {
  id: DialogueMode;
  label: string;
  emoji: string;
  description: string;
}

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  mode?: DialogueMode;
}

export interface QuestionCategory {
  id: string;
  emoji: string;
  label: string;
  questions: string[];
}

export interface ReflectionEntry {
  id: string;
  createdAt: string; // ISO date
  question: string;
  perspectiveSlug: string;
  perspectiveName: string;
  initialPosition: string;
  newInsight: string;
  currentPosition: string;
  remainingQuestions: string;
  resonatedIdeas: string[];
}
