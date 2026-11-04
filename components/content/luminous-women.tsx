// Luminous, serene women drawn as soft silhouettes with a ring of light behind the head: an angelic feeling
// without wings or religious symbols, because Stoa takes no side on religion. They are decorative only (hidden
// from assistive technology), static (nothing moves, so nothing can flash), and faint enough behind text that
// reading is not affected.
import type { CSSProperties } from "react";

export type Glow = "coral" | "gold" | "teal" | "pink" | "lime";
const COLOR: Record<Glow, string> = {
  coral: "oklch(0.8 0.17 25)",
  gold: "oklch(0.88 0.16 95)",
  teal: "oklch(0.82 0.13 195)",
  pink: "oklch(0.78 0.17 330)",
  lime: "oklch(0.9 0.2 125)",
};

// One figure, drawn in a 200 x 400 box. Parts: ring of light, head, long streaming veil, open arms, flowing gown.
function Figure({ glow, uid }: { glow: Glow; uid: string }) {
  const c = COLOR[glow];
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={c} stopOpacity="0.45" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={c} stopOpacity="0.55" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="54" r="58" fill={`url(#${uid}-halo)`} />
      <circle cx="100" cy="52" r="29" fill="none" stroke={c} strokeWidth="3" opacity="0.9" />
      <circle cx="100" cy="52" r="35" fill="none" stroke={c} strokeWidth="1" opacity="0.5" />
      <g fill={`url(#${uid}-body)`}>
        {/* veil and hair */}
        <path d="M87 48C66 86 58 156 66 236C78 208 82 130 92 76Z" />
        <path d="M113 48C134 86 142 156 134 236C122 208 118 130 108 76Z" />
        {/* open arms with flowing sleeves */}
        <path d="M90 92C58 112 34 150 20 196C46 172 74 146 98 124Z" />
        <path d="M110 92C142 112 166 150 180 196C154 172 126 146 102 124Z" />
        {/* gown */}
        <path d="M88 80C80 128 70 210 34 398H166C130 210 120 128 112 80C106 88 94 88 88 80Z" />
      </g>
      <ellipse cx="100" cy="56" rx="13" ry="16" fill={c} />
    </>
  );
}

export function LuminousWoman({ glow, uid, className, style }: { glow: Glow; uid: string; className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 200 400" className={className} style={style}>
      <Figure glow={glow} uid={uid} />
    </svg>
  );
}

// A wide band for the "What is philosophy?" section: a group of luminous women in a soft sky of light.
const BANNER: { glow: Glow; x: number; scale: number }[] = [
  { glow: "pink", x: 40, scale: 0.7 },
  { glow: "gold", x: 210, scale: 0.9 },
  { glow: "teal", x: 400, scale: 1 },
  { glow: "coral", x: 590, scale: 0.9 },
  { glow: "lime", x: 760, scale: 0.7 },
];

export function LuminousBanner() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 1000 300"
      preserveAspectRatio="xMidYMax slice"
      data-testid="luminous-banner"
      className="aspect-[10/3] w-full rounded-2xl border border-border bg-background/60"
    >
      <defs>
        <linearGradient id="lb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.3 0.12 300)" />
          <stop offset="1" stopColor="oklch(0.17 0.05 285)" />
        </linearGradient>
        <radialGradient id="lb-light" cx="50%" cy="0%" r="70%">
          <stop offset="0" stopColor="oklch(0.9 0.1 90)" stopOpacity="0.5" />
          <stop offset="1" stopColor="oklch(0.9 0.1 90)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="300" fill="url(#lb-sky)" />
      <rect width="1000" height="300" fill="url(#lb-light)" />
      {[[90, 40, 2], [320, 22, 1.6], [520, 46, 2.2], [700, 18, 1.8], [930, 54, 2], [160, 120, 1.5], [860, 130, 1.5]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="oklch(0.95 0.05 95)" opacity="0.8" />
      ))}
      {BANNER.map((f, i) => (
        <g key={f.glow} transform={`translate(${f.x} ${300 - 400 * f.scale * 0.72}) scale(${f.scale * 0.72})`}>
          <Figure glow={f.glow} uid={`lb${i}`} />
        </g>
      ))}
    </svg>
  );
}

// Faint, tall figures fixed behind the whole page. Low opacity keeps text easy to read, and they sit
// toward the edges where the content column leaves room.
const BACKDROP: { glow: Glow; left: string; top: string; height: string; opacity: number }[] = [
  { glow: "pink", left: "2%", top: "6%", height: "62vh", opacity: 0.16 },
  { glow: "teal", left: "calc(100% - 17%)", top: "0%", height: "74vh", opacity: 0.16 },
  { glow: "gold", left: "calc(50% - 6%)", top: "46%", height: "52vh", opacity: 0.09 },
];

export function AngelicBackdrop() {
  return (
    <div aria-hidden data-testid="angelic-backdrop" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BACKDROP.map((f, i) => (
        <LuminousWoman
          key={f.glow}
          glow={f.glow}
          uid={`bd${i}`}
          className="absolute w-auto"
          style={{ left: f.left, top: f.top, height: f.height, opacity: f.opacity }}
        />
      ))}
    </div>
  );
}
