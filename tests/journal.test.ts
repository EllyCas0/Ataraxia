import assert from "node:assert/strict";
import test from "node:test";
import { appendEntry, isJournalEntry, parseJournalEntries, removeEntry } from "../lib/journal";
import type { JournalEntry } from "../lib/types";

const entry: JournalEntry = {
  id: "entry-1",
  createdAt: "2026-09-28T00:00:00.000Z",
  question: "What is justice?",
  initialPosition: "Justice is fairness.",
  reasoning: "",
  counterargument: "",
  revisedPosition: "",
  remainingUncertainty: "",
  philosopherSlugs: ["rawls"],
};

test("recognizes valid journal entries", () => {
  assert.equal(isJournalEntry(entry), true);
  assert.equal(isJournalEntry({ ...entry, philosopherSlugs: [1] }), false);
});

test("parses only valid journal entries from unknown data", () => {
  assert.deepEqual(parseJournalEntries([entry, { ...entry, id: 42 }, null]), [entry]);
  assert.deepEqual(parseJournalEntries({ entries: [entry] }), []);
});

test("appends and removes entries without mutating the source list", () => {
  const original: JournalEntry[] = [];
  const next = appendEntry(original, entry);

  assert.deepEqual(original, []);
  assert.deepEqual(next, [entry]);
  assert.deepEqual(removeEntry(next, "entry-1"), []);
});
