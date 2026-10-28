import { describe, expect, it } from "vitest";
import { ABOUT_PHILOSOPHY_INTRO, aboutPhilosophy } from "@/lib/content/about-philosophy";

const words = (text: string) => text.trim().split(/\s+/).length;

describe("the home page's explanation of philosophy", () => {
  it("has three short blocks: what it is, why it matters, and how it relates to religion", () => {
    expect(aboutPhilosophy.map((b) => b.id)).toEqual(["what", "why", "religion"]);
    for (const block of aboutPhilosophy) {
      expect(words(block.text), block.id).toBeLessThanOrEqual(70);
      expect(words(block.text), block.id).toBeGreaterThanOrEqual(30);
      expect(block.title.length, block.id).toBeGreaterThan(5);
    }
  });

  it("defines the word from its Greek roots", () => {
    expect(ABOUT_PHILOSOPHY_INTRO).toMatch(/Greek/);
    expect(ABOUT_PHILOSOPHY_INTRO).toMatch(/love of wisdom/);
  });

  it("is even-handed about religion: it describes, and says Stoa takes no side", () => {
    const religion = aboutPhilosophy.find((b) => b.id === "religion")!.text;
    expect(religion).toMatch(/takes no side/i);
    expect(religion).toMatch(/not simply rivals/i);
    // Never says religion is true or false, or that philosophy has beaten or replaced it.
    const all = aboutPhilosophy.map((b) => b.text).join(" ").toLowerCase();
    for (const phrase of ["superstition", "myth", "irrational", "proves god", "disproves", "replaces religion", "outdated", "the only way"]) expect(all).not.toContain(phrase);
  });

  it("uses plain words a teenager can read", () => {
    const all = aboutPhilosophy.map((b) => b.text).join(" ");
    for (const jargon of ["epistemology", "ontology", "metaphysical", "hermeneutic", "paradigm"]) expect(all.toLowerCase()).not.toContain(jargon);
    // Short sentences: no sentence longer than 45 words.
    for (const sentence of all.split(/(?<=[.?!])\s+/)) expect(words(sentence), sentence).toBeLessThanOrEqual(45);
  });
});
