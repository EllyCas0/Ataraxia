# The Agora

A space to explore philosophical perspectives, reflect on your own ideas, and keep a private journal.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No model installation, API keys, or environment variables are required.

All features use bundled content, browser storage, and local calculations. There are no external service integrations, API routes, or database connections.

## Features

- Browse one question library, with search and topics as filters.
- Search results include matching topics and related thinkers. Searches handle accents, punctuation, partial words of at least four characters, and a fixed vocabulary of Spanish topic translations. They do not provide general translation or spelling correction.
- Compare five thinkers using perspectives from the curated philosophy library.
- Explore comparison, Socratic, steelman, and historical views.
- Write a position, consider a reflection prompt, and revise it.
- Save reflections to your journal, search entries, and import or export backups.
- Choose your philosophical positions and add personal notes in your profile.
- Review English writing for claims, reasons, and language patterns.
- Enable optional ambient music using the speaker button.

Perspectives and reflection prompts use library content and local rules. The writing review uses English language patterns; it does not verify factual claims or provide a comprehensive assessment of an argument.

Journal entries, drafts, profile selections, and sound preferences are stored in the current browser. Export your journal and profile before clearing browser data or moving to another device.

## Validation

```bash
npm test
npm run lint
npm run build
```

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Daily Contemplation

`/contemplation` is a full-screen, one-quote-a-day screen. A slow gradient drifts behind the quote (`app/globals.css`), and the quote starts blurred under a `backdrop-filter` veil. Pressing and holding it (finger, mouse, or Space/Enter) clears the blur over 2 seconds with a haptic tap at the end; letting go early re-blurs it. A minimal "Reflect" button opens a slide-up drawer (swipe down, Escape, or Close to dismiss) whose entry is saved to the Journal.

The quote rotates daily from `lib/quotes.ts` using the visitor's local date. Haptics use the Vibration API (Android and most desktop browsers); iOS Safari has no such API, so it tries a native switch-input tap, which works on recent iOS versions but is best effort. With "reduce motion" on, the gradient stays still and the blur clears at the end of the hold instead of gradually.


## Schools of Thought map

`/map` is an interactive canvas map of five major schools (Stoicism, Buddhism, Confucianism, Existentialism, Utilitarianism) and how they relate. The nodes float gently. Clicking one glides the camera so it sits in the center, lights its connections with neon edges (cyan for shared ground, magenta for tension, with light pulses and relationship labels), and fires a callback with that school's data.

```tsx
<PhilosophyMap onSelect={(school) => setSelected(school)} />
```

`onSelect` receives the full `School` object (`lib/philosophy-map.ts`: name, era, region, tagline, summary, key ideas, thinkers, and `connections`), or `null` when the selection is cleared by clicking empty space or pressing Escape. The demo in `components/SchoolsExplorer.tsx` renders a bottom summary sheet from it. Other props: `selectedId` (control the selection yourself), `selectedOffsetY` (shift the centered node, for example up when a sheet covers the bottom), `schools` (your own data), `listClassName`.

It uses the plain Canvas 2D API (`lib/map-engine.ts`), so there is no charting dependency. It is keyboard accessible through a school list that appears on focus, announces selections to screen readers, and respects reduced motion (no floating, instant camera moves).


## Mental Reframing

`/reframe` shows one thought through four lenses: Anxious, Stoic, Growth, and Cosmic. A custom slider with four stops steps through them, and the text at the top cross-fades to the matching version while the accent color changes with the step. The four versions are an array of objects in `lib/reframing.ts` (`id`, `label`, `lens`, `text`, `accent`), and `<MentalReframing versions={...} />` accepts any array of the same shape.

People can also type a worry of their own into the box under the heading. `reframeThought` in `lib/reframe-thought.ts` turns it into the same four versions: it picks a topic from keywords (work, school, relationships, health, money, or self-worth), writes each lens around that topic, echoes the person's own words in the Anxious version, and calls out absolute words like "never" or "always" in the Growth version. This is rule-based, not a language model, so replace `reframeThought` to connect a real one; the screen does not need to change. If the text points to self-harm, nothing is reframed and the screen shows a support message instead (988 in the US, findahelpline.com elsewhere). "Back to the example" restores the built-in thought. Nothing typed is stored or sent anywhere.

The slider is a real `<input type="range">` laid invisibly over custom-drawn visuals, so keyboard (arrows, Home, End), touch, and screen-reader support come built in, and the drawn thumb glides between stops. All the versions are stacked in one grid cell and fade by opacity, so the cross-fade works between any two steps and the layout never jumps. With reduced motion on, the transitions are instant.


## The Shadow

`/shadow` is a minimal Socratic chat. There are no speech bubbles: the conversation reads like a plain script, with "You:" and "The Shadow:" as speaker names and the text beside them. The Shadow's lines type themselves out with `typeText` in `lib/typing.ts`, which waits a random 30 to 70 ms between characters, after a short "thinking" pause, so the rhythm feels deliberate rather than mechanical.

```ts
typeText(text, { onUpdate: (shown) => setShown(shown), onDone: () => setTyping(false) });
```

It returns `{ cancel, finish }`, splits by character (so emoji are never cut in half), and takes an injectable scheduler and random source, which is how the 30 to 70 ms range is tested. Esc (or tapping the text) shows the rest of a line instantly, and sending a message while The Shadow is still typing finishes its line first. With reduced motion on, lines appear at once. Screen readers hear each finished line once rather than letter by letter.

The Shadow's questions come from `shadowReply` in `lib/shadow.ts`, a scripted stand-in rather than a live model. It quotes a fragment of what you said and rotates through classic Socratic moves (meaning, grounds, assumptions, counterexamples, implications, other views, certainty), and every reply is made only of questions. Replace `shadowReply` to connect a real model; the chat and typing effect do not need to change.

