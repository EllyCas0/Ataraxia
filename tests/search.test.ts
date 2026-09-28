import assert from "node:assert/strict";
import test from "node:test";
import {
  matchesSearchQuery,
  normalizeSearchText,
  filterQuestions,
  philosopherSearchRank,
  philosopherSearchText,
  questionSearchRank,
  questionSearchText,
  search,
  searchTerms,
} from "../lib/search";
import { philosophers } from "../lib/philosophers";
import { getQuestion } from "../lib/questions";

test("normalizes case and accents for search text", () => {
  assert.equal(normalizeSearchText("Socrates y la ÉTICA"), "socrates y la etica");
});

test("splits normalized search terms and ignores extra whitespace", () => {
  assert.deepEqual(searchTerms("  objective   TRUTH  "), ["objective", "truth"]);
});

test("matches all query terms when the exact phrase is absent", () => {
  const haystack = normalizeSearchText("Democracy depends on public truth and civic trust");

  assert.equal(matchesSearchQuery(haystack, "truth democracy"), true);
  assert.equal(matchesSearchQuery(haystack, "truth metaphysics"), false);
});

test("search finds relevant questions and philosophers", () => {
  const results = search("justice");

  assert.ok(results.questions.some((q) => q.slug === "what-is-justice"));
  assert.ok(results.philosophers.length > 0);
});

test("question search text normalizes tags and metadata", () => {
  const question = getQuestion("morality-religion");
  assert.ok(question);

  const haystack = questionSearchText(question);

  assert.equal(matchesSearchQuery(haystack, "secular ethics"), true);
  assert.equal(matchesSearchQuery(haystack, "philosophy religion"), true);
});

test("question ranking prioritizes direct text matches over metadata matches", () => {
  const justice = getQuestion("what-is-justice");
  const punishment = getQuestion("punishment");
  assert.ok(justice);
  assert.ok(punishment);

  assert.ok(questionSearchRank(justice, "justice") > questionSearchRank(punishment, "justice"));
});

test("question filtering uses normalized search with domain and difficulty filters", () => {
  const results = filterQuestions({
    query: "religión",
    domain: "philosophy-of-religion",
    difficulty: "intro",
  });

  assert.deepEqual(results.map((question) => question.slug), ["morality-religion"]);
});

test("philosopher ranking prioritizes direct name matches", () => {
  const arendt = philosophers.find((p) => p.slug === "arendt");
  const descartes = philosophers.find((p) => p.slug === "descartes");
  assert.ok(arendt);
  assert.ok(descartes);

  assert.ok(
    philosopherSearchRank(arendt, "arendt") > philosopherSearchRank(descartes, "arendt"),
  );
});

test("philosopher search text includes concept definitions", () => {
  const descartes = philosophers.find((p) => p.slug === "descartes");
  assert.ok(descartes);

  const haystack = philosopherSearchText(descartes);

  assert.equal(matchesSearchQuery(haystack, "doubting everything"), true);
});
