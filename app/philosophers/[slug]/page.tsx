import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhilosopher, resolveNamesToPhilosophers } from "@/lib/philosophers";
import { getTradition } from "@/lib/traditions";

export default async function PhilosopherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPhilosopher(slug);
  if (!p) notFound();

  const influenceLinks = resolveNamesToPhilosophers(p.influences);
  const influencedLinks = resolveNamesToPhilosophers(p.influenced);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <Link href="/philosophers" className="text-sm text-foreground-muted hover:text-foreground">
        ← All thinkers
      </Link>

      <h1 className="font-serif text-4xl mt-6 mb-1">{p.name}</h1>
      <p className="text-sm text-foreground-muted mb-6">
        {p.dates} · {p.region} · {p.period}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {p.traditions.map((t) => {
          const tr = getTradition(t);
          return tr ? (
            <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-surface-muted text-foreground-muted">
              {tr.name}
            </span>
          ) : null;
        })}
      </div>

      <Section title="Central questions">
        <ul className="space-y-2">
          {p.centralQuestions.map((q) => (
            <li key={q}>
              <Link
                href={`/council?text=${encodeURIComponent(q)}`}
                className="text-accent-strong hover:underline leading-relaxed"
              >
                {q}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Key concepts">
        <div className="space-y-3">
          {p.keyConcepts.map((k) => (
            <div key={k.term}>
              <p className="font-medium">{k.term}</p>
              <p className="text-sm text-foreground-muted leading-relaxed">{k.definition}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Major arguments">
        <ul className="space-y-2.5">
          {p.majorArguments.map((a, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="text-foreground-muted">•</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Historical & political context">
        <p className="text-sm leading-relaxed text-foreground-muted">{p.context}</p>
      </Section>

      <div className="grid sm:grid-cols-2 gap-8 mb-8">
        <Section title="Influenced by" flush>
          <NameList names={p.influences} links={influenceLinks} />
        </Section>
        <Section title="Influenced" flush>
          <NameList names={p.influenced} links={influencedLinks} />
        </Section>
      </div>

      <Section title="Major criticisms">
        <ul className="space-y-2">
          {p.criticisms.map((c, i) => (
            <li key={i} className="text-sm text-foreground-muted border-l-2 border-border pl-3 leading-relaxed">
              {c}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Contemporary relevance">
        <p className="text-sm leading-relaxed">{p.relevance}</p>
      </Section>

      <Section title="Sources">
        <p className="text-xs text-foreground-muted mb-1">Primary: {p.primarySources.join("; ")}</p>
        <p className="text-xs text-foreground-muted">Secondary: {p.secondarySources.join("; ")}</p>
      </Section>

      <Link
        href={`/council?text=${encodeURIComponent(p.centralQuestions[0])}`}
        className="block text-center rounded-lg bg-accent-strong text-background font-medium px-6 py-3.5 mt-10 hover:opacity-90 transition-opacity"
      >
        Bring {p.name.split(" (")[0]} into the Council
      </Link>
    </div>
  );
}

function Section({ title, children, flush = false }: { title: string; children: React.ReactNode; flush?: boolean }) {
  return (
    <section className={flush ? "" : "mb-8"}>
      <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">{title}</h2>
      {children}
    </section>
  );
}

function NameList({ names, links }: { names: string[]; links: { slug: string; name: string }[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {names.map((n) => {
        const match = links.find((l) => n.toLowerCase().includes(l.name.toLowerCase().split(" (")[0].toLowerCase()));
        return (
          <li key={n}>
            {match ? (
              <Link href={`/philosophers/${match.slug}`} className="text-accent-strong hover:underline">
                {n}
              </Link>
            ) : (
              <span className="text-foreground-muted">{n}</span>
            )}
          </li>
        );
      })}
      {names.length === 0 && <li className="text-foreground-muted">—</li>}
    </ul>
  );
}
