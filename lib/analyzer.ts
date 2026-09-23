import { philosophers } from "./philosophers";
import type { AnalyzerFlag, AnalyzerResult, Philosopher } from "./types";

// The spec's "Argument Analyzer" (module D), built as transparent pattern
// matching rather than a real NLP/LLM pipeline — see README for the tradeoff.
// It flags patterns worth a second look; it does not adjudicate whether an
// argument is actually good or bad. `analyze` is the seam to swap for a real
// reasoning-layer model later.

const ABSOLUTE_WORDS = ["always", "never", "everyone", "no one", "nobody", "everybody", "all people", "every single", "impossible", "undeniable", "obviously", "clearly", "completely", "totally", "entirely"];
const HEDGE_WORDS = ["might", "may", "could", "perhaps", "possibly", "seems", "arguably", "i think", "in my opinion", "it's possible", "likely", "suggests"];
const EVIDENCE_WORDS = ["because", "since", "data", "study", "studies", "research", "evidence", "according to", "statistics", "survey", "found that", "percent", "%"];
const RHETORIC_WORDS = ["disaster", "crisis", "outrage", "shocking", "terrifying", "destroying", "evil", "corrupt", "elites", "wake up", "everyone knows", "no reasonable person", "radical", "extremist"];
const DICHOTOMY_PHRASES = ["either you", "either we", "there are only two", "you're either"];

const VALUE_GROUPS: { label: string; words: string[] }[] = [
  { label: "Individual liberty", words: ["freedom", "liberty", "autonomy", "choice", "individual rights"] },
  { label: "Equality / fairness", words: ["equal", "equality", "fair", "fairness", "justice", "unjust"] },
  { label: "Safety / order", words: ["safe", "safety", "security", "protect", "order", "stability"] },
  { label: "Tradition / community", words: ["tradition", "family", "community", "heritage", "culture", "values"] },
  { label: "Efficiency / progress", words: ["efficient", "efficiency", "growth", "progress", "innovation", "productivity"] },
  { label: "Care / harm reduction", words: ["care", "compassion", "harm", "suffering", "vulnerable", "wellbeing"] },
];

function findMatches(text: string, words: string[]): string[] {
  const lower = text.toLowerCase();
  return words.filter((w) => lower.includes(w));
}

function splitSentences(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function textOf(p: Philosopher): string {
  return [p.name, ...p.centralQuestions, ...p.keyConcepts.map((k) => `${k.term} ${k.definition}`), ...p.majorArguments, p.frame]
    .join(" ")
    .toLowerCase();
}

function relatedPhilosophers(text: string): Philosopher[] {
  const tokens = text.toLowerCase().split(/[^a-z]+/).filter((t) => t.length > 4);
  const scored = philosophers.map((p) => {
    const haystack = textOf(p);
    const score = tokens.filter((t) => haystack.includes(t)).length;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.p);
}

export function analyze(text: string): AnalyzerResult {
  const sentences = splitSentences(text);
  const claim = sentences[0] || text.trim();

  const evidenceMatches = findMatches(text, EVIDENCE_WORDS);
  const evidenceFlags: AnalyzerFlag[] =
    evidenceMatches.length > 0
      ? [{ label: "Evidence indicators found", detail: "The text points to something beyond assertion — worth checking whether it actually supports the claim.", matches: evidenceMatches }]
      : [{ label: "No evidence indicators found", detail: "This reads as an assertion without a stated basis. That doesn't make it false — but it means the claim currently rests on the author's word alone.", matches: [] }];

  const absoluteMatches = findMatches(text, ABSOLUTE_WORDS);
  const dichotomyMatches = findMatches(text, DICHOTOMY_PHRASES);
  const logicFlags: AnalyzerFlag[] = [];
  if (absoluteMatches.length > 0) {
    logicFlags.push({ label: "Absolute language", detail: "Words like these leave no room for exceptions — worth asking whether the claim really holds in every case.", matches: absoluteMatches });
  }
  if (dichotomyMatches.length > 0) {
    logicFlags.push({ label: "Possible false dichotomy", detail: "This frames the choice as only two options — worth checking whether a third option was left out.", matches: dichotomyMatches });
  }
  if (logicFlags.length === 0) {
    logicFlags.push({ label: "No obvious logical red flags detected", detail: "This is a shallow pattern scan, not a full logical audit — absence of a flag isn't proof the reasoning is sound.", matches: [] });
  }

  const rhetoricMatches = findMatches(text, RHETORIC_WORDS);
  const rhetoricFlags: AnalyzerFlag[] =
    rhetoricMatches.length > 0
      ? [{ label: "Charged or urgent language", detail: "Emotionally loaded words can be accurate — but they also work to bypass scrutiny. Worth separating the feeling from the claim.", matches: rhetoricMatches }]
      : [{ label: "Measured tone", detail: "No strongly charged language detected.", matches: [] }];

  const valueFlags: AnalyzerFlag[] = VALUE_GROUPS.map((g) => ({ label: g.label, detail: `Language associated with ${g.label.toLowerCase()} appears in the text.`, matches: findMatches(text, g.words) })).filter((f) => f.matches.length > 0);

  const hedgeMatches = findMatches(text, HEDGE_WORDS);
  const uncertaintyFlags: AnalyzerFlag[] = [];
  if (hedgeMatches.length > 0) {
    uncertaintyFlags.push({ label: "Hedged claims present", detail: "The author signals some claims aren't fully certain — a sign of epistemic honesty worth noting.", matches: hedgeMatches });
  }
  if (absoluteMatches.length > 0 && hedgeMatches.length === 0) {
    uncertaintyFlags.push({ label: "High confidence, no hedging", detail: "Strong claims with no acknowledged uncertainty. Ask: what evidence would change the author's mind?", matches: [] });
  }
  if (uncertaintyFlags.length === 0) {
    uncertaintyFlags.push({ label: "Mixed confidence", detail: "No strong pattern of overconfidence or hedging detected.", matches: [] });
  }

  return {
    claim,
    evidenceFlags,
    logicFlags,
    rhetoricFlags,
    valueFlags,
    uncertaintyFlags,
    relatedPhilosophers: relatedPhilosophers(text),
  };
}
