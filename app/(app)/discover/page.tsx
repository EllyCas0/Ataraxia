import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InsightCarousel } from "@/components/content/insight-carousel";
import { buttonVariants } from "@/components/ui/button";
import { insightImage } from "@/lib/content/insight-image";
import { insights, insightsStartingFrom } from "@/lib/content/insights";
import { pickTryThis } from "@/lib/content/try-this";
import { getAppTimezone, zonedDateKey } from "@/lib/time";
import { NEW_CONVERSATION_HREF } from "@/components/shell/nav-items";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Discover" };
// "Today" depends on the request time, so this page must not be prerendered at build time.
export const dynamic = "force-dynamic";

export default function DiscoverPage() {
  const dateKey = zonedDateKey(new Date(), getAppTimezone());
  const tryThis = pickTryThis(dateKey);
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

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={NEW_CONVERSATION_HREF} className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-full px-7 text-base font-semibold")}>
              Start thinking
              <ArrowRight data-icon="inline-end" aria-hidden />
            </Link>
            <Link href="/ideas" className="text-base text-accent-foreground underline-offset-4 hover:underline">
              Browse ideas
            </Link>
          </div>
        </div>

        <InsightCarousel slides={slides} />
      </div>

      <Link
        href={tryThis.href}
        data-testid="try-this"
        className="group flex items-center justify-between gap-6 rounded-[2rem] border border-border bg-card p-6 transition-colors hover:border-accent-foreground/60 md:p-8"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">Try this</span>
          <span className="mt-2 block text-2xl font-extrabold leading-snug">{tryThis.title}</span>
          <span className="mt-2 block text-base text-muted-foreground">{tryThis.line}</span>
        </span>
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform motion-safe:group-hover:translate-x-1">
          <ArrowRight className="size-5" aria-hidden />
        </span>
      </Link>
    </div>
  );
}
