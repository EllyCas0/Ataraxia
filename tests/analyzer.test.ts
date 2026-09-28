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
