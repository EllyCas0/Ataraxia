import type { Difficulty, Domain } from "./types";

export const domainDescriptions: Record<Domain, string> = {
  ethics: "Questions about character, action, obligation, and what makes a life go well.",
  "political-philosophy": "Questions about power, justice, authority, rights, institutions, and collective life.",
  metaphysics: "Questions about what exists, what things are, and how reality is structured.",
  epistemology: "Questions about knowledge, evidence, certainty, truth, and the limits of reason.",
  "philosophy-of-mind": "Questions about consciousness, identity, thought, machines, and the relation between mind and body.",
  "philosophy-of-history": "Questions about progress, tradition, change, memory, and whether history has direction.",
  aesthetics: "Questions about beauty, art, taste, expression, creativity, and interpretation.",
  "philosophy-of-religion": "Questions about God, faith, morality, suffering, sacredness, and secular alternatives.",
};

export const difficultyNotes: Record<Difficulty, string> = {
  intro: "A good starting point for naming your intuitions.",
  intermediate: "Best when you can already see more than one plausible side.",
  advanced: "Requires slower distinctions and a tolerance for unresolved tension.",
};
