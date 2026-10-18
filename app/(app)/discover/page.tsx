import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ConceptCard } from "@/components/content/concept-card";
import { Greeting } from "@/components/content/greeting";
import { SaveButton } from "@/components/content/save-button";
import { SectionHeading } from "@/components/content/section-heading";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/lib/content/repository";
import { getTheme, themes } from "@/lib/content/themes";
import { formatLongDate, getAppTimezone, zonedDateKey } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Discover" };
// "Today" depends on the request time, so this page must not be prerendered at build time.
export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  const now = new Date();
  const timeZone = getAppTimezone();
  const dateKey = zonedDateKey(now, timeZone);

  const question = content.dailyQuestion(dateKey);
  const theme = getTheme(question.theme);
  const related = question.relatedConceptSlug ? content.conceptBySlug(question.relatedConceptSlug) : undefined;
  const featured = content.featured(dateKey, 3);
  const weekly = content.weeklyPrompt(dateKey);

  return (
    <div className="space-y-14">
      <header>
        <p className="text-sm text-muted-foreground">{formatLongDate(now, timeZone)}</p>
        <h1 className="mt-1 text-4xl md:text-5xl">
          <Greeting />
        </h1>
        <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A few good questions to think with today. There are no wrong answers, and no one is keeping score.
        </p>
      </header>

      <section aria-labelledby="qotd-heading">
        <article className="rounded-3xl border border-border bg-card p-6 md:p-10">
          <p id="qotd-heading" className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Question of the day
          </p>
          <Badge variant="secondary" className="mt-3">
            {theme.name}
          </Badge>
          <h2 className="mt-4 text-3xl leading-tight md:text-4xl">{question.question}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{question.shortDescription}</p>
          {related && (
            <p className="mt-4 text-sm text-muted-foreground">
              Related idea:{" "}
              <Link href={`/ideas/${related.slug}`} className="text-primary underline underline-offset-4">
                {related.title}
              </Link>{" "}
              <span aria-hidden>·</span> {related.philosopher}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/reflect/new?question=${encodeURIComponent(question.slug)}`}
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
            >
              Reflect on this with the AI
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Link>
            <SaveButton label="Save question" className="h-11 px-5 text-base" />
          </div>
        </article>
      </section>

      <section aria-labelledby="browse-heading">
        <SectionHeading
          id="browse-heading"
          title="Browse ideas"
          action={
            <Link href="/ideas" className="text-sm text-primary underline-offset-4 hover:underline">
              See all ideas
            </Link>
          }
        />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/ideas?theme=${t.slug}`}
                className="flex h-full flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40"
              >
                <span className="font-serif text-lg leading-snug">{t.name}</span>
                <span className="text-sm text-muted-foreground">{t.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Featured ideas">
        <SectionHeading title="Ideas to start with" />
        <ul className="grid gap-4 md:grid-cols-3">
          {featured.map((concept) => (
            <li key={concept.slug}>
              <ConceptCard concept={concept} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="weekly-heading">
        <article className="rounded-3xl border border-border bg-secondary/60 p-6 md:p-8">
          <p id="weekly-heading" className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            This week&apos;s human perspective
          </p>
          <h2 className="mt-3 text-2xl leading-snug md:text-3xl">{weekly.question}</h2>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Traditions in this comparison">
            {weekly.perspectives.map((p) => (
              <li key={p.tradition}>
                <Badge variant="outline">{p.tradition}</Badge>
              </li>
            ))}
          </ul>
          <Link href="/weekly" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-5 h-11 px-5 text-base")}>
            Compare the perspectives
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
        </article>
      </section>
    </div>
  );
}
