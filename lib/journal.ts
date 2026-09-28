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
    typeof value.createdAt === "string" &&
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

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
