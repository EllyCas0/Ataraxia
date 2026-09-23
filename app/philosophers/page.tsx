"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { philosophers } from "@/lib/philosophers";
import { traditions } from "@/lib/traditions";

export default function PhilosophersPage() {
  const [query, setQuery] = useState("");
  const [tradition, setTradition] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return philosophers.filter((p) => {
      if (tradition && !p.traditions.includes(tradition)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.keyConcepts.some((k) => k.term.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [query, tradition]);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Philosophy Explorer</h1>
      <p className="text-foreground-muted mb-6">
        {philosophers.length} thinkers across {traditions.length} traditions — Europe, the Middle East, South Asia, East Asia, Africa, Indigenous America, and contemporary global philosophy.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or concept…"
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring mb-4"
      />

      <div className="flex flex-wrap gap-1.5 mb-8">
        <Chip active={tradition === null} onClick={() => setTradition(null)} label="All traditions" />
        {traditions.map((t) => (
          <Chip key={t.id} active={tradition === t.id} onClick={() => setTradition(tradition === t.id ? null : t.id)} label={t.name} />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/philosophers/${p.slug}`}
            className="rounded-lg border border-border bg-surface p-4 hover:border-ring transition-colors"
          >
            <h2 className="font-serif text-lg leading-snug">{p.name}</h2>
            <p className="text-xs text-foreground-muted mt-0.5 mb-2">{p.dates} · {p.region}</p>
            <p className="text-sm text-foreground-muted leading-relaxed line-clamp-2">{p.centralQuestions[0]}</p>
          </Link>
        ))}
        {filtered.length === 0 && <p className="text-foreground-muted text-sm">No thinkers match those filters.</p>}
      </div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active ? "border-accent-strong bg-accent-strong text-background" : "border-border text-foreground-muted hover:border-ring"
      }`}
    >
      {label}
    </button>
  );
}
