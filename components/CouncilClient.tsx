"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CouncilMode, Philosopher, Question } from "@/lib/types";
import { councilModes, historicalOrder, matchPhilosophers, speak, traditionLabel } from "@/lib/council";
import { useAI } from "@/lib/use-ai";
import OllamaControl from "./OllamaControl";
import { useAmbientDomain } from "./AmbientProvider";
import { supportLinks } from "@/lib/support";
import { analyze } from "@/lib/analyzer";
import { makeId } from "@/lib/journal";
import { saveEntry } from "@/lib/journal-storage";

export default function CouncilClient({
  question,
  initialMode,
}: {
  question: Question;
  initialMode: CouncilMode;
}) {
  useAmbientDomain(question.domain);
  const [mode, setMode] = useState<CouncilMode>(initialMode);
  const council = useMemo(() => matchPhilosophers(question), [question]);
  const ordered = mode === "historical" ? historicalOrder(council) : council;

  const [initialPosition, setInitialPosition] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [challengeShown, setChallengeShown] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisedPosition, setRevisedPosition] = useState("");
  const [remainingUncertainty, setRemainingUncertainty] = useState("");
  const [saved, setSaved] = useState(false);

  const [challengeResult, setChallengeResult] = useState<{ philosopher: Philosopher; text: string } | null>(null);
  const [voices, setVoices] = useState<Partial<Record<CouncilMode, Record<string, string>>>>({});
  const { loading, error, setError, model, setModel, run, cancel } = useAI();
  const [voiceModels, setVoiceModels] = useState<Partial<Record<CouncilMode, string>>>({});
  const [draftReady, setDraftReady] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");
  const draftKey = `agora:draft:${question.text}`;
  useEffect(() => {
    // Restore browser-only state after hydration, as with the journal and profile.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = window.localStorage.getItem(draftKey);
      const draft = raw ? JSON.parse(raw) : null;
      if (draft && typeof draft === "object") {
        if (typeof draft.initialPosition === "string") setInitialPosition(draft.initialPosition);
        if (typeof draft.reasoning === "string") setReasoning(draft.reasoning);
        if (typeof draft.revisedPosition === "string") setRevisedPosition(draft.revisedPosition);
        if (typeof draft.remainingUncertainty === "string") setRemainingUncertainty(draft.remainingUncertainty);
        const philosopher = council.find((p) => p.slug === draft.challengeSlug);
        if (philosopher && typeof draft.challengeText === "string" && draft.challengeText.trim()) {
          setChallengeResult({ philosopher, text: draft.challengeText });
          setChallengeShown(true);
        }
        setDraftStatus("Draft restored from this browser.");
      }
    } catch { setDraftStatus("Draft storage is unavailable."); }
    setDraftReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [draftKey, council]);
  useEffect(() => {
    // Report the outcome of synchronizing the draft with browser storage.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!draftReady || saved) return;
    try {
      window.localStorage.setItem(draftKey, JSON.stringify({ initialPosition, reasoning, revisedPosition, remainingUncertainty, challengeSlug: challengeResult?.philosopher.slug, challengeText: challengeResult?.text }));
      setDraftStatus(initialPosition || reasoning || revisedPosition || remainingUncertainty ? "Draft saved in this browser." : "");
    } catch { setDraftStatus("Could not save the draft. Copy your text before leaving."); }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [draftReady, saved, draftKey, initialPosition, reasoning, revisedPosition, remainingUncertainty, challengeResult]);
  async function generate(action: "council" | "challenge") {
      if (action === "council") {
        const data = await run<Record<string, string>>({ action, text: question.text, slug: question.slug, domain: question.domain, mode });
        if (!data) return;
        setVoices((current) => ({ ...current, [mode]: data.result }));
        setVoiceModels((current) => ({ ...current, [mode]: data.model }));
      } else {
        const data = await run<{ philosopher: Philosopher; text: string }>({ action, text: question.text, slug: question.slug, domain: question.domain, position: initialPosition, reasoning });
        if (!data) return;
        setChallengeResult(data.result);
        setChallengeShown(true);
      }
  }
  const worthExamining = useMemo(() => {
    if (!challengeShown || !initialPosition.trim()) return [];
    const result = analyze(initialPosition);
    return [...result.valueFlags, ...result.logicFlags.filter((f) => f.matches.length > 0)];
  }, [challengeShown, initialPosition]);

  function saveToJournal() {
    try {
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
    try { window.localStorage.removeItem(draftKey); } catch { /* Journal was saved successfully. */ }
    } catch { setError("Could not save your journal. Browser storage may be full or disabled. Copy your text before leaving."); }
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
        {supportLinks.waitlistUrl && (
          <p className="text-sm text-foreground-muted mt-8">
            Want unlimited AI and journal sync someday?{" "}
            <Link href="/support" className="underline underline-offset-2 hover:text-foreground">Join the Pro waitlist</Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl sm:text-4xl leading-snug mb-6">{question.text}</h1>
      <p className="text-sm text-foreground-muted mb-4">Start with your own view, or open a perspective below. You can reflect and revise without AI.</p>
      <a href="#initial-position" onClick={(event) => {
        event.preventDefault();
        document.getElementById("initial-position")?.focus();
      }} className="inline-block rounded-lg bg-accent-strong text-background px-5 py-3 text-sm font-medium mb-6">Write my initial view</a>
      <details className="rounded-lg border border-border bg-surface mb-6">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium">AI settings</summary>
        <div className="px-4 pb-1">
          <OllamaControl model={model} onChange={setModel} disabled={loading} />
        </div>
      </details>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {councilModes.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={loading}
            aria-pressed={mode === m.id}
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
      <button type="button" disabled={loading} onClick={() => generate("council")} className="rounded-lg border border-border px-4 py-2 text-sm mb-3 disabled:opacity-40">
        {loading ? "Exploring perspectives…" : "Explore perspectives"}
      </button>
      {loading && <button type="button" onClick={cancel} className="ml-3 text-sm underline">Cancel generation</button>}
      <p role="status" className="text-xs text-foreground-muted mb-3">{loading ? "Your local model is thinking. This can take a few minutes." : voices[mode] ? `Generated locally with ${voiceModels[mode]}` : "Showing reference perspectives. Generate to explore this question with local AI."}</p>
      {error && <p role="alert" className="text-sm text-foreground-muted mb-4">{error}</p>}

      <div className="space-y-3 mb-10">
        {ordered.map((p) => (
          <PhilosopherVoice key={p.slug} philosopher={p} line={voices[mode]?.[p.slug] ?? speak(mode, p, question)} />
        ))}
      </div>

      <div className="border-t border-border pt-8">
        {draftStatus && <p role="status" className="text-xs text-foreground-muted mb-3">{draftStatus}</p>}
        <h2 className="font-serif text-xl mb-1">Your turn</h2>
        <p className="text-sm text-foreground-muted mb-4">What&apos;s your initial position?</p>
        <textarea
          id="initial-position"
          value={initialPosition}
          maxLength={12000}
          disabled={loading}
          onChange={(e) => {
            setInitialPosition(e.target.value);
            setChallengeShown(false);
            setChallengeResult(null);
          }}
          aria-label="Initial position"
          rows={4}
          placeholder="Write freely — there's no wrong answer here."
          className="w-full scroll-mt-24 rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-3"
        />
        <label className="block text-xs text-foreground-muted mb-1">Why do you think that? (optional)</label>
        <textarea
          value={reasoning}
          maxLength={12000}
          disabled={loading}
          onChange={(e) => { setReasoning(e.target.value); setChallengeShown(false); setChallengeResult(null); }}
          aria-label="Reasoning"
          rows={2}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-4"
        />

        {!challengeShown && (
          <button
            type="button"
            disabled={!initialPosition.trim() || loading}
            onClick={() => generate("challenge")}
            className="rounded-lg bg-accent-strong text-background font-medium px-5 py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Preparing a challenge…" : "Challenge my view"}
          </button>
        )}

        {initialPosition.trim() && !challengeShown && <button type="button" onClick={saveToJournal} disabled={loading} className="ml-3 text-sm underline disabled:opacity-40">Save this reflection without a challenge</button>}
        <button type="button" onClick={() => setRevisionOpen(true)} aria-expanded={Boolean(revisionOpen || challengeShown || revisedPosition || remainingUncertainty)} aria-controls="personal-revision" className="block mt-4 mb-4 rounded-lg border border-border px-5 py-2.5 text-sm hover:border-ring">Revise on my own</button>
        {(revisionOpen || challengeShown || revisedPosition || remainingUncertainty) && (
          <div id="personal-revision" className="mt-2 space-y-4">
            {challengeResult && <div className="rounded-lg border border-border bg-surface-muted p-4">
              <p className="text-xs uppercase tracking-wide text-foreground-muted mb-1.5">
                Challenge, from {challengeResult.philosopher.name.split(" (")[0]}
              </p>
              <p className="text-sm leading-relaxed">{challengeResult.text}</p>
            </div>}

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
                maxLength={12000}
                disabled={loading}
                onChange={(e) => setRevisedPosition(e.target.value)}
                aria-label="Revised position"
                rows={3}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label htmlFor="remaining-uncertainty" className="block text-sm font-medium mb-1">What am I still unsure about?</label>
              <p className="text-xs text-foreground-muted mb-2">Keep track of questions you want to return to.</p>
              <textarea
                id="remaining-uncertainty"
                value={remainingUncertainty}
                maxLength={12000}
                disabled={loading}
                onChange={(e) => setRemainingUncertainty(e.target.value)}
                aria-label="Remaining uncertainty"
                rows={2}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <button
              type="button"
              onClick={saveToJournal}
              disabled={!initialPosition.trim() || loading}
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
    <details className="rounded-lg border border-border bg-surface p-4">
      <summary className="cursor-pointer font-serif text-lg">
        {philosopher.name}
        <span className="block font-sans text-xs text-foreground-muted mt-1">{traditionLabel(philosopher)} · Open perspective</span>
      </summary>
      <div className="mt-3 border-t border-border pt-3">
      <p className="text-sm leading-relaxed mb-3">{line}</p>
      <Link href={`/philosophers/${philosopher.slug}`} className="font-serif text-lg hover:text-accent-strong transition-colors">
        About {philosopher.name}
      </Link>
      </div>
    </details>
  );
}
