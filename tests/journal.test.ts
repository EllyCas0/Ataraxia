import assert from "node:assert/strict";
import test from "node:test";
import { appendEntry, isJournalEntry, mergeJournalEntries, parseJournalEntries, removeEntry } from "../lib/journal";
import type { JournalEntry } from "../lib/types";
import { deleteEntry, getEntries, importEntries, saveEntry } from "../lib/journal-storage";

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

test("backup imports preserve existing entries and are repeatable", () => {
  assert.deepEqual(mergeJournalEntries([entry], {version:1,entries:[entry]}), [entry]);
  const conflicting = {...entry, revisedPosition:"Justice requires care too."};
  const merged = mergeJournalEntries([entry], [conflicting]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].revisedPosition, "");
  assert.equal(merged[1].revisedPosition, conflicting.revisedPosition);
  assert.equal(mergeJournalEntries(merged, [conflicting]).length, 2);
});

test("invalid backups are rejected as a whole", () => {
  assert.throws(() => mergeJournalEntries([entry], [entry, {...entry,createdAt:"not a date"}]));
  assert.throws(() => mergeJournalEntries([entry], {}));
});

function withStorage(raw: string | null, run: (storage: { raw: string | null; writes: number; failRead: boolean }) => void) {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storage = { raw, writes: 0, failRead: false };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: {
      getItem: () => {
        if (storage.failRead) throw new Error("Storage unavailable");
        return storage.raw;
      },
      setItem: (_key: string, value: string) => { storage.raw = value; storage.writes++; },
    } },
  });
  try { run(storage); }
  finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

test("missing and empty journals remain usable", () => {
  for (const raw of [null, "[]"]) withStorage(raw, () => {
    assert.deepEqual(getEntries(), []);
    saveEntry(entry);
    assert.deepEqual(getEntries(), [entry]);
    deleteEntry(entry.id);
    assert.deepEqual(getEntries(), []);
    assert.deepEqual(importEntries([entry]), [entry]);
  });
});

test("unreadable journals block all writes and preserve the original data", () => {
  const valid = JSON.stringify([entry]);
  const cases = ["{broken", "", "null", "{}", JSON.stringify([entry, { id: "broken" }]), valid];
  for (const raw of cases) withStorage(raw, (storage) => {
    // Simulate a read failure while writes would still succeed.
    storage.failRead = raw === valid;
    for (const operation of [getEntries, () => saveEntry(entry), () => deleteEntry(entry.id), () => importEntries([entry])]) {
      assert.throws(operation, /Could not read your journal/);
      assert.equal(storage.raw, raw);
      assert.equal(storage.writes, 0);
    }
    if (storage.failRead) {
      storage.failRead = false;
      assert.deepEqual(getEntries(), [entry]);
    }
  });
});
