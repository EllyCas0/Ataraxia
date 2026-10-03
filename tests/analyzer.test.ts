import assert from "node:assert/strict";
import test from "node:test";
import { analyze } from "../lib/analyzer";

test("uses the first sentence as the claim", () => {
  const result = analyze("Democracy needs truth. Otherwise debate becomes theater.");

  assert.equal(result.claim, "Democracy needs truth.");
});

test("flags absolute language and possible false dichotomies", () => {
  const result = analyze("Either we ban every lie, or democracy will never survive.");

  assert.ok(result.logicFlags.some((flag) => flag.label === "Absolute language"));
  assert.ok(result.logicFlags.some((flag) => flag.label === "Possible false dichotomy"));
});

test("detects evidence indicators when a reason is stated", () => {
  const result = analyze("This policy may work because research found that trust improves compliance.");

  assert.equal(result.evidenceFlags[0]?.label, "Evidence indicators found");
  assert.ok(result.evidenceFlags[0]?.matches.includes("because"));
  assert.ok(result.evidenceFlags[0]?.matches.includes("research"));
});

test("reports missing evidence indicators for unsupported assertions", () => {
  const result = analyze("This is the only rational way forward.");

  assert.equal(result.evidenceFlags[0]?.label, "No evidence indicators found");
});

test("surfaces value language and related philosophers", () => {
  const result = analyze("Freedom and justice matter because a society should protect vulnerable people.");

  assert.ok(result.valueFlags.some((flag) => flag.label === "Individual liberty"));
  assert.ok(result.valueFlags.some((flag) => flag.label === "Equality / fairness"));
  assert.ok(result.relatedPhilosophers.length > 0);
});

test("extracts conclusion and premises from marked arguments", () => {
  const result = analyze("Trust improves compliance because research found that people cooperate with legitimate institutions. Therefore we should make public policy more transparent.");

  assert.equal(result.conclusion, "we should make public policy more transparent.");
  assert.ok(result.premises.some((premise) => premise.includes("research found")));
});

test("adds fallacy hints beyond generic logic flags", () => {
  const result = analyze("Either we ban this technology or it will inevitably lead to disaster.");

  assert.ok(result.fallacyFlags.some((flag) => flag.label === "Possible false dichotomy"));
  assert.ok(result.fallacyFlags.some((flag) => flag.label === "Possible slippery slope"));
});

test("asks missing evidence questions for unsupported claims", () => {
  const result = analyze("This is the only rational way forward.");

  assert.ok(result.missingEvidenceQuestions.some((question) => question.includes("source, example, or data")));
});

test("flags current or empirical claims for source-aware verification", () => {
  const result = analyze("Recent polls show unemployment fell 5 percent this year.");

  assert.equal(result.factCheckFlags[0]?.label, "Current or empirical claim needs verification");
  assert.ok(result.factCheckFlags[0]?.matches.includes("recent"));
  assert.ok(result.factCheckFlags[0]?.matches.some((match) => match.includes("5 percent")));
});
