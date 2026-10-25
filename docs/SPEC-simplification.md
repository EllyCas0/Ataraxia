# The Agora: simplification (specification)

Goal: make the app feel "just right": fewer things on each screen and fewer ways to do the same thing, without losing the features that matter. This follows the simplification strategy agreed in conversation, and it builds on `docs/SPEC-contemporary-experience.md` (read Section 0 of that document: its shared rules, safety rules and quality bar apply here too).

Status: **implemented**, using the recommended option for each decision in Section 3 (D1a, D2a, D3a), on your instruction to carry out the whole specification. Differences between this text and what was built are listed in "As built" at the end.

---

## 1. The core loop

The app exists to do one thing: **give someone a good question, help them think about it, and let them keep their thoughts.**

Every screen and control is judged against that loop:

1. **Get a question** (Discover: the daily quote, ideas, guided tours)
2. **Think about it** (Reflect: the conversation; Reframe; Natural Law reflections)
3. **Keep it** (My Philosophy: journal, saved items, values)

If an element does not serve one of those three steps, it is hidden, merged with something else, or removed.

## 2. Principles

1. **One primary action per screen.** Secondary actions are visually quieter.
2. **One way to do each thing.** No duplicate routes to the same place unless a decision below says so.
3. **Hide, don't delete, depth.** Advanced options move behind a small control; they are not removed.
4. **Nothing moves or plays without being asked** (see D1 for the one exception under discussion).
5. **Keep the mood.** Dark theme, lime accent, rounded headings, lightning on the home carousel and the colour per school all stay; this is a reduction in clutter, not a redesign.
6. **Keep what protects people.** Crisis handling, "not therapy" notices, AI-generated labels, privacy notices and accessibility features are never removed in the name of simplicity.

## 3. Decisions needed before building

These are open because each affects what was previously requested. The recommended option is first.

| # | Decision | Options | Why it needs an owner |
|---|---|---|---|
| **D1** | Music at page load | **(a) Off by default, with a clear "Play music" button** · (b) keep trying to autoplay (current) | Autoplay was requested explicitly. It adds motion and sound the person did not ask for, and browsers often block it anyway. |
| **D2** | Where Natural Law lives | **(a) Not in the main navigation; reached from a card on Discover and from Ideas** · (b) keep it as a fourth nav item | It was added to the navigation on request. Removing it trades visibility for simplicity. Decide after testing (Section 9). |
| **D3** | The separate "New" (new conversation) button | **(a) Remove it; "Start thinking" on Discover and the primary button on Reflect cover it** · (b) keep it | The original build specification required a persistent "new conversation" entry. Option (a) changes that requirement, so it needs explicit approval. |

Until decided, build the rest and leave the affected element unchanged.

## 4. Navigation

**Target (D2a, D3a):** three items, in this order: **Discover, Reflect, My Philosophy.**

- Sidebar (desktop): logo, then the three items. No separate "New" button above them (D3a).
- Bottom bar (mobile): three equal columns.
- Mobile header: the logo and name only (no "New" pill) under D3a.
- `navItems` in `components/shell/nav-items.ts` holds the three items; Discover is highlighted for `/discover`, `/ideas`, `/weekly`, `/reframe`, `/ethics`, and `/insights`.
- If D2b is chosen, keep the Natural Law item as it is today (four items) and skip the Discover card in Section 5.
- If D3b is chosen, keep `NEW_CONVERSATION_HREF` in the sidebar and header.

**Acceptance criteria**
- Each of the three destinations is reachable by keyboard and highlighted when active, including on child pages.
- Exactly one item is highlighted at a time on every page.
- The primary navigation has exactly 3 links (4 under D2b), all fully visible on a 375 px wide screen and in the sidebar.

## 5. Discover (home)

**Keep:** the headline ("Big questions. Your take."), one primary button (**Start thinking**), the daily quote carousel, and one secondary card.

**Remove from the home page:**
- The eight "Pick a vibe" chips and their heading.
- The search box. Search lives on the Ideas page, which already has it.

