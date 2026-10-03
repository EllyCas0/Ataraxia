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
  { slug: "death-fear", text: "Should death be feared?", domain: "ethics", tags: ["death", "fear", "mortality"], difficulty: "intro" },
  { slug: "pleasure-happiness", text: "Is pleasure the same as happiness?", domain: "ethics", tags: ["pleasure", "happiness", "desire"], difficulty: "intro" },
  { slug: "desire-train", text: "Can we train our desires?", domain: "ethics", tags: ["desire", "discipline", "habit"], difficulty: "intermediate" },
  { slug: "friendship-good-life", text: "How important is friendship to the good life?", domain: "ethics", tags: ["friendship", "flourishing", "community"], difficulty: "intro" },
  { slug: "evil-exists", text: "Why does evil exist?", domain: "philosophy-of-religion", tags: ["evil", "suffering", "god"], difficulty: "advanced" },
  { slug: "faith-reason", text: "Can faith and reason genuinely cooperate?", domain: "philosophy-of-religion", tags: ["faith", "reason", "revelation"], difficulty: "intermediate" },
  { slug: "religious-language", text: "Can human language describe the divine?", domain: "philosophy-of-religion", tags: ["language", "god", "divine"], difficulty: "advanced" },
  { slug: "miracles-causation", text: "Do miracles violate nature or reveal a deeper account of causation?", domain: "philosophy-of-religion", tags: ["miracles", "causation", "nature"], difficulty: "advanced" },
  { slug: "interpret-scripture", text: "When should sacred texts be interpreted figuratively?", domain: "philosophy-of-religion", tags: ["scripture", "interpretation", "reason"], difficulty: "intermediate" },
  { slug: "human-nature-good", text: "Are people naturally good?", domain: "ethics", tags: ["human nature", "goodness", "cultivation"], difficulty: "intro" },
  { slug: "human-nature-bad", text: "Are people naturally selfish?", domain: "ethics", tags: ["human nature", "selfishness", "discipline"], difficulty: "intro" },
  { slug: "ritual-morality", text: "Can rituals make people morally better?", domain: "ethics", tags: ["ritual", "habit", "virtue"], difficulty: "intermediate" },
  { slug: "impartial-care", text: "Should we care equally about everyone?", domain: "ethics", tags: ["impartiality", "care", "obligation"], difficulty: "advanced" },
  { slug: "family-partiality", text: "Is it morally acceptable to favor family and friends?", domain: "ethics", tags: ["family", "partiality", "loyalty"], difficulty: "intermediate" },
  { slug: "war-ever-just", text: "Can war ever be just?", domain: "political-philosophy", tags: ["war", "justice", "violence"], difficulty: "advanced" },
  { slug: "pacifism-realistic", text: "Is pacifism morally required or politically naive?", domain: "ethics", tags: ["pacifism", "violence", "realism"], difficulty: "advanced" },
  { slug: "useful-useless", text: "Can uselessness be valuable?", domain: "aesthetics", tags: ["usefulness", "value", "daoism"], difficulty: "intermediate" },
  { slug: "categories-fluid", text: "Are our categories discoveries or inventions?", domain: "metaphysics", tags: ["categories", "classification", "reality"], difficulty: "advanced" },
  { slug: "language-meaning", text: "Does meaning come from use?", domain: "epistemology", tags: ["language", "meaning", "use"], difficulty: "intermediate" },
  { slug: "private-experience", text: "Can an entirely private experience have public meaning?", domain: "philosophy-of-mind", tags: ["experience", "language", "privacy"], difficulty: "advanced" },
  { slug: "concepts-family", text: "Do concepts need strict definitions?", domain: "epistemology", tags: ["concepts", "definition", "meaning"], difficulty: "intermediate" },
  { slug: "education-liberation", text: "Can education be a practice of freedom?", domain: "political-philosophy", tags: ["education", "freedom", "liberation"], difficulty: "intro" },
  { slug: "indoctrination-education", text: "Where is the line between education and indoctrination?", domain: "epistemology", tags: ["education", "indoctrination", "authority"], difficulty: "intermediate" },
  { slug: "expertise-democracy", text: "How should democracies balance expertise and popular judgment?", domain: "political-philosophy", tags: ["expertise", "democracy", "knowledge"], difficulty: "advanced" },
  { slug: "public-reason", text: "What reasons should count in public debate?", domain: "political-philosophy", tags: ["public reason", "debate", "democracy"], difficulty: "intermediate" },
  { slug: "deliberation-polarization", text: "Can deliberation survive polarization?", domain: "political-philosophy", tags: ["deliberation", "polarization", "public sphere"], difficulty: "intermediate" },
  { slug: "truth-politics", text: "Why does truth matter in politics?", domain: "political-philosophy", tags: ["truth", "politics", "lying"], difficulty: "intro" },
  { slug: "surveillance-freedom", text: "How does surveillance change freedom?", domain: "political-philosophy", tags: ["surveillance", "discipline", "freedom"], difficulty: "intermediate" },
  { slug: "prisons-justice", text: "Do prisons deliver justice?", domain: "political-philosophy", tags: ["prisons", "punishment", "justice"], difficulty: "intermediate" },
  { slug: "abolition-alternatives", text: "What would justice require if punishment were not the default response to harm?", domain: "political-philosophy", tags: ["abolition", "punishment", "repair"], difficulty: "advanced" },
  { slug: "property-rights", text: "What justifies private property?", domain: "political-philosophy", tags: ["property", "rights", "ownership"], difficulty: "intermediate" },
  { slug: "taxation-freedom", text: "Is taxation a violation of freedom or a condition of justice?", domain: "political-philosophy", tags: ["taxation", "freedom", "justice"], difficulty: "advanced" },
  { slug: "redistribution-fair", text: "When is redistribution fair?", domain: "political-philosophy", tags: ["redistribution", "fairness", "equality"], difficulty: "intermediate" },
  { slug: "capabilities-justice", text: "Should justice be measured by capabilities rather than resources?", domain: "political-philosophy", tags: ["capabilities", "resources", "development"], difficulty: "advanced" },
  { slug: "poverty-duty", text: "How much must the affluent do to reduce extreme poverty?", domain: "ethics", tags: ["poverty", "altruism", "obligation"], difficulty: "advanced" },
  { slug: "animal-moral-status", text: "Do animals have equal moral status?", domain: "ethics", tags: ["animals", "moral status", "suffering"], difficulty: "intermediate" },
  { slug: "speciesism", text: "Is species membership morally relevant?", domain: "ethics", tags: ["speciesism", "animals", "equality"], difficulty: "advanced" },
  { slug: "experience-machine", text: "Would a perfectly pleasant simulation be enough for a good life?", domain: "ethics", tags: ["simulation", "pleasure", "reality"], difficulty: "intermediate" },
  { slug: "authenticity-social-roles", text: "Can authenticity exist inside social roles?", domain: "ethics", tags: ["authenticity", "roles", "identity"], difficulty: "intermediate" },
  { slug: "gender-constructed", text: "Is gender socially constructed?", domain: "metaphysics", tags: ["gender", "social construction", "identity"], difficulty: "intermediate" },
  { slug: "race-social-reality", text: "Can race be socially real without being biological?", domain: "metaphysics", tags: ["race", "social reality", "biology"], difficulty: "advanced" },
  { slug: "identity-recognition", text: "How much does identity depend on recognition by others?", domain: "philosophy-of-mind", tags: ["identity", "recognition", "self"], difficulty: "intermediate" },
  { slug: "oppression-knowledge", text: "Can oppression distort what a society knows?", domain: "epistemology", tags: ["oppression", "knowledge", "ideology"], difficulty: "intermediate" },
  { slug: "double-consciousness", text: "Can a divided self-understanding reveal social truth?", domain: "epistemology", tags: ["double consciousness", "race", "self"], difficulty: "advanced" },
  { slug: "colonialism-psyche", text: "How does colonialism shape the inner life?", domain: "philosophy-of-mind", tags: ["colonialism", "psyche", "alienation"], difficulty: "advanced" },
  { slug: "decolonization", text: "What would genuine decolonization require?", domain: "political-philosophy", tags: ["decolonization", "liberation", "empire"], difficulty: "advanced" },
  { slug: "reconciliation-justice", text: "Can reconciliation happen without justice?", domain: "political-philosophy", tags: ["reconciliation", "justice", "forgiveness"], difficulty: "intermediate" },
  { slug: "forgiveness-politics", text: "What role should forgiveness play in politics?", domain: "ethics", tags: ["forgiveness", "politics", "harm"], difficulty: "intermediate" },
  { slug: "memory-democracy", text: "What does a democracy owe to historical memory?", domain: "philosophy-of-history", tags: ["memory", "democracy", "history"], difficulty: "intermediate" },
  { slug: "progress-myth", text: "Is belief in progress a myth?", domain: "philosophy-of-history", tags: ["progress", "myth", "history"], difficulty: "advanced" },
  { slug: "civilization-decline", text: "What does it mean for a civilization to decline?", domain: "philosophy-of-history", tags: ["civilization", "decline", "history"], difficulty: "advanced" },
  { slug: "revolution-justified", text: "When is revolution justified?", domain: "political-philosophy", tags: ["revolution", "justice", "violence"], difficulty: "advanced" },
  { slug: "law-morality", text: "Must an unjust law be obeyed?", domain: "political-philosophy", tags: ["law", "obedience", "justice"], difficulty: "intermediate" },
  { slug: "civil-disobedience", text: "When is civil disobedience morally required?", domain: "political-philosophy", tags: ["civil disobedience", "law", "conscience"], difficulty: "intermediate" },
  { slug: "rights-universal", text: "Are human rights universal?", domain: "political-philosophy", tags: ["rights", "universalism", "culture"], difficulty: "advanced" },
  { slug: "culture-criticism", text: "Can we criticize another culture without arrogance?", domain: "ethics", tags: ["culture", "criticism", "relativism"], difficulty: "intermediate" },
  { slug: "world-traveling", text: "What does it take to understand another person's world?", domain: "epistemology", tags: ["understanding", "perspective", "worlds"], difficulty: "intermediate" },
  { slug: "love-political", text: "Can love be a political virtue?", domain: "ethics", tags: ["love", "politics", "care"], difficulty: "intro" },
  { slug: "care-justice", text: "Is care as important as justice?", domain: "ethics", tags: ["care", "justice", "relationships"], difficulty: "intermediate" },
  { slug: "emotions-rational", text: "Can emotions be rational?", domain: "philosophy-of-mind", tags: ["emotions", "reason", "judgment"], difficulty: "intermediate" },
  { slug: "literature-ethics", text: "Can literature make us ethically wiser?", domain: "aesthetics", tags: ["literature", "ethics", "imagination"], difficulty: "intro" },
  { slug: "art-truth", text: "Can art tell the truth?", domain: "aesthetics", tags: ["art", "truth", "representation"], difficulty: "intermediate" },
  { slug: "beauty-politics", text: "Is beauty politically important?", domain: "aesthetics", tags: ["beauty", "politics", "public life"], difficulty: "intermediate" },
  { slug: "ai-personhood", text: "Could an AI ever be a person?", domain: "philosophy-of-mind", tags: ["ai", "personhood", "mind"], difficulty: "advanced" },
  { slug: "ai-moral-patients", text: "Could artificial systems deserve moral consideration?", domain: "ethics", tags: ["ai", "moral status", "technology"], difficulty: "advanced" },
  { slug: "memory-self", text: "Does memory make the self?", domain: "metaphysics", tags: ["memory", "self", "identity"], difficulty: "intermediate" },
  { slug: "body-self", text: "Is the body essential to personal identity?", domain: "philosophy-of-mind", tags: ["body", "self", "identity"], difficulty: "intermediate" },
  { slug: "time-real", text: "Is time real or a feature of experience?", domain: "metaphysics", tags: ["time", "reality", "experience"], difficulty: "advanced" },
  { slug: "nothingness", text: "Why is there something rather than nothing?", domain: "metaphysics", tags: ["existence", "nothingness", "being"], difficulty: "advanced" },
  { slug: "nature-purpose", text: "Does nature have purposes?", domain: "metaphysics", tags: ["nature", "purpose", "teleology"], difficulty: "advanced" },
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
