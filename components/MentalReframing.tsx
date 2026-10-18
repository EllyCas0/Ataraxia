"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { clampStep, reframes, stepFraction } from "@/lib/reframing";
import type { Reframe } from "@/lib/reframing";
import { MAX_THOUGHT_LENGTH, SUPPORT_MESSAGE, reframeThought } from "@/lib/reframe-thought";
import type { ReframeResult } from "@/lib/reframe-thought";

const SUPPORT_ACCENT = "#5b86a6";

const THUMB = 28; // px; must match the thumb size in .reframe-input (globals.css)
const FADE = "700ms cubic-bezier(0.4, 0, 0.2, 1)";

// Where a step sits along the slider, accounting for the thumb's travel range.
const position = (fraction: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${fraction})`;

export default function MentalReframing({ versions: exampleVersions = reframes, initialStep = 0 }: { versions?: Reframe[]; initialStep?: number }) {
  // null means the built-in example thought; otherwise the result of the person's own thought.
  const [result, setResult] = useState<ReframeResult | null>(null);
  const [step, setStep] = useState(() => clampStep(initialStep, exampleVersions.length));
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [swapping, setSwapping] = useState(false);
  const swapTimer = useRef<number | undefined>(undefined);

  const support = result?.kind === "support";
  const versions = result?.kind === "reframes" ? result.versions : exampleVersions;
  const last = versions.length - 1;
  const current = versions[Math.min(step, last)];
  const accent = support ? SUPPORT_ACCENT : current.accent;
  const fraction = stepFraction(step, versions.length);

  useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  // Fade the text out, swap in the new version set, and fade back in.
  function swapTo(next: ReframeResult | null) {
    window.clearTimeout(swapTimer.current);
    setSwapping(true);
    swapTimer.current = window.setTimeout(() => {
      setResult(next);
      setStep(0);
      setSwapping(false);
    }, 320);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = reframeThought(draft);
    if (!next) {
      setError("Write a sentence about what is on your mind.");
      return;
    }
    setError("");
    swapTo(next);
  }

  function showExample() {
    setDraft("");
    setError("");
    swapTo(null);
  }

  return (
    <section
      aria-label="Mental reframing"
      style={{ "--accent": accent } as CSSProperties}
      className="relative isolate flex min-h-[calc(100dvh-4.1rem)] flex-col overflow-clip px-6 pb-28 pt-10"
    >
      {/* A soft glow behind the text; each step has its own and they cross-fade too. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {versions.map((version, i) => (
          <div
            key={version.id}
            className="absolute inset-0"
            style={{
              opacity: !support && i === step ? 1 : 0,
              transition: "opacity 1100ms ease",
              background: `radial-gradient(65% 55% at 50% 32%, color-mix(in srgb, ${version.accent} 20%, transparent), transparent 72%)`,
            }}
          />
        ))}
      </div>

      <p className="text-center text-xs uppercase tracking-[0.25em] text-foreground-muted">One thought, four ways of seeing it</p>

      <form onSubmit={submit} className="mx-auto mt-6 w-full max-w-xl">
        <label htmlFor="own-thought" className="sr-only">
          A worry of your own
        </label>
        <div className="flex items-end gap-4 border-b border-border focus-within:border-accent">
          <input
            id="own-thought"
            type="text"
            value={draft}
            maxLength={MAX_THOUGHT_LENGTH}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError("");
            }}
            placeholder="Or type a worry of your own…"
            className="min-w-0 flex-1 bg-transparent py-2 font-serif text-lg outline-none placeholder:text-foreground-muted/60"
          />
          <button type="submit" disabled={!draft.trim() || swapping} className="shrink-0 pb-2 text-sm text-accent underline-offset-4 hover:underline disabled:opacity-40">
            Reframe →
          </button>
        </div>
        <div className="mt-2 flex min-h-5 items-center justify-between gap-4 text-xs text-foreground-muted">
          {error ? (
            <p role="alert" className="text-foreground">
              {error}
            </p>
          ) : (
            <span>{result ? "Showing your own thought." : "Showing an example."}</span>
          )}
          {result && (
            <button type="button" onClick={showExample} className="underline underline-offset-4 hover:text-foreground">
              Back to the example
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-1 items-center justify-center py-10" style={{ opacity: swapping ? 0 : 1, transition: "opacity 300ms ease" }}>
        {support ? (
          <div className="mx-auto max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground-muted">A moment first</p>
            <div className="mt-5 space-y-4 font-serif text-xl leading-relaxed">
              {SUPPORT_MESSAGE.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6">
              <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                Find a helpline near you
              </a>
            </p>
          </div>
        ) : (
          /* All versions share one grid cell, so the box is as tall as the longest and nothing jumps. */
          <div className="grid w-full max-w-2xl">
            {versions.map((version, i) => (
              <div
                key={version.id}
                aria-hidden="true"
                className="text-center"
                style={{
                  gridArea: "1 / 1",
                  opacity: i === step ? 1 : 0,
                  transform: i === step ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity ${FADE}, transform ${FADE}`,
                }}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-foreground-muted">
                  <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: version.accent }} />
                  {version.label} · {version.lens}
                </p>
                <p className="mt-5 font-serif text-[clamp(1.5rem,1rem+2.2vw,2.5rem)] leading-[1.35]">&ldquo;{version.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {support ? SUPPORT_MESSAGE.join(" ") : `${current.label}: ${current.text}`}
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl" hidden={support}>
        <div className="relative h-11">
          {/* The real, accessible control: invisible, on top, and catching all pointer and keyboard input. */}
          <input
            type="range"
            min={0}
            max={last}
            step={1}
            value={step}
            onChange={(event) => setStep(clampStep(Number(event.target.value), versions.length))}
            aria-label="Reframing lens"
            aria-valuetext={`${current.label}: ${current.lens}`}
            className="reframe-input peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />

          <div aria-hidden="true" className="pointer-events-none absolute left-3.5 right-3.5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-border" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
            style={{ width: `calc((100% - ${THUMB}px) * ${fraction})`, background: current.accent, transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1), background-color 700ms ease" }}
          />
          {versions.map((version, i) => (
            <span
              key={version.id}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-background"
              style={{
                left: position(stepFraction(i, versions.length)),
                borderColor: i <= step ? current.accent : "var(--border)",
                transition: "border-color 500ms ease",
              }}
            />
          ))}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 rounded-full border-[3px] border-background shadow-[0_2px_12px_rgb(0_0_0/0.3)] peer-focus-visible:ring-4 peer-focus-visible:ring-ring"
            style={{
              width: THUMB,
              height: THUMB,
              left: position(fraction),
              transform: "translate(-50%, -50%)",
              background: current.accent,
              transition: "left 450ms cubic-bezier(0.34, 1.35, 0.5, 1), background-color 700ms ease",
            }}
          />
        </div>

        {/* Mouse and touch shortcuts; the slider above covers keyboard and screen readers. */}
        <div className="relative mt-2 h-8" aria-hidden="true">
          {versions.map((version, i) => (
            <button
              key={version.id}
              type="button"
              tabIndex={-1}
              onClick={() => setStep(i)}
              className={`absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-1 text-sm transition-colors ${
                i === step ? "font-medium text-foreground" : "text-foreground-muted hover:text-foreground"
              }`}
              style={{ left: position(stepFraction(i, versions.length)) }}
            >
              {version.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
