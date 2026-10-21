"use client";

import { useSyncExternalStore } from "react";
import { newestFirst, parseReflections, removeReflection, saveReflection } from "./reflections";
import type { UserReflection } from "./philosophy/types";

// Browser storage for reflections: one list under one key, shared by every tradition. It is read with
// useSyncExternalStore, so server rendering starts empty and the real list appears after hydration
// without a mismatch, and other tabs stay in step through the "storage" event.
export const REFLECTIONS_KEY = "agora.reflections.v1";

const EMPTY: UserReflection[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedList: UserReflection[] = EMPTY;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(REFLECTIONS_KEY);
  } catch {
    return null; // Storage can be unavailable (private windows, blocked site data).
  }
}

function getSnapshot(): UserReflection[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parseReflections(raw);
  }
  return cachedList;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// If storage is blocked the list is kept in memory for this visit, so the page still behaves.
function write(next: UserReflection[]) {
  cachedList = next;
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(REFLECTIONS_KEY, raw);
    cachedRaw = raw;
  } catch {
    cachedRaw = undefined;
  }
  listeners.forEach((listener) => listener());
}

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `r-${Date.now()}-${Math.random().toString(36).slice(2)}`);

export function useReflections() {
  const reflections = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  return {
    reflections,
    newestFirst: () => newestFirst(reflections),
    save: (tenetId: string, response: string) => write(saveReflection(getSnapshot(), { tenetId, response }, new Date(), newId)),
    remove: (tenetId: string) => write(removeReflection(getSnapshot(), tenetId)),
  };
}
