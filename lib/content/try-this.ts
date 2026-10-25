import { dayNumber } from "../time";

// The one secondary card on the home page. It shows a single item, alternating by day with the same
// date-based rule as the daily quote, so the same date always shows the same card and a refresh never changes it.
export interface TryThisCard {
  id: "reframe" | "natural-law";
  title: string;
  /** One short line (at most 20 words). */
  line: string;
  href: string;
}

export const tryThisCards: TryThisCard[] = [
  { id: "reframe", title: "Reframe a worried thought", line: "See one thought through four lenses: anxious, Stoic, growth, and cosmic.", href: "/reframe" },
  { id: "natural-law", title: "Natural Law: a guided tour", line: "Ten big ideas about right and wrong, and space to write what you think.", href: "/ethics/natural-law" },
];

export function pickTryThis(dateKey: string, cards: TryThisCard[] = tryThisCards): TryThisCard {
  if (cards.length === 0) throw new Error("No cards to show");
  return cards[((dayNumber(dateKey) % cards.length) + cards.length) % cards.length];
}
