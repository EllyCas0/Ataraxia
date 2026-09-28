"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { questions } from "@/lib/questions";
import { domainLabels, domains } from "@/lib/domains";
import { difficultyNotes, domainDescriptions } from "@/lib/domain-guides";
import { filterQuestions } from "@/lib/search";
import type { Difficulty, Domain } from "@/lib/types";

const DIFFICULTIES: Difficulty[] = ["intro", "intermediate", "advanced"];

export default function QuestionsPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<Domain | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    return filterQuestions({ query, domain, difficulty });
  }, [query, domain, difficulty]);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-wide text-accent-cool mb-2">Question library</p>
        <h1 className="font-serif text-3xl sm:text-4xl mb-2">Browse questions</h1>
        <p className="text-foreground-muted">{questions.length} questions across {domains.length} domains.</p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search questions"
        placeholder="Search questions…"
        className="focusable w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-sm mb-4"
      />

      <div className="rounded-xl border border-border bg-surface/70 p-4 mb-8">
        <FilterGroup label="Domain">
          <Chip active={domain === null} onClick={() => setDomain(null)} label="All domains" />
          {domains.map((d) => (
            <Chip key={d} active={domain === d} onClick={() => setDomain(domain === d ? null : d)} label={domainLabels[d]} />
          ))}
        </FilterGroup>
        <FilterGroup label="Level">
          <Chip active={difficulty === null} onClick={() => setDifficulty(null)} label="Any level" />
          {DIFFICULTIES.map((d) => (
            <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(difficulty === d ? null : d)} label={d} />
          ))}
        </FilterGroup>
      </div>

      {(domain || difficulty) && (
        <div className="rounded-lg border border-border bg-surface-muted p-4 mb-8">
          {domain && (
            <p className="text-sm leading-relaxed">
              <span className="font-medium">{domainLabels[domain]}:</span> {domainDescriptions[domain]}
            </p>
          )}
          {difficulty && (
            <p className="text-sm leading-relaxed mt-2">
              <span className="font-medium capitalize">{difficulty}:</span> {difficultyNotes[difficulty]}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((item) => (
          <Link
            key={item.slug}
            href={`/council?slug=${item.slug}`}
            className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-4 shadow-sm hover:border-ring hover:-translate-y-0.5 transition"
          >
            <div>
              <p className="leading-snug">{item.text}</p>
              <p className="text-xs text-foreground-muted mt-1">
                {domainLabels[item.domain]} · {item.difficulty}
              </p>
              <p className="text-xs text-foreground-muted mt-1">Key terms: {item.tags.join(", ")}</p>
            </div>
            <span className="text-foreground-muted group-hover:text-foreground transition-colors shrink-0" aria-hidden>
              →
            </span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="text-foreground-muted text-sm">No questions match those filters.</p>}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-md border capitalize transition-colors ${
        active ? "border-accent-strong bg-accent-strong text-background" : "border-border bg-surface text-foreground-muted hover:border-ring"
      }`}
    >
      {label}
    </button>
  );
}
