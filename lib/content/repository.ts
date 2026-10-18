import { concepts as seedConcepts } from "./concepts";
import { dailyQuestions as seedQuestions } from "./questions";
import { themes } from "./themes";
import { weeklyPrompts as seedWeekly } from "./weekly";
import type { Concept, DailyQuestion, ThemeSlug, WeeklyPrompt } from "./types";
import { dayNumber, weekNumber, weekStartKey } from "@/lib/time";

const approved = <T extends { publicationStatus: string }>(items: T[]): T[] => items.filter((i) => i.publicationStatus === "approved");

// The question for a date: one pinned to that exact date wins, otherwise a stable rotation through
// the approved, unpinned questions. The same date key always gives the same question.
export function pickDailyQuestion(questions: DailyQuestion[], dateKey: string): DailyQuestion {
  const pool = approved(questions);
  if (pool.length === 0) throw new Error("No approved daily questions");
  const pinned = pool.find((q) => q.activeDate === dateKey);
  if (pinned) return pinned;
  const rotation = pool.filter((q) => !q.activeDate).sort((a, b) => a.slug.localeCompare(b.slug));
  const source = rotation.length > 0 ? rotation : pool;
  return source[((dayNumber(dateKey) % source.length) + source.length) % source.length];
}

export function pickWeeklyPrompt(prompts: WeeklyPrompt[], dateKey: string): WeeklyPrompt {
  const pool = approved(prompts);
  if (pool.length === 0) throw new Error("No approved weekly prompts");
  const weekStart = weekStartKey(dateKey);
  const pinned = pool.find((p) => p.activeWeek === weekStart);
  if (pinned) return pinned;
  const rotation = pool.filter((p) => !p.activeWeek).sort((a, b) => a.slug.localeCompare(b.slug));
  const source = rotation.length > 0 ? rotation : pool;
  return source[((weekNumber(dateKey) % source.length) + source.length) % source.length];
}

// A rotating window of concepts for the front page: stable for a given date.
export function featuredConcepts(concepts: Concept[], dateKey: string, count = 3): Concept[] {
  const pool = approved(concepts).sort((a, b) => a.slug.localeCompare(b.slug));
  if (pool.length === 0) return [];
  const start = ((dayNumber(dateKey) % pool.length) + pool.length) % pool.length;
  return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}

export interface ConceptQuery {
  q?: string;
  tradition?: string;
  theme?: ThemeSlug;
}

const words = (text: string) => text.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 1);

function conceptText(c: Concept): { title: string; body: string } {
  return {
    title: `${c.title} ${c.philosopher} ${c.tradition}`.toLowerCase(),
    body: [c.summary, c.detailedExplanation, ...c.coreClaims, c.practicalApplication, ...c.counterarguments].join(" ").toLowerCase(),
  };
}

// In-memory search used when no database is configured, and in tests. Title and tradition matches
// rank above matches in the body. Every word of the query must appear somewhere in the record.
export function searchConcepts(concepts: Concept[], query: ConceptQuery = {}): Concept[] {
  const terms = words(query.q ?? "");
  const scored = approved(concepts)
    .filter((c) => !query.tradition || c.tradition === query.tradition)
    .filter((c) => !query.theme || c.themes.includes(query.theme))
    .map((c) => {
      const { title, body } = conceptText(c);
      let score = 0;
      for (const term of terms) {
        const inTitle = title.includes(term);
        const inBody = body.includes(term);
        if (!inTitle && !inBody) return { c, score: -1 };
        score += (inTitle ? 3 : 0) + (inBody ? 1 : 0);
      }
      return { c, score };
    })
    .filter((x) => x.score >= 0);
  return scored.sort((a, b) => b.score - a.score || a.c.title.localeCompare(b.c.title)).map((x) => x.c);
}

export function listTraditions(concepts: Concept[]): string[] {
  return [...new Set(approved(concepts).map((c) => c.tradition))].sort();
}

// Public, approved content accessors over the bundled seed data.
export const content = {
  themes,
  questions: () => approved(seedQuestions),
  concepts: () => approved(seedConcepts),
  weeklyPrompts: () => approved(seedWeekly),
  conceptBySlug: (slug: string) => approved(seedConcepts).find((c) => c.slug === slug),
  questionBySlug: (slug: string) => approved(seedQuestions).find((q) => q.slug === slug),
  weeklyBySlug: (slug: string) => approved(seedWeekly).find((p) => p.slug === slug),
  questionsByTheme: (theme: ThemeSlug) => approved(seedQuestions).filter((q) => q.theme === theme),
  dailyQuestion: (dateKey: string) => pickDailyQuestion(seedQuestions, dateKey),
  weeklyPrompt: (dateKey: string) => pickWeeklyPrompt(seedWeekly, dateKey),
  featured: (dateKey: string, count = 3) => featuredConcepts(seedConcepts, dateKey, count),
  search: (query: ConceptQuery) => searchConcepts(seedConcepts, query),
  traditions: () => listTraditions(seedConcepts),
};
