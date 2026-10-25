import { describe, expect, it } from "vitest";
import { pickTryThis, tryThisCards } from "@/lib/content/try-this";

describe("the home page's secondary card", () => {
  it("offers Reframe and Natural Law, each with a short line", () => {
    expect(tryThisCards.map((c) => c.id).sort()).toEqual(["natural-law", "reframe"]);
    for (const card of tryThisCards) {
      expect(card.line.split(/\s+/).length, card.id).toBeLessThanOrEqual(20);
      expect(card.href.startsWith("/"), card.id).toBe(true);
    }
  });

  it("shows the same card for the same date", () => {
    expect(pickTryThis("2026-03-04")).toBe(pickTryThis("2026-03-04"));
  });

  it("alternates from one day to the next, so both appear", () => {
    const seen = new Set<string>();
    let previous = "";
    for (let day = 1; day <= 14; day++) {
      const card = pickTryThis(`2026-03-${String(day).padStart(2, "0")}`);
      expect(card.id).not.toBe(previous);
      previous = card.id;
      seen.add(card.id);
    }
    expect(seen.size).toBe(2);
  });

  it("refuses to pick from an empty list", () => {
    expect(() => pickTryThis("2026-03-04", [])).toThrow();
  });
});
