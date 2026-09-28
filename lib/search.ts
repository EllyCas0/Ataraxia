import { philosophers } from "./philosophers";
import { questions } from "./questions";
import type { Difficulty, Domain, Philosopher, Question } from "./types";

export interface SearchResults {
  questions: Question[];
  philosophers: Philosopher[];
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchTerms(query: string): string[] {
  return normalizeSearchText(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

export function matchesSearchQuery(haystack: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return true;
  if (haystack.includes(normalizedQuery)) return true;

  const terms = searchTerms(normalizedQuery);
  return terms.length > 0 && terms.every((term) => haystack.includes(term));
}

export function questionSearchText(question: Question): string {
  return normalizeSearchText(
    [
      question.text,
      question.domain,
      question.difficulty,
      ...question.tags,
    ].join(" ")
  );
}

export function questionSearchRank(question: Question, query: string): number {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return 0;

  const fields = [
    { value: question.text, weight: 80 },
    { value: question.tags.join(" "), weight: 55 },
    { value: question.domain, weight: 25 },
    { value: question.difficulty, weight: 10 },
  ];

  return fields.reduce((score, field) => {
    const haystack = normalizeSearchText(field.value);
    if (haystack.includes(normalizedQuery)) return score + field.weight;
    const terms = searchTerms(normalizedQuery).filter((term) => haystack.includes(term));
    return score + terms.length * Math.floor(field.weight / 4);
  }, 0);
}

export function filterQuestions({
  query,
  domain = null,
  difficulty = null,
}: {
  query: string;
  domain?: Domain | null;
  difficulty?: Difficulty | null;
}): Question[] {
  const q = normalizeSearchText(query.trim());

  return questions
    .filter((item) => {
      if (domain && item.domain !== domain) return false;
      if (difficulty && item.difficulty !== difficulty) return false;
      if (q && !matchesSearchQuery(questionSearchText(item), q)) return false;
      return true;
    })
    .sort((a, b) => questionSearchRank(b, q) - questionSearchRank(a, q));
}

export function philosopherSearchText(philosopher: Philosopher, traditionNames: string[] = []): string {
  return normalizeSearchText(
    [
      philosopher.name,
      philosopher.dates,
      philosopher.region,
      philosopher.period,
      ...traditionNames,
      ...philosopher.domains,
      ...philosopher.centralQuestions,
      ...philosopher.keyConcepts.flatMap((concept) => [concept.term, concept.definition]),
      ...philosopher.majorArguments,
      philosopher.frame,
      ...philosopher.criticisms,
      philosopher.relevance,
      ...philosopher.majorWorks,
    ].join(" ")
  );
}

export function philosopherSearchRank(philosopher: Philosopher, query: string, traditionNames: string[] = []): number {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return 0;

  const fields = [
    { value: philosopher.name, weight: 80 },
    { value: philosopher.keyConcepts.map((concept) => concept.term).join(" "), weight: 70 },
    { value: philosopher.keyConcepts.map((concept) => concept.definition).join(" "), weight: 55 },
    { value: traditionNames.join(" "), weight: 45 },
    { value: philosopher.centralQuestions.join(" "), weight: 35 },
    { value: philosopher.majorArguments.join(" "), weight: 30 },
    { value: philosopher.frame, weight: 25 },
    { value: philosopher.relevance, weight: 20 },
  ];

  return fields.reduce((score, field) => {
    const haystack = normalizeSearchText(field.value);
    if (haystack.includes(normalizedQuery)) return score + field.weight;
    const terms = searchTerms(normalizedQuery).filter((term) => haystack.includes(term));
    return score + terms.length * Math.floor(field.weight / 4);
  }, 0);
}

export function search(query: string): SearchResults {
  const q = normalizeSearchText(query.trim());
  if (!q) return { questions: [], philosophers: [] };

  const matchedQuestions = filterQuestions({ query: q });

  const matchedPhilosophers = philosophers
    .filter((p) => matchesSearchQuery(philosopherSearchText(p), q))
    .sort((a, b) => philosopherSearchRank(b, q) - philosopherSearchRank(a, q));

  return { questions: matchedQuestions, philosophers: matchedPhilosophers };
}
