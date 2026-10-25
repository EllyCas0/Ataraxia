# Stoa: contemporary, fun, simple (feature specification)

Goal: make Stoa feel modern and playful to any age group, especially young people, without becoming noisy. Simple first: one idea per screen, one clear action.

This is written so each section can be handed to a coding assistant on its own. Read **Section 0** before any other section; it applies to all of them.

Status legend used below: **[now]** can be built today with no database or login; **[needs P3]** needs Supabase (Phase 3); **[needs P4]** needs the AI chat backend (Phase 4).

---

## 0. Shared rules (apply to every feature)

**Stack and conventions** (already in the repo)
- Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui. Read `AGENTS.md` first: this Next.js version has breaking changes, and `node_modules/next/dist/docs/` is the reference. `params` and `searchParams` are async. `proxy.ts` replaces `middleware.ts`.
- Content lives in typed seed files under `lib/content/` and is read through `lib/content/repository.ts`. Follow that pattern: data file, pure selection function, `content.*` accessor, unit tests.
- Constants imported by server components must not be exported from `"use client"` files (they become client references). Put shared constants in plain `lib/*.ts` files.
- Date-dependent pages set `export const dynamic = "force-dynamic"` and derive "today" from `getAppTimezone()` and `zonedDateKey()` in `lib/time.ts`.
- Anything chosen "for today" must be deterministic for the date (same result on refresh), never `Math.random()` at render time.

**Design principles**
1. One idea per screen, one primary action. No more than 3 choices at a time.
2. Plain words. Reading level about age 12 to 14 for all new copy. No jargon without a one-line explanation.
3. Mobile first. Design at 375 px wide, thumb-reachable controls at the bottom half, tap targets at least 44 px.
4. Motion is small and optional: always honour `prefers-reduced-motion` (a global rule already exists in `app/globals.css`). No autoplay.
5. Nothing is required to be signed in to *try* a feature. Saving and syncing may require an account.
6. Never put free text a person typed into a share image, URL, analytics event or log.

**Safety and honesty (non-negotiable)**
- The app is not therapy. Keep the "not therapy" wording wherever AI replies or reflective prompts appear.
- Keep crisis handling: any input path that accepts free text (Reframe, chat, journal prompts, "your own take") must run the self-harm check and show the support message instead of a playful response. Reuse `CRISIS` logic in `lib/reframe-thought.ts`; move it to a shared `lib/safety.ts` when a second feature needs it.
- No manipulative engagement: no streak-loss warnings, no countdown pressure, no "your friends are waiting" nagging, no infinite feeds. The existing quote carousel is the model: user-controlled and no autoplay.
- Quotes and claims about thinkers must be accurate and cited. Do not add a quotation unless it can be checked against a named source. Mark any AI-generated imagery as such.

**Quality bar for every feature**
- Typecheck, lint, Vitest and Playwright (desktop and mobile projects) all pass before it counts as done.
- Every new public page has a 404 test for bad slugs, a keyboard-only path, and visible focus.
- Text contrast at least 4.5:1 (3:1 for large text) against its actual background, including over images.
- Add an end-to-end test using the `open(page, path)` helper from `e2e/helpers.ts` (it waits for hydration).

---

## 1. Voice and copy pass [now]

**What:** rewrite existing content so it is friendly, short and concrete.

**Scope**
- `lib/content/questions.ts` (32 daily questions and their `shortDescription`)
- `lib/content/concepts.ts` (22 concepts: `summary` and similar fields)
- `lib/content/weekly.ts`, `lib/content/chat.ts` (starter prompts), UI strings on Discover, Ideas, Reflect, My Philosophy.

**Style guide (also saved as `docs/COPY-STYLE.md`)**
- Questions: at most 14 words, one idea, about something a young person could meet this week (group chats, grades, social media, AI, friendship, money, identity). Example: "Is it fake if you only post the good stuff?"
- Descriptions: at most 2 sentences, at most 30 words.
- Concept summaries: lead with a situation, then the idea. Example: "Your friend leaves you on read. The Stoics would ask: which part of that is up to you?"
- No "one must", "individuals", "discourse", "paradigm". Say "you".
- Keep every philosophical claim accurate. Simplify, never change the meaning. All concepts stay marked as drafts needing expert review.
- Tone: curious and warm, a light joke is fine, never sarcastic about the person.

