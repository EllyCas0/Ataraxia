import { describe, expect, it } from "vitest";
import { concepts } from "@/lib/content/concepts";
import { dailyQuestions } from "@/lib/content/questions";
import { themes } from "@/lib/content/themes";
import { seedValues } from "@/lib/content/values";
import { weeklyPrompts } from "@/lib/content/weekly";
import { THEME_SLUGS } from "@/lib/content/types";

const unique = (items: string[]) => new Set(items).size === items.length;

describe("seed content", () => {
  it("has the required amount of curated content", () => {
    expect(dailyQuestions.length).toBeGreaterThanOrEqual(30);
    expect(concepts.length).toBeGreaterThanOrEqual(20);
    expect(weeklyPrompts.length).toBeGreaterThanOrEqual(3);
    expect(seedValues.length).toBeGreaterThanOrEqual(12);
    expect(themes).toHaveLength(8);
  });

  it("uses unique slugs", () => {
    expect(unique(dailyQuestions.map((q) => q.slug))).toBe(true);
    expect(unique(concepts.map((c) => c.slug))).toBe(true);
    expect(unique(weeklyPrompts.map((p) => p.slug))).toBe(true);
    expect(unique(dailyQuestions.map((q) => q.question))).toBe(true);
  });

  it("only references themes, concepts, and slugs that exist", () => {
    const conceptSlugs = new Set(concepts.map((c) => c.slug));
    const themeSlugs = new Set<string>(THEME_SLUGS);
    for (const q of dailyQuestions) {
      expect(themeSlugs.has(q.theme), `${q.slug} theme`).toBe(true);
      if (q.relatedConceptSlug) expect(conceptSlugs.has(q.relatedConceptSlug), `${q.slug} concept`).toBe(true);
    }
    for (const c of concepts) {
      for (const theme of c.themes) expect(themeSlugs.has(theme), `${c.slug} theme ${theme}`).toBe(true);
      for (const related of c.relatedConcepts) {
        expect(conceptSlugs.has(related), `${c.slug} -> ${related}`).toBe(true);
        expect(related).not.toBe(c.slug);
      }
    }
    for (const p of weeklyPrompts) {
      for (const perspective of p.perspectives) {
        if (perspective.conceptSlug) expect(conceptSlugs.has(perspective.conceptSlug), `${p.slug} concept`).toBe(true);
      }
    }
  });

  it("covers every theme with at least one question", () => {
    for (const theme of THEME_SLUGS) expect(dailyQuestions.some((q) => q.theme === theme), theme).toBe(true);
  });

  it("gives every concept the fields the library displays", () => {
    for (const c of concepts) {
      expect(c.summary.length, `${c.slug} summary`).toBeGreaterThan(40);
      expect(c.detailedExplanation.length, `${c.slug} explanation`).toBeGreaterThan(200);
      expect(c.coreClaims.length, `${c.slug} claims`).toBeGreaterThanOrEqual(3);
      expect(c.counterarguments.length, `${c.slug} counterarguments`).toBeGreaterThanOrEqual(2);
      expect(c.practicalApplication.length, `${c.slug} application`).toBeGreaterThan(30);
      expect(c.reflectionQuestion.endsWith("?"), `${c.slug} reflection question`).toBe(true);
      expect(c.sourceReferences.length, `${c.slug} sources`).toBeGreaterThanOrEqual(1);
      expect(c.themes.length, `${c.slug} themes`).toBeGreaterThanOrEqual(1);
    }
  });

  it("spans the traditions the product promises, without lumping them together", () => {
    const traditions = concepts.map((c) => c.tradition).join(" | ");
    for (const required of ["Stoicism", "Existentialism", "Aristotelian virtue ethics", "Socratic inquiry", "Buddhist philosophy", "Pragmatism", "Feminist philosophy", "African philosophy"]) {
      expect(traditions, required).toContain(required);
    }
    expect(new Set(concepts.map((c) => c.tradition)).size).toBeGreaterThanOrEqual(12);
  });

  it("does not include fake-looking page numbers, URLs, or direct quotation marks in source references", () => {
    for (const c of concepts) {
      for (const source of c.sourceReferences) {
        expect(source.title.length).toBeGreaterThan(2);
        expect(`${source.location ?? ""}${source.note ?? ""}`).not.toMatch(/https?:\/\/|\bpp?\.\s*\d/);
      }
    }
  });

  it("has weekly prompts with two or three contrasting perspectives", () => {
    for (const p of weeklyPrompts) {
      expect(p.perspectives.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.perspectives.length, p.slug).toBeLessThanOrEqual(3);
      expect(new Set(p.perspectives.map((x) => x.tradition)).size, `${p.slug} traditions differ`).toBe(p.perspectives.length);
      expect(p.description.length).toBeGreaterThan(60);
    }
  });

  it("limits the content the product treats as authoritative to approved records", () => {
    for (const item of [...dailyQuestions, ...concepts, ...weeklyPrompts]) expect(item.publicationStatus).toBe("approved");
  });
});
