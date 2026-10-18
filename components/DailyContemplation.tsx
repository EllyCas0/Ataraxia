"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { quoteIndexForDate, quotes } from "@/lib/quotes";
import ContemplationDrawer from "./ContemplationDrawer";

const HOLD_MS = 2000;
const MAX_BLUR_PX = 22;

type Phase = "blurred" | "holding" | "revealed";

const subscribeNothing = () => () => {};

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export default function DailyContemplation() {
  // The quote depends on the visitor's local date, so it is chosen in the browser.
  // The server snapshot (-1) renders an empty placeholder, which avoids a hydration mismatch.
  const quoteIndex = useSyncExternalStore(subscribeNothing, () => quoteIndexForDate(new Date()), () => -1);
  const quote = quoteIndex >= 0 ? quotes[quoteIndex] : null;
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("blurred");
  const phaseRef = useRef<Phase>("blurred");
  const timer = useRef<number | undefined>(undefined);
  const hapticSwitch = useRef<HTMLLabelElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const reflectButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
      window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(false), 4000);
    return () => window.clearTimeout(id);
  }, [toast]);

  function setPhaseBoth(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  function haptic() {
    try {
      if (typeof navigator.vibrate === "function" && navigator.vibrate(14)) return;
    } catch {
      /* Vibration is optional. */
    }
    // iOS Safari has no Vibration API, but toggling a native switch input gives a light tap
    // (iOS 17.4+). Best effort only: some browsers ignore it outside a direct touch.
    hapticSwitch.current?.click();
  }

  function beginHold() {
    if (phaseRef.current !== "blurred") return;
    setPhaseBoth("holding");
    timer.current = window.setTimeout(() => {
      setPhaseBoth("revealed");
      haptic();
    }, HOLD_MS);
  }

  function endHold() {
    if (phaseRef.current !== "holding") return;
    window.clearTimeout(timer.current);
    setPhaseBoth("blurred");
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* Capture is a nicety; losing it just ends the hold on pointerleave. */
    }
    beginHold();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      beginHold();
    }
  }

  function onKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === " " || event.key === "Enter") endHold();
  }

  // With reduced motion the blur stays until the hold completes, then clears at once.
  const clear = phase === "revealed" || (phase === "holding" && !reducedMotion);
  const blur = `blur(${clear ? 0 : MAX_BLUR_PX}px)`;
  const duration = phase === "holding" ? `${HOLD_MS}ms linear` : phase === "revealed" ? "400ms ease-out" : "700ms ease-out";
  const veilStyle: CSSProperties = {
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
    backgroundColor: clear ? "rgb(12 10 32 / 0)" : "rgb(12 10 32 / 0.16)",
    transition: `backdrop-filter ${duration}, -webkit-backdrop-filter ${duration}, background-color ${duration}`,
  };

  return (
    <section aria-label="Daily Contemplation" className="contemplation fixed inset-0 z-40 overflow-clip">
      <div aria-hidden="true" className="contemplation-bg" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        <Link
          href="/"
          className="absolute left-5 top-[max(1.25rem,env(safe-area-inset-top))] rounded-full px-3 py-1.5 text-sm tracking-wide text-[#f5efe6]/70 transition-colors hover:text-[#f5efe6]"
        >
          ← The Agora
        </Link>

        <p className="mb-8 text-xs uppercase tracking-[0.3em] text-[#f5efe6]/60">Daily contemplation</p>

        <div
          role="group"
          tabIndex={0}
          aria-label="Today's quote. Press and hold to reveal it."
          aria-describedby="contemplation-hint"
          onPointerDown={onPointerDown}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onLostPointerCapture={endHold}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={endHold}
          className={`relative w-full max-w-2xl cursor-pointer rounded-[2rem] outline-offset-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f5efe6]/60 ${
            phase === "revealed" ? "" : "contemplation-hold"
          }`}
        >
          <figure className="px-6 py-10 text-center sm:px-10 sm:py-14" aria-busy={!quote}>
            {quote ? (
              <>
                <blockquote className="contemplation-quote text-[clamp(1.65rem,1.1rem+2.6vw,3rem)] leading-[1.28] tracking-[0.005em]">
                  <p>&ldquo;{quote.text}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-8 text-sm tracking-[0.18em] text-[#f5efe6]/75">
                  <span className="uppercase">{quote.author}</span>
                  <span className="mt-1 block text-xs normal-case tracking-wide text-[#f5efe6]/55">{quote.source}</span>
                </figcaption>
              </>
            ) : (
              <div className="min-h-40" />
            )}
          </figure>
          <div aria-hidden="true" className="contemplation-veil pointer-events-none absolute inset-0" style={veilStyle} />
        </div>

        <p
          id="contemplation-hint"
          className="mt-6 h-5 text-xs tracking-[0.2em] text-[#f5efe6]/60 transition-opacity duration-500"
          style={{ opacity: phase === "blurred" ? 1 : 0 }}
        >
          {phase === "revealed" ? "" : "Press and hold to reveal"}
        </p>

        <button
          ref={reflectButton}
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="mt-10 rounded-full border border-[#f5efe6]/30 px-7 py-2.5 text-xs uppercase tracking-[0.25em] text-[#f5efe6]/85 transition-colors hover:border-[#f5efe6]/60 hover:bg-[#f5efe6]/10"
        >
          Reflect
        </button>
      </div>

      {quote && (
        <ContemplationDrawer
          open={drawerOpen}
          quote={quote}
          returnFocusRef={reflectButton}
          onClose={() => setDrawerOpen(false)}
          onSaved={() => setToast(true)}
        />
      )}

      {toast && (
        <p
          role="status"
          className="fixed bottom-24 left-1/2 sm:bottom-8 z-[70] -translate-x-1/2 rounded-full border border-[#f5efe6]/20 bg-[#14122a]/90 px-5 py-2.5 text-sm text-[#f5efe6] shadow-lg"
        >
          Saved to your journal.{" "}
          <Link href="/journal" className="underline underline-offset-2">
            View
          </Link>
        </p>
      )}

      {/* Hidden native switch used only to produce a light haptic tap on iOS Safari. */}
      <label ref={hapticSwitch} aria-hidden="true" className="sr-only">
        <input type="checkbox" tabIndex={-1} {...({ switch: "" } as object)} />
      </label>
    </section>
  );
}
