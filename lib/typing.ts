// A typewriter effect with a human cadence: each character appears after a random
// delay between 30 and 70 ms, so the rhythm is slightly uneven instead of mechanical.

export const MIN_DELAY_MS = 30;
export const MAX_DELAY_MS = 70;

export interface Scheduler {
  set(callback: () => void, ms: number): unknown;
  clear(handle: unknown): void;
}

const browserScheduler: Scheduler = {
  set: (callback, ms) => setTimeout(callback, ms),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

// A whole-millisecond delay, inclusive of both ends. `random` returns [0, 1) like Math.random.
export function randomDelay(random: () => number = Math.random, min = MIN_DELAY_MS, max = MAX_DELAY_MS): number {
  return Math.round(min + random() * (max - min));
}

export interface TypeTextOptions {
  /** Called with the text typed so far, each time a character is added. */
  onUpdate: (shown: string) => void;
  /** Called once, when the whole text has been shown (also when finish() is used). */
  onDone?: () => void;
  /** Pause before the first character, in ms. Defaults to a normal 30–70 ms delay. */
  startDelay?: number;
  /** Show everything in one step instead of typing (for reduced motion). */
  instant?: boolean;
  random?: () => number;
  scheduler?: Scheduler;
}

export interface Typing {
  /** Stop without showing the rest and without calling onDone. */
  cancel(): void;
  /** Show the rest of the text immediately and call onDone. */
  finish(): void;
  readonly done: boolean;
}

export function typeText(text: string, options: TypeTextOptions): Typing {
  const { onUpdate, onDone, startDelay, instant = false, random = Math.random, scheduler = browserScheduler } = options;
  // Array.from splits by code point, so emoji and other multi-unit characters are never cut in half.
  const characters = Array.from(text);
  let shown = 0;
  let handle: unknown = null;
  let done = false;

  function complete() {
    if (done) return;
    done = true;
    handle = null;
    onDone?.();
  }

  function tick() {
    handle = null;
    if (instant) shown = characters.length;
    else shown += 1;
    onUpdate(characters.slice(0, shown).join(""));
    if (shown >= characters.length) complete();
    else handle = scheduler.set(tick, randomDelay(random));
  }

  if (characters.length === 0) handle = scheduler.set(complete, 0);
  else handle = scheduler.set(tick, instant ? 0 : startDelay ?? randomDelay(random));

  return {
    cancel() {
      if (handle !== null) scheduler.clear(handle);
      handle = null;
      done = true;
    },
    finish() {
      if (done) return;
      if (handle !== null) scheduler.clear(handle);
      handle = null;
      onUpdate(text);
      complete();
    },
    get done() {
      return done;
    },
  };
}
