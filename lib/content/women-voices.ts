import type { Glow } from "@/components/content/luminous-women";

// Women thinkers on a timeline, with one short quote each where an honest, checkable one exists.
// Every quote is from a public-domain text or translation, and its source is shown beside it. A quote that
// cannot be traced to the person, or whose only English translation may still be under copyright, is left out and
// the card describes her idea instead (and says why). Hypatia has none because no writing of hers survives and the
// famous line online was written by someone else; Gargi, Ban Zhao, Rabia and Mirabai have none because we could not
// confirm a wording we are free to use. Dates are approximate for the earliest thinkers.
// `start` and `end` are years (negative means BCE) and are used only to keep the list in time order.
export interface WomanVoice {
  id: string;
  name: string;
  place: string;
  dates: string;
  start: number;
  end: number;
  glow: Glow;
  quote?: string;
  /** When there is no quote we can stand behind, the idea she is known for, in a sentence or two. */
  idea?: string;
  /** Shown under the quote when the quote is a translation made for Stoa, so no one mistakes it for the original. */
  original?: string;
  source: string;
  note?: string;
}

export const WOMEN_VOICES_TITLE = "Their ideas, across time";
export const WOMEN_VOICES_INTRO =
  "Scroll sideways to move through more than two thousand years. Each quote is from a public-domain text, with its source underneath. Where we could not check a quote, we describe the idea instead.";
export const WOMEN_VOICES_FOOTNOTE =
  "This is still a small start. We want more voices from Africa, the Middle East and the Americas, and more quotes we can check against public sources.";

export const womenVoices: WomanVoice[] = [
  {
    id: "gargi",
    name: "G\u0101rg\u012b V\u0101chaknav\u012b",
    place: "Ancient India",
    dates: "traditionally c. 7th century BCE",
    start: -700,
    end: -700,
    glow: "teal",
    idea: "In an ancient Indian text she questions the sage Y\u0101j\u00f1avalkya in a chain: water is held in air, so what holds the air? She keeps pressing deeper, until he tells her not to ask too much.",
    source: "Brihadaranyaka Upanishad 3.6, in F. Max M\u00fcller\u2019s translation (1879)",
    note: "We describe her questions instead of quoting them, because we could not confirm the exact wording to use. Her dates are uncertain.",
  },
  {
    id: "sappho",
    name: "Sappho",
    place: "Lesbos, Greece",
    dates: "c. 630 – c. 570 BCE",
    start: -630,
    end: -570,
    glow: "coral",
    quote: "Now Love masters my limbs and shakes me, fatal creature, bitter-sweet.",
    source: "Fragment 130, translated by H. T. Wharton (1887)",
  },
  {
    id: "diotima",
    name: "Diotima of Mantinea",
    place: "Ancient Greece",
    dates: "5th century BCE",
    start: -416,
    end: -416,
    glow: "gold",
    quote:
      "He who has been instructed thus far in the things of love, and who has learned to see the beautiful in due order and succession, when he comes toward the end will suddenly perceive a nature of wondrous beauty.",
    source: "As told by Socrates in Plato’s Symposium, translated by Benjamin Jowett",
    note: "We know her only through Plato, so some scholars think she may be a character he invented.",
  },
  {
    id: "ban-zhao",
    name: "Ban Zhao",
    place: "Han dynasty China",
    dates: "c. 49 \u2013 c. 120 CE",
    start: 49,
    end: 120,
    glow: "coral",
    idea: "A historian and scholar at the imperial court who helped finish the history of the Han dynasty. In her Lessons for Women she argued that girls should be taught just as boys are.",
    source: "Lessons for Women, c. 100 CE",
    note: "The standard English translation is from 1932, so we describe her argument instead of quoting it. The book also tells women to be obedient, which readers still argue about.",
  },
  {
    id: "hypatia",
    name: "Hypatia of Alexandria",
    place: "Alexandria, Egypt",
    dates: "died 415 CE",
    start: 415,
    end: 415,
    glow: "teal",
    idea: "A mathematician, astronomer and teacher in Alexandria, widely admired in her own lifetime.",
    source: "No writing of hers survives in its original form",
    note: "A famous line about the right to think is often credited to her online. It first appears in a 1908 book by Elbert Hubbard, so we have not used it.",
  },
  {
    id: "rabia",
    name: "Rabia al-Adawiyya",
    place: "Basra, Iraq",
    dates: "c. 714 \u2013 801 CE",
    start: 714,
    end: 801,
    glow: "pink",
    idea: "A Sufi mystic and poet remembered for teaching that God should be loved for God\u2019s own sake, not out of fear of punishment or hope of reward.",
    source: "Stories about her were written down centuries later",
    note: "Little is certain about her life, and the words credited to her come from later writers, so we describe her idea instead of quoting it.",
  },
  {
    id: "julian",
    name: "Julian of Norwich",
    place: "Norwich, England",
    dates: "c. 1342 – c. 1416",
    start: 1342,
    end: 1416,
    glow: "lime",
    quote: "All shall be well, and all shall be well, and all manner of thing shall be well.",
    source: "Revelations of Divine Love, c. 1393, in modern English",
  },
  {
    id: "mirabai",
    name: "Mirabai",
    place: "Rajasthan, India",
    dates: "c. 1498 \u2013 c. 1546",
    start: 1498,
    end: 1546,
    glow: "gold",
    idea: "A princess turned poet whose songs of devotion to Krishna were sung across India for centuries, often against what her family expected of her.",
    source: "Her songs were passed down by singing, for generations",
    note: "No manuscripts from her own lifetime survive, and the English translations we found are modern and under copyright, so there is no quote here.",
  },
  {
    id: "sor-juana",
    name: "Sor Juana Inés de la Cruz",
    place: "New Spain (Mexico)",
    dates: "1648 – 1695",
    start: 1648,
    end: 1695,
    glow: "pink",
    quote: "Foolish men, who accuse women with no reason.",
    original: "“Hombres necios que acusáis a la mujer sin razón”",
    source: "The poem “Hombres necios”, c. 1689, translated for Stoa",
  },
  {
    id: "astell",
    name: "Mary Astell",
    place: "England",
    dates: "1666 – 1731",
    start: 1666,
    end: 1731,
    glow: "coral",
    quote: "If all Men are born free, how is it that all Women are born slaves?",
    source: "Some Reflections upon Marriage, 1700",
  },
  {
    id: "gouges",
    name: "Olympe de Gouges",
    place: "France",
    dates: "1748 – 1793",
    start: 1748,
    end: 1793,
    glow: "gold",
    quote: "Woman is born free and lives equal to man in her rights.",
    source: "Declaration of the Rights of Woman, 1791, in English",
  },
  {
    id: "wollstonecraft",
    name: "Mary Wollstonecraft",
    place: "England",
    dates: "1759 – 1797",
    start: 1759,
    end: 1797,
    glow: "teal",
    quote: "It is justice, not charity, that is wanting in the world.",
    source: "A Vindication of the Rights of Woman, 1792, chapter 4",
  },
  {
    id: "fuller",
    name: "Margaret Fuller",
    place: "United States",
    dates: "1810 – 1850",
    start: 1810,
    end: 1850,
    glow: "pink",
    quote: "We would have every path laid open to Woman as freely as to Man.",
    source: "Woman in the Nineteenth Century, 1845",
  },
  {
    id: "cooper",
    name: "Anna Julia Cooper",
    place: "United States",
    dates: "1858 – 1964",
    start: 1858,
    end: 1964,
    glow: "lime",
    quote: "To me, faith means treating the truth as true.",
    source: "A Voice from the South, 1892",
  },
];
