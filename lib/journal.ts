import type { JournalEntry } from "./types";

// Per spec §22's MVP scope, this ships without real user accounts — see
// README for that tradeoff. Browser persistence lives in journal-storage.ts.

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isJournalEntry(value: unknown): value is JournalEntry {
  return (
    isStringRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.createdAt === "string" &&
    Number.isFinite(Date.parse(value.createdAt)) &&
    typeof value.question === "string" &&
    typeof value.initialPosition === "string" &&
    typeof value.reasoning === "string" &&
    typeof value.counterargument === "string" &&
    typeof value.revisedPosition === "string" &&
    typeof value.remainingUncertainty === "string" &&
    hasStringArray(value.philosopherSlugs)
  );
}

export function parseJournalEntries(value: unknown): JournalEntry[] {
  return Array.isArray(value) ? value.filter(isJournalEntry) : [];
}

export function appendEntry(entries: JournalEntry[], entry: JournalEntry): JournalEntry[] {
  return [...entries, entry];
}

export function removeEntry(entries: JournalEntry[], id: string): JournalEntry[] {
  return entries.filter((entry) => entry.id !== id);
}

export function mergeJournalEntries(existing: JournalEntry[], incoming: unknown): JournalEntry[] {
  const source = isStringRecord(incoming) ? incoming.entries : incoming;
  if (!Array.isArray(source) || !source.every(isJournalEntry)) throw new Error("This file does not contain a valid journal backup.");
  const merged = new Map(existing.map((entry) => [entry.id, entry]));
  for (const entry of source) {
    const current = merged.get(entry.id);
    if (!current) merged.set(entry.id, entry);
    else if (JSON.stringify(current) !== JSON.stringify(entry)) {
      // Preserve both versions when backups contain a conflicting identifier.
      if (![...merged.values()].some((item) => item.id.startsWith(`${entry.id}-import-`) && JSON.stringify({ ...item, id: entry.id }) === JSON.stringify(entry))) {
        const copy = { ...entry, id: `${entry.id}-import-${makeId()}` };
        merged.set(copy.id, copy);
      }
    }
  }
  return [...merged.values()];
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
