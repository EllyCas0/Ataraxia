"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { StormBackground } from "@/components/content/storm-background";
import type { InsightImage } from "@/lib/content/insight-image";
import type { Insight } from "@/lib/content/insights";

export interface InsightSlide {
  insight: Insight;
  image: InsightImage;
}

const SWIPE_DISTANCE = 50; // px

// The home page's daily insight, as a carousel that loops without end: it opens on today's insight,
// and next/previous (buttons, arrow keys, or a swipe) wrap around the list in either direction.
// Each slide is a link to its reading view. There is no autoplay, so nothing moves on its own.
export function InsightCarousel({ slides }: { slides: InsightSlide[] }) {
  // The previous slide keeps its animated background until it has faded out; the rest are not drawn.
  const [position, setPosition] = useState({ index: 0, previous: -1 });
  const { index, previous } = position;
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const count = slides.length;

  const go = (step: number) => setPosition(({ index: i }) => ({ index: (i + step + count) % count, previous: i }));

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") go(1);
    else if (event.key === "ArrowLeft") go(-1);
    else return;
    event.preventDefault();
  }

  function onPointerDown(event: PointerEvent) {
    swipeStart.current = event.clientX;
    swiped.current = false;
  }

  function onPointerUp(event: PointerEvent) {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) >= SWIPE_DISTANCE) {
      swiped.current = true;
      go(distance < 0 ? 1 : -1);
    }
  }

  const buttonClass =
    "flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Daily insights from philosophers"
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipeStart.current = null)}
      onClickCapture={(event) => {
        // A swipe that ends on a slide must not also open it.
        if (swiped.current) {
          event.preventDefault();
          event.stopPropagation();
          swiped.current = false;
        }
      }}
      className="relative isolate grid min-h-[28rem] touch-pan-y overflow-clip rounded-[2rem] bg-accent text-white transition-transform motion-safe:hover:scale-[1.01]"
    >
      {slides.map(({ insight, image }, i) => {
        const active = i === index;
        return (
          <Link
            key={insight.slug}
            href={`/insights/${insight.slug}`}
            draggable={false}
            aria-roledescription="slide"
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            className="group relative col-start-1 row-start-1 flex flex-col justify-end gap-10 p-7 pt-20 transition-[opacity,transform] duration-500 ease-out md:p-9 md:pt-24 motion-reduce:transition-none"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "none" : "translateX(1.5rem)",
              pointerEvents: active ? "auto" : "none",
            }}
          >
            {image.placeholder ? (
              (active || i === previous) && <StormBackground hue={insight.hue} paused={!active} />
            ) : (
              <Image src={image.src} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="-z-20 object-cover" priority={i === 0} draggable={false} />
            )}
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/10" />

            <p className="absolute left-7 top-7 text-xs font-medium uppercase tracking-[0.2em] text-white/70 md:left-9 md:top-9">Daily insights</p>

            <div>
              <blockquote className="font-serif text-2xl leading-relaxed [text-shadow:0_1px_14px_rgb(0_0_0/0.55)] md:text-3xl md:leading-relaxed">&ldquo;{insight.quote}&rdquo;</blockquote>
              <p className="mt-6 inline-flex items-center gap-1.5 text-base">
                <span>
                  &mdash; {insight.philosopher}, {insight.context}
                </span>
                <ArrowRight className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
              </p>
              {!image.placeholder && <p className="mt-3 text-xs text-white/70">Illustration generated with AI</p>}
            </div>
          </Link>
        );
      })}

      <div className="absolute right-5 top-5 z-10 flex gap-2 md:right-7 md:top-6">
        <button type="button" onClick={() => go(-1)} aria-label="Previous quote" className={buttonClass}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next quote" className={buttonClass}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Quote {index + 1} of {count}: {slides[index].insight.philosopher}
      </p>
    </section>
  );
}
