"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { WOMEN_VOICES_FOOTNOTE, WOMEN_VOICES_INTRO, WOMEN_VOICES_TITLE, womenVoices } from "@/lib/content/women-voices";
import { LuminousWoman, type Glow } from "@/components/content/luminous-women";

const COLOR: Record<Glow, string> = {
  coral: "oklch(0.8 0.17 25)",
  gold: "oklch(0.88 0.16 95)",
  teal: "oklch(0.82 0.13 195)",
  pink: "oklch(0.78 0.17 330)",
  lime: "oklch(0.9 0.2 125)",
};

// A sideways-scrolling timeline. The scroll area can be reached with the keyboard (it is one tab stop; the
// arrow keys then scroll it), and the two arrow buttons are a convenience for mouse users, so they are left
// out of the tab order to keep the home page simple. Motion is instant for people who prefer reduced motion.
export function WomenTimeline() {
  const scroller = useRef<HTMLDivElement>(null);

  function nudge(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div data-testid="women-timeline" className="mt-10 border-t border-border pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl">{WOMEN_VOICES_TITLE}</h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{WOMEN_VOICES_INTRO}</p>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          {([[-1, ChevronLeft, "Earlier"], [1, ChevronRight, "Later"]] as const).map(([dir, Icon, label]) => (
            <button
              key={label}
              type="button"
              tabIndex={-1}
              aria-label={`${label} voices`}
              onClick={() => nudge(dir)}
              className="flex size-11 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-primary/60 hover:bg-accent"
            >
              <Icon className="size-5" aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scroller}
        role="region"
        tabIndex={0}
        aria-label="Timeline of women philosophers. Scroll sideways."
        className="-mx-2 mt-6 overflow-x-auto overscroll-x-contain px-2 pb-4 [scrollbar-color:oklch(0.5_0.05_285)_transparent] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <ol className="flex w-max snap-x snap-mandatory">
          {womenVoices.map((voice) => (
            <li key={voice.id} data-testid={`voice-${voice.id}`} className="relative w-[78vw] max-w-80 shrink-0 snap-start pr-5 pt-9 md:w-80">
              {/* the line of time, with a dot where this person begins */}
              <span aria-hidden className="absolute inset-x-0 top-3 h-px bg-border" />
              <span aria-hidden className="absolute left-0 top-1.5 size-3 rounded-full" style={{ background: COLOR[voice.glow], boxShadow: `0 0 14px ${COLOR[voice.glow]}` }} />
              <div className="relative flex h-full flex-col rounded-2xl border border-border bg-background/60 p-5">
                <LuminousWoman glow={voice.glow} uid={`tl-${voice.id}`} className="pointer-events-none absolute right-3 top-3 h-20 w-auto opacity-30" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: COLOR[voice.glow] }}>
                  {voice.dates}
                </p>
                <h4 className="mt-2 pr-12 text-lg leading-snug">{voice.name}</h4>
                <p className="text-sm text-muted-foreground">{voice.place}</p>
                {voice.quote ? (
                  <figure className="mt-4 flex flex-1 flex-col">
                    <blockquote className="text-base leading-relaxed">&ldquo;{voice.quote}&rdquo;</blockquote>
                    {voice.original && <p className="mt-2 text-sm italic text-muted-foreground">{voice.original}</p>}
                    <figcaption className="mt-3 text-xs leading-snug text-muted-foreground">{voice.source}</figcaption>
                  </figure>
                ) : (
                  <div className="mt-4 flex flex-1 flex-col">
                    <p className="text-base leading-relaxed">{voice.idea}</p>
                    <p className="mt-3 text-xs leading-snug text-muted-foreground">{voice.source}</p>
                  </div>
                )}
                {voice.note && <p className="mt-3 border-t border-border pt-3 text-xs leading-snug text-muted-foreground">{voice.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{WOMEN_VOICES_FOOTNOTE}</p>
    </div>
  );
}
