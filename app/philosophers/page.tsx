"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { philosophers } from "@/lib/philosophers";
import { domainLabels, domains } from "@/lib/domains";
import { matchesSearchQuery, normalizeSearchText, philosopherSearchRank, philosopherSearchText } from "@/lib/search";
import { getTradition, traditions } from "@/lib/traditions";
import type { Domain, KeyConcept, Philosopher } from "@/lib/types";

const periods = Array.from(new Set(philosophers.map((p) => p.period)));

export default function PhilosophersPage() {
  const [query, setQuery] = useState("");
  const [tradition, setTradition] = useState<string | null>(null);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [period, setPeriod] = useState<string | null>(null);
  const normalizedQuery = normalizeSearchText(query.trim());
  const activeFilterCount = [tradition, domain, period, normalizedQuery].filter(Boolean).length;

  const filtered = useMemo(() => {
    return philosophers
      .filter((p) => {
        const traditionNames = p.traditions.map((id) => getTradition(id)?.name ?? id);
        const haystack = philosopherSearchText(p, traditionNames);
        if (tradition && !p.traditions.includes(tradition)) return false;
        if (domain && !p.domains.includes(domain)) return false;
        if (period && p.period !== period) return false;
        if (normalizedQuery && !matchesSearchQuery(haystack, normalizedQuery)) return false;
        return true;
      })
      .sort((a, b) => {
        const aTraditions = a.traditions.map((id) => getTradition(id)?.name ?? id);
        const bTraditions = b.traditions.map((id) => getTradition(id)?.name ?? id);
        return philosopherSearchRank(b, normalizedQuery, bTraditions) - philosopherSearchRank(a, normalizedQuery, aTraditions);
      });
  }, [domain, normalizedQuery, period, tradition]);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">
      <div className="mb-8 grid lg:grid-cols-[1fr_16rem] gap-6 items-end">
        <div>
          <p className="text-xs uppercase tracking-wide text-accent-cool mb-2">Explore lenses</p>
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">Philosophy Explorer</h1>
          <p className="text-foreground-muted leading-relaxed">
            {philosophers.length} thinkers across {traditions.length} traditions. Search by idea, then narrow by tradition, domain, or historical period.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-foreground-muted mb-3">Index</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat value={philosophers.length} label="Thinkers" />
            <Stat value={traditions.length} label="Traditions" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface/70 p-4 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search philosophers"
          placeholder="Search by name, concept, or idea…"
          className="focusable w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-sm mb-4"
        />

        <div className="space-y-4">
          <FilterGroup label="Tradition">
            <Chip active={tradition === null} onClick={() => setTradition(null)} label="All" />
            {traditions.map((t) => (
              <Chip key={t.id} active={tradition === t.id} onClick={() => setTradition(tradition === t.id ? null : t.id)} label={t.name} />
            ))}
          </FilterGroup>

          <FilterGroup label="Domain">
            <Chip active={domain === null} onClick={() => setDomain(null)} label="All" />
            {domains.map((d) => (
              <Chip key={d} active={domain === d} onClick={() => setDomain(domain === d ? null : d)} label={domainLabels[d]} />
            ))}
          </FilterGroup>

          <FilterGroup label="Period">
            <Chip active={period === null} onClick={() => setPeriod(null)} label="All" />
            {periods.map((p) => (
              <Chip key={p} active={period === p} onClick={() => setPeriod(period === p ? null : p)} label={p} />
            ))}
          </FilterGroup>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <p className="text-xs text-foreground-muted" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "thinker" : "thinkers"}
          {query.trim() ? ` for "${query.trim()}"` : ""}
          {activeFilterCount > 0 ? ` with ${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}` : ""}.
        </p>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTradition(null);
              setDomain(null);
              setPeriod(null);
            }}
            className="self-start rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground-muted hover:border-ring hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <PhilosopherCard key={p.slug} philosopher={p} query={normalizedQuery} />
        ))}
        {filtered.length === 0 && <p className="text-foreground-muted text-sm">No thinkers match those filters.</p>}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
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
      className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
        active ? "border-accent-strong bg-accent-strong text-background" : "border-border bg-surface text-foreground-muted hover:border-ring"
      }`}
    >
      {label}
    </button>
  );
}

function PhilosopherCard({ philosopher, query }: { philosopher: Philosopher; query: string }) {
  const matchedConcepts = query ? philosopher.keyConcepts.filter((concept) => matchesConcept(concept, query)) : [];
  const concepts = matchedConcepts.length > 0 ? matchedConcepts : philosopher.keyConcepts.slice(0, 3);
  const conceptLabel = matchedConcepts.length > 0 ? "Matched concepts" : "Concepts";

  return (
    <Link
      href={`/philosophers/${philosopher.slug}`}
      className="rounded-lg border border-border bg-surface p-4 shadow-sm hover:border-ring hover:-translate-y-0.5 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-serif text-lg leading-snug">{philosopher.name}</h2>
        <span className="mt-1 h-2 w-2 rounded-full bg-accent-cool shrink-0" aria-hidden />
      </div>
      <p className="text-xs text-foreground-muted mt-0.5 mb-2">
        {philosopher.dates} · {philosopher.region}
      </p>
      <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2">{philosopher.centralQuestions[0]}</p>
      <p className="text-sm leading-relaxed mt-3 line-clamp-3">{philosopher.frame}.</p>
      <p className="text-xs text-foreground-muted mt-3">
        {philosopher.traditions.map((id) => getTradition(id)?.name).filter(Boolean).join(" · ")}
      </p>
      <p className="text-xs text-foreground-muted mt-1">
        Domains: {philosopher.domains.map((d) => domainLabels[d]).join(", ")}
      </p>
      <div className="mt-2">
        <p className="text-xs text-foreground-muted">{conceptLabel}: {concepts.map((concept) => concept.term).join(", ")}</p>
        {matchedConcepts[0] && (
          <p className="text-xs text-foreground-muted mt-1 leading-relaxed line-clamp-2">
            {matchedConcepts[0].definition}
          </p>
        )}
      </div>
      <span className="inline-block text-xs text-accent-strong font-medium mt-4">Open profile</span>
    </Link>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-serif text-2xl leading-none">{value}</p>
      <p className="text-xs text-foreground-muted mt-1">{label}</p>
    </div>
  );
}

function matchesConcept(concept: KeyConcept, query: string): boolean {
  return matchesSearchQuery(normalizeSearchText(`${concept.term} ${concept.definition}`), query);
}
