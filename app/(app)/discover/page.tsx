import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DailyInsightCard } from "@/components/content/daily-insight-card";
import { buttonVariants } from "@/components/ui/button";
import { insightImage } from "@/lib/content/insight-image";
import { insights, pickDailyInsight } from "@/lib/content/insights";
import { getAppTimezone, zonedDateKey } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Discover" };
// "Today" depends on the request time, so this page must not be prerendered at build time.
export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  const dateKey = zonedDateKey(new Date(), getAppTimezone());
  const insight = pickDailyInsight(insights, dateKey);

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

        <DailyInsightCard insight={insight} image={insightImage(insight.slug)} />
      </div>

      <Link
        href="/reframe"
        className="flex items-center justify-between gap-6 rounded-3xl border border-border bg-card p-6 transition-colors hover:border-foreground/30 md:p-8"
      >
        <span>
          <span className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Try this</span>
          <span className="mt-2 block font-serif text-2xl leading-snug">Reframe a worried thought</span>
          <span className="mt-2 block text-base text-muted-foreground">See one thought through four lenses: anxious, Stoic, growth, and cosmic.</span>
        </span>
        <ArrowRight className="size-6 shrink-0 text-accent-foreground" aria-hidden />
      </Link>
    </div>
  );
}
