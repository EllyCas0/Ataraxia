// Kept out of the client component file on purpose: server components cannot call methods on values
// exported from a "use client" module, so shared constants live in a plain module.
export const MY_PHILOSOPHY_TABS = ["journal", "values", "history"] as const;
export type MyPhilosophyTab = (typeof MY_PHILOSOPHY_TABS)[number];

// Saved items used to be a tab of their own. They now sit under the journal, so old links still land in the right place.
const RENAMED: Record<string, MyPhilosophyTab> = { saved: "journal" };

export function parseMyPhilosophyTab(value: string | string[] | undefined): MyPhilosophyTab {
  const raw = (Array.isArray(value) ? value[0] : value) ?? "";
  if (raw in RENAMED) return RENAMED[raw];
  return (MY_PHILOSOPHY_TABS as readonly string[]).includes(raw) ? (raw as MyPhilosophyTab) : "journal";
}
