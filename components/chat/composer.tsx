"use client";

import { SendHorizontal } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
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
  footerLeft,
  className,
}: {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  /** Explains why sending is unavailable; shown under the box and announced to assistive tech. */
  disabledReason?: string;
  busy?: boolean;
  placeholder?: string;
  initialValue?: string;
  /** Something small shown at the bottom-left inside the box, such as the style chip. */
  footerLeft?: ReactNode;
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

  // Normal help sits quietly inside the box. A problem (too long, or sending is unavailable) is shown
  // below it so it is easy to see and is announced to assistive technology.
  const problem = disabledReason ?? (tooLong ? `That is ${value.length - MAX_MESSAGE_LENGTH} characters too long.` : undefined);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="rounded-3xl border border-input bg-card focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
        <label htmlFor="composer" className="sr-only">
          Your message
        </label>
        <textarea
          id="composer"
          ref={ref}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
          placeholder={placeholder}
          aria-describedby="composer-help"
          aria-invalid={tooLong}
          disabled={disabled}
          className="field-sizing-content block max-h-64 min-h-28 w-full resize-none bg-transparent px-5 pb-2 pt-4 text-lg leading-relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60"
        />
        <div className="flex items-center gap-3 px-3 pb-3">
          {footerLeft}
          <span className="flex-1" />
          {!problem && (
            <p id="composer-help" className="hidden text-xs text-muted-foreground sm:block">
              Enter to send · Shift+Enter for a new line
            </p>
          )}
          <Button
            type="button"
            size="icon-lg"
            className="size-11 rounded-full disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
            onClick={send}
            disabled={!canSend}
            aria-label="Send message"
          >
            <SendHorizontal aria-hidden />
          </Button>
        </div>
      </div>
      {problem && (
        <p id="composer-help" className="px-2 text-sm text-muted-foreground" role="status">
          {problem}
        </p>
      )}
    </div>
  );
}
