"use client";

import { cn } from "@/lib/utils";
import { modes, type ConversationMode } from "@/lib/content/chat";

export function ModeSwitcher({
  value,
  onChange,
  disabled,
  className,
}: {
  value: ConversationMode;
  onChange: (mode: ConversationMode) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label="Conversation mode" className={cn("grid gap-2 sm:grid-cols-3", className)}>
      {modes.map((mode) => {
        const selected = mode.id === value;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(mode.id)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition-colors disabled:opacity-60",
              selected ? "border-primary bg-accent text-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <span className="block text-sm font-medium text-foreground">{mode.label}</span>
            <span className="mt-0.5 block text-xs leading-snug">{mode.description}</span>
          </button>
        );
      })}
    </div>
  );
}
