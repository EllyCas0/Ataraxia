"use client";

import type { ReflectionEntry } from "./types";

// Phase-1 MVP scope keeps this local to the browser (localStorage) rather
// than a backend/database — see spec §18 "Phase 1: Validate the Idea".
// The shape mirrors what a `reflections` Postgres table would hold, so this
// can be swapped for real persistence in Phase 2 without changing callers.

const KEY = "philosophy-app:reflections";

export function getReflections(): ReflectionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReflectionEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReflection(entry: ReflectionEntry): void {
  if (typeof window === "undefined") return;
  const all = getReflections();
  all.push(entry);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function deleteReflection(id: string): void {
  if (typeof window === "undefined") return;
  const all = getReflections().filter((r) => r.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
