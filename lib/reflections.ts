import { z } from "zod";
import type { UserReflection } from "./philosophy/types";

// People's written reflections on tenets. These functions are pure (no storage, no clock, no randomness)
// so they are easy to test. The browser storage lives in lib/reflections-store.ts.

export const MAX_REFLECTION_LENGTH = 4000;
export const LOCAL_USER_ID = "local";

const reflectionSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  tenetId: z.string().min(1),
  response: z.string().max(MAX_REFLECTION_LENGTH * 2),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

// Reads whatever is in storage. Anything malformed is dropped rather than trusted, and if the same
// tenet appears twice the most recently updated one wins.
export function parseReflections(raw: string | null | undefined): UserReflection[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  const byTenet = new Map<string, UserReflection>();
  for (const item of value) {
    const parsed = reflectionSchema.safeParse(item);
    if (!parsed.success) continue;
    const existing = byTenet.get(parsed.data.tenetId);
    if (!existing || existing.updatedAt <= parsed.data.updatedAt) byTenet.set(parsed.data.tenetId, parsed.data);
  }
  return [...byTenet.values()];
}

export function cleanResponse(text: string): string {
  return text.replace(/\r\n/g, "\n").trim().slice(0, MAX_REFLECTION_LENGTH);
}

// Adds a reflection for a tenet or updates the existing one (keeping its id and creation time).
// A blank response changes nothing: use removeReflection to delete.
export function saveReflection(
  list: UserReflection[],
  input: { tenetId: string; response: string },
  now: Date,
  newId: () => string,
): UserReflection[] {
  const response = cleanResponse(input.response);
  if (response.length === 0) return list;
  const timestamp = now.toISOString();
  const existing = list.find((r) => r.tenetId === input.tenetId);
  if (!existing) return [...list, { id: newId(), userId: LOCAL_USER_ID, tenetId: input.tenetId, response, createdAt: timestamp, updatedAt: timestamp }];
  if (existing.response === response) return list;
  return list.map((r) => (r.tenetId === input.tenetId ? { ...r, response, updatedAt: timestamp } : r));
}

export function removeReflection(list: UserReflection[], tenetId: string): UserReflection[] {
  return list.some((r) => r.tenetId === tenetId) ? list.filter((r) => r.tenetId !== tenetId) : list;
}

export function reflectionFor(list: UserReflection[], tenetId: string): UserReflection | undefined {
  return list.find((r) => r.tenetId === tenetId);
}

/** Most recently edited first, so people can pick up where they left off. */
export function newestFirst(list: UserReflection[]): UserReflection[] {
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
