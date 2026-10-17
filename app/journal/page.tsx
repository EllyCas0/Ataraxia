"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { JournalEntry } from "@/lib/types";
import { deleteEntry, getEntries, importEntries, saveEntry } from "@/lib/journal-storage";
import { matchesSearchQuery } from "@/lib/search";
import { downloadJson } from "@/lib/download";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [deleted, setDeleted] = useState<JournalEntry | null>(null);
  const [notice, setNotice] = useState("");
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error("Choose a backup smaller than 5 MB.");
      const next = importEntries(JSON.parse(await file.text()));
      setEntries(next);
      setNotice("Backup imported. Existing entries were preserved.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not import the backup."); }
  }
  const backupControls = <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
    <button type="button" disabled={!entries?.length} onClick={() => downloadJson(`agora-journal-${new Date().toISOString().slice(0, 10)}.json`, { version: 1, entries })} className="underline disabled:opacity-40">Export backup</button>
    <label className="cursor-pointer underline">Import backup<input type="file" accept="application/json,.json" className="sr-only" onChange={(e) => { void restore(e.target.files?.[0]); e.target.value = ""; }} /></label>
  </div>;

  useEffect(() => {
    // localStorage only exists in the browser — read after mount so SSR markup matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getEntries());
  }, []);

  if (entries === null) return <p role="status" className="max-w-2xl mx-auto px-6 py-16">Loading your journal…</p>;

  if (entries.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Your journal is empty</h1>
        {notice && <p role="status" className="text-sm mb-4">{notice}</p>}
        {deleted && <button onClick={() => { try { saveEntry(deleted); setEntries(getEntries()); setDeleted(null); } catch { setNotice("Could not restore the entry."); } }} className="underline mb-4">Undo deletion</button>}
        {backupControls}
        <p className="text-foreground-muted mb-8">
          Ask the Council a question, state a position, and see how it holds up — each entry lands here, privately, so you can watch your thinking change.
        </p>
        <Link href="/questions" className="inline-block rounded-lg bg-accent-strong text-background font-medium px-6 py-3.5 hover:opacity-90 transition-opacity">
          Ask a question
        </Link>
      </div>
    );
  }

  const sorted = entries.filter((entry) => matchesSearchQuery([entry.question, entry.initialPosition, entry.reasoning, entry.counterargument, entry.revisedPosition, entry.remainingUncertainty].join(" "), query)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Philosophy Journal</h1>
      <p className="text-foreground-muted mb-8">{entries.length} entries, private to this browser.</p>
      {backupControls}
      {notice && <p role="status" className="text-sm mb-4">{notice}</p>}
      {deleted && <div className="rounded-lg border border-border bg-surface-muted p-3 mb-4 text-sm">Entry deleted. <button onClick={() => { try { saveEntry(deleted); setEntries(getEntries()); setDeleted(null); } catch { setNotice("Could not restore the entry."); } }} className="underline">Undo</button></div>}
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search your journal" placeholder="Search your reflections…" className="w-full rounded-lg border border-border bg-surface px-4 py-3 mb-6" />
      {sorted.length === 0 && <p className="text-foreground-muted">No reflections match your search.</p>}

      <div className="space-y-4">
        {sorted.map((e) => (
          <article key={e.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-baseline justify-between gap-4 text-xs text-foreground-muted mb-2">
              <span>{new Date(e.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              <button
                type="button"
                onClick={() => {
                  try {
                  deleteEntry(e.id);
                  setDeleted(e);
                  setEntries(getEntries());
                  } catch { setNotice("Could not delete the entry. Browser storage is unavailable."); }
                }}
                aria-label={`Delete journal entry for ${e.question}`}
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
            <Link href={`/council?text=${encodeURIComponent(e.question)}`} className="inline-block mt-4 text-sm text-accent-strong underline">Return to this question</Link>
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
