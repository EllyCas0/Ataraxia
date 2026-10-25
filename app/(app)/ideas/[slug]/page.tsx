import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ConceptCard } from "@/components/content/concept-card";
import { SaveButton } from "@/components/content/save-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/lib/content/repository";
import { themes } from "@/lib/content/themes";
import type { SourceReference } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

// Only the pages listed in generateStaticParams exist. Anything else is a real HTTP 404 straight away. Without this,
// the loading screens start streaming a "200 OK" response before the page can say it was not found.
export const dynamicParams = false;

export function generateStaticParams() {
  return content.concepts().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const concept = content.conceptBySlug(slug);
  return { title: concept ? concept.title : "Idea not found" };
}

function formatSource(s: SourceReference): string {
  const bits = [s.author, s.title, s.year && `(${s.year})`, s.location && `, ${s.location}`].filter(Boolean);
  return bits.join(" ").replace(" ,", ",");
}

export default async function ConceptPage({ params }: { params: Params }) {
  const { slug } = await params;
  const concept = content.conceptBySlug(slug);
  if (!concept) notFound();

  const related = concept.relatedConcepts.map((s) => content.conceptBySlug(s)).filter((c) => c !== undefined);
  const conceptThemes = themes.filter((t) => concept.themes.includes(t.slug));

  return (
    <article className="space-y-10">
      <div>
        <Link href="/ideas" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> All ideas
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{concept.tradition}</Badge>
          {conceptThemes.map((t) => (
            <Link key={t.slug} href={`/ideas?theme=${t.slug}`}>
              <Badge variant="outline">{t.name}</Badge>
            </Link>
          ))}
        </div>
        <h1 className="mt-4 text-4xl leading-tight md:text-5xl">{concept.title}</h1>
        <p className="mt-2 text-muted-foreground">{concept.philosopher}</p>
        <p className="mt-5 max-w-2xl text-xl leading-relaxed">{concept.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/reflect/new?concept=${encodeURIComponent(concept.slug)}`} className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
            <MessageCircle data-icon="inline-start" aria-hidden />
            Discuss this idea
          </Link>
          <SaveButton className="h-11 px-5 text-base" />
        </div>
      </div>

      <section aria-labelledby="explain">
        <h2 id="explain" className="text-2xl">
          In plain language
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-[1.75]">{concept.detailedExplanation}</p>
      </section>

      <section aria-labelledby="claims">
        <h2 id="claims" className="text-2xl">
          Core claims
        </h2>
        <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
          {concept.coreClaims.map((claim) => (
            <li key={claim}>{claim}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apply">
        <h2 id="apply" className="text-2xl">
          In everyday life
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed">{concept.practicalApplication}</p>
      </section>

      <section aria-labelledby="limits" className="rounded-2xl border border-border bg-secondary/50 p-6">
        <h2 id="limits" className="text-2xl">
          Objections and limits
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Good ideas have good critics. These are some of the strongest challenges.</p>
        <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-relaxed marker:text-muted-foreground">
          {concept.counterarguments.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reflect" className="rounded-2xl border border-primary/25 bg-accent/60 p-6">
        <h2 id="reflect" className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Something to ask yourself
        </h2>
        <p className="mt-2 font-serif text-2xl leading-snug">{concept.reflectionQuestion}</p>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related">
          <h2 id="related" className="text-2xl">
            Related ideas
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <ConceptCard concept={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="sources">
        <h2 id="sources" className="text-2xl">
          Sources and further reading
        </h2>
        <ul className="mt-3 max-w-2xl space-y-2">
          {concept.sourceReferences.map((s) => (
            <li key={formatSource(s)} className="flex items-start gap-3 text-sm leading-relaxed">
              <Badge variant={s.kind === "primary" ? "default" : "secondary"} className="mt-0.5">
                {s.kind === "primary" ? "Primary" : "Secondary"}
              </Badge>
              <span>{formatSource(s)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          These notes are a reader&apos;s summary and may simplify a debate that scholars still discuss. Translations differ, so check the text itself before relying on any detail.
        </p>
      </section>
    </article>
  );
}
