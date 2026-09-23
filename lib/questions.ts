import type { Domain, Question } from "./types";

export const questions: Question[] = [
  { slug: "meaningful-life", text: "What makes a life meaningful?", domain: "ethics", tags: ["meaning", "purpose", "flourishing"], difficulty: "intro" },
  { slug: "freedom-responsibility", text: "Is freedom possible without responsibility?", domain: "ethics", tags: ["freedom", "responsibility", "autonomy"], difficulty: "intermediate" },
  { slug: "morality-religion", text: "Does morality require religion?", domain: "philosophy-of-religion", tags: ["morality", "religion", "secular ethics"], difficulty: "intro" },
  { slug: "democracy-misinformation", text: "Can democracy survive widespread misinformation?", domain: "political-philosophy", tags: ["democracy", "truth", "media"], difficulty: "intermediate" },
  { slug: "consciousness-matter", text: "Is consciousness reducible to matter?", domain: "philosophy-of-mind", tags: ["consciousness", "physicalism", "mind"], difficulty: "advanced" },
  { slug: "future-generations", text: "What do we owe future generations?", domain: "ethics", tags: ["future", "obligation", "environment"], difficulty: "intermediate" },
  { slug: "ai-creativity", text: "Can artificial intelligence be genuinely creative?", domain: "aesthetics", tags: ["ai", "creativity", "art"], difficulty: "intermediate" },
  { slug: "inequality-unjust", text: "Is inequality inherently unjust?", domain: "political-philosophy", tags: ["inequality", "justice", "economics"], difficulty: "intermediate" },
  { slug: "technology-freedom", text: "Does technological progress make humans freer?", domain: "political-philosophy", tags: ["technology", "progress", "freedom"], difficulty: "intermediate" },
  { slug: "political-legitimacy", text: "What makes political authority legitimate?", domain: "political-philosophy", tags: ["authority", "legitimacy", "consent"], difficulty: "intermediate" },
  { slug: "free-society-equality", text: "Can a society be free without being economically equal?", domain: "political-philosophy", tags: ["freedom", "equality", "economics"], difficulty: "advanced" },
  { slug: "what-is-freedom", text: "What is freedom?", domain: "ethics", tags: ["freedom", "autonomy"], difficulty: "intro" },
  { slug: "free-will", text: "Do we have free will?", domain: "metaphysics", tags: ["free will", "determinism", "choice"], difficulty: "advanced" },
  { slug: "what-is-justice", text: "What is justice?", domain: "political-philosophy", tags: ["justice", "fairness"], difficulty: "intro" },
  { slug: "what-is-the-self", text: "What is the self?", domain: "metaphysics", tags: ["self", "identity"], difficulty: "intermediate" },
  { slug: "certain-knowledge", text: "Can we know anything with certainty?", domain: "epistemology", tags: ["certainty", "doubt", "knowledge"], difficulty: "advanced" },
  { slug: "objective-truth", text: "Is there such a thing as objective truth?", domain: "epistemology", tags: ["truth", "objectivity", "relativism"], difficulty: "advanced" },
  { slug: "human-nature", text: "Is human nature fixed, or shaped by society?", domain: "metaphysics", tags: ["human nature", "society", "identity"], difficulty: "intermediate" },
  { slug: "punishment", text: "What justifies punishing someone for a crime?", domain: "ethics", tags: ["punishment", "justice", "crime"], difficulty: "intermediate" },
  { slug: "violence-justified", text: "Can violence ever be morally justified?", domain: "ethics", tags: ["violence", "morality", "conflict"], difficulty: "advanced" },
  { slug: "history-direction", text: "Does history move in a direction?", domain: "philosophy-of-history", tags: ["history", "progress"], difficulty: "advanced" },
  { slug: "owe-strangers", text: "What do we owe strangers?", domain: "ethics", tags: ["obligation", "strangers", "community"], difficulty: "intro" },
  { slug: "beauty-objective", text: "Is beauty objective or subjective?", domain: "aesthetics", tags: ["beauty", "art", "taste"], difficulty: "intro" },
  { slug: "machines-think", text: "Can machines think?", domain: "philosophy-of-mind", tags: ["ai", "mind", "consciousness"], difficulty: "intermediate" },
  { slug: "good-life", text: "What is the good life?", domain: "ethics", tags: ["good life", "flourishing", "virtue"], difficulty: "intro" },
  { slug: "liberty-vs-welfare", text: "Should individual liberty ever yield to collective welfare?", domain: "political-philosophy", tags: ["liberty", "welfare", "collective"], difficulty: "intermediate" },
  { slug: "suffering-meaningful", text: "Is suffering meaningful?", domain: "philosophy-of-religion", tags: ["suffering", "meaning", "religion"], difficulty: "intermediate" },
  { slug: "individual-state", text: "What is the relationship between the individual and the state?", domain: "political-philosophy", tags: ["individual", "state", "authority"], difficulty: "intermediate" },
  { slug: "tradition-progress", text: "Can tradition and progress coexist?", domain: "philosophy-of-history", tags: ["tradition", "progress", "change"], difficulty: "intro" },
  { slug: "rational-argument", text: "What makes an argument rational rather than merely persuasive?", domain: "epistemology", tags: ["rhetoric", "logic", "persuasion"], difficulty: "intermediate" },
];

// Deterministic per-day pick — no backend needed for a "daily question".
export function todaysQuestion(date: Date = new Date()): Question {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return questions[dayOfYear % questions.length];
}

export function getQuestion(slug: string): Question | undefined {
  return questions.find((q) => q.slug === slug);
}

const DOMAIN_HINTS: [Domain, string[]][] = [
  ["philosophy-of-mind", ["conscious", "mind", "ai ", "artificial intelligence", "robot", "machine", "think"]],
  ["epistemology", ["know", "truth", "certain", "belief", "evidence", "objective", "rational", "argument"]],
  ["metaphysics", ["real", "exist", "self", "identity", "will", "matter", "cause", "time"]],
  ["political-philosophy", ["state", "government", "law", "rights", "justice", "democra", "society", "politic", "author"]],
  ["aesthetics", ["beauty", "art", "creativ", "aesthetic"]],
  ["philosophy-of-religion", ["god", "religio", "faith", "sacred", "divine"]],
  ["philosophy-of-history", ["history", "progress", "civiliz", "tradition"]],
];

function inferDomain(text: string): Domain {
  const lower = ` ${text.toLowerCase()} `;
  for (const [domain, keywords] of DOMAIN_HINTS) {
    if (keywords.some((k) => lower.includes(k))) return domain;
  }
  return "ethics";
}

// A user-typed question isn't in the curated library, so we shape it like
// one, guessing a domain from simple keyword hints — otherwise every custom
// question would default to one domain and skew the council toward it.
export function questionFromText(text: string): Question {
  return {
    slug: "custom",
    text: text.trim(),
    domain: inferDomain(text),
    tags: text.toLowerCase().split(/[^a-z]+/).filter((t) => t.length > 3),
    difficulty: "intermediate",
  };
}
