"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuestionInput({
  initialValue = "",
  compact = false,
}: {
  initialValue?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/council?text=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Philosophical question"
        placeholder="What are you thinking about?"
        className={`focusable flex-1 rounded-lg border border-border bg-surface px-4 shadow-sm ${
          compact ? "py-2.5 text-sm" : "py-3.5"
        } transition-colors placeholder:text-foreground-muted/70`}
      />
      <button
        type="submit"
        className={`rounded-lg bg-accent-strong text-background font-medium px-6 shadow-sm ${
          compact ? "py-2.5 text-sm" : "py-3.5"
        } hover:opacity-90 transition-opacity whitespace-nowrap`}
      >
        Ask the Council
      </button>
    </form>
  );
}
