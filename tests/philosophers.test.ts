import assert from "node:assert/strict";
import test from "node:test";
import { philosophers } from "../lib/philosophers";
import { traditions } from "../lib/traditions";
import type { Domain } from "../lib/types";

const domains: Domain[] = [
  "ethics",
  "political-philosophy",
  "metaphysics",
  "epistemology",
  "philosophy-of-mind",
  "philosophy-of-history",
  "aesthetics",
  "philosophy-of-religion",
];

test("philosopher catalog meets MVP depth target", () => {
  assert.ok(philosophers.length >= 50);
  assert.equal(new Set(philosophers.map((p) => p.slug)).size, philosophers.length);
});

test("philosopher catalog uses known taxonomy ids", () => {
  const traditionIds = new Set(traditions.map((t) => t.id));
  const domainIds = new Set(domains);

  for (const philosopher of philosophers) {
    assert.ok(philosopher.domains.every((domain) => domainIds.has(domain)), philosopher.slug);
    assert.ok(philosopher.traditions.every((tradition) => traditionIds.has(tradition)), philosopher.slug);
  }
});
