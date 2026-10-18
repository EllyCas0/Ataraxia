"use client";

import { useRef, useState } from "react";
import { AssistantMessage, UserMessage } from "@/components/chat/message";
import { Composer } from "@/components/chat/composer";
import { AiNotice } from "@/components/chat/notice";
import { ModeSwitcher } from "@/components/chat/mode-switcher";
import { starterPrompts, type ConversationMode } from "@/lib/content/chat";

export function NewConversation({
  initialMode = "explore_idea",
  initialText = "",
  contextLabel,
}: {
  initialMode?: ConversationMode;
  initialText?: string;
  contextLabel?: string;
}) {
  const [mode, setMode] = useState<ConversationMode>(initialMode);
  const [seed, setSeed] = useState({ text: initialText, n: 0 });
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);

  async function send(text: string) {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: next.slice(-20) }),
        signal: AbortSignal.timeout(60_000),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your message. Please try again.");
      if (typeof data.content !== "string" || !data.content.trim()) throw new Error("No reply was returned. Please try again.");
      setMessages([...next, { role: "assistant", content: data.content }]);
    } catch (cause) {
      setMessages(messages);
      setSeed((s) => ({ text, n: s.n + 1 }));
      setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "The reply took too long. Please try again.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl md:text-5xl">New conversation</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Bring a question, an idea, or a decision. You can change the style of conversation at any time.
        </p>
      </header>

      {contextLabel && (
        <p className="rounded-xl border border-primary/25 bg-accent/60 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Starting from: </span>
          <span className="font-medium">{contextLabel}</span>
        </p>
      )}

      <section aria-labelledby="mode-heading" className="space-y-3">
        <h2 id="mode-heading" className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          How would you like to think?
        </h2>
        <ModeSwitcher value={mode} onChange={setMode} />
      </section>

      <section aria-labelledby="starters-heading" className="space-y-3">
        <h2 id="starters-heading" className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Or start with one of these
        </h2>
        <ul className="flex flex-wrap gap-2">
          {starterPrompts.map((starter) => (
            <li key={starter.text}>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setMode(starter.mode);
                  setSeed((s) => ({ text: starter.text, n: s.n + 1 }));
                }}
                className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-sm transition-colors hover:border-primary/50 hover:bg-accent"
              >
                {starter.text}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Write your first message" className="space-y-3">
        {messages.length > 0 && (
          <div aria-label="Conversation" role="log" className="space-y-6">
            {messages.map((message, index) => message.role === "user"
              ? <UserMessage key={index} content={message.content} />
              : <AssistantMessage key={index} content={message.content} />)}
          </div>
        )}
        {busy && <p role="status" className="text-sm text-muted-foreground">Thinking…</p>}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Composer
          key={seed.n}
          initialValue={seed.text}
          onSend={send}
          busy={busy}
        />
        <AiNotice />
      </section>
    </div>
  );
}
