"use client";

import type { JournalEntry } from "./types";

// Per spec §22's MVP scope, this ships without real user accounts — see
// README for that tradeoff. Entries live in this browser only.

const KEY = "agora:journal";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: JournalEntry): void {
  if (typeof window === "undefined") return;
  const all = getEntries();
  all.push(entry);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteEntry(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(getEntries().filter((e) => e.id !== id)));
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
