import assert from "node:assert/strict";
import test from "node:test";
import { createEmptyProfile, findTensions, parseProfile, selectedPositionDetails, togglePosition, updatePositionNote } from "../lib/profile";

test("creates a fresh empty profile", () => {
  const first = createEmptyProfile();
  const second = createEmptyProfile();
  first.ethics.push("virtue");

  assert.deepEqual(second.ethics, []);
});

test("parses profile data while dropping malformed fields", () => {
  const profile = parseProfile({
    ethics: ["consequentialism", 12, "deontology"],
    epistemology: "skepticism",
    metaphysics: ["physicalism"],
    "political-philosophy": ["liberalism"],
    notes: { consequentialism: "outcomes matter", bad: 42 },
  });

  assert.deepEqual(profile.ethics, ["consequentialism", "deontology"]);
  assert.deepEqual(profile.epistemology, []);
  assert.deepEqual(profile.notes, { consequentialism: "outcomes matter" });
});

test("toggles profile positions immutably", () => {
  const profile = createEmptyProfile();
  const selected = togglePosition(profile, "ethics", "deontology");
  const deselected = togglePosition(selected, "ethics", "deontology");

  assert.deepEqual(profile.ethics, []);
  assert.deepEqual(selected.ethics, ["deontology"]);
  assert.deepEqual(deselected.ethics, []);
});

test("stores notes for selected positions and removes them when deselected", () => {
  const profile = createEmptyProfile();
  const selected = togglePosition(profile, "ethics", "deontology");
  const noted = updatePositionNote(selected, "deontology", "Duty matters when outcomes are unclear.");
  const deselected = togglePosition(noted, "ethics", "deontology");

  assert.equal(selectedPositionDetails(noted)[0]?.note, "Duty matters when outcomes are unclear.");
  assert.deepEqual(deselected.notes, {});
});

test("detects classic tensions from explicit selections", () => {
  const profile = parseProfile({ ethics: ["consequentialism", "deontology"] });

  assert.ok(findTensions(profile).some((tension) => tension.a === "consequentialism" && tension.b === "deontology"));
});
