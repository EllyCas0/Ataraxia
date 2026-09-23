"use client";

import Link from "next/link";
import { useState } from "react";
import { analyze } from "@/lib/analyzer";
import type { AnalyzerFlag, AnalyzerResult } from "@/lib/types";

const PLACEHOLDER = "Paste a social media post, an essay excerpt, a speech, or your own argument…";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzerResult | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setResult(analyze(text));
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Argument Analyzer</h1>
      <p className="text-foreground-muted mb-6">
        Paste any text and see it broken into claim, evidence, logic, rhetoric, values, and uncertainty.
      </p>
      <p className="text-xs text-foreground-muted mb-6 rounded-lg border border-border bg-surface-muted p-3">
        This is automated pattern-matching, not deep reading — it flags patterns worth a second look, and it does not judge whether the argument is ultimately right or wrong. See the Journal page to think that through yourself.
      </p>

      <form onSubmit={run}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={PLACEHOLDER}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-3"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-lg bg-accent-strong text-background font-medium px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Analyze
        </button>
      </form>

      {result && (
        <div className="mt-10 space-y-8">
          <Block title="Claim">
            <p className="leading-relaxed">{result.claim}</p>
          </Block>
          <Block title="Evidence"><Flags flags={result.evidenceFlags} /></Block>
          <Block title="Logic"><Flags flags={result.logicFlags} /></Block>
          <Block title="Rhetoric"><Flags flags={result.rhetoricFlags} /></Block>
          <Block title="Values at play">
            {result.valueFlags.length > 0 ? <Flags flags={result.valueFlags} /> : <p className="text-sm text-foreground-muted">No strong value-language detected.</p>}
          </Block>
          <Block title="Uncertainty"><Flags flags={result.uncertaintyFlags} /></Block>

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
