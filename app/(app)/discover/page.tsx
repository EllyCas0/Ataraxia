import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InsightCarousel } from "@/components/content/insight-carousel";
import { buttonVariants } from "@/components/ui/button";
import { insightImage } from "@/lib/content/insight-image";
import { insights, insightsStartingFrom } from "@/lib/content/insights";
import { getAppTimezone, zonedDateKey } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Discover" };
// "Today" depends on the request time, so this page must not be prerendered at build time.
export const dynamic = "force-dynamic";

// Short, casual labels for browsing by theme, each with its own colour.
const vibes = [
  { theme: "meaning-purpose", label: "Meaning", emoji: "🧭", hue: 95 },
  { theme: "identity-self-knowledge", label: "Identity", emoji: "🪞", hue: 330 },
  { theme: "ethics-morality", label: "Right & wrong", emoji: "⚖️", hue: 255 },
  { theme: "love-relationships", label: "Love & friends", emoji: "💬", hue: 10 },
  { theme: "freedom-responsibility", label: "Freedom", emoji: "🕊️", hue: 195 },
  { theme: "death-impermanence", label: "Time & loss", emoji: "⏳", hue: 290 },
  { theme: "knowledge-truth", label: "Truth", emoji: "🔎", hue: 150 },
  { theme: "society-technology-humanity", label: "Tech & society", emoji: "📱", hue: 40 },
] as const;

export default function DiscoverPage() {
  const dateKey = zonedDateKey(new Date(), getAppTimezone());
  const slides = insightsStartingFrom(insights, dateKey).map((insight) => ({ insight, image: insightImage(insight.slug) }));

  return (
    <div className="relative space-y-12 md:space-y-16">
      {/* Soft colour blobs behind the headline. Decorative only, the layout clips them so nothing scrolls sideways. */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-6 -top-10 -z-10 h-[34rem]">
        <div className="absolute -left-20 top-0 size-72 rounded-full bg-[oklch(0.7_0.2_330)]/25 blur-3xl" />
        <div className="absolute left-1/3 top-40 size-72 rounded-full bg-[oklch(0.8_0.15_195)]/15 blur-3xl" />
        <div className="absolute -right-10 top-10 size-64 rounded-full bg-[oklch(0.9_0.2_125)]/10 blur-3xl" />
      </div>

      <div className="grid items-start gap-10 md:grid-cols-[1.15fr_1fr] md:gap-12">
        <div>
          <h1 className="text-5xl leading-[1.02] md:text-6xl">
            Big questions. <span className="text-pop">Your take.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Short, weird, surprisingly useful. Pick a thought and see where your head goes.</p>

          <Link href="/reflect/new" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 rounded-full px-7 text-base font-semibold")}>
            Start thinking
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>

          <form action="/ideas" role="search" className="mt-8 flex items-center gap-2 rounded-full border border-border bg-card p-2 pl-5">
            <label htmlFor="home-search" className="sr-only">
              Search ideas by topic
            </label>
            <input
              id="home-search"
              name="q"
              type="search"
              maxLength={100}
              placeholder="What's on your mind?"
              className="min-w-0 flex-1 bg-transparent py-2 text-base placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-5 text-base")}>
              Search
              <ArrowRight data-icon="inline-end" aria-hidden />
            </button>
          </form>

          <section aria-labelledby="vibes-heading" className="mt-7">
            <h2 id="vibes-heading" className="text-sm font-semibold text-muted-foreground">
              Pick a vibe
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <li key={vibe.theme}>
                  <Link
                    href={`/ideas?theme=${vibe.theme}`}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
                    style={{ background: `oklch(0.3 0.09 ${vibe.hue})`, borderColor: `oklch(0.52 0.15 ${vibe.hue})` }}
                  >
                    <span aria-hidden>{vibe.emoji}</span>
                    {vibe.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/ideas" className="mt-4 inline-block text-base text-accent-foreground underline-offset-4 hover:underline">
              Browse all ideas
            </Link>
          </section>
        </div>

        <InsightCarousel slides={slides} />
      </div>

      <Link
        href="/reframe"
        className="group flex items-center justify-between gap-6 rounded-[2rem] border border-border bg-card p-6 transition-colors hover:border-accent-foreground/60 md:p-8"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">Try this</span>
          <span className="mt-2 block text-2xl font-extrabold leading-snug">Reframe a worried thought</span>
          <span className="mt-2 block text-base text-muted-foreground">See one thought through four lenses: anxious, Stoic, growth, and cosmic.</span>
        </span>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform motion-safe:group-hover:translate-x-1">
          <ArrowRight className="size-5" aria-hidden />
        </span>
      </Link>
    </div>
  );
}
