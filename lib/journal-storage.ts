"use client";

import type { JournalEntry } from "./types";
import { appendEntry, parseJournalEntries, removeEntry } from "./journal";

const KEY = "agora:journal";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return parseJournalEntries(raw ? JSON.parse(raw) : []);
  } catch {
    return [];
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
