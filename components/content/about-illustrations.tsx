import type { AboutBlock, AncientWomanId } from "@/lib/content/about-philosophy";

// Original, decorative drawings for the "What is philosophy?" blocks. They show ideas, not people or
// religious symbols, and they are hidden from assistive technology because the text says everything.
const CORAL = "oklch(0.8 0.17 25)";
const GOLD = "oklch(0.88 0.16 95)";
const TEAL = "oklch(0.82 0.13 195)";
const PINK = "oklch(0.75 0.17 330)";
const LIME = "oklch(0.9 0.2 125)";

function Stars({ color, points }: { color: string; points: [number, number, number][] }) {
  return (
    <>
      {points.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={color} opacity={0.7} />
      ))}
    </>
  );
}

// A big question mark with sparks: asking carefully.
function Question() {
  return (
    <>
      <defs>
        <radialGradient id="ill-q-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={CORAL} stopOpacity="0.35" />
          <stop offset="1" stopColor={CORAL} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ill-q-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={CORAL} />
          <stop offset="1" stopColor={PINK} />
        </linearGradient>
      </defs>
      <circle cx="160" cy="100" r="92" fill="url(#ill-q-glow)" />
      <path
        d="M122 78c0-22 16-36 38-36s38 13 38 32c0 16-10 24-22 32-9 6-14 12-14 24"
        fill="none"
        stroke="url(#ill-q-stroke)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <circle cx="162" cy="158" r="9" fill={GOLD} />
      <Stars color={LIME} points={[[60, 50, 3], [262, 66, 4], [250, 150, 2.5], [84, 148, 2.5], [220, 30, 2]]} />
      <path d="M62 112l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill={GOLD} opacity="0.85" />
      <path d="M258 108l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={TEAL} opacity="0.85" />
    </>
  );
}

// A balance scale: weighing reasons.
function Scale() {
  return (
    <>
      <defs>
        <radialGradient id="ill-s-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.28" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="92" r="95" fill="url(#ill-s-glow)" />
      <g stroke={GOLD} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M160 40v104" />
        <path d="M120 156h80" />
        <path d="M70 62l180-6" />
      </g>
      <circle cx="160" cy="38" r="8" fill={GOLD} />
      <g stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        <path d="M70 62l-28 52M70 62l28 52" />
        <path d="M250 56l-28 52M250 56l28 52" />
      </g>
      <path d="M38 114h64c0 18-14 28-32 28s-32-10-32-28z" fill={CORAL} />
      <path d="M218 108h64c0 18-14 28-32 28s-32-10-32-28z" fill={TEAL} />
      <circle cx="70" cy="102" r="9" fill={PINK} />
      <path d="M250 90l4 9 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z" fill={LIME} />
      <Stars color={CORAL} points={[[40, 30, 2.5], [286, 30, 3], [286, 156, 2.5], [34, 156, 2]]} />
    </>
  );
}

// Two different paths toward the same light: same questions, different ways of answering.
function Paths() {
  return (
    <>
      <defs>
        <radialGradient id="ill-p-glow" cx="50%" cy="30%" r="55%">
          <stop offset="0" stopColor={TEAL} stopOpacity="0.4" />
          <stop offset="1" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="48" r="96" fill="url(#ill-p-glow)" />
      <g fill="none" strokeLinecap="round" strokeWidth="7">
        <path d="M30 176C70 160 40 120 100 104S150 78 160 56" stroke={CORAL} />
        <path d="M290 176C250 164 280 124 224 106S172 80 160 56" stroke={PINK} />
        <path d="M160 176V56" stroke={GOLD} opacity="0.55" strokeDasharray="2 14" />
      </g>
      <circle cx="160" cy="48" r="20" fill={GOLD} />
      <circle cx="160" cy="48" r="30" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.5" />
      <g stroke={GOLD} strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M160 6v8M118 48h-8M210 48h-8M130 18l6 6M190 18l-6 6" />
      </g>
      <circle cx="30" cy="176" r="6" fill={CORAL} />
      <circle cx="290" cy="176" r="6" fill={PINK} />
      <circle cx="160" cy="176" r="5" fill={GOLD} opacity="0.7" />
      <Stars color={LIME} points={[[60, 40, 2.5], [262, 36, 3], [76, 90, 2], [250, 96, 2]]} />
    </>
  );
}

const DRAWINGS: Record<AboutBlock["id"], () => React.JSX.Element> = {
  what: () => <Question />,
  why: () => <Scale />,
  religion: () => <Paths />,
};

