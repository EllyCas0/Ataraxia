"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export default function QuestionInput({
  initialValue = "",
  compact = false,
}: {
  initialValue?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const router = useRouter();
  const inputId = useId();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) {
      setError("Write a question first.");
      return;
    }
    setError("");
    router.push(`/explore?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={inputId} className="sr-only">
        Philosophy question
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={inputId}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          placeholder="Ask a question about life, humanity, reality, or meaning..."
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`flex-1 rounded-lg border border-border bg-surface px-4 ${
            compact ? "py-2.5 text-sm" : "py-3.5"
          } outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors placeholder:text-foreground-muted/70`}
        />
        <button
          type="submit"
          className={`rounded-lg bg-accent-strong text-background font-medium px-6 ${
            compact ? "py-2.5 text-sm" : "py-3.5"
          } hover:opacity-90 transition-opacity whitespace-nowrap`}
        >
          Explore
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-accent-strong" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
