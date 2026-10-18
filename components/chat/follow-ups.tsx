"use client";

export function FollowUps({ suggestions, onPick, disabled }: { suggestions: string[]; onPick: (text: string) => void; disabled?: boolean }) {
  if (suggestions.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">You could ask</p>
      <ul className="flex flex-wrap gap-2">
        {suggestions.map((text) => (
          <li key={text}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onPick(text)}
              className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-sm transition-colors hover:border-primary/50 hover:bg-accent disabled:opacity-60"
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
