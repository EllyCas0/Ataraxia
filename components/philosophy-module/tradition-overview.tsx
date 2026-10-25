import { ArrowRight } from "lucide-react";
import type { TraditionBundle } from "@/lib/philosophy/types";
import { thinkersOf } from "@/lib/philosophy/registry";
import { StatusLegend } from "./status-badge";

export function TraditionOverview({ bundle, tenetsHref }: { bundle: TraditionBundle; tenetsHref: string }) {
  const { tradition, overview } = bundle;
  const thinkers = thinkersOf(bundle);
  return (
    <div className="space-y-12">
      <section aria-labelledby="history" className="space-y-4">
        <h2 id="history" className="text-2xl">
          Where it comes from
        </h2>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">{tradition.historicalContext}</p>
        <ol className="relative max-w-3xl space-y-5 border-l border-border pl-6">
          {overview.timeline.map((entry) => (
            <li key={entry.period} className="relative">
              <span aria-hidden className="absolute -left-[1.85rem] top-1.5 size-3 rounded-full bg-primary" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{entry.period}</p>
              <p className="mt-0.5 font-bold">{entry.who}</p>
              <p className="mt-0.5 leading-relaxed text-muted-foreground">{entry.idea}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="distinctions" className="space-y-4">
        <h2 id="distinctions" className="text-2xl">
          Four ideas that are easy to mix up
        </h2>
        <dl className="grid gap-4 md:grid-cols-2">
          {overview.distinctions.map((item) => (
            <div key={item.term} className="rounded-3xl border border-border bg-card p-5">
              <dt className="text-xl font-extrabold">{item.term}</dt>
              <dd className="mt-2 leading-relaxed">{item.meaning}</dd>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.contrast}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="what-is" className="space-y-4">
        <h2 id="what-is" className="text-2xl">
          What is {tradition.name}?
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed">{overview.definition}</p>
        <blockquote className="max-w-3xl rounded-3xl border border-accent-foreground/40 bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">The central question</p>
          <p className="mt-2 text-2xl font-extrabold leading-snug">{tradition.centralQuestion}</p>
        </blockquote>
      </section>

      <section aria-labelledby="framework-note" className="space-y-4">
        <h2 id="framework-note" className="text-2xl">
          How to read this module
        </h2>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">{overview.frameworkNote}</p>
        <StatusLegend />
        <a href={tenetsHref} className="inline-flex items-center gap-1.5 text-accent-foreground underline-offset-4 hover:underline">
          Go to the {bundle.tenets.length} core tenets
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </section>


      <section aria-labelledby="thinkers" className="space-y-4">
        <h2 id="thinkers" className="text-2xl">
          Major thinkers
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {thinkers.map((thinker) => (
            <li key={thinker.id} id={`thinker-${thinker.id}`} className="scroll-mt-24 rounded-3xl border border-border bg-card p-5 target:border-accent-foreground">
              <h3 className="text-xl">{thinker.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {thinker.years} · {thinker.role}
              </p>
              <p className="mt-3 leading-relaxed">{thinker.contribution}</p>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
