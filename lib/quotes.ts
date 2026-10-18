// Short, well-attested lines for the Daily Contemplation screen. Philosophical
// texts exist in many translations, so the wording below follows common English
// renderings and each entry names its source.

export interface Quote {
  text: string;
  author: string;
  source: string;
}

export const quotes: Quote[] = [
  { text: "The unexamined life is not worth living.", author: "Socrates", source: "Plato, Apology 38a" },
  { text: "All men by nature desire to know.", author: "Aristotle", source: "Metaphysics I.1" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Laozi", source: "Tao Te Ching 64" },
  { text: "Learning without thought is labor lost; thought without learning is perilous.", author: "Confucius", source: "Analects 2.15" },
  { text: "It is not things that disturb us, but our judgments about things.", author: "Epictetus", source: "Enchiridion 5" },
  { text: "Have the courage to use your own understanding.", author: "Immanuel Kant", source: "What Is Enlightenment?" },
  { text: "All that we are is the result of what we have thought.", author: "The Dhammapada", source: "Verse 1" },
  { text: "Hold every hour in your grasp.", author: "Seneca", source: "Letters to Lucilius 1" },
  { text: "All things excellent are as difficult as they are rare.", author: "Baruch Spinoza", source: "Ethics V, Proposition 42" },
  { text: "I think, therefore I am.", author: "René Descartes", source: "Principles of Philosophy I.7" },
];

// Uses the visitor's local calendar day, so the quote changes at their own
// midnight and stays the same all day, with no server or storage needed.
export function quoteIndexForDate(date: Date, count = quotes.length): number {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return ((day % count) + count) % count;
}