export function AboutIllustration({ id }: { id: AboutBlock["id"] }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 320 190"
      className="aspect-[16/9.5] w-full rounded-2xl border border-border bg-background/60"
      data-testid={`about-art-${id}`}
    >
      {DRAWINGS[id]()}
    </svg>
  );
}

// ---- Women of the ancient Greek world ----
// Flat, faceless figures: a robe, a head, and one thing each is known for. Faceless on purpose, because no
// likeness of these women survives and we should not invent one.

const SKIN: Record<AncientWomanId, string> = {
  poet: "oklch(0.74 0.07 60)",
  teacher: "oklch(0.62 0.08 55)",
  astronomer: "oklch(0.7 0.08 65)",
  speaker: "oklch(0.55 0.07 50)",
};
const HAIR = "oklch(0.28 0.04 280)";
const CREAM = "oklch(0.93 0.04 90)";

const THEME: Record<AncientWomanId, { back: string; robe: string; drape: string }> = {
  poet: { back: CORAL, robe: "oklch(0.55 0.15 25)", drape: "oklch(0.88 0.06 25)" },
  teacher: { back: GOLD, robe: "oklch(0.5 0.1 85)", drape: "oklch(0.92 0.06 95)" },
  astronomer: { back: TEAL, robe: "oklch(0.45 0.1 215)", drape: "oklch(0.9 0.05 195)" },
  speaker: { back: PINK, robe: "oklch(0.48 0.16 335)", drape: "oklch(0.9 0.06 330)" },
};

function Prop({ id, skin }: { id: AncientWomanId; skin: string }) {
  switch (id) {
    case "poet": // a lyre held at her side
      return (
        <g>
          <path d="M80 122c-6-14-4-28 2-34M106 122c6-14 4-28-2-34" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
          <path d="M80 90h26" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
          <path d="M86 92v28M93 92v30M100 92v28" stroke={CREAM} strokeWidth="1.5" />
          <circle cx="84" cy="124" r="5" fill={skin} />
        </g>
      );
    case "teacher": // a scroll
      return (
        <g>
          <rect x="76" y="100" width="26" height="30" rx="4" fill={CREAM} />
          <rect x="74" y="98" width="30" height="6" rx="3" fill={GOLD} />
          <rect x="74" y="126" width="30" height="6" rx="3" fill={GOLD} />
          <path d="M82 110h14M82 116h14M82 121h9" stroke="oklch(0.5 0.05 85)" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="78" cy="118" r="5" fill={skin} />
        </g>
      );
    case "astronomer": // a ring-model of the sky
      return (
        <g fill="none" stroke={GOLD} strokeWidth="2.5">
          <circle cx="92" cy="98" r="17" />
          <ellipse cx="92" cy="98" rx="17" ry="6" />
          <ellipse cx="92" cy="98" rx="6" ry="17" transform="rotate(35 92 98)" />
          <circle cx="92" cy="98" r="3.5" fill={CREAM} stroke="none" />
          <circle cx="80" cy="118" r="5" fill={skin} stroke="none" />
        </g>
      );
    case "speaker": // a raised hand and a spark of an idea
      return (
        <g>
          <path d="M78 90l16-22" stroke={skin} strokeWidth="8" strokeLinecap="round" />
          <circle cx="96" cy="62" r="6" fill={skin} />
          <path d="M100 38l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill={GOLD} />
        </g>
      );
  }
}

export function AncientWomanDrawing({ id }: { id: AncientWomanId }) {
  const skin = SKIN[id];
  const t = THEME[id];
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 120 150" className="w-full" data-testid={`ancient-art-${id}`}>
      <circle cx="60" cy="72" r="54" fill={t.back} opacity="0.22" />
      <path d="M40 86q20-8 40 0l10 64H30z" fill={t.robe} />
      <path d="M40 86h40l4 26q-22-8-46 6z" fill={t.drape} />
      <path d="M60 86v64" stroke={t.robe} strokeWidth="1.5" opacity="0.5" />
      <rect x="54" y="68" width="12" height="18" rx="5" fill={skin} />
      <circle cx="60" cy="58" r="15" fill={skin} />
      <path d="M44 58a16 16 0 0 1 32 0q-6-10-16-10t-16 10z" fill={HAIR} />
      <circle cx="60" cy="40" r="7" fill={HAIR} />
      <path d="M45 52q15-8 30 0" fill="none" stroke={t.back} strokeWidth="2.5" strokeLinecap="round" />
      <Prop id={id} skin={skin} />
    </svg>
  );
}
