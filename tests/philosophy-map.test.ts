import assert from "node:assert/strict";
import test from "node:test";
import { getSchool, schools } from "../lib/philosophy-map";
import { philosophers } from "../lib/philosophers";

test("there are five schools with unique ids and complete content", () => {
  assert.equal(schools.length, 5);
  assert.equal(new Set(schools.map((s) => s.id)).size, 5);
  for (const school of schools) {
    assert.ok(school.name && school.era && school.region && school.tagline && school.summary, `${school.id} is incomplete`);
    assert.ok(school.keyIdeas.length >= 3 && school.thinkers.length >= 1, `${school.id} needs ideas and thinkers`);
  }
});

test("every school is connected, and connections are valid and symmetric", () => {
  for (const school of schools) {
    assert.ok(school.connections.length >= 2, `${school.id} should connect to at least two schools`);
    assert.equal(new Set(school.connections.map((c) => c.id)).size, school.connections.length, `${school.id} has a duplicate link`);
    for (const connection of school.connections) {
      assert.notEqual(connection.id, school.id, "no self links");
      const other = getSchool(connection.id);
      assert.ok(other, `${school.id} links to unknown ${connection.id}`);
      const back = other.connections.find((c) => c.id === school.id);
      assert.ok(back, `${connection.id} should link back to ${school.id}`);
      assert.equal(back.kind, connection.kind);
      assert.equal(back.label, connection.label);
    }
  }
});

test("thinker slugs point to real philosopher profiles", () => {
  const known = new Set(philosophers.map((p) => p.slug));
  for (const school of schools) {
    for (const thinker of school.thinkers) {
      if (thinker.slug) assert.ok(known.has(thinker.slug), `${school.id}: no profile for ${thinker.slug}`);
    }
  }
});

test("nodes start far enough apart not to overlap", () => {
  for (let i = 0; i < schools.length; i++) {
    for (let j = i + 1; j < schools.length; j++) {
      const a = schools[i].position;
      const b = schools[j].position;
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > 150, `${schools[i].id} and ${schools[j].id} are too close`);
    }
  }
});

test("curve helpers: endpoints and midpoint of the edge curve", async () => {
  const { quadPoint, controlPoint } = await import("../lib/map-engine");
  const a = { x: 0, y: 0 };
  const b = { x: 100, y: 0 };
  assert.deepEqual(quadPoint(a, controlPoint(a, b, 0.2), b, 0), a);
  assert.deepEqual(quadPoint(a, controlPoint(a, b, 0.2), b, 1), b);
  assert.deepEqual(controlPoint(a, b, 0), { x: 50, y: 0 }, "no bend keeps the control point on the line");
  const bent = controlPoint(a, b, 0.2);
  assert.equal(bent.x, 50);
  assert.equal(bent.y, 20, "bend is a perpendicular offset proportional to length");
  const mid = quadPoint(a, bent, b, 0.5);
  assert.equal(mid.y, 10, "the curve passes halfway to its control point");
});
