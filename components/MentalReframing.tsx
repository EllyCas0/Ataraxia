"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { clampStep, reframes, stepFraction } from "@/lib/reframing";
import type { Reframe } from "@/lib/reframing";

const THUMB = 28; // px; must match the thumb size in .reframe-input (globals.css)
const FADE = "700ms cubic-bezier(0.4, 0, 0.2, 1)";

// Where a step sits along the slider, accounting for the thumb's travel range.
const position = (fraction: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${fraction})`;

export default function MentalReframing({ versions = reframes, initialStep = 0 }: { versions?: Reframe[]; initialStep?: number }) {
  const last = versions.length - 1;
  const [step, setStep] = useState(() => clampStep(initialStep, versions.length));
  const current = versions[step];
  const fraction = stepFraction(step, versions.length);

  return (
    <section
      aria-label="Mental reframing"
      style={{ "--accent": current.accent } as CSSProperties}
      className="relative isolate flex min-h-[calc(100dvh-4.1rem)] flex-col overflow-clip px-6 pb-28 pt-10"
    >
      {/* A soft glow behind the text; each step has its own and they cross-fade too. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {versions.map((version, i) => (
          <div
            key={version.id}
            className="absolute inset-0"
            style={{
              opacity: i === step ? 1 : 0,
              transition: "opacity 1100ms ease",
              background: `radial-gradient(65% 55% at 50% 32%, color-mix(in srgb, ${version.accent} 20%, transparent), transparent 72%)`,
            }}
          />
        ))}
      </div>

      <p className="text-center text-xs uppercase tracking-[0.25em] text-foreground-muted">One thought, four ways of seeing it</p>

      <div className="flex flex-1 items-center justify-center py-10">
        {/* All versions share one grid cell, so the box is as tall as the longest and nothing jumps. */}
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
        <p className="sr-only" aria-live="polite">
          {current.label}: {current.text}
        </p>
      </div>

      <div className="mx-auto w-full max-w-xl">
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
