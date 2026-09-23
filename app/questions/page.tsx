"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { questions } from "@/lib/questions";
import { domainLabels, domains } from "@/lib/domains";
import type { Difficulty, Domain } from "@/lib/types";

const DIFFICULTIES: Difficulty[] = ["intro", "intermediate", "advanced"];

export default function QuestionsPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<Domain | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((item) => {
      if (domain && item.domain !== domain) return false;
      if (difficulty && item.difficulty !== difficulty) return false;
      if (q && !item.text.toLowerCase().includes(q) && !item.tags.some((t) => t.includes(q))) return false;
      return true;
    });
  }, [query, domain, difficulty]);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Browse questions</h1>
      <p className="text-foreground-muted mb-6">{questions.length} questions across {domains.length} domains.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions…"
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring mb-4"
      />

      <div className="flex flex-wrap gap-1.5 mb-2">
        <Chip active={domain === null} onClick={() => setDomain(null)} label="All domains" />
        {domains.map((d) => (
          <Chip key={d} active={domain === d} onClick={() => setDomain(domain === d ? null : d)} label={domainLabels[d]} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-8">
        <Chip active={difficulty === null} onClick={() => setDifficulty(null)} label="Any level" />
        {DIFFICULTIES.map((d) => (
          <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(difficulty === d ? null : d)} label={d} />
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <Link
            key={item.slug}
            href={`/council?slug=${item.slug}`}
            className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3.5 hover:border-ring transition-colors"
          >
            <div>
              <p className="leading-snug">{item.text}</p>
              <p className="text-xs text-foreground-muted mt-1">
                {domainLabels[item.domain]} · {item.difficulty}
              </p>
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

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${
        active ? "border-accent-strong bg-accent-strong text-background" : "border-border text-foreground-muted hover:border-ring"
      }`}
    >
      {label}
    </button>
  );
}
