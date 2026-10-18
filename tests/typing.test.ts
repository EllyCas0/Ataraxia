import assert from "node:assert/strict";
import test from "node:test";
import { MAX_DELAY_MS, MIN_DELAY_MS, randomDelay, typeText } from "../lib/typing";
import type { Scheduler } from "../lib/typing";

// A manual scheduler: records each requested delay and runs callbacks only when told to.
function fakeScheduler() {
  const delays: number[] = [];
  let pending: (() => void) | null = null;
  const scheduler: Scheduler = {
    set(callback, ms) {
      delays.push(ms);
      pending = callback;
      return callback;
    },
    clear(handle) {
      if (pending === handle) pending = null;
    },
  };
  const step = () => {
    const callback = pending;
    pending = null;
    callback?.();
  };
  return {
    scheduler,
    delays,
    step,
    hasPending: () => pending !== null,
    runAll() {
      for (let guard = 0; pending && guard < 10_000; guard++) step();
    },
  };
}

test("randomDelay maps the random value onto 30 to 70 ms, inclusive", () => {
  assert.equal(randomDelay(() => 0), MIN_DELAY_MS);
  assert.equal(randomDelay(() => 0.5), 50);
  assert.equal(randomDelay(() => 0.999999), MAX_DELAY_MS);
  assert.equal(MIN_DELAY_MS, 30);
  assert.equal(MAX_DELAY_MS, 70);
});

test("randomDelay never leaves the 30 to 70 ms range, and varies", () => {
  const seen = new Set<number>();
  for (let i = 0; i < 5000; i++) {
    const delay = randomDelay();
    assert.ok(Number.isInteger(delay) && delay >= 30 && delay <= 70, `delay ${delay} out of range`);
    seen.add(delay);
  }
  assert.ok(seen.size > 30, "delays should be spread across the range, not constant");
});

test("typeText reveals one character at a time, ending on the full text", () => {
  const clock = fakeScheduler();
  const updates: string[] = [];
  let doneCalls = 0;
  typeText("Why?", { onUpdate: (s) => updates.push(s), onDone: () => doneCalls++, scheduler: clock.scheduler });
  assert.deepEqual(updates, [], "nothing is shown before the first delay");
  clock.runAll();
  assert.deepEqual(updates, ["W", "Wh", "Why", "Why?"]);
  assert.equal(doneCalls, 1);
});

test("every pause between characters is 30 to 70 ms", () => {
  const clock = fakeScheduler();
  const text = "What do you mean by justice?";
  typeText(text, { onUpdate: () => {}, scheduler: clock.scheduler, startDelay: 900 });
  clock.runAll();
  const [start, ...between] = clock.delays;
  assert.equal(start, 900, "the opening pause is the configured startDelay");
  assert.equal(between.length, Array.from(text).length - 1);
  for (const delay of between) assert.ok(delay >= 30 && delay <= 70, `delay ${delay} out of range`);
});

test("a custom random source drives the delays", () => {
  const clock = fakeScheduler();
  typeText("abc", { onUpdate: () => {}, scheduler: clock.scheduler, startDelay: 0, random: () => 1 });
  clock.runAll();
  assert.deepEqual(clock.delays, [0, 70, 70]);
});

test("characters made of several code units are never split", () => {
  const clock = fakeScheduler();
  const updates: string[] = [];
  typeText("a😀b", { onUpdate: (s) => updates.push(s), scheduler: clock.scheduler });
  clock.runAll();
  assert.deepEqual(updates, ["a", "a😀", "a😀b"]);
});

test("finish() shows the rest at once and calls onDone once", () => {
  const clock = fakeScheduler();
  const updates: string[] = [];
  let doneCalls = 0;
  const typing = typeText("hello", { onUpdate: (s) => updates.push(s), onDone: () => doneCalls++, scheduler: clock.scheduler });
  clock.step();
  clock.step();
  typing.finish();
  typing.finish();
  assert.equal(updates.at(-1), "hello");
  assert.equal(doneCalls, 1);
  assert.equal(typing.done, true);
  assert.equal(clock.hasPending(), false);
});

test("cancel() stops typing without calling onDone", () => {
  const clock = fakeScheduler();
  const updates: string[] = [];
  let doneCalls = 0;
  const typing = typeText("hello", { onUpdate: (s) => updates.push(s), onDone: () => doneCalls++, scheduler: clock.scheduler });
  clock.step();
  typing.cancel();
  assert.equal(clock.hasPending(), false);
  assert.deepEqual(updates, ["h"]);
  assert.equal(doneCalls, 0);
});

test("instant mode shows everything in one update", () => {
  const clock = fakeScheduler();
  const updates: string[] = [];
  let doneCalls = 0;
  typeText("no animation", { onUpdate: (s) => updates.push(s), onDone: () => doneCalls++, scheduler: clock.scheduler, instant: true });
  clock.runAll();
  assert.deepEqual(updates, ["no animation"]);
  assert.equal(doneCalls, 1);
});

test("empty text completes without updates", () => {
  const clock = fakeScheduler();
  let doneCalls = 0;
  typeText("", { onUpdate: () => assert.fail("nothing to show"), onDone: () => doneCalls++, scheduler: clock.scheduler });
  clock.runAll();
  assert.equal(doneCalls, 1);
});
