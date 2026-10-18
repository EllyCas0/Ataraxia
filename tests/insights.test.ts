import { describe, expect, it } from "vitest";
import { insights, pickDailyInsight } from "@/lib/content/insights";
import { content } from "@/lib/content/repository";

describe("insights", () => {
  it("has unique ids and slugs and a cited source for every quote", () => {
    expect(new Set(insights.map((i) => i.id)).size).toBe(insights.length);
    expect(new Set(insights.map((i) => i.slug)).size).toBe(insights.length);
    for (const i of insights) {
      expect(i.quote.length).toBeGreaterThan(10);
      expect(i.source.length).toBeGreaterThan(10);
      expect(i.philosopher && i.context).toBeTruthy();
    }
  });

  it("only links to concepts that exist", () => {
    for (const i of insights) if (i.relatedConceptSlug) expect(content.conceptBySlug(i.relatedConceptSlug), i.slug).toBeDefined();
  });

  it("gives the same insight for the same date and rotates through all of them", () => {
    expect(pickDailyInsight(insights, "2026-03-04")).toBe(pickDailyInsight(insights, "2026-03-04"));
    const seen = new Set<string>();
    const start = new Date("2026-01-01T00:00:00Z").getTime();
    for (let d = 0; d < insights.length; d++) seen.add(pickDailyInsight(insights, new Date(start + d * 86400000).toISOString().slice(0, 10)).slug);
    expect(seen.size).toBe(insights.length);
  });

  it("throws when there is nothing to show", () => {
    expect(() => pickDailyInsight([], "2026-01-01")).toThrow();
  });
});
