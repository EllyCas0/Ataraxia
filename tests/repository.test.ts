import { describe, expect, it } from "vitest";
import { concepts } from "@/lib/content/concepts";
import { dailyQuestions } from "@/lib/content/questions";
import { weeklyPrompts } from "@/lib/content/weekly";
import { content, listTraditions, pickDailyQuestion, pickWeeklyPrompt, searchConcepts } from "@/lib/content/repository";
import type { DailyQuestion } from "@/lib/content/types";
import { zonedDateKey } from "@/lib/time";

describe("daily question", () => {
  it("is the same for every call on the same date", () => {
    const first = pickDailyQuestion(dailyQuestions, "2026-10-18");
    for (let i = 0; i < 20; i++) expect(pickDailyQuestion(dailyQuestions, "2026-10-18").slug).toBe(first.slug);
  });

  it("does not change when the order of the records changes", () => {
    const shuffled = [...dailyQuestions].reverse();
    expect(pickDailyQuestion(shuffled, "2026-10-18").slug).toBe(pickDailyQuestion(dailyQuestions, "2026-10-18").slug);
  });

  it("changes from one day to the next and cycles through every approved question", () => {
    const seen = new Set<string>();
    let previous = "";
    for (let i = 0; i < dailyQuestions.length; i++) {
      const day = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      const slug = pickDailyQuestion(dailyQuestions, day).slug;
      expect(slug).not.toBe(previous);
      previous = slug;
      seen.add(slug);
    }
    expect(seen.size).toBe(dailyQuestions.length);
  });

  it("lets a question pinned to a date override the rotation, only on that date", () => {
    const pinned: DailyQuestion = { ...dailyQuestions[0], slug: "pinned-q", question: "A pinned question?", activeDate: "2026-12-25" };
    const pool = [...dailyQuestions, pinned];
    expect(pickDailyQuestion(pool, "2026-12-25").slug).toBe("pinned-q");
    expect(pickDailyQuestion(pool, "2026-12-26").slug).not.toBe("pinned-q");
  });

  it("never picks an unapproved question", () => {
    const pool = dailyQuestions.map((q, i) => (i === 0 ? { ...q, publicationStatus: "draft" as const } : q));
    for (let i = 0; i < 60; i++) {
      const day = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
      expect(pickDailyQuestion(pool, day).slug).not.toBe(dailyQuestions[0].slug);
    }
  });

  it("throws a clear error when nothing is approved", () => {
    expect(() => pickDailyQuestion([], "2026-10-18")).toThrow(/approved/);
  });

  it("follows the configured time zone: one local day gives one question, and it changes at local midnight", () => {
    const zone = "America/New_York";
    const pick = (iso: string) => pickDailyQuestion(dailyQuestions, zonedDateKey(new Date(iso), zone)).slug;
    // 22:30 on Oct 17 and 11:00 on Oct 17 in New York are the same local day.
    expect(pick("2026-10-18T02:30:00Z")).toBe(pick("2026-10-17T15:00:00Z"));
    // 02:30 UTC is still Oct 17 in New York; 04:30 UTC is after local midnight, so Oct 18.
    expect(pick("2026-10-18T03:59:00Z")).toBe(pick("2026-10-17T15:00:00Z"));
    expect(pick("2026-10-18T04:30:00Z")).not.toBe(pick("2026-10-18T03:59:00Z"));
  });
});

describe("weekly prompt", () => {
  it("is constant within a week and changes in the next", () => {
    const monday = pickWeeklyPrompt(weeklyPrompts, "2026-10-12").slug;
    for (const day of ["2026-10-13", "2026-10-16", "2026-10-18"]) expect(pickWeeklyPrompt(weeklyPrompts, day).slug).toBe(monday);
    expect(pickWeeklyPrompt(weeklyPrompts, "2026-10-19").slug).not.toBe(monday);
  });

  it("lets a prompt pinned to a week override the rotation", () => {
    const pinned = { ...weeklyPrompts[0], slug: "pinned-week", activeWeek: "2026-11-02" };
    expect(pickWeeklyPrompt([...weeklyPrompts, pinned], "2026-11-04").slug).toBe("pinned-week");
    expect(pickWeeklyPrompt([...weeklyPrompts, pinned], "2026-11-09").slug).not.toBe("pinned-week");
  });
});

describe("concept search", () => {
  it("returns everything when there is no query", () => {
    expect(searchConcepts(concepts)).toHaveLength(concepts.length);
  });

  it("finds a concept by words in its title, ranking title matches first", () => {
    const results = searchConcepts(concepts, { q: "stoic" });
    expect(results.length).toBeGreaterThan(0);
    expect(searchConcepts(concepts, { q: "absurd" })[0].slug).toBe("the-absurd");
  });

  it("requires every word to match", () => {
    expect(searchConcepts(concepts, { q: "ubuntu personhood" }).map((c) => c.slug)).toContain("ubuntu");
    expect(searchConcepts(concepts, { q: "ubuntu zzzzqx" })).toHaveLength(0);
  });

  it("filters by tradition and by theme, alone or together", () => {
    const stoic = searchConcepts(concepts, { tradition: "Stoicism" });
    expect(stoic.length).toBeGreaterThan(0);
    expect(stoic.every((c) => c.tradition === "Stoicism")).toBe(true);
    const death = searchConcepts(concepts, { theme: "death-impermanence" });
    expect(death.every((c) => c.themes.includes("death-impermanence"))).toBe(true);
    expect(searchConcepts(concepts, { tradition: "Stoicism", theme: "love-relationships" })).toHaveLength(0);
  });

  it("is case- and punctuation-insensitive", () => {
    expect(searchConcepts(concepts, { q: "  EXISTENCE,  precedes!! " }).map((c) => c.slug)).toContain("existence-precedes-essence");
  });

  it("does not return draft or archived records", () => {
    const hidden = concepts.map((c, i) => (i === 0 ? { ...c, publicationStatus: "draft" as const } : c));
    expect(searchConcepts(hidden)).toHaveLength(concepts.length - 1);
  });

  it("lists traditions alphabetically without duplicates", () => {
    const traditions = listTraditions(concepts);
    expect(traditions).toEqual([...new Set(traditions)].sort());
  });
});

describe("content accessors", () => {
  it("expose lookups by slug and by theme", () => {
    expect(content.conceptBySlug("ubuntu")?.title).toMatch(/Ubuntu/);
    expect(content.conceptBySlug("missing")).toBeUndefined();
    expect(content.questionsByTheme("knowledge-truth").length).toBeGreaterThan(0);
  });
});
