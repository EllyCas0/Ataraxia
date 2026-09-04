import { perspectives } from "./perspectives";
import type { Perspective } from "./types";

// A lightweight, transparent matching engine.
//
// This plays the role the spec calls the "Question Classifier" +
// "Philosophy Retrieval Agent": it reads a free-text question, infers which
// human concern(s) it touches, and surfaces 3-5 perspectives whose core
// questions and ideas most overlap with those concerns.
//
// It is intentionally rule-based rather than an LLM call, so the MVP has no
// external dependency — the interface (`matchQuestion`) is the seam where a
// real classifier/RAG agent (Feature 8 in the spec) can be dropped in later
// without touching any UI code.

interface Topic {
  id: string;
  keywords: string[];
  perspectives: string[]; // slugs, in rough priority order
  blurb: string; // short explanation of why these lenses apply
}

const topics: Topic[] = [
  {
    id: "free-will",
    keywords: ["free will", "determin", "choice", "choose", "fate", "destiny", "control my"],
    perspectives: ["existentialism", "stoicism", "neuroscience", "buddhism", "taoism"],
    blurb: "questions about freedom, choice, and what determines our actions",
  },
  {
    id: "self-identity",
    keywords: ["who am i", "myself", "identity", "self", "change as a person", "authentic"],
    perspectives: ["existentialism", "buddhism", "vedanta", "confucianism", "philosophy-of-mind"],
    blurb: "questions about the nature and boundaries of the self",
  },
  {
    id: "meaning-purpose",
    keywords: ["meaning", "purpose", "point of life", "worth living", "why are we here", "significance"],
    perspectives: ["existentialism", "stoicism", "buddhism", "aristotelianism", "utilitarianism"],
    blurb: "questions about meaning, purpose, and what makes a life worth living",
  },
  {
    id: "suffering-happiness",
    keywords: ["suffer", "happ", "pain", "joy", "content", "fulfil", "flourish"],
    perspectives: ["buddhism", "stoicism", "aristotelianism", "utilitarianism", "evolutionary-psychology"],
    blurb: "questions about suffering, happiness, and human flourishing",
  },
  {
    id: "love-relationships",
    keywords: ["love", "attachment", "partner", "relationship", "romance", "marriage"],
    perspectives: ["buddhism", "existentialism", "aristotelianism", "confucianism", "evolutionary-psychology"],
    blurb: "questions about love, attachment, and what we owe each other in relationship",
  },
  {
    id: "death-mortality",
    keywords: ["death", "mortal", "die", "dying", "afterlife", "grief", "loss"],
    perspectives: ["stoicism", "existentialism", "buddhism", "vedanta", "aristotelianism"],
    blurb: "questions about mortality and how facing death shapes how we live",
  },
  {
    id: "ethics-morality",
    keywords: ["moral", "ethic", "right and wrong", "good action", "evil", "virtue", "should i"],
    perspectives: ["utilitarianism", "aristotelianism", "confucianism", "stoicism", "existentialism"],
    blurb: "questions about what makes an action right, and how we should live",
  },
  {
    id: "justice-society",
    keywords: ["justice", "society", "equal", "fair", "owe each other", "community", "politic", "rights"],
    perspectives: ["utilitarianism", "aristotelianism", "confucianism", "feminist-philosophy", "environmental-philosophy"],
    blurb: "questions about justice, fairness, and our obligations to one another",
  },
  {
    id: "knowledge-truth",
    keywords: ["know", "truth", "certain", "belief", "evidence", "real", "reality", "objective"],
    perspectives: ["pragmatism", "platonism", "vedanta", "neuroscience", "philosophy-of-mind"],
    blurb: "questions about knowledge, truth, and how we tell reality from belief",
  },
  {
    id: "technology-ai",
    keywords: ["ai", "artificial intelligence", "machine", "robot", "conscious", "technology", "computer"],
    perspectives: ["philosophy-of-mind", "neuroscience", "utilitarianism", "environmental-philosophy", "existentialism"],
    blurb: "questions about consciousness, technology, and what we owe intelligent machines",
  },
  {
    id: "nature-environment",
    keywords: ["nature", "environment", "climate", "animal", "planet", "earth"],
    perspectives: ["environmental-philosophy", "taoism", "utilitarianism", "vedanta", "confucianism"],
    blurb: "questions about our relationship to nature and the non-human world",
  },
];

function normalize(s: string) {
  return s.toLowerCase();
}

export interface MatchResult {
  perspectives: Perspective[];
  matchedTopics: Topic[];
  blurb: string;
}

export function matchQuestion(question: string): MatchResult {
  const q = normalize(question);
  const scores = new Map<string, number>();
  const matchedTopics: Topic[] = [];

  for (const topic of topics) {
    const hit = topic.keywords.some((kw) => q.includes(kw));
    if (hit) {
      matchedTopics.push(topic);
      topic.perspectives.forEach((slug, i) => {
        const weight = topic.perspectives.length - i; // earlier = stronger
        scores.set(slug, (scores.get(slug) ?? 0) + weight);
      });
    }
  }

  // Fallback: score by loose overlap with each perspective's own text if no
  // topic matched (keeps the app useful for open-ended, unanticipated
  // questions rather than failing silently).
  if (scores.size === 0) {
    const tokens = q.split(/[^a-z]+/).filter((t) => t.length > 3);
    for (const p of perspectives) {
      const haystack = normalize(
        [p.coreQuestion, p.coreIdea, ...p.centralIdeas].join(" ")
      );
      const hits = tokens.filter((t) => haystack.includes(t)).length;
      if (hits > 0) scores.set(p.slug, hits);
    }
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const topSlugs =
    ranked.length > 0
      ? ranked.slice(0, 5).map(([slug]) => slug)
      : // Ultimate fallback: a broad, diverse default spread so the app
        // never returns nothing.
        ["existentialism", "stoicism", "buddhism", "aristotelianism", "utilitarianism"];

  const matched = topSlugs
    .map((slug) => perspectives.find((p) => p.slug === slug))
    .filter((p): p is Perspective => Boolean(p));

  const blurb =
    matchedTopics.length > 0
      ? `Your question touches on ${matchedTopics.map((t) => t.blurb).join("; and ")}.`
      : "Your question doesn't map neatly onto one familiar theme — here is a diverse spread of traditions to open it up from several angles.";

  return { perspectives: matched, matchedTopics, blurb };
}
