# The Agora

> Think better. Understand yourself. Understand civilization.

An AI-assisted philosophical thinking platform. Bring a question, meet a council of thinkers across traditions, articulate your own position, get challenged, and record how your thinking moves — without ever being told what to believe.

This build implements exactly the MVP scope the product spec itself defines (§22), not the full long-term vision (no community/Agora layer, no Civilization Simulator, no knowledge-graph visualization — the spec calls those later-stage).

## The core loop

Ask → Compare → Think → Articulate → Challenge → Reflect → Revise

1. **Ask** a question, or start from the daily question / browse the library.
2. **Meet the Council** — 5 thinkers matched to your question, viewable in 4 modes (Compare, Socratic, Steelman, Historical).
3. **State your position**, and optionally why.
4. **See a challenge** — a council member pushes back, and your own wording is scanned for absolute language, values, and assumptions worth examining.
5. **Revise** your position and note what's still uncertain.
6. **Save** to your private Philosophy Journal.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Modules built (spec §22 core)

| Spec module | Route | File |
|---|---|---|
| Philosophical Question Engine | `/`, `/questions` | `lib/questions.ts` |
| Philosophy Explorer | `/philosophers`, `/philosophers/[slug]` | `lib/philosophers.json` |
| AI Council | `/council` | `lib/council.ts`, `components/CouncilClient.tsx` |
| Argument Analyzer | `/analyze` | `lib/analyzer.ts` |
| Philosophy Journal | `/journal` | `lib/journal.ts` |
| Personal Philosophy profile | `/profile` | `lib/profile.ts` |
| Search | built into Questions & Philosophers pages | `lib/search.ts` |
| "User accounts" | — | see tradeoff below |

## Content (spec §22 targets, scoped down deliberately)

- **27 philosophers** (spec target: ~50) — full structured profiles (dates, region, period, traditions, central questions, key concepts, major arguments, influences/influenced, context, criticisms, contemporary relevance, primary & secondary sources), spanning all traditions the spec requires: Europe, the Middle East, South Asia, East Asia, Africa, Indigenous America, and contemporary global philosophy. Chosen for breadth and accuracy over hitting a raw count — see `lib/philosophers.json`, trivially extendable.
- **15 traditions** (spec target: 10) — `lib/traditions.ts`.
- **30 questions** (spec target: 100) across 8 domains — `lib/questions.ts`.
- **Concepts and sources** are embedded per-philosopher (key concepts, primary/secondary sources) rather than built as separate 300-concept / 500-source standalone databases — the spec's numbers there describe a much larger content operation than one build pass can respect with real accuracy; embedding keeps every concept and source tied to a specific, correct attribution.

## The honest tradeoffs

Three things are deliberately not backed by a live model or backend, each behind one function so the real thing can be swapped in without touching UI code — consistent with the spec's own instruction (§19) to build specialized AI components with an orchestrator, not to overengineer the MVP:

- **`matchPhilosophers()`** (`lib/council.ts`) — keyword/domain scoring, not the spec's real retrieval system. It also tries to keep the council cross-civilizational rather than five variations on one school.
- **`speak()` / `challenge()`** (`lib/council.ts`) — templated per-mode framing built from each philosopher's real, hand-written `frame`, `criticisms`, and `coreQuestion` fields. Every perspective is explicitly labeled "generalized from each thinker's philosophy — not a literal quotation," per spec §8's hard requirement not to impersonate historical thinkers.
- **`analyze()`** (`lib/analyzer.ts`) — pattern-matching (absolute language, hedges, evidence words, charged language, value-keyword groups), not real NLP. The Analyzer page says so explicitly; it flags patterns worth a second look, it doesn't adjudicate whether an argument is right.

**No backend or accounts.** The Journal and Personal Philosophy profile live in the browser's `localStorage`. This satisfies spec §22's "user accounts" bullet only partially — there's no cross-device sync, no real auth. Both modules are already shaped as the data a Postgres-backed version would use.

## What's intentionally not in this build

Explicitly later-stage or out-of-§22-scope per the spec itself:

- Module H, the Agora community layer (structured discussions, salons)
- Civilization Mode and the Civilization Simulator
- The interactive Philosophical Family Tree graph visualization (relationship data exists per-philosopher; no zoomable graph UI)
- Media Literacy Mode (separate from the Argument Analyzer)
- A general-purpose Contradiction Engine — a small, honest version exists on the Profile page (`findTensions()` in `lib/profile.ts`), checking a fixed table of classic tension pairs, not open-ended contradiction detection
- Fact verification / live source retrieval for current-events claims
- Community safety architecture (moot without a community layer yet)

## Known limitations worth knowing about

- Council matching is keyword-based; niche or very specific questions won't always surface the most topically perfect five thinkers.
- The Argument Analyzer's value-word lists are a small, fixed vocabulary — it will miss values expressed in less common phrasing.
- No hamburger menu yet; on very narrow phone widths the top nav scrolls horizontally rather than collapsing.

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4. No backend, no external API keys required.
