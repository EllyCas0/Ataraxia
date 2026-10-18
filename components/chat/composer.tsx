"use client";

import { SendHorizontal } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MAX_MESSAGE_LENGTH = 4000;

// Enter sends; Shift+Enter inserts a newline. IME composition (for example typing Japanese or
// Chinese) is respected so Enter confirms a character instead of sending.
export function shouldSendOnKey(event: { key: string; shiftKey: boolean; isComposing?: boolean }): boolean {
  return event.key === "Enter" && !event.shiftKey && !event.isComposing;
}

export function Composer({
  onSend,
  disabled = false,
  disabledReason,
  busy = false,
  placeholder = "Write what is on your mind…",
  initialValue = "",
  className,
}: {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  /** Explains why sending is unavailable; shown under the box and announced to assistive tech. */
  disabledReason?: string;
  busy?: boolean;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLTextAreaElement>(null);
  const trimmed = value.trim();
  const tooLong = value.length > MAX_MESSAGE_LENGTH;
  const canSend = !disabled && !busy && trimmed.length > 0 && !tooLong;

  function send() {
    if (!canSend) return;
    const text = trimmed;
    setValue("");
    void onSend(text);
    ref.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (shouldSendOnKey({ key: event.key, shiftKey: event.shiftKey, isComposing: event.nativeEvent.isComposing })) {
      event.preventDefault();
      send();
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end gap-2 rounded-2xl border border-input bg-card p-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
        <label htmlFor="composer" className="sr-only">
          Your message
        </label>
        <textarea
          id="composer"
          ref={ref}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={placeholder}
          aria-describedby="composer-help"
          aria-invalid={tooLong}
          disabled={disabled}
          className="max-h-48 min-h-12 flex-1 resize-y bg-transparent px-2 py-1.5 text-base leading-relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        />
        <Button type="button" size="icon-lg" className="size-11 rounded-xl" onClick={send} disabled={!canSend} aria-label="Send message">
          <SendHorizontal aria-hidden />
        </Button>
      </div>
      <p id="composer-help" className="px-1 text-xs text-muted-foreground" role={disabledReason ? "status" : undefined}>
        {disabledReason ?? (tooLong ? `That is ${value.length - MAX_MESSAGE_LENGTH} characters too long.` : "Enter to send, Shift+Enter for a new line.")}
      </p>
    </div>
  );
}
