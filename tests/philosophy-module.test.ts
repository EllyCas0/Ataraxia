import { describe, expect, it } from "vitest";
import { content } from "@/lib/content/repository";
import { bundles, bundlesInCategory, findTenet, getBundle, sourcesFor, tenetsOf, thinkersOf } from "@/lib/philosophy/registry";
import { naturalLawBundle } from "@/lib/philosophy/natural-law";
import type { TraditionBundle } from "@/lib/philosophy/types";
import { validateBundle } from "@/lib/philosophy/validate";
import { SECTIONS, parseSection, tenetViews } from "@/lib/philosophy/views";

const conceptExists = (slug: string) => content.conceptBySlug(slug) !== undefined;

// The ten tenets required by the product specification, in order.
const EXPECTED_TITLES = [
  "Objective Morality",
  "Human Nature",
  "Practical Reason",
  "Human Flourishing",
  "Basic Human Goods",
  "Justice",
  "The Common Good",
  "Virtue",
  "Moral Responsibility",
  "Moral Limits of Authority",
];

describe("Natural Law content", () => {
  it("has no broken references or empty fields", () => {
    expect(validateBundle(naturalLawBundle, { conceptExists })).toEqual([]);
  });

  it("has exactly the ten tenets from the specification, in order", () => {
    expect(tenetsOf(naturalLawBundle).map((t) => t.title)).toEqual(EXPECTED_TITLES);
    expect(tenetsOf(naturalLawBundle).map((t) => t.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("gives every tenet the parts a card needs", () => {
    for (const tenet of naturalLawBundle.tenets) {
      expect(tenet.definition.length, tenet.id).toBeGreaterThan(20);
      expect(tenet.explanation.length, tenet.id).toBeGreaterThan(200);
      expect(tenet.example.length, tenet.id).toBeGreaterThan(60);
      expect(tenet.origins.length, tenet.id).toBeGreaterThanOrEqual(2);
      expect(tenet.criticisms.length, tenet.id).toBeGreaterThanOrEqual(2);
      expect(tenet.reflectionQuestion.endsWith("?"), tenet.id).toBe(true);
      expect(tenet.relatedConceptIds.length, tenet.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("labels the framework as synthesized and distinguishes Aquinas's own claims", () => {
    expect(naturalLawBundle.overview.frameworkNote).toMatch(/synthesized/i);
    expect(naturalLawBundle.overview.frameworkNote).toMatch(/not an official list/i);
    // Several tenets are not simply classical, and the ones that are specifically about Aquinas say so.
    const statuses = new Set(naturalLawBundle.tenets.map((t) => t.status));
    expect(statuses).toEqual(new Set(["classical", "interpretation", "contested"]));
    expect(naturalLawBundle.tenets.filter((t) => t.aquinasNote).length).toBeGreaterThanOrEqual(8);
    expect(naturalLawBundle.tenets.find((t) => t.number === 5)?.aquinasNote).toMatch(/does not give a list/i);
  });

  it("covers the required overview and critical-perspective topics", () => {
    const names = naturalLawBundle.overview.distinctions.map((d) => d.term.toLowerCase());
    expect(names).toEqual(["natural law", "natural rights", "positive law", "scientific laws of nature"]);
    expect(thinkersOf(naturalLawBundle).map((t) => t.id)).toEqual(expect.arrayContaining(["aristotle", "stoics", "cicero", "aquinas", "locke"]));
    const ids = naturalLawBundle.perspectives.map((p) => p.id);
    for (const required of ["is-ought", "cultural-bias", "religious-secular", "freedom-common-good"]) expect(ids).toContain(required);
    expect(naturalLawBundle.perspectives.some((p) => p.kind === "criticism")).toBe(true);
    expect(naturalLawBundle.perspectives.some((p) => p.kind === "defence")).toBe(true);
  });

  it("does not present contested philosophy as established fact", () => {
    const text = JSON.stringify(naturalLawBundle).toLowerCase();
    for (const phrase of ["it is proven", "science has shown", "everyone agrees", "all philosophers agree"]) expect(text).not.toContain(phrase);
  });

  it("resolves tenet cross-references for the cards", () => {
    const views = tenetViews(naturalLawBundle, (slug) => content.conceptBySlug(slug));
    expect(views).toHaveLength(10);
    for (const view of views) {
      expect(view.concepts.length).toBe(view.relatedConceptIds.length);
      expect(view.thinkers.length).toBe(view.relatedThinkerIds.length);
      expect(view.sources.length).toBe(view.sourceIds.length);
    }
  });

  it("only links sources over https", () => {
    for (const source of naturalLawBundle.sources) if (source.url) expect(source.url.startsWith("https://")).toBe(true);
  });
});

describe("the validator", () => {
  const clone = (): TraditionBundle => JSON.parse(JSON.stringify(naturalLawBundle));

  it("catches broken references and empty text", () => {
    const broken = clone();
    broken.tenets[0].sourceIds.push("s-nope");
    broken.tenets[1].relatedConceptIds.push("not-a-concept");
    broken.tenets[2].relatedThinkerIds.push("nobody");
    broken.tenets[3].example = "   ";
    broken.tenets[4].reflectionQuestion = "Think about it.";
    broken.perspectives[0].sourceIds.push("s-missing");
    const problems = validateBundle(broken, { conceptExists });
    expect(problems.join("\n")).toMatch(/unknown source "s-nope"/);
    expect(problems.join("\n")).toMatch(/unknown concept "not-a-concept"/);
    expect(problems.join("\n")).toMatch(/unknown thinker "nobody"/);
    expect(problems.join("\n")).toMatch(/example is empty/);
    expect(problems.join("\n")).toMatch(/should be a question/);
    expect(problems.join("\n")).toMatch(/unknown source "s-missing"/);
  });

  it("catches duplicate or mismatched tenets", () => {
    const broken = clone();
    broken.tenets[1].id = broken.tenets[0].id;
    expect(validateBundle(broken, { conceptExists }).join("\n")).toMatch(/duplicates/);
  });
});

describe("a second tradition fits the same structure with no code changes", () => {
  // A small made-up tradition, to prove the model is reusable. It is never shown to anyone.
  const utilitarianism: TraditionBundle = {
    tradition: {
      id: "utilitarianism",
      name: "Utilitarianism",
      category: "Ethics",
      summary: "Actions are right when they produce the best overall results for everyone affected.",
      centralQuestion: "Should we judge actions by their consequences for well-being?",
      historicalContext: "Developed by Bentham and Mill in the 18th and 19th centuries.",
      tenetIds: ["ut-1"],
      thinkerIds: ["mill"],
    },
    overview: { definition: "A family of consequence-based theories.", frameworkNote: "A synthesized framework.", distinctions: [], timeline: [{ period: "19th century", who: "Mill", idea: "Refines the theory.", thinkerId: "mill" }] },
    tenets: [
      {
        id: "ut-1",
        traditionId: "utilitarianism",
        number: 1,
        title: "Well-being matters",
        definition: "What ultimately matters is how well people's lives go.",
        explanation: "An explanation.",
        status: "classical",
        origins: ["Bentham and Mill."],
        example: "Choosing where to build a hospital.",
        reflectionQuestion: "Does counting everyone equally seem fair to you?",
        relatedConceptIds: [],
        relatedThinkerIds: ["mill"],
        criticisms: ["It can seem to ignore individual rights."],
        sourceIds: ["s-mill"],
      },
    ],
    thinkers: [{ id: "mill", name: "John Stuart Mill", years: "1806–1873", role: "Philosopher", contribution: "Refined utilitarianism.", sourceIds: ["s-mill"] }],
    perspectives: [{ id: "rights", kind: "criticism", title: "Rights", summary: "It may sacrifice individuals.", detail: "Detail.", sourceIds: ["s-mill"] }],
    sources: [{ id: "s-mill", author: "J. S. Mill", title: "Utilitarianism", sourceType: "primary", notes: "Chapter 2." }],
  };

  it("validates and can be listed alongside Natural Law", () => {
    expect(validateBundle(utilitarianism, { conceptExists })).toEqual([]);
    const all = [...bundles, utilitarianism];
    expect(bundlesInCategory("ethics", all).map((b) => b.tradition.id)).toEqual(["natural-law", "utilitarianism"]);
    expect(findTenet("ut-1", all)?.bundle.tradition.name).toBe("Utilitarianism");
    expect(sourcesFor(utilitarianism, ["s-mill"])).toHaveLength(1);
    expect(tenetViews(utilitarianism, () => undefined)).toHaveLength(1);
  });
});

describe("the registry and sections", () => {
  it("finds Natural Law by id and lists it under Ethics", () => {
    expect(getBundle("natural-law")).toBe(naturalLawBundle);
    expect(getBundle("nope")).toBeUndefined();
    expect(bundlesInCategory("Ethics").map((b) => b.tradition.id)).toContain("natural-law");
    expect(bundlesInCategory("Metaphysics")).toEqual([]);
  });

  it("falls back to the overview for an unknown section", () => {
    expect(SECTIONS.map((s) => s.label)).toEqual(["Overview", "Core Tenets", "Critical Perspectives", "Apply & Reflect"]);
    expect(parseSection("tenets")).toBe("tenets");
    expect(parseSection("reflect")).toBe("reflect");
    expect(parseSection("<script>")).toBe("overview");
    expect(parseSection(undefined)).toBe("overview");
  });
});
