"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { filterQuestions, matchingTopics, search } from "@/lib/search";
import { domains, domainLabels } from "@/lib/domains";
import type { Domain } from "@/lib/types";

export default function QuestionsClient({ initialQuery = "", initialDomain = null }: { initialQuery?: string; initialDomain?: Domain | null }) {
  const [query, setQuery] = useState(initialQuery);
  const [domain, setDomain] = useState<Domain | null>(initialDomain);
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (domain) params.set("domain", domain);
    window.history.replaceState(null, "", `/questions${params.size ? `?${params}` : ""}`);
  }, [query, domain]);
  const filtered = filterQuestions({ query, domain, difficulty: null });
  const relatedTopics = matchingTopics(query).filter((item) => !domain || item === domain);
  const thinkers = search(query).philosophers.filter((item) => !domain || item.domains.includes(domain)).slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-16">
      <h1 className="font-serif text-3xl sm:text-4xl mb-3">Questions</h1>
      <p className="text-foreground-muted mb-7">Find a question that makes you pause.</p>
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search questions" placeholder="Search questions…" className="focusable min-w-0 flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm" />
        <select value={domain ?? ""} onChange={(event) => setDomain(event.target.value ? event.target.value as Domain : null)} aria-label="Filter by topic" className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
          <option value="">All topics</option>
          {domains.map((item) => <option key={item} value={item}>{domainLabels[item]}</option>)}
        </select>
      </div>
      {(query || domain) && <button type="button" onClick={() => { setQuery(""); setDomain(null); }} className="text-sm text-accent underline mb-5">Clear search and filters</button>}
      {relatedTopics.length > 0 && <section aria-label="Matching topics" className="mb-6">
        <h2 className="text-sm font-medium mb-3">Narrow by topic</h2>
        <div className="flex flex-wrap gap-2">{relatedTopics.map((item) => <Link key={item} href={`/questions?domain=${item}`} className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-ring">{domainLabels[item]} →</Link>)}</div>
      </section>}
      {thinkers.length > 0 && <section aria-label="Related thinkers" className="mb-6">
        <h2 className="text-sm font-medium mb-3">Related thinkers</h2>
        <div className="flex flex-wrap gap-2">{thinkers.map((item) => <Link key={item.slug} href={`/philosophers/${item.slug}`} className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-ring">{item.name} →</Link>)}</div>
      </section>}
      <p role="status" className="text-sm text-foreground-muted mb-4">{filtered.length} {filtered.length === 1 ? "question" : "questions"}{query.trim() ? ` for “${query.trim()}”` : ""}</p>
      <div className="space-y-3">
        {filtered.map((question) => (
          <Link key={question.slug} href={`/council?slug=${question.slug}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 hover:border-ring transition-colors">
            <span><span className="block">{question.text}</span><span className="block text-xs text-foreground-muted mt-2">{domainLabels[question.domain]}</span></span>
            <span aria-hidden="true" className="text-accent">→</span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="text-sm text-foreground-muted">{thinkers.length || relatedTopics.length ? "No questions match this search. See the related results above, or try another term." : "No results found. Try a broader topic or check the spelling."}</p>}
      </div>
    </div>
  );
}
