import assert from "node:assert/strict";
import test from "node:test";
import {
  challenge,
  historicalOrder,
  matchPhilosophers,
  speak,
  traditionLabel,
} from "../lib/council";
import { getQuestion, questionFromText } from "../lib/questions";

test("matches a five-person council for curated questions", () => {
  const question = getQuestion("objective-truth");
  assert.ok(question);

  const council = matchPhilosophers(question);

  assert.equal(council.length, 5);
  assert.equal(new Set(council.map((p) => p.slug)).size, 5);
});

test("prioritizes philosophers from the question domain", () => {
  const question = getQuestion("consciousness-matter");
  assert.ok(question);

  const council = matchPhilosophers(question);

  assert.ok(council.some((p) => p.domains.includes("philosophy-of-mind")));
});

test("historical mode orders matched philosophers chronologically", () => {
  const question = getQuestion("what-is-justice");
  assert.ok(question);
  const ordered = historicalOrder(matchPhilosophers(question));
  const line = ordered.map((p) => p.period).join(" -> ");

  assert.equal(ordered[0]?.period, "Classical Antiquity");
  assert.match(line, /Classical Antiquity/);
});

test("socratic voice references the active question without claiming quotation", () => {
  const question = questionFromText("Can machines think?");
  const council = matchPhilosophers(question);
  const line = speak("socratic", council[0]!, question);

  assert.match(line, /what does that force you to ask/i);
  assert.match(line, /Can machines think\?/);
});

test("challenge returns a council philosopher and a reflective question", () => {
  const question = getQuestion("liberty-vs-welfare");
  assert.ok(question);
  const council = matchPhilosophers(question);

  const result = challenge("Liberty should always defeat collective welfare.", council);

  assert.ok(council.some((p) => p.slug === result.philosopher.slug));
  assert.match(result.text, /would push back here/);
  assert.match(result.text, /\?$/);
});

test("tradition labels resolve known tradition ids", () => {
  const question = getQuestion("meaningful-life");
  assert.ok(question);
  const [first] = matchPhilosophers(question);

  assert.ok(first);
  assert.notEqual(traditionLabel(first), "");
});
