import assert from "node:assert/strict";
import test from "node:test";
import { clampStep, reframes, stepFraction } from "../lib/reframing";

test("there are four versions of the thought, in slider order", () => {
  assert.deepEqual(reframes.map((r) => r.id), ["anxious", "stoic", "growth", "cosmic"]);
});

test("each version has its own label, lens, text, and accent color", () => {
  for (const reframe of reframes) {
    assert.ok(reframe.label.trim() && reframe.lens.trim() && reframe.text.trim(), `${reframe.id} is incomplete`);
    assert.match(reframe.accent, /^#[0-9a-f]{6}$/i, `${reframe.id} accent must be a hex color`);
  }
  assert.equal(new Set(reframes.map((r) => r.text)).size, 4, "the four versions must differ");
  assert.equal(new Set(reframes.map((r) => r.accent)).size, 4, "each step needs a distinct accent");
});

test("clampStep keeps values on the four steps", () => {
  assert.equal(clampStep(-3), 0);
  assert.equal(clampStep(0), 0);
  assert.equal(clampStep(1.4), 1);
  assert.equal(clampStep(2.6), 3);
  assert.equal(clampStep(99), 3);
  assert.equal(clampStep(Number.NaN), 0);
});

test("stepFraction spreads the steps evenly from 0 to 1", () => {
  assert.deepEqual([0, 1, 2, 3].map((step) => stepFraction(step)), [0, 1 / 3, 2 / 3, 1]);
  assert.equal(stepFraction(5), 1, "out-of-range steps are clamped");
  assert.equal(stepFraction(0, 1), 0, "a single step does not divide by zero");
});
