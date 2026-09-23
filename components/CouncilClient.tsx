"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CouncilMode, Philosopher, Question } from "@/lib/types";
import { councilModes, historicalOrder, matchPhilosophers, speak, traditionLabel, challenge as buildChallenge } from "@/lib/council";
import { analyze } from "@/lib/analyzer";
import { makeId, saveEntry } from "@/lib/journal";

export default function CouncilClient({
  question,
  initialMode,
}: {
  question: Question;
  initialMode: CouncilMode;
}) {
  const [mode, setMode] = useState<CouncilMode>(initialMode);
  const council = useMemo(() => matchPhilosophers(question), [question]);
  const ordered = mode === "historical" ? historicalOrder(council) : council;

  const [initialPosition, setInitialPosition] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [challengeShown, setChallengeShown] = useState(false);
  const [revisedPosition, setRevisedPosition] = useState("");
  const [remainingUncertainty, setRemainingUncertainty] = useState("");
  const [saved, setSaved] = useState(false);

  const challengeResult = useMemo(
    () => (challengeShown && initialPosition.trim() ? buildChallenge(initialPosition, council) : null),
    [challengeShown, initialPosition, council]
  );
  const worthExamining = useMemo(() => {
    if (!challengeShown || !initialPosition.trim()) return [];
    const result = analyze(initialPosition);
    return [...result.valueFlags, ...result.logicFlags.filter((f) => f.matches.length > 0)];
  }, [challengeShown, initialPosition]);

  function saveToJournal() {
    saveEntry({
      id: makeId(),
      createdAt: new Date().toISOString(),
      question: question.text,
      initialPosition: initialPosition.trim(),
      reasoning: reasoning.trim(),
      counterargument: challengeResult?.text ?? "",
      revisedPosition: revisedPosition.trim(),
      remainingUncertainty: remainingUncertainty.trim(),
      philosopherSlugs: council.map((p) => p.slug),
    });
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Saved to your journal.</h1>
        <p className="text-foreground-muted mb-8">
          Come back to this question later and see whether your position holds up.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/journal" className="rounded-lg bg-accent-strong text-background font-medium px-6 py-3 hover:opacity-90 transition-opacity">
            View my journal
          </Link>
          <Link href="/questions" className="rounded-lg border border-border px-6 py-3 hover:border-ring transition-colors">
            Ask another question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl sm:text-4xl leading-snug mb-6">{question.text}</h1>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {councilModes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            title={m.hint}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              mode === m.id ? "border-accent-strong bg-accent-strong text-background" : "border-border text-foreground-muted hover:border-ring"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-foreground-muted mb-3">
        Generalized from each thinker&apos;s philosophy — not a literal quotation.
      </p>

      <div className="space-y-3 mb-10">
        {ordered.map((p) => (
          <PhilosopherVoice key={p.slug} philosopher={p} line={speak(mode, p, question)} />
        ))}
      </div>

      <div className="border-t border-border pt-8">
        <h2 className="font-serif text-xl mb-1">Your turn</h2>
        <p className="text-sm text-foreground-muted mb-4">What&apos;s your initial position?</p>
        <textarea
          value={initialPosition}
          onChange={(e) => {
            setInitialPosition(e.target.value);
            setChallengeShown(false);
          }}
          rows={4}
          placeholder="Write freely — there's no wrong answer here."
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-3"
        />
        <label className="block text-xs text-foreground-muted mb-1">Why do you think that? (optional)</label>
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-4"
        />

        {!challengeShown && (
          <button
            type="button"
            disabled={!initialPosition.trim()}
            onClick={() => setChallengeShown(true)}
            className="rounded-lg bg-accent-strong text-background font-medium px-5 py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            See a challenge
          </button>
        )}

        {challengeShown && challengeResult && (
          <div className="mt-2 space-y-4">
            <div className="rounded-lg border border-border bg-surface-muted p-4">
              <p className="text-xs uppercase tracking-wide text-foreground-muted mb-1.5">
                Challenge, from {challengeResult.philosopher.name.split(" (")[0]}
              </p>
              <p className="text-sm leading-relaxed">{challengeResult.text}</p>
            </div>

            {worthExamining.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">In your own words, worth examining</p>
                <ul className="space-y-1">
                  {worthExamining.map((f) => (
                    <li key={f.label} className="text-xs text-foreground-muted">
                      <span className="text-foreground">{f.label}:</span> {f.matches.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Revised position</label>
              <p className="text-xs text-foreground-muted mb-2">Has anything changed, even slightly?</p>
              <textarea
                value={revisedPosition}
                onChange={(e) => setRevisedPosition(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remaining uncertainty</label>
              <p className="text-xs text-foreground-muted mb-2">What are you still unsure about?</p>
              <textarea
                value={remainingUncertainty}
                onChange={(e) => setRemainingUncertainty(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <button
              type="button"
              onClick={saveToJournal}
              className="w-full rounded-lg bg-accent-strong text-background font-medium px-6 py-3.5 hover:opacity-90 transition-opacity"
            >
              Save to my journal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PhilosopherVoice({ philosopher, line }: { philosopher: Philosopher; line: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <Link href={`/philosophers/${philosopher.slug}`} className="font-serif text-lg hover:text-accent-strong transition-colors">
        {philosopher.name}
      </Link>
      <p className="text-xs text-foreground-muted mb-1.5">{traditionLabel(philosopher)}</p>
      <p className="text-sm leading-relaxed">{line}</p>
    </div>
  );
}
