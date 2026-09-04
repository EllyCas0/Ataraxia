import type { DialogueMode, DialogueModeInfo, Perspective } from "./types";

// The Socratic Dialogue / Perspective / Reflection agents from the spec,
// implemented as templated prompt banks rather than a live LLM call.
//
// This is a deliberate MVP tradeoff (see the spec's "do not overengineer the
// MVP" note on AI architecture): the four modes, their intent, and their
// output shape are all real — `respond()` is the single seam to swap in an
// actual model call later without touching any calling code.

export const dialogueModes: DialogueModeInfo[] = [
  {
    id: "socratic",
    label: "Socratic Mode",
    emoji: "🕯️",
    description: "The AI mostly asks questions, helping you examine your own reasoning.",
  },
  {
    id: "scientist",
    label: "Compassionate Scientist",
    emoji: "🧪",
    description: "Separates evidence, interpretation, belief, assumption, and the unknown.",
  },
  {
    id: "devil",
    label: "Devil's Advocate",
    emoji: "🔥",
    description: "Respectfully challenges your position to test — not defeat — it.",
  },
  {
    id: "perspective",
    label: "Perspective Taking",
    emoji: "🌐",
    description: "Introduces viewpoints you might not naturally encounter.",
  },
];

function extractPhrase(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "that";
  // Grab a short, quotable fragment — prefer the tail clause, capped in length.
  const parts = cleaned.split(/[,.;:]/).filter(Boolean);
  const tail = parts[parts.length - 1]?.trim() || cleaned;
  const words = tail.split(" ");
  const fragment = words.slice(-8).join(" ");
  return fragment.length > 2 ? fragment : cleaned.slice(0, 60);
}

const socraticBank = (p: Perspective) => [
  (u: string) => `What experiences led you to believe ${JSON.stringify(extractPhrase(u))}?`,
  (u: string) => `If someone you deeply respected disagreed with "${extractPhrase(u)}", what might they say — and would it move you at all?`,
  () => `${p.name} asks: "${p.coreQuestion}" — how would you answer that in your own words, before we bring in any tradition's view?`,
  (u: string) => `Is "${extractPhrase(u)}" something you've tested against experience, or something you've mostly inherited?`,
  () => `What would have to be true for you to change your mind here?`,
  (u: string) => `You said "${extractPhrase(u)}" — what's the strongest version of the opposite view, as far as you can construct it?`,
];

const scientistBank = (p: Perspective) => [
  () =>
    `Let's sort this. Evidence: what, if anything, is empirically observable here? Interpretation: what meaning are we layering onto it? Belief: what do you personally hold to be true? Assumption: what are we taking for granted without examining it? Unknown: what genuinely remains uncertain? Start wherever feels easiest.`,
  (u: string) => `You said "${extractPhrase(u)}" — is that closer to an observed fact, or an interpretation you're making of the facts?`,
  () => `${p.name} treats part of this as ${p.coreIdea} What would count as evidence for or against that, in your own life?`,
  (u: string) => `What assumption is quietly doing a lot of work in "${extractPhrase(u)}"?`,
  () => `What part of this question do you think may simply be unknown right now — not "unknown to you," but genuinely unresolved by anyone?`,
];

const devilBank = (p: Perspective) => [
  (u: string) => `Here's a challenge: what if "${extractPhrase(u)}" is comfortable precisely because it's convenient, not because it's true?`,
  () => `A sharp critic of ${p.name} would say: ${p.criticisms[0]} How would you answer them?`,
  (u: string) => `What is the strongest argument against "${extractPhrase(u)}" — not a weak version you can easily beat, the strongest one?`,
  () => `Suppose you're wrong about this. What would that cost you to admit — and is that cost affecting how open you are to being wrong?`,
  (u: string) => `Someone could say "${extractPhrase(u)}" just restates what you already wanted to believe. Is that fair?`,
];

const perspectiveBank = (p: Perspective) => [
  () => `How might someone raised in a tradition very different from ${p.tradition.toLowerCase()} thought approach this question?`,
  (u: string) => `A committed skeptic of all philosophy — someone who trusts only direct evidence — hears you say "${extractPhrase(u)}." What do they push back on?`,
  () => `${p.name}'s related traditions sometimes disagree sharply with it. If you stood in one of those, what would look different from here?`,
  (u: string) => `Imagine explaining "${extractPhrase(u)}" to someone from a culture with no concept of individual selfhood as central as many Western traditions assume. What would you need to translate?`,
  () => `What would a person a generation older, and a person a generation younger than you, each say differently about this?`,
];

const openers: Record<DialogueMode, (p: Perspective, question: string) => string> = {
  socratic: (p, q) =>
    `Let's slow down on "${q}". Before I share what ${p.name} says, I'm curious: what do you already believe, and why?`,
  scientist: (p, q) =>
    `We're going to look at "${q}" the way a compassionate scientist would — separating evidence, interpretation, belief, assumption, and the genuinely unknown. First: is there anything about this question that's empirically testable at all, or is it entirely a question of value and meaning?`,
  devil: (p, q) =>
    `I'll push back on you here, respectfully — not to win, but to pressure-test your thinking on "${q}". What's your current position, stated as plainly as you can?`,
  perspective: (p, q) =>
    `Let's widen the lens on "${q}" beyond ${p.name}. Who is a person very unlike you — in culture, era, or life experience — who might answer this completely differently?`,
};

const banks: Record<DialogueMode, (p: Perspective) => Array<(u: string) => string>> = {
  socratic: socraticBank,
  scientist: scientistBank,
  devil: devilBank,
  perspective: perspectiveBank,
};

export function openingMessage(mode: DialogueMode, p: Perspective, question: string): string {
  return openers[mode](p, question);
}

export function respond(
  mode: DialogueMode,
  perspective: Perspective,
  userText: string,
  turnIndex: number
): string {
  const bank = banks[mode](perspective);
  const fn = bank[turnIndex % bank.length];
  return fn(userText);
}

export const modeById = (id: DialogueMode) =>
  dialogueModes.find((m) => m.id === id)!;
