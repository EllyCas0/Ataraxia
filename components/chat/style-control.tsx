"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ModeSwitcher } from "@/components/chat/mode-switcher";
import { modes, type ConversationMode } from "@/lib/content/chat";

// A conversation starts in one simple style (Explore an idea). The current style is always named, and
// the other two are one press of "Change style" away, so most people never need to see them.
export function StyleControl({ value, onChange, disabled }: { value: ConversationMode; onChange: (mode: ConversationMode) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const current = modes.find((mode) => mode.id === value);

  return (
    <section aria-label="Style of conversation" className="space-y-3">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-sm text-muted-foreground">
          Style: <span className="font-semibold text-foreground">{current?.label}</span>
        </span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="text-sm text-accent-foreground underline underline-offset-4 hover:text-foreground"
        >
          {open ? "Hide styles" : "Change style"}
        </button>
      </p>
      {open && (
        <div id={panelId}>
          <ModeSwitcher value={value} onChange={onChange} disabled={disabled} />
        </div>
      )}
    </section>
  );
}

// A compact version of the same control: a small chip that sits inside the message box. It names the current
// style and opens a panel with the three styles. The panel itself is drawn by the page (see NewConversation),
// so the chip only needs to know whether it is open.
export function StyleChip({ value, open, onToggle, panelId, disabled }: { value: ConversationMode; open: boolean; onToggle: () => void; panelId: string; disabled?: boolean }) {
  const current = modes.find((mode) => mode.id === value);
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={`Change style, now ${current?.label}`}
      disabled={disabled}
      onClick={onToggle}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background/60 px-3.5 text-sm font-medium transition-colors hover:border-accent-foreground/60 disabled:opacity-60"
    >
      {current?.label}
      <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
    </button>
  );
}
