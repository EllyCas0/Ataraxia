import type { CSSProperties } from "react";

// A slow, colourful background that sits behind a quote: soft blobs rise and sink like a lava lamp,
// and two mirrored, counter-rotating wedge patterns give it a kaleidoscope feel. It is only CSS
// (see .lamp in globals.css), so it costs no scripts, and it stands still for people who prefer
// reduced motion. Keep the quote on top of a dark scrim: the colours here are never the text background.
const blobs = [
  { x: "-8%", size: "62%", duration: "23s", delay: "-4s", hueShift: 0 },
  { x: "46%", size: "54%", duration: "29s", delay: "-13s", hueShift: 50 },
  { x: "18%", size: "44%", duration: "19s", delay: "-9s", hueShift: -40 },
  { x: "62%", size: "38%", duration: "26s", delay: "-1s", hueShift: 95 },
  { x: "-14%", size: "36%", duration: "31s", delay: "-17s", hueShift: 140 },
];

export function LavaLamp({ hue, paused = false }: { hue: number; paused?: boolean }) {
  return (
    <div aria-hidden data-testid="lava-lamp" data-paused={paused} className="lamp pointer-events-none absolute inset-0 -z-20 overflow-clip" style={{ "--h": hue } as CSSProperties}>
      <div className="lamp-kaleido" />
      <div className="lamp-kaleido lamp-kaleido-mirror" />
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="lamp-blob"
          style={{ left: blob.x, width: blob.size, animationDuration: blob.duration, animationDelay: blob.delay, "--shift": blob.hueShift } as CSSProperties}
        />
      ))}
    </div>
  );
}
