import { MAX_RANKED_VALUES } from "@/lib/content/values";

export const MAX_VALUE_NAME_LENGTH = 40;

export type ValueResult = { ok: true; values: string[] } | { ok: false; error: string };

// Collapses whitespace so "  Deep   work " and "Deep work" are the same value.
export function normalizeValueName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

const sameValue = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;

// Adds a value to the end of the ranked list. A value is never added on the user's behalf:
// this only runs when they pick or type one.
export function addValue(ranked: string[], raw: string): ValueResult {
  const name = normalizeValueName(raw);
  if (name.length === 0) return { ok: false, error: "Enter a value first." };
  if (name.length > MAX_VALUE_NAME_LENGTH) return { ok: false, error: `Keep it to ${MAX_VALUE_NAME_LENGTH} characters or fewer.` };
  if (ranked.some((v) => sameValue(v, name))) return { ok: false, error: `“${name}” is already on your list.` };
  if (ranked.length >= MAX_RANKED_VALUES) return { ok: false, error: `You can rank up to ${MAX_RANKED_VALUES} values. Remove one to add another.` };
  return { ok: true, values: [...ranked, name] };
}

export function removeValue(ranked: string[], name: string): string[] {
  return ranked.filter((v) => !sameValue(v, name));
}

// Moves a value up (-1) or down (+1) in the ranking. Out-of-range moves leave the list unchanged.
export function moveValue(ranked: string[], index: number, direction: -1 | 1): string[] {
  const target = index + direction;
  if (index < 0 || index >= ranked.length || target < 0 || target >= ranked.length) return ranked;
  const next = [...ranked];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
