"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/types";
import { getEntries } from "@/lib/journal";

export default function ContinueThinking() {
  const [latest, setLatest] = useState<JournalEntry | null | undefined>(undefined);

  useEffect(() => {
    // localStorage only exists in the browser — read after mount so SSR markup matches.
    const entries = getEntries();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLatest(entries.length ? entries[entries.length - 1] : null);
  }, []);

  if (!latest) return null;

  return (
    <div className="mt-8 rounded-xl border border-border p-6">
      <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">Continue thinking</p>
      <p className="mb-1 text-sm text-foreground-muted">Your position on</p>
      <p className="font-serif text-lg mb-3">{latest.question}</p>
      <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
        You previously argued: &ldquo;{latest.revisedPosition || latest.initialPosition}&rdquo;
      </p>
      <Link href="/journal" className="text-sm text-accent-strong hover:underline font-medium">
        Revisit →
      </Link>
    </div>
  );
}
