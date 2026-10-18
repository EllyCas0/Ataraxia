import assert from "node:assert/strict";
import test from "node:test";
import { OPENING, claimOf, shadowReply } from "../lib/shadow";

const statement = "I believe that money is the key to happiness, and nothing else really matters.";

// A Socratic reply is made only of questions.
const onlyQuestions = (reply: string) => reply.split(/(?<=\?)\s+/).every((sentence) => sentence.endsWith("?"));

test("the opening and every reply consist only of questions", () => {
  assert.ok(onlyQuestions(OPENING));
  for (let turn = 0; turn < 20; turn++) {
    const reply = shadowReply(statement, turn);
    assert.ok(onlyQuestions(reply), `turn ${turn} was not all questions: ${reply}`);
  }
});

test("it cycles through different questions instead of repeating", () => {
  const replies = Array.from({ length: 7 }, (_, turn) => shadowReply(statement, turn));
  assert.equal(new Set(replies).size, 7);
  assert.equal(shadowReply(statement, 7), replies[0], "the cycle wraps around");
});

test("it quotes the person's own claim back, without 'I think' lead-ins", () => {
  assert.equal(claimOf(statement), "money is the key to happiness, and nothing else really matters");
  assert.ok(shadowReply(statement, 1).includes("“money is the key to happiness, and nothing else really matters”"));
  assert.equal(claimOf("I think that fairness matters. Also other things."), "fairness matters");
});

test("long claims are shortened", () => {
  const long = "Honesty is the most important virtue because " + "very ".repeat(30) + "everything depends on it.";
  const claim = claimOf(long);
  assert.ok(claim.endsWith("…"));
  assert.ok(claim.split(" ").length <= 15);
});

test("the first reply asks what an important word means", () => {
  assert.match(shadowReply("Freedom requires responsibility.", 0), /What do you mean by “(requires|responsibility|freedom)”/i);
});

test("a question from the person is turned back to them", () => {
  const reply = shadowReply("What is justice?", 3);
  assert.match(reply, /answer that yourself/);
  assert.ok(onlyQuestions(reply));
});

test("short or uncertain replies get a gentle prompt", () => {
  assert.match(shadowReply("I don't know", 2), /begin/i);
  assert.match(shadowReply("Maybe", 2), /begin/i);
  assert.match(shadowReply("Freedom", 2), /“Freedom”/);
  assert.ok(onlyQuestions(shadowReply("yes", 5)));
});

test("empty input is handled", () => {
  assert.ok(onlyQuestions(shadowReply("   ", 0)));
});

test("negative or huge turn numbers still pick a valid move", () => {
  assert.ok(onlyQuestions(shadowReply(statement, -3)));
  assert.ok(onlyQuestions(shadowReply(statement, 10_000)));
});
