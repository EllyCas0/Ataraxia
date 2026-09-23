"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/types";
import { deleteEntry, getEntries } from "@/lib/journal";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    // localStorage only exists in the browser — read after mount so SSR markup matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getEntries());
  }, []);

  if (entries === null) return null;

  if (entries.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Your journal is empty</h1>
        <p className="text-foreground-muted mb-8">
          Ask the Council a question, state a position, and see how it holds up — each entry lands here, privately, so you can watch your thinking change.
        </p>
        <Link href="/questions" className="inline-block rounded-lg bg-accent-strong text-background font-medium px-6 py-3.5 hover:opacity-90 transition-opacity">
          Ask a question
        </Link>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Philosophy Journal</h1>
      <p className="text-foreground-muted mb-8">{entries.length} entries, private to this browser.</p>

      <div className="space-y-4">
        {sorted.map((e) => (
          <article key={e.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-baseline justify-between gap-4 text-xs text-foreground-muted mb-2">
              <span>{new Date(e.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
              <button
                onClick={() => {
                  deleteEntry(e.id);
                  setEntries(getEntries());
                }}
                className="hover:text-foreground"
              >
                Delete
              </button>
            </div>
            <h2 className="font-serif text-xl leading-snug mb-3">{e.question}</h2>

            <Field label="Initial position" value={e.initialPosition} />
            <Field label="Reasoning" value={e.reasoning} />
            <Field label="Counterargument" value={e.counterargument} />
            <Field label="Revised position" value={e.revisedPosition} emphasis />
            <Field label="Remaining uncertainty" value={e.remainingUncertainty} />
          </article>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  if (!value) return null;
  return (
    <p className={`text-sm mt-2 leading-relaxed ${emphasis ? "" : ""}`}>
      <span className="text-foreground-muted">{label}: </span>
      <span className={emphasis ? "font-medium" : ""}>{value}</span>
    </p>
  );
}
