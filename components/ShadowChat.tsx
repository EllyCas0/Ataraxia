"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, FormEvent, KeyboardEvent, SetStateAction } from "react";
import { OPENING, SHADOW_NAME, shadowReply } from "@/lib/shadow";
import { randomDelay, typeText } from "@/lib/typing";
import type { Typing } from "@/lib/typing";

interface Line {
  id: number;
  speaker: "you" | "shadow";
  text: string;
}

interface ActiveLine {
  id: number;
  shown: string;
}

const THINKING_MS = [700, 1400] as const; // a deliberate pause before The Shadow begins to answer

// Types one of The Shadow's lines, character by character at a 30-70 ms random cadence.
function typeLine(
  id: number,
  text: string,
  setActive: Dispatch<SetStateAction<ActiveLine | null>>,
  setAnnouncement: Dispatch<SetStateAction<string>>,
): Typing {
  return typeText(text, {
    startDelay: randomDelay(Math.random, THINKING_MS[0], THINKING_MS[1]),
    instant: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    onUpdate: (shown) => setActive({ id, shown }),
    onDone: () => {
      setActive(null);
      setAnnouncement(text); // the full line is announced once, instead of letter by letter
    },
  });
}

export default function ShadowChat() {
  const [lines, setLines] = useState<Line[]>([{ id: 0, speaker: "shadow", text: OPENING }]);
  const [active, setActive] = useState<ActiveLine | null>({ id: 0, shown: "" });
  const [announcement, setAnnouncement] = useState("");
  const [draft, setDraft] = useState("");
  const typing = useRef<Typing | null>(null);
  const nextId = useRef(1);
  const userTurns = useRef(0);
  const stickToBottom = useRef(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opening = typeLine(0, OPENING, setActive, setAnnouncement);
    typing.current = opening;
    return () => opening.cancel();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      stickToBottom.current = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the newest text in view while it types, unless the reader has scrolled up.
  useEffect(() => {
    if (stickToBottom.current) end.current?.scrollIntoView({ block: "end" });
  }, [lines.length, active?.shown]);

  function skip() {
    typing.current?.finish();
  }

  function send(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    typing.current?.finish(); // sending while The Shadow is still typing completes its line first
    const youId = nextId.current++;
    const shadowId = nextId.current++;
    const reply = shadowReply(text, userTurns.current++);
    stickToBottom.current = true;
    setLines((current) => [...current, { id: youId, speaker: "you", text }, { id: shadowId, speaker: "shadow", text: reply }]);
    setActive({ id: shadowId, shown: "" });
    typing.current = typeLine(shadowId, reply, setActive, setAnnouncement);
    setDraft("");
    if (input.current) input.current.style.height = "";
  }

  function beginAgain() {
    typing.current?.cancel();
    nextId.current = 1;
    userTurns.current = 0;
    setLines([{ id: 0, speaker: "shadow", text: OPENING }]);
    setActive({ id: 0, shown: "" });
    setAnnouncement("");
    setDraft("");
    typing.current = typeLine(0, OPENING, setActive, setAnnouncement);
    input.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    } else if (event.key === "Escape") {
      skip();
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4.1rem)] w-full max-w-2xl flex-col px-6 pt-10">
      <header className="mb-10 flex items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl">{SHADOW_NAME}</h1>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">A Socratic conversation. It will only ask you questions.</p>
        </div>
        <button type="button" onClick={beginAgain} className="shrink-0 text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline">
          Begin again
        </button>
      </header>

      {/* A plain script: a speaker's name, then what they say. No bubbles, no boxes. */}
      <div role="log" aria-label="Conversation" aria-live="off" onClick={skip} className="flex-1 space-y-7 pb-8">
        {lines.map((line) => {
          const isActive = active?.id === line.id;
          return (
            <div key={line.id} className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
              <p className={`text-sm tracking-wide sm:pt-1.5 ${line.speaker === "shadow" ? "text-accent" : "text-foreground-muted"}`}>
                {line.speaker === "shadow" ? `${SHADOW_NAME}:` : "You:"}
              </p>
              <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed" aria-hidden={isActive || undefined}>
                {isActive ? active.shown : line.text}
                {isActive && <span aria-hidden="true" className="shadow-caret" />}
              </p>
            </div>
          );
        })}
        <div ref={end} className="scroll-mb-48" />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* The next line of the script, waiting to be written. */}
      <form onSubmit={send} className="sticky bottom-0 bg-background/90 pb-8 pt-4 pr-16 backdrop-blur md:pr-0">
        <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-4">
          <label htmlFor="shadow-input" className="text-sm tracking-wide text-foreground-muted sm:pt-1.5">
            You:
          </label>
          <div>
            <textarea
              ref={input}
              id="shadow-input"
              rows={1}
              value={draft}
              maxLength={2000}
              autoFocus
              placeholder="Say what you believe…"
              onChange={(event) => {
                setDraft(event.target.value);
                event.target.style.height = "auto";
                event.target.style.height = `${event.target.scrollHeight}px`;
              }}
              onKeyDown={onKeyDown}
              className="w-full resize-none border-0 border-b border-border bg-transparent px-0 py-1.5 font-serif text-lg leading-relaxed outline-none placeholder:text-foreground-muted/60 focus:border-accent"
            />
            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-foreground-muted">
              <span className="hidden sm:inline">Enter to send · Shift+Enter for a new line · Esc to skip the typing</span>
              <span className="sm:hidden">Tap the text to skip the typing</span>
              <button type="submit" disabled={!draft.trim()} className="text-sm text-accent underline-offset-4 hover:underline disabled:opacity-40">
                Send
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
