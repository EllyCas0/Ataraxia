import assert from "node:assert/strict";
import test from "node:test";
import { MAX_THOUGHT_LENGTH, SUPPORT_MESSAGE, cleanThought, detectTopic, findAbsolute, reframeThought } from "../lib/reframe-thought";
import { reframes } from "../lib/reframing";

function versionsOf(raw: string) {
  const result = reframeThought(raw);
  assert.ok(result && result.kind === "reframes", `expected reframes for: ${raw}`);
  return result.versions;
}

test("a thought becomes four versions, in slider order, with the same labels and colors", () => {
  const versions = versionsOf("I'm going to fail my driving test.");
  assert.deepEqual(versions.map((v) => v.id), ["anxious", "stoic", "growth", "cosmic"]);
  assert.deepEqual(versions.map((v) => v.label), reframes.map((r) => r.label));
  assert.deepEqual(versions.map((v) => v.accent), reframes.map((r) => r.accent));
  assert.equal(new Set(versions.map((v) => v.text)).size, 4, "the four versions must differ");
  for (const version of versions) assert.ok(version.text.trim().length > 40);
});

test("the Anxious version echoes the person's own words", () => {
  const [anxious] = versionsOf("my boss is going to hate my report");
  assert.ok(anxious.text.startsWith("My boss is going to hate my report."), anxious.text);
});

test("input is tidied: spacing, wrapping quotes, capital letter, and final punctuation", () => {
  assert.equal(cleanThought('   “  i will   never find  a job  ”  '), "i will never find a job");
  assert.ok(versionsOf("will I ever get better?")[0].text.startsWith("Will I ever get better?"));
  assert.ok(versionsOf("everything is falling apart")[0].text.startsWith("Everything is falling apart."));
});

test("long input is capped", () => {
  assert.equal(cleanThought("a".repeat(900)).length, MAX_THOUGHT_LENGTH);
});

test("the topic is detected, with self-judgment outranking the situation", () => {
  assert.equal(detectTopic("I'm going to fail this presentation"), "work");
  assert.equal(detectTopic("I'm afraid I'll fail the exam on Friday"), "school");
  assert.equal(detectTopic("My friend hasn't replied to my message"), "relationship");
  assert.equal(detectTopic("I can't stop worrying about this symptom"), "health");
  assert.equal(detectTopic("I can't afford the rent this month"), "money");
  assert.equal(detectTopic("I'm not good enough for this job"), "self");
  assert.equal(detectTopic("What if it all goes wrong?"), "generic");
});

test("words are matched whole, not inside other words", () => {
  assert.equal(detectTopic("the network is down"), "generic", "'work' inside 'network' must not match");
  assert.equal(detectTopic("a classic mistake"), "generic", "'class' inside 'classic' must not match");
});

test("different topics produce different, tailored versions", () => {
  const work = versionsOf("I'm going to mess up the interview");
  const school = versionsOf("I'm going to mess up the exam");
  assert.notEqual(work[1].text, school[1].text);
  assert.match(work[1].text, /prepare/);
  assert.match(school[1].text, /study/);
});

test("absolute words are called out in the Growth version", () => {
  assert.equal(findAbsolute("I always ruin everything"), "always");
  assert.equal(findAbsolute("This might go badly"), null);
  assert.match(versionsOf("I will never get this right")[2].text, /‘never’ leave no room for exceptions/);
  assert.doesNotMatch(versionsOf("this might not go well")[2].text, /leave no room for exceptions/);
});

test("nothing or too little returns null", () => {
  assert.equal(reframeThought(""), null);
  assert.equal(reframeThought("   "), null);
  assert.equal(reframeThought("ab"), null);
});

test("language about self-harm gets the support message and no reframes", () => {
  for (const text of [
    "I want to kill myself",
    "i don't want to be here anymore",
    "I think everyone would be better off without me",
    "I keep thinking about suicide",
    "I can't go on like this",
    "I want to hurt myself",
  ]) {
    const result = reframeThought(text);
    assert.equal(result?.kind, "support", `should offer support for: ${text}`);
  }
  const joined = SUPPORT_MESSAGE.join(" ");
  assert.match(joined, /988/);
  assert.match(joined, /findahelpline\.com/);
});

test("everyday figures of speech are not mistaken for a crisis", () => {
  for (const text of ["I'm dying to know the result of my exam", "This deadline is killing me", "I could die of embarrassment at the presentation"]) {
    assert.equal(reframeThought(text)?.kind, "reframes", `should reframe: ${text}`);
  }
});
