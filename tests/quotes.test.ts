import assert from "node:assert/strict";
import test from "node:test";
import { quoteIndexForDate, quotes } from "../lib/quotes";

test("every quote has text, an author, and a source", () => {
  for (const quote of quotes) {
    assert.ok(quote.text.trim() && quote.author.trim() && quote.source.trim(), `incomplete quote: ${quote.text}`);
  }
  assert.equal(new Set(quotes.map((q) => q.text)).size, quotes.length, "quotes should be unique");
});

test("the daily quote is stable through the day and changes at local midnight", () => {
  const morning = quoteIndexForDate(new Date(2026, 9, 17, 0, 5));
  const night = quoteIndexForDate(new Date(2026, 9, 17, 23, 55));
  const nextDay = quoteIndexForDate(new Date(2026, 9, 18, 0, 5));
  assert.equal(morning, night);
  assert.equal(nextDay, (morning + 1) % quotes.length);
});

test("the index stays in range across year boundaries and cycles through every quote", () => {
  const seen = new Set<number>();
  for (let i = 0; i < quotes.length * 2; i++) {
    const index = quoteIndexForDate(new Date(2026, 11, 25 + i));
    assert.ok(index >= 0 && index < quotes.length);
    seen.add(index);
  }
  assert.equal(seen.size, quotes.length);
});
