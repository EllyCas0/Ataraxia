import assert from "node:assert/strict";
import test from "node:test";
import { moods } from "../lib/ambient";
import { domains } from "../lib/domains";
import { questions } from "../lib/questions";

test("every question domain has an ambient mood", () => {
  for (const domain of domains) assert.ok(moods[domain], `missing mood for ${domain}`);
  for (const question of questions) assert.ok(moods[question.domain], `missing mood for ${question.slug}`);
});

test("moods have playable audio settings", () => {
  for (const [domain, mood] of Object.entries(moods)) {
    assert.ok(mood.label.trim(), `${domain} needs a label`);
    assert.ok(mood.root > 20 && mood.root < 500, `${domain} root out of range`);
    assert.ok(mood.chord.length >= 3 && mood.chord.every((n) => Number.isInteger(n) && n >= 0), `${domain} chord invalid`);
    assert.ok(mood.cutoff >= 300 && mood.cutoff <= 4000, `${domain} cutoff out of range`);
    assert.ok(mood.swell > 0, `${domain} swell must be positive`);
    if (mood.plucks) assert.ok(mood.plucks.every[0] > 0 && mood.plucks.every[0] <= mood.plucks.every[1], `${domain} pluck timing invalid`);
  }
});
