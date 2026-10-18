import { dayNumber } from "@/lib/time";

// "Modern Minds": short quotations from historical thinkers, shown on the home page as the daily insight.
//
// Every quotation here is from a public-domain English translation (named in `source`) so it can be
// shown verbatim. Several famous lines attributed to these thinkers online are paraphrases or
// misattributions (for example "You have power over your mind, not outside events" is not in Marcus
// Aurelius), so add new ones only after checking them against the cited text.
//
// Images are optional. To add one, put a file named `<slug>.jpg` (or .webp / .png) in
// `public/modern-minds/`; it is picked up on the next build or server start (dev picks it up immediately). Until then the card uses a plain green background.
export interface Insight {
  id: number;
  slug: string;
  philosopher: string;
  context: string; // school of thought
  quote: string;
  source: string; // work, passage, and translation
  relatedConceptSlug?: string;
}

export const insights: Insight[] = [
  {
    id: 1,
    slug: "socrates-unexamined-life",
    philosopher: "Socrates",
    context: "Socratic inquiry",
    quote: "The unexamined life is not worth living.",
    source: "Plato, Apology 38a (Socrates speaking, as Plato portrays him), trans. Benjamin Jowett",
    relatedConceptSlug: "examined-life",
  },
  {
    id: 2,
    slug: "marcus-aurelius-dyed-by-thoughts",
    philosopher: "Marcus Aurelius",
    context: "Stoicism",
    quote: "Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.",
    source: "Meditations 5.16, trans. George Long",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 3,
    slug: "epictetus-not-things",
    philosopher: "Epictetus",
    context: "Stoicism",
    quote: "Men are disturbed, not by things, but by the principles and notions which they form concerning things.",
    source: "Enchiridion 5, trans. Elizabeth Carter",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 4,
    slug: "seneca-imagination",
    philosopher: "Seneca",
    context: "Stoicism",
    quote: "There are more things, Lucilius, likely to frighten us than there are to crush us; we suffer more often in imagination than in reality.",
    source: "Letters to Lucilius 13, trans. Richard Gummere",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 5,
    slug: "confucius-learning-and-thought",
    philosopher: "Confucius",
    context: "Confucian ethics",
    quote: "Learning without thought is labour lost; thought without learning is perilous.",
    source: "Analects 2.15, trans. James Legge",
    relatedConceptSlug: "ren-and-ritual",
  },
  {
    id: 6,
    slug: "laozi-knowing-yourself",
    philosopher: "Laozi",
    context: "Daoism",
    quote: "He who knows other men is discerning; he who knows himself is intelligent.",
    source: "Daodejing 33 (traditionally attributed to Laozi), trans. James Legge",
    relatedConceptSlug: "wu-wei",
  },
  {
    id: 7,
    slug: "aristotle-political-animal",
    philosopher: "Aristotle",
    context: "Aristotelian virtue ethics",
    quote: "Man is by nature a political animal.",
    source: "Politics 1.2, trans. Benjamin Jowett",
    relatedConceptSlug: "eudaimonia",
  },
  {
    id: 8,
    slug: "mill-dissatisfied-socrates",
    philosopher: "John Stuart Mill",
    context: "Utilitarianism",
    quote: "It is better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied.",
    source: "Utilitarianism, chapter 2 (1863)",
    relatedConceptSlug: "experience-machine",
  },
];

export function insightBySlug(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}

// One insight per day, rotating through the list in a fixed order. The same date key always gives the same one.
export function pickDailyInsight(items: Insight[], dateKey: string): Insight {
  if (items.length === 0) throw new Error("No insights");
  const sorted = [...items].sort((a, b) => a.id - b.id);
  return sorted[((dayNumber(dateKey) % sorted.length) + sorted.length) % sorted.length];
}
