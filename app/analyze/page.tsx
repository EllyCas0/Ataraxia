"use client";

import Link from "next/link";
import { useState } from "react";
import { analyze } from "@/lib/analyzer";
import { downloadJson } from "@/lib/download";
import type { AnalyzerFlag, AnalyzerResult } from "@/lib/types";

const PLACEHOLDER = "Paste a social media post, an essay excerpt, a speech, or your own argument…";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const source = "English language pattern review";

  function run(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setResult(analyze(text));
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Review your writing</h1>
      <p className="text-foreground-muted mb-6">
        Find the main claim, supporting reasons, and wording worth reconsidering.
      </p>
      <p className="text-xs text-foreground-muted mb-6 rounded-lg border border-border bg-surface-muted p-3">
        This review looks for common patterns in English text. Use it as a guide to reflection; it does not verify facts.
      </p>

      <form onSubmit={run}>
        <textarea
          maxLength={12000}
          value={text}
          onChange={(e) => { setText(e.target.value); setResult(null); }}
          aria-label="Text to analyze"
          rows={8}
          placeholder={PLACEHOLDER}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-3"
        />
        <p className="text-xs text-foreground-muted mb-3">{text.length.toLocaleString("en-US")} / 12,000 characters</p>
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-lg bg-accent-strong text-background font-medium px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Review text
        </button>
      </form>
      {result && <p className="mt-4 text-xs text-foreground-muted">{source}</p>}
      {result && <button type="button" onClick={() => downloadJson("agora-analysis.json", { text, source, result })} className="mt-3 text-sm underline">Export analysis</button>}

      {result && (
        <div className="mt-10 space-y-8">
          <Block title="Claim">
            <p className="leading-relaxed">{result.claim}</p>
          </Block>
          <Block title="Conclusion">
            <p className="leading-relaxed">{result.conclusion}</p>
          </Block>
          <Block title="Premises">
            {result.premises.length > 0 ? (
              <ul className="space-y-2">
                {result.premises.map((premise) => (
                  <li key={premise} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">
                    {premise}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground-muted">No explicit premise detected. The argument may be leaning on an unstated assumption.</p>
            )}
          </Block>
          <Block title="Evidence"><Flags flags={result.evidenceFlags} /></Block>
          <Block title="Logic"><Flags flags={result.logicFlags} /></Block>
          <Block title="Fallacy hints"><Flags flags={result.fallacyFlags} /></Block>
          <Block title="Rhetoric"><Flags flags={result.rhetoricFlags} /></Block>
          <Block title="Values at play">
            {result.valueFlags.length > 0 ? <Flags flags={result.valueFlags} /> : <p className="text-sm text-foreground-muted">No strong value-language detected.</p>}
          </Block>
          <Block title="Uncertainty"><Flags flags={result.uncertaintyFlags} /></Block>
          <Block title="Missing evidence questions">
            <ul className="space-y-2">
              {result.missingEvidenceQuestions.map((question) => (
                <li key={question} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">
                  {question}
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Fact-check needs"><Flags flags={result.factCheckFlags} /></Block>

          {result.relatedPhilosophers.length > 0 && (
            <Block title="Philosophical parallels">
              <div className="flex flex-wrap gap-2">
                {result.relatedPhilosophers.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/philosophers/${p.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface hover:border-ring transition-colors"
                  >
                    {p.name.split(" (")[0]}
                  </Link>
                ))}
              </div>
            </Block>
          )}
        </div>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Flags({ flags }: { flags: AnalyzerFlag[] }) {
  if (flags.length === 0) {
    return <p className="text-sm text-foreground-muted">No matching patterns found.</p>;
  }
  return (
    <ul className="space-y-2.5">
      {flags.map((f) => (
        <li key={f.label} className="rounded-lg border border-border bg-surface p-3">
          <p className="text-sm font-medium">{f.label}</p>
          <p className="text-xs text-foreground-muted mt-0.5 leading-relaxed">{f.detail}</p>
          {f.matches.length > 0 && <p className="text-xs text-foreground-muted mt-1.5">Matched: {f.matches.join(", ")}</p>}
        </li>
      ))}
    </ul>
  );
}
