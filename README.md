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

## Local AI with Ollama

Start Ollama with `llama3.2:3b` installed, then run `npm run dev`. The Council has a **Generate perspectives with Ollama** button for each mode and generates challenges from your position and reasoning. The Argument Analyzer uses the local model. Calls go through the Next.js server at `/api/ai`; no external API key is needed.

Defaults are `http://127.0.0.1:11434` and `llama3.2:3b`. To change them, copy `.env.example` to `.env.local`, edit `OLLAMA_HOST` / `OLLAMA_MODEL`, and restart Next.js. Generation may take up to three minutes. Errors are shown so you can retry. Reference council perspectives remain visible before generation. The model can make mistakes and does not verify facts against live sources.

Next.js and Ollama must run on the same computer for this local setup. A hosted Next.js server would need access to its own Ollama service. The tradeoffs below describe the original reference implementation; the Analyzer and council generation now use Ollama, while retrieval and lightweight council hints still use local rules.

The model selector lists installed models and remembers your choice. Refresh the connection after downloading a model. Generation can be cancelled; the UI reports offline services and invalid responses rather than presenting them as successful results.

Council drafts, including a generated challenge, survive reloads in the same browser. You can save a reflection without waiting for AI. The Journal supports search, undo for the latest deletion, and JSON backup export/import. Imports merge entries and preserve conflicting versions. The Profile and Analyzer can also be exported as JSON. Data stays in this browser, so export your journal before clearing browser data or changing devices.

Custom questions support Spanish domain hints and bilingual retrieval terms. Ollama responds in the question's language; the reference library and quick pattern scan remain in English.

Validation: `npm run test`, `npm run lint`, and `npm run build`. API tests use controlled model responses to cover unavailable services, invalid input/output, model selection, and matching the displayed council.

## Ambient music

Generative ambient music plays across the whole app and continues between pages. A speaker button at the bottom right turns it on or off (the choice and volume are remembered in the browser). Each question domain has its own mood (`lib/ambient.ts`), so on a Council page the music matches the question; other pages use a warm default. Everything is synthesized with the Web Audio API, so there are no audio files or licensing concerns.

Browsers block sound until the visitor's first click, tap, or keypress. The app tries to start music on load; if the browser blocks it, a "Tap anywhere to start music" hint appears and music begins on the first interaction. Music pauses while the tab is hidden.

## Support and Pro waitlist

A first step toward sustaining the project, with no accounts or billing code: a `/support` page with a "support this project" payment link and a Pro waitlist. Nothing is shown (no footer link, no page) until you configure at least one link, and the repo holds no account details.

Set these as environment variables (copy `.env.example` to `.env.local` for local use, and add them in your host's settings when deployed):

| Variable | What to put |
|---|---|
| `NEXT_PUBLIC_SUPPORT_URL` | A Stripe Payment Link. In the Stripe Dashboard, go to Payment Links, create one, choose "Customers choose what to pay," and copy the `https://buy.stripe.com/...` URL. |
| `NEXT_PUBLIC_WAITLIST_URL` | A signup form, such as a Tally or Google Form. |
| `NEXT_PUBLIC_WAITLIST_EMAIL` | Optional fallback: if no form URL is set, the waitlist button opens a prefilled email to this address. |

These values are built into the site, so redeploy (or rebuild) after changing them. Only `https` links are accepted. Once the waitlist is configured, a small "Join the Pro waitlist" note also appears after someone saves a journal entry. The page is honest that Pro isn't built yet and that joining costs nothing.

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

- **54 philosophers** — full structured profiles (dates, region, period, traditions, central questions, key concepts, major arguments, influences/influenced, context, criticisms, contemporary relevance, primary & secondary sources), spanning all traditions the spec requires: Europe, the Middle East, South Asia, East Asia, Africa, Indigenous America, and contemporary global philosophy. Chosen for breadth and accuracy over hitting a raw count — see `lib/philosophers.json`, trivially extendable.
- **15 traditions** (spec target: 10) — `lib/traditions.ts`.
- **100 questions** across 8 domains — `lib/questions.ts`.
- **Concepts and sources** are embedded per-philosopher (key concepts, primary/secondary sources) rather than built as separate 300-concept / 500-source standalone databases — the spec's numbers there describe a much larger content operation than one build pass can respect with real accuracy; embedding keeps every concept and source tied to a specific, correct attribution.

## The honest tradeoffs

Curated retrieval and local reference functions work alongside the model:

- **`matchPhilosophers()`** (`lib/council.ts`) — keyword/domain scoring, not the spec's real retrieval system. It also tries to keep the council cross-civilizational rather than five variations on one school.
- **`speak()` / `challenge()`** (`lib/council.ts`) — reference perspectives and challenger selection. Ollama generates question-specific interpretations from curated profiles, explicitly labeled as interpretations rather than literal quotations.
- **`analyze()`** (`lib/analyzer.ts`) — a fast English pattern scan, used for the optional quick scan, lightweight council hints, and related philosopher lookup. The full Analyzer uses validated structured output from Ollama.

**No accounts or database.** The Journal and Personal Philosophy profile live in the browser's `localStorage`, with no automatic cross-device sync. Next.js provides the server route that connects to Ollama.

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
- A small local model may be slow or miss nuances. Cancel and retry, or use the quick scan for a preliminary pass.

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, local Ollama. No external API keys required.
