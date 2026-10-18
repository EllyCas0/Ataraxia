import type { DailyQuestion } from "./types";

// Original prompts. Each is meant to start a conversation, not to have a single right answer.
type Seed = Omit<DailyQuestion, "publicationStatus">;

const seeds: Seed[] = [
  // Meaning and purpose
  {
    slug: "worth-doing-without-an-audience",
    question: "If your life had no audience, what would still feel worth doing?",
    shortDescription: "Much of what we pursue is shaped by who is watching. Imagining the audience away can show what you actually care about.",
    theme: "meaning-purpose",
    relatedConceptSlug: "examined-life",
  },
  {
    slug: "meaning-found-or-built",
    question: "Is a meaningful life one you find, or one you build?",
    shortDescription: "Some traditions say meaning is discovered in the world or in a calling. Others say we make it through what we commit to.",
    theme: "meaning-purpose",
    relatedConceptSlug: "existence-precedes-essence",
  },
  {
    slug: "regret-of-not-trying",
    question: "What would you regret not having tried, even if you failed?",
    shortDescription: "Failure and regret are different things. Thinking about which one you fear more can clarify what matters.",
    theme: "meaning-purpose",
    relatedConceptSlug: "the-absurd",
  },
  {
    slug: "good-without-happy",
    question: "Can a life be good without being happy?",
    shortDescription: "Ancient and modern thinkers disagree about whether a good life must feel good, or whether it is measured some other way.",
    theme: "meaning-purpose",
    relatedConceptSlug: "eudaimonia",
  },

  // Identity and self-knowledge
  {
    slug: "choice-or-inheritance",
    question: "Which parts of who you are are choices, and which are inheritance?",
    shortDescription: "Temperament, family, culture, and luck shape us before we choose anything. Where does choice begin?",
    theme: "identity-self-knowledge",
    relatedConceptSlug: "bad-faith",
  },
  {
    slug: "changed-memories-same-self",
    question: "If your memories changed, would you still be you?",
    shortDescription: "Is the self a continuous thread, a story we tell, or something that keeps changing from moment to moment?",
    theme: "identity-self-knowledge",
    relatedConceptSlug: "non-self",
  },
  {
    slug: "knowing-your-own-motives",
    question: "How well do you actually know your own motives?",
    shortDescription: "We usually have reasons for what we do, but they may not be the whole story. How would you test yours?",
    theme: "identity-self-knowledge",
    relatedConceptSlug: "examined-life",
  },
  {
    slug: "unjudged",
    question: "What would you do differently if you were certain no one would judge you?",
    shortDescription: "The gap between how you live and how you would live might point to values you have not yet acted on.",
    theme: "identity-self-knowledge",
    relatedConceptSlug: "bad-faith",
  },

  // Ethics and morality
  {
    slug: "breaking-a-promise",
    question: "Is it ever right to break a promise?",
    shortDescription: "Promises create obligations, but circumstances change. Different ethical views weigh the promise and the consequences differently.",
    theme: "ethics-morality",
    relatedConceptSlug: "categorical-imperative",
  },
  {
    slug: "strangers-and-friends",
    question: "Should you treat strangers the way you treat friends?",
    shortDescription: "Impartial fairness and special loyalty both feel like part of being good, and they can pull in opposite directions.",
    theme: "ethics-morality",
    relatedConceptSlug: "ethics-of-care",
  },
  {
    slug: "people-you-will-never-meet",
    question: "What do you owe to people you will never meet?",
    shortDescription: "Our choices reach far beyond the people we know. How far does responsibility extend?",
    theme: "ethics-morality",
    relatedConceptSlug: "veil-of-ignorance",
  },
  {
    slug: "rules-results-or-character",
    question: "Is being good mostly about rules, results, or character?",
    shortDescription: "Three major families of ethical theory each answer this differently, and each captures something the others miss.",
    theme: "ethics-morality",
    relatedConceptSlug: "eudaimonia",
  },

  // Love and relationships
  {
    slug: "love-without-changing",
    question: "Can you love someone without trying to change them?",
    shortDescription: "Care often involves wanting someone to grow. Where is the line between support and control?",
    theme: "love-relationships",
    relatedConceptSlug: "ethics-of-care",
  },
  {
    slug: "disagreeing-friends",
    question: "What do friends owe each other when they disagree?",
    shortDescription: "Honesty, loyalty, and tact can all matter at once. What does a good friend do when they cannot agree?",
    theme: "love-relationships",
    relatedConceptSlug: "ren-and-ritual",
  },
  {
    slug: "forgiveness",
    question: "Is forgiveness a gift, a duty, or something else?",
    shortDescription: "People disagree about whether forgiving is owed, earned, or entirely up to the person who was wronged.",
    theme: "love-relationships",
  },
  {
    slug: "giving-up-for-a-relationship",
    question: "How much of yourself should you give up to keep a relationship?",
    shortDescription: "Every close relationship involves compromise. When does compromise become losing yourself?",
    theme: "love-relationships",
    relatedConceptSlug: "ubuntu",
  },

  // Freedom and responsibility
  {
    slug: "responsible-for-what-you-did-not-choose",
    question: "Are you responsible for things you did not choose?",
    shortDescription: "We inherit circumstances, habits, and advantages we never picked. What do we owe because of them?",
    theme: "freedom-responsibility",
    relatedConceptSlug: "situated-freedom",
  },
  {
    slug: "habit-and-choice",
    question: "When does a habit stop being your choice?",
    shortDescription: "Repeated actions shape us until they feel automatic. Where does responsibility sit once that happens?",
    theme: "freedom-responsibility",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    slug: "free-and-committed",
    question: "Is it possible to be free and deeply committed at once?",
    shortDescription: "Commitment closes doors. Some see that as a loss of freedom, others as what freedom is for.",
    theme: "freedom-responsibility",
    relatedConceptSlug: "bad-faith",
  },
  {
    slug: "when-a-system-causes-harm",
    question: "Who is responsible when a system, rather than a person, causes harm?",
    shortDescription: "Institutions and incentives can produce outcomes no individual intended. How should responsibility be shared?",
    theme: "freedom-responsibility",
    relatedConceptSlug: "situated-freedom",
  },

  // Death and impermanence
  {
    slug: "living-forever",
    question: "Would you want to live forever if you could?",
    shortDescription: "Some argue that an endless life would lose its meaning, others that death is simply a loss. What do you think matters here?",
    theme: "death-impermanence",
    relatedConceptSlug: "the-absurd",
  },
  {
    slug: "everything-passes",
    question: "What changes if you take seriously that everything passes?",
    shortDescription: "Impermanence can feel like a threat or like a relief. How does it change what you hold on to?",
    theme: "death-impermanence",
    relatedConceptSlug: "impermanence",
  },
  {
    slug: "grieving-well",
    question: "What does it mean to grieve well?",
    shortDescription: "Traditions differ on whether grief should be eased, honored, or understood. What would grieving well look like for you?",
    theme: "death-impermanence",
    relatedConceptSlug: "impermanence",
  },
  {
    slug: "limited-time-and-seriousness",
    question: "Does knowing your time is limited make your choices more serious or less?",
    shortDescription: "Finitude can make each choice weigh more, or make it feel like none of them matter. Which does it do for you?",
    theme: "death-impermanence",
    relatedConceptSlug: "dichotomy-of-control",
  },

  // Knowledge and truth
  {
    slug: "whom-to-believe",
    question: "How do you decide whom to believe when experts disagree?",
    shortDescription: "Most of what we know, we know on trust. What makes trust well placed?",
    theme: "knowledge-truth",
    relatedConceptSlug: "pragmatic-maxim",
  },
  {
    slug: "unjustified-belief",
    question: "Can you hold a belief you cannot fully justify?",
    shortDescription: "Some beliefs seem necessary for living even though they cannot be proven. Is that acceptable, and where is the line?",
    theme: "knowledge-truth",
    relatedConceptSlug: "is-ought-gap",
  },
  {
    slug: "what-would-change-your-mind",
    question: "What would change your mind about something you care about?",
    shortDescription: "If nothing could change a belief, is it still a belief about the world? Naming what would move you is a useful test.",
    theme: "knowledge-truth",
    relatedConceptSlug: "examined-life",
  },
  {
    slug: "unimaginable-and-impossible",
    question: "Is what you cannot imagine necessarily impossible?",
    shortDescription: "Our imagination is limited by our experience. How far should it be trusted as a guide to what could be real?",
    theme: "knowledge-truth",
    relatedConceptSlug: "allegory-of-the-cave",
  },

  // Society, technology, and humanity
  {
    slug: "thinking-tools",
    question: "Does a tool that thinks for us make us wiser or lazier?",
    shortDescription: "Every new tool changes which skills we practice. What should we make sure we keep doing ourselves?",
    theme: "society-technology-humanity",
    relatedConceptSlug: "allegory-of-the-cave",
  },
  {
    slug: "trusting-a-machine",
    question: "What would make you trust a machine with a decision that affects someone's life?",
    shortDescription: "Accuracy is one part of trust. Accountability, explanation, and care for the person affected may matter too.",
    theme: "society-technology-humanity",
    relatedConceptSlug: "veil-of-ignorance",
  },
  {
    slug: "connected-and-lonely",
    question: "Does being connected all the time make us closer or lonelier?",
    shortDescription: "Technology gives us constant contact. Does contact amount to connection, and what does connection need?",
    theme: "society-technology-humanity",
    relatedConceptSlug: "ubuntu",
  },
  {
    slug: "what-we-owe-the-living-world",
    question: "What do we owe the places and living things we depend on?",
    shortDescription: "Many traditions treat land and living beings as relations rather than resources. What follows if that is right?",
    theme: "society-technology-humanity",
    relatedConceptSlug: "place-and-knowledge",
  },
];

export const dailyQuestions: DailyQuestion[] = seeds.map((seed) => ({ ...seed, publicationStatus: "approved" as const }));
