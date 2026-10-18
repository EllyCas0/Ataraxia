import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/lib/content/repository";
import { getTheme } from "@/lib/content/themes";
import { getAppTimezone, zonedDateKey } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Discover" };
// "Today" depends on the request time, so this page must not be prerendered at build time.
export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  const dateKey = zonedDateKey(new Date(), getAppTimezone());
  const question = content.dailyQuestion(dateKey);
  const theme = getTheme(question.theme);
  const weekly = content.weeklyPrompt(dateKey);

  return (
    <div className="space-y-12 md:space-y-16">
      <div className="grid items-start gap-10 md:grid-cols-[1.15fr_1fr] md:gap-12">
        <div>
          <h1 className="text-5xl leading-[1.05] md:text-6xl">
            Clarify what <em className="text-accent-foreground">you think.</em>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">Explore other perspectives and form your own response.</p>

          <Link href="/reflect/new" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 px-6 text-base")}>
            Start reflecting
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>

          <form action="/ideas" role="search" className="mt-8 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-4">
            <label htmlFor="home-search" className="sr-only">
              Search ideas by topic
            </label>
            <input
              id="home-search"
              name="q"
              type="search"
              maxLength={100}
              placeholder="A topic on your mind…"
              className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-4 text-base")}>
              Search
              <ArrowRight data-icon="inline-end" aria-hidden />
            </button>
          </form>

          <Link href="/ideas" className="mt-5 inline-block text-base text-accent-foreground underline-offset-4 hover:underline">
            Browse ideas
          </Link>
        </div>

        <section aria-labelledby="qotd-heading" className="rounded-3xl bg-accent p-7 md:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/70">Today&apos;s topic</p>
          <Link href={`/ideas?theme=${theme.slug}`} className="mt-3 inline-flex items-center gap-2 font-serif text-2xl hover:underline">
            {theme.name}
            <ArrowRight className="size-5" aria-hidden />
          </Link>
          <h2 id="qotd-heading" className="mt-8 text-3xl leading-snug md:text-4xl">
            {question.question}
          </h2>
          <Link
            href={`/reflect/new?question=${encodeURIComponent(question.slug)}`}
            className="mt-6 inline-flex items-center gap-1.5 text-base hover:underline"
          >
            Consider this question
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      </div>

      <Link
        href="/weekly"
        aria-label={`This week: ${weekly.question}`}
        className="flex items-center justify-between gap-6 rounded-3xl border border-border bg-card p-6 transition-colors hover:border-foreground/30 md:p-8"
      >
        <span>
          <span className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">This week</span>
          <span className="mt-2 block font-serif text-2xl leading-snug">{weekly.question}</span>
          <span className="mt-2 block text-base text-muted-foreground">
            See how {weekly.perspectives.map((p) => p.tradition).join(", ")} approach it.
          </span>
        </span>
        <ArrowRight className="size-6 shrink-0 text-accent-foreground" aria-hidden />
      </Link>
    </div>
  );
}
