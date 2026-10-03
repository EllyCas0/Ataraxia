import { philosophers } from "./philosophers";
import { normalizeSearchText, searchTerms } from "./search";
import { getTradition } from "./traditions";
import type { CouncilMode, CouncilModeInfo, Philosopher, Question } from "./types";

// Local retrieval stand-in for the spec's Knowledge Layer + Retrieval System
// (section 19). It ranks structured philosopher records by weighted fields,
// then selects a diverse council from the strongest evidence.

export const councilModes: CouncilModeInfo[] = [
  { id: "compare", label: "Compare", hint: "See each thinker's lens side by side" },
  { id: "socratic", label: "Socratic", hint: "The council only asks you questions" },
  { id: "steelman", label: "Steelman", hint: "The strongest version of each position" },
  { id: "historical", label: "Historical", hint: "How the question evolved across centuries" },
];

const COUNCIL_SIZE = 5;
const STOP_WORDS = new Set([
  "about", "after", "again", "against", "being", "could", "does", "ever", "from", "have", "into", "make", "makes",
  "more", "must", "only", "rather", "same", "should", "than", "that", "their", "there", "thing", "this", "what",
  "when", "where", "which", "while", "with", "without", "would",
]);

interface RetrievalField {
  name: string;
  text: string;
  weight: number;
}

interface RetrievalCandidate {
  philosopher: Philosopher;
  score: number;
  matchedFields: string[];
  matchedTerms: string[];
}

function textOf(p: Philosopher): string {
  return [
    p.name,
    ...p.centralQuestions,
    ...p.keyConcepts.map((k) => `${k.term} ${k.definition}`),
    ...p.majorArguments,
    p.frame,
    ...p.primarySources,
    ...p.secondarySources,
  ]
    .join(" ")
    .toLowerCase();
}

function normalizedTokens(value: string): string[] {
  return searchTerms(normalizeSearchText(value))
    .map((term) => term.replace(/'s$/, ""))
    .map((term) => (term.length > 5 && term.endsWith("s") ? term.slice(0, -1) : term))
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term));
}

function questionNeedle(question: Question): string {
  return normalizeSearchText([question.text, ...question.tags, question.domain].join(" "));
}

function philosopherFields(p: Philosopher): RetrievalField[] {
  const traditionNames = p.traditions.map((id) => getTradition(id)?.name ?? id);
  return [
    { name: "name", text: p.name, weight: 9 },
    { name: "domain", text: p.domains.join(" "), weight: 8 },
    { name: "concepts", text: p.keyConcepts.map((concept) => `${concept.term} ${concept.definition}`).join(" "), weight: 7 },
    { name: "central questions", text: p.centralQuestions.join(" "), weight: 6 },
    { name: "major arguments", text: p.majorArguments.join(" "), weight: 5 },
    { name: "traditions", text: traditionNames.join(" "), weight: 4 },
    { name: "frame", text: p.frame, weight: 4 },
    { name: "sources", text: [...p.primarySources, ...p.secondarySources, ...p.majorWorks].join(" "), weight: 3 },
    { name: "context", text: `${p.context} ${p.relevance} ${p.criticisms.join(" ")}`, weight: 2 },
  ];
}

export function retrieveCouncilCandidates(question: Question): RetrievalCandidate[] {
  const queryText = questionNeedle(question);
  const queryTerms = [...new Set(normalizedTokens(queryText))];
  const queryPhrases = [question.text, ...question.tags]
    .map((phrase) => normalizeSearchText(phrase))
    .filter((phrase) => phrase.length > 3);

  return philosophers
    .map((philosopher) => {
      let score = philosopher.domains.includes(question.domain) ? 18 : 0;
      const matchedFields = new Set<string>();
      const matchedTerms = new Set<string>();

      for (const field of philosopherFields(philosopher)) {
        const fieldText = normalizeSearchText(field.text);

        for (const phrase of queryPhrases) {
          if (fieldText.includes(phrase)) {
            score += field.weight * 3;
            matchedFields.add(field.name);
            matchedTerms.add(phrase);
          }
        }

        for (const term of queryTerms) {
          if (fieldText.includes(term)) {
            score += field.weight;
            matchedFields.add(field.name);
            matchedTerms.add(term);
          }
        }
      }

      return {
        philosopher,
        score,
        matchedFields: [...matchedFields],
        matchedTerms: [...matchedTerms],
      };
    })
    .sort((a, b) => b.score - a.score || a.philosopher.name.localeCompare(b.philosopher.name));
}

export function matchPhilosophers(question: Question): Philosopher[] {
  const scored = retrieveCouncilCandidates(question);

  const picked: Philosopher[] = [];
  const seenTraditions = new Set<string>();

  for (const { philosopher } of scored) {
    if (picked.length >= COUNCIL_SIZE) break;
    const traditionOverlap = philosopher.traditions.filter((t) => seenTraditions.has(t)).length;
    const hasFreshTraditionLater = scored.some(({ philosopher: later }) =>
      !picked.includes(later) && later.traditions.some((t) => !seenTraditions.has(t))
    );
    if (traditionOverlap >= 2 && hasFreshTraditionLater) continue;
    picked.push(philosopher);
    philosopher.traditions.forEach((t) => seenTraditions.add(t));
  }
  for (const { philosopher } of scored) {
    if (picked.length >= COUNCIL_SIZE) break;
    if (!picked.includes(philosopher)) picked.push(philosopher);
  }

  return picked.slice(0, COUNCIL_SIZE);
}

function periodRank(period: string): number {
  const order = [
    "Ancient India", "Classical Antiquity", "Roman Imperial Period", "Classical India", "Classical China",
    "Late Antiquity", "Islamic Golden Age", "Medieval Europe", "Early Modern Europe", "Enlightenment", "German Idealism", "19th century",
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
