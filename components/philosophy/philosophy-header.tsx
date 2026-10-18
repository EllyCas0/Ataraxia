"use client";

import { useState } from "react";
import { Popover } from "radix-ui";
import { PrivacyNotice } from "@/components/philosophy/privacy-notice";

export function PhilosophyHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-fit" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <h1 className="text-4xl md:text-5xl">
          <Popover.Trigger asChild>
            <button type="button" className="cursor-help rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              My Philosophy
            </button>
          </Popover.Trigger>
        </h1>
        <Popover.Content
          align="start"
          sideOffset={0}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-50 w-[min(36rem,calc(100vw-2rem))] space-y-4 rounded-2xl border border-border bg-background p-4 shadow-lg"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            A private room for your own thinking: what you have written, saved, and decided matters most.
          </p>
          <PrivacyNotice />
        </Popover.Content>
      </Popover.Root>
    </header>
  );
}
