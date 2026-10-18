// Kept out of the client component file on purpose: server components cannot call methods on values
// exported from a "use client" module, so shared constants live in a plain module.
export const MY_PHILOSOPHY_TABS = ["journal", "saved", "values", "history"] as const;
export type MyPhilosophyTab = (typeof MY_PHILOSOPHY_TABS)[number];

export function parseMyPhilosophyTab(value: string | string[] | undefined): MyPhilosophyTab {
  const raw = Array.isArray(value) ? value[0] : value;
  return (MY_PHILOSOPHY_TABS as readonly string[]).includes(raw ?? "") ? (raw as MyPhilosophyTab) : "journal";
}
