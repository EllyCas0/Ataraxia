import assert from "node:assert/strict";
import test from "node:test";
import { getQuestion, questionFromText, questions, todaysQuestion } from "../lib/questions";

test("returns curated questions by slug", () => {
  assert.equal(getQuestion("meaningful-life")?.text, "What makes a life meaningful?");
  assert.equal(getQuestion("missing-question"), undefined);
});

test("daily question is deterministic for a given date", () => {
  const date = new Date("2026-01-15T12:00:00Z");

  assert.deepEqual(todaysQuestion(date), todaysQuestion(date));
  assert.ok(questions.includes(todaysQuestion(date)));
});

test("custom AI questions infer philosophy of mind", () => {
  const question = questionFromText("Can artificial intelligence have consciousness?");

  assert.equal(question.slug, "custom");
  assert.equal(question.domain, "philosophy-of-mind");
  assert.ok(question.tags.includes("artificial"));
  assert.ok(question.tags.includes("intelligence"));
});

test("custom political questions infer political philosophy", () => {
  const question = questionFromText("When is a government law legitimate?");

  assert.equal(question.domain, "political-philosophy");
});

test("custom questions fall back to ethics when no domain hint matches", () => {
  const question = questionFromText("How should I live tomorrow?");

  assert.equal(question.domain, "ethics");
  assert.equal(question.difficulty, "intermediate");
});
