import { philosophers } from "./philosophers";
import { questions } from "./questions";
import type { Philosopher, Question } from "./types";

export interface SearchResults {
  questions: Question[];
  philosophers: Philosopher[];
}

export function search(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { questions: [], philosophers: [] };

  const matchedQuestions = questions.filter(
    (item) => item.text.toLowerCase().includes(q) || item.tags.some((t) => t.includes(q))
  );

  const matchedPhilosophers = philosophers.filter((p) => {
    const haystack = [p.name, p.period, p.region, ...p.keyConcepts.map((k) => k.term), ...p.majorWorks].join(" ").toLowerCase();
    return haystack.includes(q);
  });

  return { questions: matchedQuestions, philosophers: matchedPhilosophers };
}
