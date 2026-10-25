"use client";

import { useMemo, useSyncExternalStore } from "react";
import { z } from "zod";
import { toast } from "sonner";

const journalSchema = z.array(z.object({
  id: z.string(), title: z.string().optional(), body: z.string(),
  createdAt: z.string().datetime(), updatedAt: z.string().datetime(), linkedConceptSlug: z.string().optional(),
}));
const savedSchema = z.array(z.object({
  id: z.string(), type: z.enum(["question", "concept", "insight"]), title: z.string(),
  note: z.string().optional(), href: z.string().regex(/^\/(?!\/)/).optional(), createdAt: z.string().datetime(),
}));
const changed = "stoa-library-change";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changed, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(changed, callback); };
}

function useBrowserList<T>(key: string, schema: z.ZodType<T[]>) {
  const read = () => { try { return window.localStorage.getItem(key); } catch { return null; } };
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const items = useMemo(() => {
    if (!raw) return [];
    try { return schema.parse(JSON.parse(raw)); } catch { return []; }
  }, [raw, schema]);
  function update(transform: (current: T[]) => T[]): boolean {
    try {
      // Read at mutation time so another tab's latest changes are preserved.
      const stored = window.localStorage.getItem(key);
      const current = stored ? schema.parse(JSON.parse(stored)) : [];
      window.localStorage.setItem(key, JSON.stringify(transform(current)));
      window.dispatchEvent(new Event(changed));
      return true;
    } catch {
      toast.error("Could not save in this browser. Check browser storage settings or available space. Your changes have not been saved.");
      return false;
    }
  }
  return [items, update] as const;
}

export function useJournal() { return useBrowserList("stoa.journal.v1", journalSchema); }
export function useSavedItems() { return useBrowserList("stoa.saved.v1", savedSchema); }
