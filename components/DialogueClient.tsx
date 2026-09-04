"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage, DialogueMode, Perspective } from "@/lib/types";
import { dialogueModes, openingMessage, respond } from "@/lib/dialogue";

export default function DialogueClient({
  perspective,
  question,
}: {
  perspective: Perspective;
  question: string;
}) {
  const [mode, setMode] = useState<DialogueMode>("socratic");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { role: "ai", text: openingMessage("socratic", perspective, question), mode: "socratic" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [seenModes, setSeenModes] = useState<Set<DialogueMode>>(new Set(["socratic"]));
  const turnRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function switchMode(next: DialogueMode) {
    if (next === mode) return;
    setMode(next);
    if (!seenModes.has(next)) {
      setSeenModes((s) => new Set(s).add(next));
      setMessages((m) => [
        ...m,
        { role: "ai", text: openingMessage(next, perspective, question), mode: next },
      ]);
    }
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    const delay = 500 + Math.random() * 500;
    window.setTimeout(() => {
      const reply = respond(mode, perspective, text, turnRef.current);
      turnRef.current += 1;
      setMessages((m) => [...m, { role: "ai", text: reply, mode }]);
      setThinking(false);
    }, delay);
  }

  const reflectHref = `/reflect/${perspective.slug}?q=${encodeURIComponent(question)}`;
  const exploreOthersHref = `/explore?q=${encodeURIComponent(question)}`;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-8 pb-40 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-foreground-muted mb-1">
          Discussing &ldquo;{question}&rdquo; with
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xl">{perspective.emoji}</span>
          <h1 className="font-serif text-2xl">{perspective.name}</h1>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {messages.map((m, i) => (
          <ChatBubble key={i} message={m} />
        ))}
        {thinking && (
          <div className="flex items-center gap-1.5 text-foreground-muted text-sm pl-1">
            <Dot delay="0ms" /> <Dot delay="150ms" /> <Dot delay="300ms" />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {dialogueModes.map((dm) => (
              <button
                key={dm.id}
                onClick={() => switchMode(dm.id)}
                title={dm.description}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  mode === dm.id
                    ? "border-accent-strong bg-accent-strong text-background"
                    : "border-border hover:border-ring text-foreground-muted"
                }`}
              >
                {dm.emoji} {dm.label}
              </button>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what you think…"
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent-strong text-background text-sm font-medium px-5 hover:opacity-90 transition-opacity"
            >
              Send
            </button>
          </form>
          <div className="flex justify-between mt-2.5 text-xs">
            <Link href={exploreOthersHref} className="text-foreground-muted hover:text-accent-strong hover:underline">
              ← Explore another perspective
            </Link>
            <Link href={reflectHref} className="text-accent-strong hover:underline font-medium">
              I&apos;m ready to reflect →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const modeInfo = message.mode ? dialogueModes.find((m) => m.id === message.mode) : undefined;
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "order-2" : ""}`}>
        {!isUser && modeInfo && (
          <p className="text-[11px] text-foreground-muted mb-1 ml-1">
            {modeInfo.emoji} {modeInfo.label}
          </p>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm prose-calm ${
            isUser
              ? "bg-accent-strong text-background rounded-br-sm"
              : "bg-surface border border-border rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-foreground-muted inline-block animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
