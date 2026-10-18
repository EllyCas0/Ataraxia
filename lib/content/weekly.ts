import type { WeeklyPrompt } from "./types";

// Curated weekly questions with contrasting perspectives. These are summaries for orientation, not
// quotations. Like the concept records, they are drafts that still need subject-matter review.
type Seed = Omit<WeeklyPrompt, "publicationStatus">;

const seeds: Seed[] = [
  {
    slug: "honesty-or-kindness",
    question: "When honesty and kindness pull in different directions, which should win?",
    description:
      "All three views value both honesty and the wellbeing of others, but they disagree about what to do when the two truly conflict: treat honesty as a firm duty, attend to the particular relationship, or weigh the overall effects.",
    perspectives: [
      {
        tradition: "Kantian ethics",
        thinker: "Immanuel Kant",
        position: "Truthfulness is a duty we owe to everyone, not something to trade against comfort.",
        reasoning:
          "Kant argued that lying treats others as mere means and could not be a universal law. He held this so strictly that he denied a right to lie even to a murderer asking where your friend is, a conclusion many readers find hard to accept.",
        conceptSlug: "categorical-imperative",
      },
      {
        tradition: "Ethics of care",
        thinker: "Nel Noddings and Virginia Held",
        position: "Attend to the person and the relationship in front of you; how you tell the truth matters.",
        reasoning:
          "Care ethicists emphasize responding to what particular people need. They do not usually endorse deception, but they stress timing, tone, and what the relationship can bear, rather than applying one rule to every case.",
        conceptSlug: "ethics-of-care",
      },
      {
        tradition: "Utilitarianism",
        thinker: "John Stuart Mill",
        position: "Truthfulness matters greatly because trust underpins wellbeing, but it can have rare exceptions.",
        reasoning:
          "Mill treated truthfulness as extremely important because social trust depends on it, while allowing that a rare case could justify withholding a fact to prevent a serious and undeserved harm. The difficulty is deciding when a case really is rare.",
      },
    ],
    activeWeek: undefined,
  },
  {
    slug: "closer-or-stranger",
    question: "Do we owe more to those close to us than to strangers?",
    description:
      "Most people feel special obligations to family and friends, yet also feel that a stranger's suffering matters. These views disagree about whether special obligations are basic, or must be justified by impartial reasons.",
    perspectives: [
      {
        tradition: "Confucian ethics",
        thinker: "Confucius and Mencius",
        position: "Care naturally begins with those nearest to us and extends outward through cultivation.",
        reasoning:
          "Confucians treat family bonds as the root of humaneness, and see moral growth as widening care from there. Critics such as Mozi argued this favors one's own circle and called for impartial concern.",
        conceptSlug: "ren-and-ritual",
      },
      {
        tradition: "Utilitarianism",
        thinker: "Peter Singer",
        position: "Distance should not matter morally: a stranger's need counts as much as a neighbor's.",
        reasoning:
          "In his essay 'Famine, Affluence, and Morality', Singer argued that if we can prevent something very bad without sacrificing anything of comparable importance, we ought to, wherever the person is. Critics say this makes ordinary loyalties and personal projects too costly.",
      },
      {
        tradition: "African philosophy",
        thinker: "Ubuntu thinkers",
        position: "We become persons through our relationships, so obligations grow out of shared life and extend through community.",
        reasoning:
          "On many readings of ubuntu, moral worth is realized in harmonious relationships. That grounds strong obligations to those in our community while also affirming the dignity of every person. Interpreters disagree about how far the obligations reach.",
        conceptSlug: "ubuntu",
      },
    ],
    activeWeek: undefined,
  },
  {
    slug: "suffering-and-a-good-life",
    question: "Can suffering be part of a good life?",
    description:
      "These traditions agree that suffering is real and important, but disagree on what it should lead to: unaffected virtue, release from clinging, or a life that can be damaged by misfortune.",
    perspectives: [
      {
        tradition: "Stoicism",
        thinker: "Epictetus",
        position: "Hardship does not have to damage a good life, because what matters most is how we judge and respond.",
        reasoning:
          "Stoics held that virtue is the one true good, so loss of health or status cannot take away a good life. Critics think this underestimates how deeply suffering can harm a person.",
        conceptSlug: "dichotomy-of-control",
      },
      {
        tradition: "Buddhist philosophy",
        thinker: "Early Buddhist teachings",
        position: "Suffering is part of ordinary existence, but its causes can be understood and loosened.",
        reasoning:
          "Early Buddhist teaching treats clinging as closely tied to suffering and offers a path toward its cessation. On this view, a good life aims to reduce suffering, not to find a role for it.",
        conceptSlug: "impermanence",
      },
      {
        tradition: "Aristotelian virtue ethics",
        thinker: "Aristotle",
        position: "A flourishing life needs some good fortune, and great misfortune can damage it.",
        reasoning:
          "Aristotle discusses King Priam's ruin in old age as a case where catastrophe can undermine flourishing, even for a virtuous person, while also saying that people can bear misfortune nobly.",
        conceptSlug: "eudaimonia",
      },
    ],
    activeWeek: undefined,
  },
  {
    slug: "certainty-or-openness",
    question: "Is it better to be sure, or to stay open?",
    description:
      "Certainty can feel like solid ground, and openness like freedom, but each has costs. These thinkers disagree about whether the aim of inquiry is secure foundations or ongoing correction.",
    perspectives: [
      {
        tradition: "Rationalism",
        thinker: "René Descartes",
        position: "Doubt everything possible to find what cannot be doubted, and build knowledge from there.",
        reasoning:
          "In the Meditations, Descartes uses systematic doubt to look for a foundation of certainty. Later philosophers questioned whether his foundation is secure, or whether knowledge needs one.",
      },
      {
        tradition: "Pragmatism",
        thinker: "Charles Sanders Peirce",
        position: "We should be fallibilists: beliefs are open to revision, and real inquiry starts from real doubt.",
        reasoning:
          "Peirce rejected doubting everything on paper as a pretense, and held that inquiry should begin from doubts we actually have, with conclusions held as provisional and tested by experience.",
        conceptSlug: "pragmatic-maxim",
      },
      {
        tradition: "Socratic inquiry",
        thinker: "Socrates (as portrayed by Plato)",
        position: "Wisdom begins with recognizing how much we do not know, and keeps questioning.",
        reasoning:
          "In the Apology, Socrates presents his wisdom as awareness of his own ignorance, and treats testing beliefs as a way of life, though he is not shown to reach final certainty.",
        conceptSlug: "examined-life",
      },
    ],
    activeWeek: undefined,
  },
  {
    slug: "pleasure-or-struggle",
    question: "Is a life of pleasure without struggle worth living?",
    description:
      "Most of us want less pain, but it is not obvious that a life of pure comfort would be a good one. These views disagree about what, beyond feeling good, a life needs.",
    perspectives: [
      {
        tradition: "Philosophy of well-being",
        thinker: "Robert Nozick",
        position: "No: we want to actually do and be things, not just have pleasant experiences.",
        reasoning:
          "Nozick's experience machine suggests that many people would refuse a perfect simulated life, which he took to show that we value real contact and real achievement. Others say this reaction may reflect bias toward the familiar.",
        conceptSlug: "experience-machine",
      },
      {
        tradition: "Existentialism and absurdism",
        thinker: "Albert Camus",
        position: "Meaning can lie in the struggle itself, taken up with awareness and defiance.",
        reasoning:
          "Camus ends The Myth of Sisyphus by saying that the struggle toward the heights is enough to fill a person's heart, and that we must imagine Sisyphus happy. Critics ask whether this romanticizes hardship.",
        conceptSlug: "the-absurd",
      },
      {
        tradition: "Aristotelian virtue ethics",
        thinker: "Aristotle",
        position: "A good life is an activity of using our abilities well, not a state of pleasant sensation.",
        reasoning:
          "Aristotle holds that pleasure accompanies and completes good activity but is not itself the point, and that flourishing involves exercising our capacities, which usually involves effort.",
        conceptSlug: "eudaimonia",
      },
    ],
    activeWeek: undefined,
  },
];

export const weeklyPrompts: WeeklyPrompt[] = seeds.map((seed) => ({ ...seed, publicationStatus: "approved" as const }));
