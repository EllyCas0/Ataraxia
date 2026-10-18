import type { CSSProperties } from "react";

// A moody background behind a quote: soft blobs of colour rise and sink slowly like a lava lamp, and
// now and then a bolt of lightning strikes in the upper part of the card. It is only CSS and SVG
// (see .storm in globals.css), so it needs no scripts.
//
// Safety: the strikes are single, soft pulses (about 0.8 s, no rapid flicker), they happen at least
// 4 s apart (see STRIKES), the flash is a dim glow rather than a bright full-card flash, and nothing
// moves for people who prefer reduced motion. Keep it that way: WCAG 2.3.1 allows at most three flashes a
// second, and flashing content can trigger seizures. The strikes also stay in the top of the card so
// they do not pass behind the quote; keep the quote on top of a dark scrim.
export const STORM_CYCLE_SECONDS = 18;

// When in each cycle a strike starts. Every gap (including the wrap-around) must stay at least 4 s.
export const STRIKES = [
  { at: 1.5, left: "2%", path: "M34 0 L26 16 L36 28 L22 46 L30 54 L16 78", branch: "M22 46 L34 56 L28 70" },
  { at: 6, left: "50%", path: "M26 0 L33 14 L24 27 L35 43 L27 52 L38 76", branch: "M24 27 L12 38 L17 50" },
  { at: 10.5, left: "26%", path: "M30 0 L22 12 L31 25 L20 38 L28 47 L18 68", branch: "M31 25 L42 34" },
  { at: 14.5, left: "64%", path: "M32 0 L38 15 L29 24 L40 40 L32 49 L42 72", branch: "M29 24 L18 30" },
] as const;

const blobs = [
  { x: "-8%", size: "62%", duration: "23s", delay: "-4s", hueShift: 0 },
  { x: "46%", size: "54%", duration: "29s", delay: "-13s", hueShift: 50 },
  { x: "18%", size: "44%", duration: "19s", delay: "-9s", hueShift: -40 },
  { x: "62%", size: "38%", duration: "26s", delay: "-1s", hueShift: 95 },
];

export function StormBackground({ hue, paused = false }: { hue: number; paused?: boolean }) {
  return (
    <div aria-hidden data-testid="storm" data-paused={paused} className="storm pointer-events-none absolute inset-0 -z-20 overflow-clip" style={{ "--h": hue } as CSSProperties}>
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="storm-blob"
          style={{ left: blob.x, width: blob.size, animationDuration: blob.duration, animationDelay: blob.delay, "--shift": blob.hueShift } as CSSProperties}
        />
      ))}
      {STRIKES.map((strike) => (
        <div key={strike.at} className="storm-strike" style={{ "--at": `${strike.at}s`, "--cycle": `${STORM_CYCLE_SECONDS}s`, left: strike.left } as CSSProperties}>
          <div className="storm-flash" />
          <svg className="storm-bolt" viewBox="0 0 60 100" preserveAspectRatio="none" fill="none">
            <path d={strike.path} pathLength={1} />
            <path d={strike.branch} pathLength={1} />
          </svg>
        </div>
      ))}
    </div>
  );
}
