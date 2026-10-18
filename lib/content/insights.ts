import { dayNumber } from "@/lib/time";

// "Modern Minds": short quotations from historical thinkers, shown on the home page as the daily insight.
//
// Every quotation here is from a public-domain English translation (named in `source`) so it can be
// shown verbatim. Several famous lines attributed to these thinkers online are paraphrases or
// misattributions (for example "You have power over your mind, not outside events" is not in Marcus
// Aurelius), so add new ones only after checking them against the cited text.
//
// Each quote has a picture slot. Until a real one is added the card shows an animated lava-lamp background in the school's colour. To add one,
// put a file named `<slug>.jpg` (or .webp / .png) in `public/modern-minds/`; it replaces the placeholder on the next build or server start (dev picks it up immediately).
export interface Insight {
  id: number;
  slug: string;
  philosopher: string;
  context: string; // school of thought
  quote: string;
  source: string; // work, passage, and translation
  /** Hue (0-360, OKLCH) of this school's colour, used for the card until a real picture is added. */
  hue: number;
  relatedConceptSlug?: string;
}

export const insights: Insight[] = [
  {
    id: 1,
    slug: "socrates-unexamined-life",
    philosopher: "Socrates",
    context: "Socratic inquiry",
    hue: 35,
    quote: "The unexamined life is not worth living.",
    source: "Plato, Apology 38a (Socrates speaking, as Plato portrays him), trans. Benjamin Jowett",
    relatedConceptSlug: "examined-life",
  },
  {
    id: 2,
    slug: "marcus-aurelius-dyed-by-thoughts",
    philosopher: "Marcus Aurelius",
    context: "Stoicism",
    hue: 165,
    quote: "Such as are thy habitual thoughts, such also will be the character of thy mind; for the soul is dyed by the thoughts.",
    source: "Meditations 5.16, trans. George Long",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 3,
    slug: "epictetus-not-things",
    philosopher: "Epictetus",
    context: "Stoicism",
    hue: 165,
    quote: "Men are disturbed, not by things, but by the principles and notions which they form concerning things.",
    source: "Enchiridion 5, trans. Elizabeth Carter",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 4,
    slug: "seneca-imagination",
    philosopher: "Seneca",
    context: "Stoicism",
    hue: 165,
    quote: "There are more things, Lucilius, likely to frighten us than there are to crush us; we suffer more often in imagination than in reality.",
    source: "Letters to Lucilius 13, trans. Richard Gummere",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 5,
    slug: "confucius-learning-and-thought",
    philosopher: "Confucius",
    context: "Confucian ethics",
    hue: 75,
    quote: "Learning without thought is labour lost; thought without learning is perilous.",
    source: "Analects 2.15, trans. James Legge",
    relatedConceptSlug: "ren-and-ritual",
  },
  {
    id: 6,
    slug: "laozi-knowing-yourself",
    philosopher: "Laozi",
    context: "Daoism",
    hue: 215,
    quote: "He who knows other men is discerning; he who knows himself is intelligent.",
    source: "Daodejing 33 (traditionally attributed to Laozi), trans. James Legge",
    relatedConceptSlug: "wu-wei",
  },
  {
    id: 7,
    slug: "aristotle-political-animal",
    philosopher: "Aristotle",
    context: "Aristotelian virtue ethics",
    hue: 330,
    quote: "Man is by nature a political animal.",
    source: "Politics 1.2, trans. Benjamin Jowett",
    relatedConceptSlug: "eudaimonia",
  },
  {
    id: 8,
    slug: "mill-dissatisfied-socrates",
    philosopher: "John Stuart Mill",
    context: "Utilitarianism",
    hue: 55,
    quote: "It is better to be a human being dissatisfied than a pig satisfied; better to be Socrates dissatisfied than a fool satisfied.",
    source: "Utilitarianism, chapter 2 (1863)",
    relatedConceptSlug: "experience-machine",
  },
  {
    id: 9,
    slug: "epictetus-in-our-power",
    philosopher: "Epictetus",
    context: "Stoicism",
    hue: 165,
    quote: "Of things some are in our power, and others are not.",
    source: "Enchiridion 1, trans. George Long",
    relatedConceptSlug: "dichotomy-of-control",
  },
  {
    id: 10,
    slug: "kant-universal-law",
    philosopher: "Immanuel Kant",
    context: "Kantian ethics",
    hue: 275,
    quote: "Act only on that maxim whereby thou canst at the same time will that it should become a universal law.",
    source: "Fundamental Principles of the Metaphysic of Morals, section 2, trans. Thomas Kingsmill Abbott",
    relatedConceptSlug: "categorical-imperative",
  },
  {
    id: 11,
    slug: "hume-reason-and-passions",
    philosopher: "David Hume",
    context: "Empiricism",
    hue: 250,
    quote: "Reason is, and ought only to be the slave of the passions, and can never pretend to any other office than to serve and obey them.",
    source: "A Treatise of Human Nature, book 2, part 3, section 3 (1739)",
    relatedConceptSlug: "is-ought-gap",
  },
  {
    id: 12,
    slug: "descartes-i-think",
    philosopher: "René Descartes",
    context: "Rationalism",
    hue: 20,
    quote: "I think, therefore I am.",
    source: "Principles of Philosophy 1.7, trans. John Veitch",
  },
  {
    id: 13,
    slug: "pascal-thinking-reed",
    philosopher: "Blaise Pascal",
    context: "Christian philosophy",
    hue: 10,
    quote: "Man is but a reed, the most feeble thing in nature; but he is a thinking reed.",
    source: "Pensées 347, trans. W. F. Trotter",
  },
  {
    id: 14,
    slug: "emerson-misunderstood",
    philosopher: "Ralph Waldo Emerson",
    context: "Transcendentalism",
    hue: 135,
    quote: "To be great is to be misunderstood.",
    source: "Self-Reliance, in Essays: First Series (1841)",
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

// All insights in a fixed order starting from the one for the given date. The carousel loops through
// this list endlessly, so it opens on the daily insight and then continues in the same order.
export function insightsStartingFrom(items: Insight[], dateKey: string): Insight[] {
  const sorted = [...items].sort((a, b) => a.id - b.id);
  const first = pickDailyInsight(sorted, dateKey);
  const at = sorted.indexOf(first);
  return [...sorted.slice(at), ...sorted.slice(0, at)];
}
