import type { Domain } from "./types";

export const domainLabels: Record<Domain, string> = {
  ethics: "Ethics",
  "political-philosophy": "Political Philosophy",
  metaphysics: "Metaphysics",
  epistemology: "Epistemology",
  "philosophy-of-mind": "Philosophy of Mind",
  "philosophy-of-history": "Philosophy of History",
  aesthetics: "Aesthetics",
  "philosophy-of-religion": "Philosophy of Religion",
};

export const domains = Object.keys(domainLabels) as Domain[];
