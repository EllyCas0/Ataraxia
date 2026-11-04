import { describe, expect, it } from "vitest";
import { womenVoices } from "@/lib/content/women-voices";

const words = (text: string) => text.trim().split(/\s+/).length;

describe("the timeline of women philosophers", () => {
  it("is in time order and has ten voices", () => {
    expect(womenVoices).toHaveLength(10);
    const starts = womenVoices.map((v) => v.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
    for (const voice of womenVoices) expect(voice.end, voice.id).toBeGreaterThanOrEqual(voice.start);
  });

  it("gives every voice a name, place, dates and a source", () => {
    for (const voice of womenVoices) {
      for (const field of [voice.name, voice.place, voice.dates, voice.source]) expect(field.trim().length, voice.id).toBeGreaterThan(3);
    }
    expect(new Set(womenVoices.map((v) => v.id)).size).toBe(womenVoices.length);
  });

  it("keeps quotes short and distinct, and names the work or translator behind each", () => {
    const quotes = womenVoices.flatMap((v) => (v.quote ? [v.quote] : []));
    expect(quotes.length).toBe(9);
    expect(new Set(quotes).size).toBe(quotes.length);
    for (const voice of womenVoices.filter((v) => v.quote)) {
      expect(words(voice.quote!), voice.id).toBeLessThanOrEqual(45);
      // A source with a year, a translator, or a named work.
      expect(voice.source, voice.id).toMatch(/\d{4}|translated|Symposium/);
    }
  });

  it("does not put an invented quote in Hypatia's mouth", () => {
    const hypatia = womenVoices.find((v) => v.id === "hypatia")!;
    expect(hypatia.quote).toBeUndefined();
    expect(hypatia.note).toMatch(/Hubbard/);
  });

  it("is honest about Diotima being known only through Plato, and about the translation for Sor Juana", () => {
    expect(womenVoices.find((v) => v.id === "diotima")!.note).toMatch(/only through Plato/);
    const juana = womenVoices.find((v) => v.id === "sor-juana")!;
    expect(juana.source).toMatch(/translated for Stoa/);
    expect(juana.original).toMatch(/Hombres necios/);
  });

  it("uses only quotes from before the middle of the 20th century, so they are in the public domain", () => {
    for (const voice of womenVoices.filter((v) => v.quote)) expect(voice.start, voice.id).toBeLessThan(1900);
  });
});
