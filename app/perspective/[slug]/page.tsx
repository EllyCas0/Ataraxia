import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerspective, getPerspectives } from "@/lib/perspectives";

export default async function PerspectivePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const question = (q ?? "").trim();
  const p = getPerspective(slug);
  if (!p) notFound();

  const agrees = getPerspectives(p.relatedPhilosophies.agrees);
  const disagrees = getPerspectives(p.relatedPhilosophies.disagrees);

  const dialogueHref = `/dialogue/${p.slug}?q=${encodeURIComponent(
    question || p.coreQuestion
  )}`;
  const reflectHref = `/reflect/${p.slug}?q=${encodeURIComponent(
    question || p.coreQuestion
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
      {question && (
        <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">
          Exploring &ldquo;{question}&rdquo; through
        </p>
      )}
      <div className="flex items-center gap-3 mb-1">
        <span className="text-3xl">{p.emoji}</span>
        <h1 className="font-serif text-3xl sm:text-4xl">{p.name}</h1>
      </div>
      <p className="text-sm text-foreground-muted mb-8">
        {p.tradition} · {p.period}
      </p>

      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">
          The core question
        </h2>
        <p className="prose-calm text-lg font-serif">{p.coreQuestion}</p>
      </section>

      <section className="mb-8 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">
          The core idea
        </h2>
        <p className="prose-calm">{p.coreIdea}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">
          Central ideas
        </h2>
        <ul className="space-y-2.5">
          {p.centralIdeas.map((idea, i) => (
            <li key={i} className="flex gap-3 text-sm prose-calm">
              <span className="text-accent-strong font-serif">{i + 1}</span>
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">
            Key thinkers
          </h2>
          <p className="text-sm text-foreground-muted">{p.keyThinkers.join(", ")}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">
            Historical context
          </h2>
          <p className="text-sm text-foreground-muted">{p.historicalContext}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">
          Application to modern life
        </h2>
        <p className="prose-calm text-sm">{p.application}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-2">
          Strongest criticisms
        </h2>
        <ul className="space-y-2">
          {p.criticisms.map((c, i) => (
            <li key={i} className="text-sm text-foreground-muted border-l-2 border-border pl-3">
              {c}
            </li>
          ))}
        </ul>
      </section>

      {(agrees.length > 0 || disagrees.length > 0) && (
        <section className="mb-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">
            Related philosophies
          </h2>
          <div className="flex flex-wrap gap-2">
            {agrees.map((r) => (
              <Link
                key={r.slug}
                href={`/perspective/${r.slug}${question ? `?q=${encodeURIComponent(question)}` : ""}`}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface-muted hover:border-ring transition-colors"
              >
                {r.emoji} tends to agree — {r.name}
              </Link>
            ))}
            {disagrees.map((r) => (
              <Link
                key={r.slug}
                href={`/perspective/${r.slug}${question ? `?q=${encodeURIComponent(question)}` : ""}`}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface-muted hover:border-ring transition-colors"
              >
                {r.emoji} often disagrees — {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">
          Explore further
        </h2>
        <ul className="space-y-1.5">
          {p.furtherQuestions.map((fq) => (
            <li key={fq}>
              <Link
                href={`/dialogue/${p.slug}?q=${encodeURIComponent(fq)}`}
                className="text-sm text-accent-strong hover:underline"
              >
                {fq}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={dialogueHref}
          className="flex-1 text-center rounded-lg bg-accent-strong text-background font-medium px-6 py-3.5 hover:opacity-90 transition-opacity"
        >
          Discuss This With AI
        </Link>
        <Link
          href={reflectHref}
          className="flex-1 text-center rounded-lg border border-border px-6 py-3.5 hover:border-ring transition-colors"
        >
          Skip to Reflection
        </Link>
      </div>
    </div>
  );
}