**Replace with:**
- A single text link, **Browse ideas**, below the button.
- One secondary card in the existing "Try this" slot. It shows **one** item at a time and alternates by day, using the same date-based rule as the daily quote (`zonedDateKey` and `dayNumber`, never `Math.random()`):
  - **Reframe a worried thought** (links to `/reframe`)
  - **Natural Law: a guided tour** (links to `/ethics/natural-law`)
- Under D2b the card shows Reframe only.

**Reachability:** Natural Law stays reachable from the daily card (every other day), from a permanent link on the Ideas page ("Ethics: guided tours"), and from the "Go deeper" callout on the ethics theme.

**Interactive-element budget:** the Discover page has at most **12** focusable elements in total (navigation, button, carousel buttons, slide link, "Browse ideas", the secondary card, and the music button). A test enforces this so the page cannot quietly grow back.

**Acceptance criteria**
- No vibe chips and no search box on `/discover`.
- Searching still works from `/ideas` (existing tests keep passing there).
- The secondary card is the same all day, and the same on reload; it changes with the date.
- Both Reframe and Natural Law are reachable from `/discover` within two clicks on any day.

## 6. Ideas and browsing

- One browsing path: **Discover → Ideas → an idea.** Themes are a filter on the Ideas page only.
- Keep the Ideas page's search, tradition and theme filters.
- Keep the two small links in the Ideas header (this week's perspective, Ethics tours) and the "Go deeper" callout. These replace the removed chips as the way into guided content.

## 7. Reflect (conversation)

**Default to one simple mode.** A new conversation opens with **Explore an idea** selected and **no mode switcher visible.**

- Add a small **"Change style"** control (a link-style button) that reveals the other two modes: **Examine a dilemma** and **Challenge my assumptions**. The three `ConversationMode` values and their system-prompt behaviour do not change.
- Starter prompts: show at most **three** (today seven) as small suggestions under the message box. Choose them by date, or the first three in `lib/content/chat.ts`.
- Keep: the AI-generated label, the "not therapy, medical advice, or crisis support" notice, the follow-up suggestions, clear-with-confirmation, and save-insight.
- The Reflect list page keeps its single primary button, **New conversation**. This is the primary entry point if D3a is chosen.

**Acceptance criteria**
- `/reflect/new` shows one mode and a "Change style" control; activating it shows all three modes, and picking one works exactly as before.
- Opening `/reflect/new?question=…` or `?concept=…` still selects the right mode automatically (the mode switcher may stay hidden; the chosen style is stated in plain words).
- The "not therapy" notice is visible on every conversation page.

## 8. My Philosophy

Reduce four tabs to **three: Journal & saved, Values, History.**

- Journal & saved: one list, entries first, saved questions/ideas/quotes underneath under their own small heading. Journal create, edit and delete work as today.
- Values and History are unchanged.
- The privacy notice stays at the top.
- Tab URLs: `?tab=journal`, `?tab=values`, `?tab=history`. The old `?tab=saved` redirects to the combined tab so existing links work (`parseMyPhilosophyTab` maps it).

**Acceptance criteria**
- Three tab triggers; no "Saved insights" tab.
- Saved items are visible in the combined tab; unsaving/removal behaves as before.
- Old `?tab=saved` links land on the combined tab.

## 9. Music and motion

- **D1a (recommended):** the player starts **paused.** The round button reads "Play music: <title>"; pressing it plays, and the volume pill appears. The remembered "paused/playing" choice from the current implementation is kept: after the person presses play once, it may start on later visits only if they last left it playing (this respects their choice without surprising first-time visitors). Remove the first-gesture autoplay fallback.
- **D1b:** keep the current behaviour.
- **Lightning and blobs:** keep them on the home carousel only. On the reading page (`/insights/[slug]`), use the static school-colour gradient with no animation. Existing safety rules for the animation (single pulses, at least 4 s apart, reduced-motion respected, contrast test) stay in force.
- Reduced-motion preference: no animation anywhere (already true for the carousel; verify the reading page).

**Acceptance criteria**
- With D1a, a fresh visit makes no sound and `audio.paused` is true until the person presses play.
- `/insights/[slug]` has no running CSS animation on its background.

## 10. Copy

- Apply the copy rules from `docs/SPEC-contemporary-experience.md` Section 1 to anything this change touches: one short sentence per card, plain words, reading level about age 12 to 14.
- Secondary-card text: one title and one line (at most 20 words). Home headline and button text do not change.

## 11. What stays untouched

Daily quote carousel and its lightning (home), the colour per school, the quote reading pages, Reframe (including its self-harm support message), Natural Law (all four sections, the ten tenets, the reflections), the Ideas library and its search and filters, journal, values, history, the chat's safety notices and AI label, the privacy notice, keyboard and screen-reader support.

## 12. Tests to change

| Test file | Change |
|---|---|
| `e2e/navigation.spec.ts` | Navigation has 3 links (not 4); remove the Natural Law nav test and the "New conversation from anywhere" test (D3a); keep the one-item-highlighted test and the fits-on-screen test (count 3). |
| `e2e/discover.spec.ts` | Remove the "vibe chip" and home-search tests; add: home has no chips or search; the secondary card alternates by date; the interactive-element budget (≤ 12). Keep carousel, insight and reading-view tests. |
| `e2e/natural-law.spec.ts` | "Natural Law reachable": use the Ideas "Ethics: guided tours" link and the Discover card instead of the nav item. |
| `e2e/reflect.spec.ts` | "Three modes and starter prompts": a single mode is shown at first; "Change style" reveals all three; at most three starter prompts. |
| `e2e/my-philosophy.spec.ts` | Three tabs; saved items inside the combined tab; `?tab=saved` redirects. |
| `e2e/music.spec.ts` | D1a: no autoplay on a fresh visit; play on press; remove the "first click starts it" tests; keep the remember-choice and error tests. |
| `e2e/storm.spec.ts` | Reading page test expects a static gradient and no animation, instead of the storm. |
| `tests/` | Add unit tests for the date-based alternation of the secondary card and for `parseMyPhilosophyTab("saved")`. |

All other tests must still pass unchanged.

## 13. Order of work

1. **Navigation and home page** (Sections 4 and 5): the biggest simplification for the least risk, and it needs only D2 and D3.
2. **Reflect default mode** (Section 7).
3. **My Philosophy tabs** (Section 8).
4. **Music default and reading-page motion** (Section 9), after D1 is decided.
5. **Copy pass** (Section 10).

Ship each step on its own with all tests green.

## 14. How to know it worked

There are no analytics yet, so judge by watching, before launch:

- Sit with **five people** (include a teenager and a teacher) and ask them to: find today's quote, start a conversation, and find Natural Law. Note where they hesitate.
- The simplification worked if no one needs help with the first two, and at least four of five find Natural Law within a minute (D2a). If fewer do, restore the Natural Law nav item (D2b).
- When analytics arrive (privacy-first, no free text), track: which nav items are used, how often "Change style" is pressed, and how often music is started. Drop or promote features based on that.

---

## As built

Everything above was implemented. Where the build differs from the wording above:

- **D1a, D2a, D3a** were chosen (music starts paused, Natural Law leaves the main navigation, the separate "New" button is removed). Each can be reversed by the notes in Sections 4 and 9.
- **The Ideas link to Natural Law** reads "Natural Law: a guided tour" and goes straight to `/ethics/natural-law` (it was "Ethics: guided tours" going to `/ethics`). That keeps Natural Law within two clicks of Discover on every day. The `/ethics` index still exists and is reached from the breadcrumb on the Natural Law page.
- **The "Go deeper" callout** on the Ethics theme now reads "Go deeper into Natural Law", so that no two links on one page share a name.
- **Reframe is also linked from the Reflect page** ("Carrying a worry? Reframe a worried thought"), so it is within two clicks of Discover even on days when the home card shows Natural Law.
- **"Change style"** is used on existing conversations as well as new ones, so both look the same.
- **Music:** the first-gesture autoplay fallback was removed. After someone presses play once, the next visit tries to resume quietly; if the browser refuses, the player stays paused with no message.
- **Interactive-element budget:** the test counts everything a keyboard can reach on Discover (including the skip link) and allows at most 12. It currently sits exactly at 12.
