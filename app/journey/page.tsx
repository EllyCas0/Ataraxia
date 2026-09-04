"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReflectionEntry } from "@/lib/types";
import { deleteReflection, getReflections } from "@/lib/journal";
import { getPerspective } from "@/lib/perspectives";

export default function JourneyPage() {
  const [entries, setEntries] = useState<ReflectionEntry[] | null>(null);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR/client
    // markup mismatch (the server has no localStorage to read from).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(getReflections());
  }, []);

  if (entries === null) return null;

  if (entries.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-24 pb-24 text-center">
        <div className="text-3xl mb-4">🗺️</div>
        <h1 className="font-serif text-2xl mb-3">Your journey hasn&apos;t started yet</h1>
        <p className="text-foreground-muted mb-8">
          Explore a question, discuss it with a perspective, and record what
          you think — each reflection becomes a marker on your timeline here.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-accent-strong text-background font-medium px-6 py-3 hover:opacity-90 transition-opacity inline-block"
        >
          Ask your first question
        </Link>
      </div>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const traditions = new Set(
    entries.map((e) => getPerspective(e.perspectiveSlug)?.tradition).filter(Boolean)
  );
  const perspectivesSeen = new Set(entries.map((e) => e.perspectiveSlug));
  const questionsExplored = new Set(entries.map((e) => e.question));

  return (
    <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
      <h1 className="font-serif text-3xl mb-2">My Philosophy Journey</h1>
      <p className="text-foreground-muted mb-8">
        A private record of the questions you&apos;ve explored and how your
        thinking has moved.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-10">
        <Stat value={questionsExplored.size} label="questions explored" />
        <Stat value={perspectivesSeen.size} label="perspectives encountered" />
        <Stat value={traditions.size} label="traditions crossed" />
      </div>

      <div className="space-y-6">
        {sorted.map((e) => {
          const p = getPerspective(e.perspectiveSlug);
          return (
            <div key={e.id} className="relative pl-6 border-l-2 border-border">
              <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-accent-strong" />
              <p className="text-xs text-foreground-muted mb-1">
                {new Date(e.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-foreground-muted mb-1">
                      {p?.emoji} {p?.name ?? e.perspectiveName}
                    </p>
                    <h3 className="font-serif text-lg leading-snug">{e.question}</h3>
                  </div>
                  <button
                    onClick={() => {
                      deleteReflection(e.id);
                      setEntries(getReflections());
                    }}
                    className="text-xs text-foreground-muted hover:text-accent-strong shrink-0"
                    aria-label="Delete entry"
                  >
                    remove
                  </button>
                </div>

                {e.currentPosition && (
                  <p className="text-sm mt-3">
                    <span className="text-foreground-muted">Currently: </span>
                    {e.currentPosition}
                  </p>
                )}
                {e.newInsight && (
                  <p className="text-sm mt-1.5">
                    <span className="text-foreground-muted">What challenged me: </span>
                    {e.newInsight}
                  </p>
                )}
                {e.remainingQuestions && (
                  <p className="text-sm mt-1.5">
                    <span className="text-foreground-muted">Still uncertain: </span>
                    {e.remainingQuestions}
                  </p>
                )}
                {e.resonatedIdeas.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {e.resonatedIdeas.map((idea) => (
                      <span
                        key={idea}
                        className="text-[11px] px-2 py-1 rounded-full bg-surface-muted text-foreground-muted"
                      >
                        {idea.length > 40 ? idea.slice(0, 40) + "…" : idea}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className="font-serif text-2xl">{value}</p>
      <p className="text-xs text-foreground-muted mt-1 leading-tight">{label}</p>
    </div>
  );
}
