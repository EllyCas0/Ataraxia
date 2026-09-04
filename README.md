# Ask — The Philosophy App (MVP)

> Bring a question about life, humanity, reality, or meaning. We won't hand
> you a single answer — we'll help you explore how different traditions of
> thought have approached it.

This is a working build of the MVP described in the product spec: the
five-step core loop —

**Ask → 3–5 perspectives → Explore one → Socratic dialogue → Reflect**

— plus a browsable philosophy library and a private "Philosophy Journey"
timeline, all scoped to spec §18 "Phase 1: Validate the Idea."

## Run it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## What's implemented

| Spec feature | Status |
|---|---|
| **Question Explorer** — free-text question → 3–5 matched perspectives | ✅ `lib/match.ts`, `/explore` |
| **Philosophy library** — 15 perspectives with full structured metadata (core question, central ideas, key thinkers, history, application, criticisms, related traditions) | ✅ `lib/perspectives.json`, `/perspective/[slug]`, `/library` |
| **Question library** — 8 categories (Self, Love, Society, Ethics, Meaning, Death, Technology, Knowledge) | ✅ `lib/questions.ts`, home page |
| **Socratic Companion** — all 4 modes (Socratic, Compassionate Scientist, Devil's Advocate, Perspective Taking) | ✅ `lib/dialogue.ts`, `/dialogue/[slug]` |
| **Reflection Journal** — initial/current position, insights, remaining questions, resonated ideas | ✅ `/reflect/[slug]` |
| **My Philosophy Journey** — private timeline + stats (questions explored, perspectives encountered, traditions crossed) | ✅ `/journey` |
| Calm, contemplative, non-gamified UX | ✅ serif headings, muted palette, light/dark, no streaks/badges/points |

## Deliberate MVP tradeoffs

Per the spec's own instruction not to overengineer the MVP AI architecture,
two things are **templated rather than backed by a live model call**, with
a single clean seam to swap in the real thing later:

- **Question → perspective matching** (`lib/match.ts`) uses a transparent
  keyword/topic map instead of an LLM classifier + RAG retrieval agent.
  Swap the body of `matchQuestion()` for a real classifier call — the
  return shape (`{ perspectives, blurb }`) is what every caller expects.
- **Socratic/Scientist/Devil's-Advocate/Perspective-Taking dialogue**
  (`lib/dialogue.ts`) uses curated prompt banks with light keyword
  extraction from the user's last message, instead of a live LLM turn.
  Swap the body of `respond()` for a real model call — callers only need
  `respond(mode, perspective, userText, turnIndex): string`.

There is also **no backend/database**: reflections persist to
`localStorage` (`lib/journal.ts`), matching spec §18 Phase 1 scope (accounts,
conversation history, and Postgres-backed persistence are Phase 2).

## Content model

`lib/perspectives.json` holds all 15 traditions (Stoicism, Existentialism,
Buddhism, Utilitarianism, Aristotelianism, Taoism, Confucianism, Vedanta,
Pragmatism, Platonism, Feminist Philosophy, Philosophy of Mind,
Environmental Philosophy, Evolutionary Psychology, Neuroscience), each with
the exact metadata shape from spec §10:

```
name, tradition, period, coreQuestion, coreIdea, centralIdeas[],
keyThinkers[], historicalContext, application, criticisms[],
relatedPhilosophies { agrees[], disagrees[] }, furtherQuestions[]
```

Add a new perspective by appending an object with this shape — no code
changes required elsewhere.

## Next (per spec §18 roadmap)

- **Phase 1 validation**: ship this to 20–50 real users, watch which
  questions/perspectives get explored and whether reflections get completed.
- **Phase 2**: real accounts + Postgres persistence, an actual LLM-backed
  classifier and dialogue agent (the two seams noted above), pgvector-backed
  retrieval so dialogue quotes real primary-source content instead of
  curated summaries.
- **Phase 3**: personalized recommendations, richer journey visualization.
- **Phase 4**: Philosophical Salons (AI-facilitated group discussion).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4
· no backend, no external API keys required.
