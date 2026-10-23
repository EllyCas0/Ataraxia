"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reflectionFor } from "@/lib/reflections";
import { useReflections } from "@/lib/reflections-store";
import type { TenetView } from "@/lib/philosophy/views";
import { cn } from "@/lib/utils";
import { ReflectionEditor } from "./reflection-editor";
import { StatusBadge } from "./status-badge";

// One tenet as a card. Collapsed it shows the number, title, short definition, its status, and a
// Reflect button. Expanding it shows the explanation, origins, example, criticisms, related ideas and
// sources. The heading button is a standard disclosure (aria-expanded), so it works with a keyboard.
export function TenetCard({ tenet, basePath }: { tenet: TenetView; basePath: string }) {
  const [open, setOpen] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  const [focusEditor, setFocusEditor] = useState(false);
  const { reflections } = useReflections();
  const saved = reflectionFor(reflections, tenet.id);
  const uid = useId();
  const panelId = `${uid}-panel`;
  const headingId = `${uid}-heading`;

  function reflect() {
    setOpen(true);
    setReflecting(true);
    setFocusEditor(true);
  }

  return (
    <li id={`tenet-${tenet.number}`} className={cn("scroll-mt-24 rounded-3xl border bg-card transition-colors", open ? "border-accent-foreground/50 md:col-span-2" : "border-border hover:border-foreground/30")}>
      <h3 id={headingId} className="text-base">
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className="flex w-full items-start gap-4 rounded-3xl p-5 text-left">
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">
            {tenet.number}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xl font-extrabold leading-snug">
              <span className="sr-only">Tenet {tenet.number}: </span>
              {tenet.title}
            </span>
            <span className="mt-1 block font-normal leading-relaxed text-muted-foreground">{tenet.definition}</span>
          </span>
          <ChevronDown className={cn("mt-1 size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </h3>

      <div className="flex flex-wrap items-center gap-3 px-5 pb-5">
        <StatusBadge status={tenet.status} />
        <Button type="button" variant="outline" size="sm" onClick={reflect} aria-label={`Reflect on ${tenet.title}`}>
          <NotebookPen data-icon="inline-start" aria-hidden />
          {saved ? "Revisit reflection" : "Reflect"}
        </Button>
        {saved && <span className="text-sm text-accent-foreground">Reflection saved</span>}
      </div>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="space-y-6 border-t border-border px-5 py-6">
          <section aria-label="Explanation" className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Explained</h4>
            <p className="leading-relaxed">{tenet.explanation}</p>
          </section>

          <section aria-label="Where it comes from" className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Where it comes from</h4>
            <ul className="list-disc space-y-1.5 pl-5 leading-relaxed">
              {tenet.origins.map((origin) => (
                <li key={origin}>{origin}</li>
              ))}
            </ul>
          </section>

          {tenet.aquinasNote && (
            <section aria-label="What Aquinas said" className="rounded-2xl border-l-4 border-accent-foreground bg-muted p-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-accent-foreground">What Aquinas specifically said</h4>
              <p className="mt-2 leading-relaxed">{tenet.aquinasNote}</p>
            </section>
          )}

          <section aria-label="Example" className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">A real-world example</h4>
            <p className="leading-relaxed">{tenet.example}</p>
          </section>

          <section aria-label="Criticisms" className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Challenges to consider</h4>
            <ul className="list-disc space-y-1.5 pl-5 leading-relaxed">
              {tenet.criticisms.map((criticism) => (
                <li key={criticism}>{criticism}</li>
              ))}
            </ul>
          </section>

          <section aria-label="Reflect" className="rounded-2xl border border-border bg-background p-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Reflect</h4>
            {reflecting || saved ? (
              <ReflectionEditor tenetId={tenet.id} question={tenet.reflectionQuestion} focusOnMount={focusEditor} />
            ) : (
              <div className="space-y-3">
                <p className="text-lg font-semibold leading-snug">{tenet.reflectionQuestion}</p>
                <Button type="button" onClick={reflect}>
                  <NotebookPen data-icon="inline-start" aria-hidden />
                  Write a reflection
                </Button>
              </div>
            )}
          </section>

          <section aria-label="Related" className="grid gap-4 sm:grid-cols-2">
            {tenet.concepts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Related ideas</h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {tenet.concepts.map((concept) => (
                    <li key={concept.slug}>
                      <Link href={`/ideas/${concept.slug}`} className="inline-block rounded-full border border-border px-3 py-1 text-sm hover:border-accent-foreground">
                        {concept.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tenet.thinkers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Related thinkers</h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {tenet.thinkers.map((thinker) => (
                    <li key={thinker.id}>
                      <Link href={`${basePath}#thinker-${thinker.id}`} className="inline-block rounded-full border border-border px-3 py-1 text-sm hover:border-accent-foreground">
                        {thinker.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section aria-label="Sources" className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">Sources</h4>
            <ul className="space-y-1 text-sm leading-relaxed text-muted-foreground">
              {tenet.sources.map((source) => (
                <li key={source.id}>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent-foreground underline underline-offset-4">
                      {source.label}
                    </a>
                  ) : (
                    source.label
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </li>
  );
}