**AI voice** (applies when Phase 4 builds the system prompt): short replies (under about 120 words by default), plain language, ask one question back, offer a concrete example, no lecturing, no therapy claims.

**Acceptance criteria**
- A unit test fails if any daily question exceeds 14 words or any description exceeds 30 words or 2 sentences.
- A unit test fails if a banned-word list ("discourse", "paradigm", "hegemony", "ontological" and similar) appears in learner-facing strings.
- Existing content tests (`tests/content.test.ts`) still pass; slugs do not change (links depend on them).
- A human review step: the diff is read by someone on the team before merge.

---

## 2. "Where do you stand?" dilemmas [now, with an optional aggregate in P3]

**What:** a one-tap dilemma. The person picks a side, then sees how different schools of thought would lean and why, in one line each.

**Routes**
- `/stand` (today's dilemma plus a "next one" button and a short list of past ones)
- `/stand/[slug]` (a specific dilemma; also the shareable link)

**Data** (`lib/content/dilemmas.ts`)
```ts
type SchoolSlug = "stoic" | "kantian" | "utilitarian" | "virtue" | "existentialist" | "confucian" | "daoist" | "care";
interface Dilemma {
  id: number;
  slug: string;
  setup: string;            // 1 to 2 sentences, at most 40 words, concrete scenario
  question: string;         // at most 14 words
  options: [{ id: "a"; label: string }, { id: "b"; label: string }]; // labels at most 6 words
  perspectives: { school: SchoolSlug; leans: "a" | "b" | "depends"; line: string }[]; // 3 to 4 per dilemma, line at most 25 words
  theme: ThemeSlug;
  relatedConceptSlug?: string;
  publicationStatus: "draft" | "approved";
}
```
- Seed at least 20 approved dilemmas covering friendship, honesty, technology and AI, fairness, ambition, family, money, and online life.
- Each perspective must describe what that school would *plausibly argue*, and say so ("A Stoic might say..."). No claim that a named person said it.

**Selection:** reuse the daily rotation pattern (`pickDaily*` in `repository.ts`): same dilemma all day for a date key; "next" cycles the list in a fixed order.

**Flow**
1. Show setup, question, two large option buttons (full width on mobile).
2. On pick: reveal the perspectives as a small stack of cards (animation optional), mark which schools lean the same way as the person.
3. Show two actions: "Share" (Section 4) and "Reflect on this" (links to `/reflect/new?concept=<relatedConceptSlug>` or `/reflect/new`). Plus a "Next dilemma" button.
4. Optional: a "Change my mind" button that lets them pick again. Do not count it against them.

**Persistence**
- **[now]** `localStorage` key `agora.stand.v1`: `{ [slug]: "a" | "b" }`. Wrap every read and write in try/catch; the page must work with storage unavailable.
- **[needs P3]** Table `dilemma_answers(user_id, dilemma_slug, option_id, created_at)` with RLS `user_id = auth.uid()`, unique on `(user_id, dilemma_slug)`.
- **[needs P3] optional "How others answered":** a Postgres view or function that returns only counts per option and only when at least 20 answers exist; never expose individual rows. Anonymous answers are not stored server-side.

**Free text:** none in v1. Do not add a free-text "why" field without wiring the safety check (Section 0).

**Analytics** (no free text): `dilemma_viewed {slug}`, `dilemma_answered {slug, option}`, `dilemma_shared {slug}`.

**Acceptance criteria**
- `/stand` shows the same dilemma on repeated reloads on the same date.
- Choosing an option reveals 3 to 4 perspectives and nothing is shown before choosing.
- Works with JavaScript storage disabled (no crash; answer simply is not remembered).
- 404 for an unknown slug. Keyboard: options are buttons reachable by Tab, activated with Enter or Space, and focus moves to the revealed results.
- Unit tests: selection determinism, schema validation of every seed dilemma (word limits, 2 options, 3 to 4 perspectives, valid school slugs, related concept exists).
- E2E: pick option, see perspectives, reload, previous choice is remembered.

---

## 3. "Which thinker are you?" quiz [now]

**What:** an 8 to 10 question quiz that ends on a result card for one school of thought. Fun, shareable, and clearly a game, not a personality test.

**Routes:** `/quiz` (intro and questions, one per screen), `/quiz/result/[school]` (result and share link).

**Data** (`lib/content/quiz.ts`)
```ts
interface QuizQuestion {
  id: number;
  prompt: string; // at most 16 words
  answers: { id: string; label: string; weights: Partial<Record<SchoolSlug, number>> }[]; // 3 to 4 answers
}
interface QuizResult {
  school: SchoolSlug;
  title: string;          // e.g. "The Steady One"
  oneLiner: string;       // at most 20 words
  strengths: string[];    // 2
  blindSpot: string;      // 1 sentence, kind
  relatedConceptSlug: string;
  thinkers: string[];     // 2 to 3 historical names for further reading
}
```
- One result per school in `SchoolSlug` (8 results). Titles are about the *style of thinking*, never a label on the person.

**Scoring** (`lib/quiz.ts`, pure function, fully unit tested)
```ts
scoreQuiz(answers: Record<number, string>): { top: SchoolSlug; runnerUp: SchoolSlug; scores: Record<SchoolSlug, number> }
```
- Sum weights. Highest wins. Ties break by a fixed school order so results are deterministic. Validate that every answer id exists; ignore unknown input rather than throwing.
- Every school must be reachable: a unit test searches the answer space (or uses greedy answer choices) and fails if any school can never win.

**Flow:** progress dots, one question per screen, back button, answers by tap. Result shows title, one-liner, strengths, blind spot, "Explore this idea" link, "Retake", "Share".

**Persistence**
- **[now]** `localStorage` key `agora.quiz.v1` with the latest school. Never required.
- **[needs P3]** optional `profiles.last_quiz_school`, shown on My Philosophy.

**Wording rules:** "This is a game, not a diagnosis" shown on the result. Do not say "you are a Stoic"; say "Your answers leaned Stoic today".

**Analytics:** `quiz_started`, `quiz_completed {school}`, `quiz_shared {school}`.

**Acceptance criteria**
- Unit tests: scoring determinism, tie-break order, all schools reachable, unknown answer ids ignored, all seed data valid.
- E2E: complete the quiz on mobile and desktop, reach a result, retake works, result URL for a valid school loads and an invalid school is a 404.
- Back button never loses earlier answers within a session.

---

## 4. Share cards [now]

**What:** a "Share" button on quotes, dilemma results and quiz results that produces a clean image and a link.

**Implementation**
- Generate images with `next/og` (`ImageResponse`) at route handlers:
  - `/api/og/quote/[slug]` (quote text, thinker, school)
  - `/api/og/quiz/[school]` (school title and one-liner)
  - `/api/og/dilemma/[slug]` (the question and two options; no result)
- Sizes via `?size=square|story|wide` (1080x1080, 1080x1920, 1200x630). Default `wide` for link previews.
- **Allowlisted inputs only:** accept a slug or school id, look it up in seed content, and return 404 if unknown. Never render query-string text. This prevents spoofed or abusive cards.
- Add `generateMetadata` to `/insights/[slug]`, `/quiz/result/[school]` and `/stand/[slug]` so the pages carry `og:image` and `twitter:card`.
- Client share button: use `navigator.share` when available, otherwise copy the link and show a toast. The shared link opens the content page, never a person's private data.
- Fonts: use a system or bundled font; do not fetch fonts at build time (build must not need network).

**Privacy:** images and links never contain journal text, conversation text, names or emails, and the app does not know who shared.

**Acceptance criteria**
- Each OG route returns a PNG with the right content type for a valid id and a 404 for an invalid one.
- A unit or e2e test checks that arbitrary query text (`?text=hello`) does not appear in the output route's inputs (the handler ignores it).
- Share button works by keyboard and shows a toast on copy.

---

## 5. Colour per school, and light/dark theme [now]

**What:** each school of thought gets one accent colour used on its quote slides, result cards, badges and dilemma perspective cards. Add a light/dark/system theme control.

**Design tokens**
- Add `--school-<slug>` colour tokens in `app/globals.css` (8 colours), chosen to look good on the dark background and to pass contrast for text.
- Keep the primary UI calm: the accent colour appears on small elements (a dot, a rule, a badge), not large fills, except on result and share cards.
- Add a light theme under `[data-theme="light"]` that mirrors the dark tokens. Default is "system" (`prefers-color-scheme`); explicit choice persists.

**Theme control**
- A small toggle in the sidebar footer and the mobile header menu (Light / Dark / System).
- Persist in `localStorage` (`agora.theme.v1`), read in an inline script in `app/layout.tsx` before paint to avoid a flash; keep it hydration-safe (`suppressHydrationWarning` on `<html>` only).
- `color-scheme` must follow the active theme so form controls match.

**Acceptance criteria**
- All text and controls meet contrast in both themes (add an automated check with axe via `@axe-core/playwright` on Discover, Ideas, Stand, Quiz, Reframe in both themes).
- No flash of the wrong theme on reload (test by setting storage then reloading and asserting `data-theme` before hydration).
- Existing e2e tests pass in dark (default) and a light-theme project or spec covers the key pages.

---

## 6. Swipeable cards pattern [now]

**What:** extract the quote carousel into a reusable `components/ui/card-deck.tsx` and use it for dilemma "next", concept browsing and the quiz.

**Behaviour (copy the carousel's guarantees)**
- Next and previous buttons, arrow keys, and swipe (50 px threshold) all work; a swipe never opens a link underneath.
- Loops endlessly when the list is finite and marked `loop`.
- No autoplay. `aria-roledescription="carousel"` and `"slide"`, live region announces "Item N of M", inactive slides are `aria-hidden` and not focusable (use `inert` where possible).
- Height is that of the tallest slide (slides share one grid cell); use `overflow-clip`, not `overflow-hidden`, so focus cannot scroll the track sideways.
- Reduced motion: no transform animation, instant swap.

**Acceptance criteria:** the existing carousel e2e tests are kept and pass unchanged after refactor; add a test for each new place the deck is used.

---

## 7. "Argue with a philosopher" chat mode [needs P4]

**What:** a fourth chat mode where the AI argues one school's position and the person pushes back. It builds on the existing "challenge assumptions" mode.

**Behaviour**
- Pick a school (or "surprise me") and a topic (free text or from a dilemma). The AI states its strongest case in 2 to 4 sentences, then asks the person to respond, and keeps replying in character as *that school's argument*.
- Every reply stays short and ends with one question or challenge.
- The AI must **not** claim to be, or speak as, a real historical person (no "I, Marcus Aurelius"). It speaks as "a Stoic" or "the Stoic view". The mode label says "AI playing the Stoic side".
- It must steelman honestly, not caricature, and must concede good points. A "Switch sides" button asks it to argue the opposite.
- Safety screen runs on every user message before the model is called; on a crisis match, return the support message and do not continue the debate. Normal moderation and rate limits from Phase 4 apply.
- Retrieval (Phase 5): include the relevant approved concept records as reference material, marked as data, not instructions.

**Data:** add `mode = "argue"` plus `persona_school` to `conversations` (nullable). `messages.role` stays `user | assistant` only.

**Acceptance criteria (with the mock model)**
- The system prompt for this mode names the school, forbids impersonating real people, and caps reply length; a unit test asserts those clauses are present.
- A crisis phrase in the first or later message yields the support message with no model call.
- Switching sides changes the persona instruction in the next call.
- Not tested against a real model in this environment; mark as unverified until run with real credentials.

---

## 8. Daily 60-second take [now, richer with P3]

**What:** a tiny daily ritual: read today's question, write one sentence, see a gentle "You thought about <theme> today" note. No streak counter, no penalty for skipping.

**Rules**
- One sentence, 280 characters max. Free text, so the self-harm check must run (Section 0); on a match show support text and do not save.
- **[now]** stored in `localStorage` (`agora.take.v1`, keyed by date); clearly labelled "stays on this device".
- **[needs P3]** save to `journal_entries` with `source = "daily_take"` and link to the question slug.
- The reward is information, not pressure: show a small count of themes thought about this month ("You've touched 4 themes this month"). No "don't break your streak" copy anywhere.
- Surface it on the home page only as a quiet link under the search box, not as a new card.

**Acceptance criteria:** works offline, no required login, saves only after an explicit button press, crisis path tested, 280-character limit enforced client-side and server-side (when persisted).

---

## 9. Installable web app [now]

- Add `app/manifest.ts` (name "Stoa", `display: "standalone"`, theme and background colours matching the tokens) and icon set (192, 512, maskable) in `public/icons/`.
- Add a mobile viewport theme colour via `viewport` export.
- **Do not** add a service worker that caches authenticated or private pages. If offline support is wanted later, cache only static public content and never `/reflect` or `/my-philosophy`.

**Acceptance criteria:** Lighthouse "installable" passes on the production build; the app opens standalone on a phone; nothing private is cached.

---

## 10. Young users: privacy, consent and safety [decision needed before launch]

This section is a requirement set, not a legal opinion. **Do not launch to under-18s or advertise to them until these decisions are made and reviewed by someone qualified.**

**Decisions the team must make**
1. **Minimum age** for creating an account and for AI chat. Rules vary: for example the US (COPPA, under 13) and many EU states (digital-consent age 13 to 16). Pick the highest age that fits the markets you launch in.
2. **Parental consent** flow if any account under the local age of digital consent is allowed. Simplest option: set the minimum age to the strictest applicable value and say so.
3. **Which features need an account.** Recommended: dilemmas, quiz, quotes, ideas and Reframe work anonymously and store nothing server-side; the AI chat and synced journal require sign-in.

**Requirements to implement**
- Neutral age question at sign-up (date of birth or year, not a "are you over 13" prompt that invites lying). If under the minimum, do not create the account and do not prompt again with a different answer in the same session.
- Store only what is needed. Do not collect real names, locations or contact details beyond the auth email.
- Privacy page written in plain language, linked from sign-up, My Philosophy and the footer.
- A "delete my data" action (conversations, journal, saved items, values, account) that works end to end (Phase 3 delete cascade).
- Moderation and crisis handling stay on for all AI features; do not weaken them for engagement.
- No behavioural ads, no third-party trackers, no dark patterns (no streak shaming, fake urgency or confirm-shaming copy).
- Analytics: only the events listed in this spec, no free text, no precise location, no cross-site IDs.

**Acceptance criteria:** a written decision record in `docs/DECISIONS.md` for items 1 to 3; the age gate and delete-my-data flows have tests; a manual review checklist is completed before any launch to minors.

---

## 11. Philosopher images [partly done]

- Real images go in `public/modern-minds/<slug>.jpg`; see `docs/modern-minds-image-prompts.md`. A generic placeholder shows until then.
- The "Illustration generated with AI" note must show whenever a real generated image is shown and hidden for the placeholder (already implemented).
- Keep the bottom third of each image simple so the quote stays legible; verify contrast over every real image once added.

---

## Suggested build order

| Step | Feature | Needs | Rough size |
|---|---|---|---|
| 1 | Section 1: copy pass and word-limit tests | nothing | small |
| 2 | Section 5: school colours and theme toggle | nothing | small |
| 3 | Section 6: reusable card deck | nothing | small |
| 4 | Section 2: dilemmas (local storage) | nothing | medium |
| 5 | Section 3: quiz | nothing | medium |
| 6 | Section 4: share cards | 2 and 3 | medium |
| 7 | Section 8: daily take (local) | nothing | small |
| 8 | Section 9: installable app | nothing | small |
| 9 | Phase 3 (auth, migrations, RLS) then persist sections 2, 3, 8 | Supabase | large |
| 10 | Phase 4 then Section 7 (argue mode) | OpenAI | large |
| 11 | Section 10 decisions and age gate | team and legal input | decision first |

## Definition of done (whole spec)

- All `[now]` sections shipped with tests passing (Vitest and Playwright on desktop and mobile).
- No feature stores or shares free text without the safety check.
- Every share image and link is built from allowlisted ids only.
- Accessibility check (axe) passes on every new page in both themes.
- README and `docs/ARCHITECTURE.md` list what is implemented, what is deferred, and what is unverified without credentials.
