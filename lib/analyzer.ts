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
const CONCLUSION_MARKERS = ["therefore", "so ", "thus", "hence", "as a result", "for this reason", "we should", "we must", "should", "must", "needs to", "need to"];
const PREMISE_MARKERS = ["because", "since", "given that", "as shown by", "according to", "research", "data", "study", "studies", "evidence", "survey", "found that"];
const CURRENT_CLAIM_MARKERS = ["today", "currently", "now", "this year", "recent", "recently", "new study", "latest", "poll", "election", "inflation", "unemployment", "crime rate", "climate", "ai", "artificial intelligence", "vaccine", "war", "court", "law", "policy"];
const NUMERIC_CLAIM_PATTERN = /\b\d+(?:\.\d+)?\s?(?:%|percent|million|billion|trillion|x|times)\b/i;

const FALLACY_PATTERNS: { label: string; detail: string; words: string[] }[] = [
  {
    label: "Possible ad hominem",
    detail: "The argument attacks a person or group rather than showing why the claim itself is false.",
    words: ["idiot", "stupid", "moron", "corrupt", "evil", "traitor", "brainwashed"],
  },
  {
    label: "Possible appeal to popularity",
    detail: "Popularity can be relevant evidence in some contexts, but it is not enough by itself to prove that a claim is true.",
    words: ["everyone knows", "most people agree", "everybody knows", "no one believes"],
  },
  {
    label: "Possible slippery slope",
    detail: "The text predicts a chain of consequences. Ask whether each step in that chain is actually supported.",
    words: ["will inevitably lead", "next thing you know", "slippery slope", "if we allow this", "this will lead to"],
  },
  {
    label: "Possible hasty generalization",
    detail: "The argument may be moving from a limited case to a broad conclusion too quickly.",
    words: ["all", "always", "never", "everyone", "no one", "everybody"],
  },
  {
    label: "Possible causal leap",
    detail: "The text suggests one thing caused another. Ask whether it rules out alternative causes or mere correlation.",
    words: ["caused", "proves that", "because of this", "the reason is", "led to"],
  },
];

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

function cleanMarkerStart(sentence: string): string {
  return sentence.replace(/^(therefore|thus|hence|so|as a result|for this reason)[,\s]+/i, "").trim();
}

function includesAny(text: string, markers: string[]): boolean {
  const lower = text.toLowerCase();
  return markers.some((marker) => lower.includes(marker));
}

function extractConclusion(sentences: string[]): string {
  const marked = sentences.find((sentence) => includesAny(sentence, CONCLUSION_MARKERS));
  return cleanMarkerStart(marked ?? sentences[0] ?? "");
}

function extractPremises(sentences: string[], conclusion: string): string[] {
  const premiseSentences = sentences
    .filter((sentence) => sentence !== conclusion)
    .filter((sentence) => includesAny(sentence, PREMISE_MARKERS));

  const becauseClauses = sentences.flatMap((sentence) => {
    const match = sentence.match(/\b(?:because|since|given that)\b\s+(.+)/i);
    return match?.[1] ? [match[1].trim()] : [];
  });

  return [...new Set([...premiseSentences, ...becauseClauses])].slice(0, 4);
}

function buildFallacyFlags(text: string, absoluteMatches: string[], dichotomyMatches: string[]): AnalyzerFlag[] {
  const flags: AnalyzerFlag[] = [];
  if (dichotomyMatches.length > 0) {
    flags.push({
      label: "Possible false dichotomy",
      detail: "The text frames the choice as only two options. Ask whether a third option or mixed position was left out.",
      matches: dichotomyMatches,
    });
  }

  for (const pattern of FALLACY_PATTERNS) {
    const matches = findMatches(text, pattern.words);
    if (matches.length > 0) {
      flags.push({ label: pattern.label, detail: pattern.detail, matches });
    }
  }

  if (absoluteMatches.length > 0 && !flags.some((flag) => flag.label === "Possible hasty generalization")) {
    flags.push({
      label: "Possible hasty generalization",
      detail: "Absolute wording can overextend a claim beyond the evidence supplied.",
      matches: absoluteMatches,
    });
  }

  return flags.length > 0
    ? flags
    : [{ label: "No named fallacy pattern detected", detail: "No common pattern was obvious from this scan. That is not proof the reasoning is sound.", matches: [] }];
}

function buildMissingEvidenceQuestions(claim: string, premises: string[], evidenceMatches: string[], factMatches: string[]): string[] {
  const questions = [
    `What evidence would most directly support or weaken this claim: "${claim}"?`,
  ];

  if (premises.length === 0) {
    questions.push("What premise has to be true for the conclusion to follow?");
  }
  if (evidenceMatches.length === 0) {
    questions.push("What source, example, or data would move this beyond assertion?");
  }
  if (factMatches.length > 0) {
    questions.push("Which primary source or current dataset would verify the time-sensitive factual claim?");
  }

  return questions.slice(0, 4);
}

function buildFactCheckFlags(text: string): AnalyzerFlag[] {
  const markerMatches = findMatches(text, CURRENT_CLAIM_MARKERS);
  const numericMatches = text.match(NUMERIC_CLAIM_PATTERN) ?? [];
  const matches = [...new Set([...markerMatches, ...numericMatches])];

  if (matches.length === 0) {
    return [{
      label: "No obvious current factual claim",
      detail: "This scan did not find dates, live statistics, or current-event language that would demand source retrieval.",
      matches: [],
    }];
  }

  return [{
    label: "Current or empirical claim needs verification",
    detail: "For claims like this, check primary documents, government or academic data, reputable reporting, or transparent fact-checkers before treating the point as settled.",
    matches,
  }];
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
  const conclusion = extractConclusion(sentences) || claim;
  const premises = extractPremises(sentences, conclusion);

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
  if (premises.length === 0) {
    logicFlags.push({ label: "Unstated premise", detail: "The conclusion may rely on a premise the text does not explicitly defend.", matches: [] });
  }
  if (logicFlags.length === 0) {
    logicFlags.push({ label: "No obvious logical red flags detected", detail: "This is a shallow pattern scan, not a full logical audit — absence of a flag isn't proof the reasoning is sound.", matches: [] });
  }

  const fallacyFlags = buildFallacyFlags(text, absoluteMatches, dichotomyMatches);

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

  const factCheckFlags = buildFactCheckFlags(text);

  return {
    claim,
    conclusion,
    premises,
    evidenceFlags,
    logicFlags,
    fallacyFlags,
    rhetoricFlags,
    valueFlags,
    uncertaintyFlags,
    missingEvidenceQuestions: buildMissingEvidenceQuestions(claim, premises, evidenceMatches, factCheckFlags[0]?.matches ?? []),
    factCheckFlags,
    relatedPhilosophers: relatedPhilosophers(text),
  };
}
