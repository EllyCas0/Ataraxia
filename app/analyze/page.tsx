"use client";

import Link from "next/link";
import { useState } from "react";
import { useAI } from "@/lib/use-ai";
import { analyze } from "@/lib/analyzer";
import OllamaControl from "@/components/OllamaControl";
import { downloadJson } from "@/lib/download";
import type { AnalyzerFlag, AnalyzerResult } from "@/lib/types";

const PLACEHOLDER = "Paste a social media post, an essay excerpt, a speech, or your own argument…";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const { loading, error, setError, model, setModel, run: generate, cancel } = useAI();
  const [source, setSource] = useState("");

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setResult(null);
      const data = await generate<AnalyzerResult>({ action: "analyze", text });
      if (!data) return;
      setResult(data.result);
      setSource(`Generated locally with ${data.model}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Argument Analyzer</h1>
      <p className="text-foreground-muted mb-6">
        Paste any text and see it broken into claim, evidence, logic, rhetoric, values, and uncertainty.
      </p>
      <p className="text-xs text-foreground-muted mb-6 rounded-lg border border-border bg-surface-muted p-3">
        An AI model running locally through Ollama examines your argument. Its suggestions can be mistaken, and factual claims still require sources.
      </p>

      <form onSubmit={run}>
        <OllamaControl model={model} onChange={setModel} disabled={loading} />
        <textarea
          maxLength={12000}
          value={text}
          disabled={loading}
          onChange={(e) => { setText(e.target.value); setResult(null); setError(""); }}
          aria-label="Text to analyze"
          rows={8}
          placeholder={PLACEHOLDER}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none mb-3"
        />
        <p className="text-xs text-foreground-muted mb-3">{text.length.toLocaleString()} / 12,000 characters</p>
        <button
          type="submit"
          disabled={!text.trim() || loading}
          className="rounded-lg bg-accent-strong text-background font-medium px-6 py-3 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? "Analyzing with Ollama…" : "Analyze with Ollama"}
        </button>
        {loading ? <button type="button" onClick={cancel} className="ml-3 text-sm underline">Cancel</button> : <button type="button" disabled={!text.trim()} onClick={() => { setResult(analyze(text)); setSource("Quick scan using local language patterns (English). No AI model used."); setError(""); }} className="ml-3 text-sm underline disabled:opacity-40">Quick scan without AI</button>}
      </form>
      {loading && <p role="status" className="mt-4 text-sm text-foreground-muted">Your local model is thinking. This can take a few minutes.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-foreground-muted">{error}</p>}
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
