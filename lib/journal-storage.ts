"use client";

import type { JournalEntry } from "./types";
import { appendEntry, isJournalEntry, mergeJournalEntries, removeEntry } from "./journal";

const KEY = "agora:journal";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return [];
    const entries: unknown = JSON.parse(raw);
    if (!Array.isArray(entries) || !entries.every(isJournalEntry)) throw new Error("Invalid journal data");
    return entries;
  } catch {
    throw new Error("Could not read your journal. Your stored data has not been changed. Try reloading the page.");
  }
}

export function saveEntry(entry: JournalEntry): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(appendEntry(getEntries(), entry)));
}

export function deleteEntry(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(removeEntry(getEntries(), id)));
}

export function importEntries(backup: unknown): JournalEntry[] {
  const entries = mergeJournalEntries(getEntries(), backup);
  window.localStorage.setItem(KEY, JSON.stringify(entries));
  return entries;
}
