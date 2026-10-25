"use client";

import { useId, useState } from "react";
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
