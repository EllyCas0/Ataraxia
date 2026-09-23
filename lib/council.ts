import { philosophers } from "./philosophers";
import { getTradition } from "./traditions";
import type { CouncilMode, CouncilModeInfo, Philosopher, Question } from "./types";

// Rule-based stand-in for the spec's Orchestrator + Debate Engine (section 19).
// `matchPhilosophers` and `speak` are the seams to swap for a real retrieval
// + LLM system later without touching any UI code.

export const councilModes: CouncilModeInfo[] = [
  { id: "compare", label: "Compare", hint: "See each thinker's lens side by side" },
  { id: "socratic", label: "Socratic", hint: "The council only asks you questions" },
  { id: "steelman", label: "Steelman", hint: "The strongest version of each position" },
  { id: "historical", label: "Historical", hint: "How the question evolved across centuries" },
];

const COUNCIL_SIZE = 5;

function textOf(p: Philosopher): string {
  return [
    p.name,
    ...p.centralQuestions,
    ...p.keyConcepts.map((k) => `${k.term} ${k.definition}`),
    ...p.majorArguments,
    p.frame,
  ]
    .join(" ")
    .toLowerCase();
}

export function matchPhilosophers(question: Question): Philosopher[] {
  const qTokens = [question.text, ...question.tags].join(" ").toLowerCase().split(/[^a-z]+/).filter((t) => t.length > 3);

  const scored = philosophers.map((p) => {
    let score = p.domains.includes(question.domain) ? 3 : 0;
    const haystack = textOf(p);
    for (const token of qTokens) {
      if (haystack.includes(token)) score += 1;
    }
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const picked: Philosopher[] = [];
  const seenTraditions = new Set<string>();

  // First pass: take the strongest matches, but skip a pick if we already
  // have two from the same tradition and a fresher tradition is available
  // later in the ranking — keeps the council genuinely cross-civilizational
  // rather than five variations on one school.
  for (const { p } of scored) {
    if (picked.length >= COUNCIL_SIZE) break;
    const traditionCount = p.traditions.filter((t) => seenTraditions.has(t)).length;
    if (traditionCount >= 2 && picked.length < scored.length - 1) continue;
    picked.push(p);
    p.traditions.forEach((t) => seenTraditions.add(t));
  }
  for (const { p } of scored) {
    if (picked.length >= COUNCIL_SIZE) break;
    if (!picked.includes(p)) picked.push(p);
  }

  return picked.slice(0, COUNCIL_SIZE);
}

function periodRank(period: string): number {
  const order = [
    "Ancient India", "Classical Antiquity", "Roman Imperial Period", "Classical India", "Classical China",
    "Islamic Golden Age", "Early Modern Europe", "Enlightenment", "German Idealism", "19th century",
    "20th century", "Contemporary",
  ];
  const i = order.indexOf(period);
  return i === -1 ? order.length : i;
}

export function speak(mode: CouncilMode, p: Philosopher, question: Question): string {
  switch (mode) {
    case "compare":
      return `${p.name} ${p.frame}.`;
    case "socratic":
      return `In ${p.name.split(" (")[0]}'s spirit: if it's true that ${lowerFirst(p.frame)}, what does that force you to ask about "${question.text}"?`;
    case "steelman": {
      const objection = p.criticisms[0];
      return `The strongest version of ${p.name.split(" (")[0]}'s position: this thinker ${p.frame}. A natural objection is that ${lowerFirst(objection)} — but the fuller version of the view treats that as a matter of degree and context, not a fatal flaw.`;
    }
    case "historical":
      return `${p.name} (${p.period}) ${p.frame}.`;
    default:
      return p.frame;
  }
}

export function historicalOrder(list: Philosopher[]): Philosopher[] {
  return [...list].sort((a, b) => periodRank(a.period) - periodRank(b.period));
}

function lowerFirst(s: string): string {
  return s.length ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

export function traditionLabel(p: Philosopher): string {
  return p.traditions.map((id) => getTradition(id)?.name).filter(Boolean).join(", ");
}

// Generates a single, honest "challenge" to a user's stated position: picks
// the council member whose lens most differs from the words the user used,
// and phrases it as a question rather than a verdict — per spec 3.4/3.5,
// challenge before critique, and let the user reach their own conclusion.
export function challenge(userPosition: string, pool: Philosopher[]): { philosopher: Philosopher; text: string } {
  const posLower = userPosition.toLowerCase();
  const scored = pool.map((p) => {
    const overlap = textOf(p).split(/\s+/).filter((w) => w.length > 4 && posLower.includes(w)).length;
    return { p, overlap };
  });
  // Prefer the LEAST textually-aligned voice — a genuine outside challenge,
  // not an echo of the user's own words.
  scored.sort((a, b) => a.overlap - b.overlap);
  const picked = scored[0]?.p ?? pool[0];
  const text = `${picked.name.split(" (")[0]} would push back here. This thinker ${picked.frame}. A pointed question in that spirit: what would you say to someone who accepted your conclusion, but rejected the assumption behind it?`;
  return { philosopher: picked, text };
}
