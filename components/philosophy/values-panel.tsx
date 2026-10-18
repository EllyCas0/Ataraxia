"use client";

import { ArrowDown, ArrowUp, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_RANKED_VALUES, seedValues } from "@/lib/content/values";
import { MAX_VALUE_NAME_LENGTH, addValue, moveValue, removeValue } from "@/lib/values";

// PHASE 2 PREVIEW: the ranking lives in component state. It is saved to your account in a later step.
// Nothing is ever added to this list for you: every value here is one you chose.
export function ValuesPanel({ initialRanked }: { initialRanked: string[] }) {
  const [ranked, setRanked] = useState(initialRanked);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  function add(name: string): boolean {
    const result = addValue(ranked, name);
    if (!result.ok) {
      setError(result.error);
      return false;
    }
    setError("");
    setRanked(result.values);
    setAnnouncement(`Added ${name} at rank ${result.values.length}.`);
    return true;
  }

  function submitCustom(event: FormEvent) {
    event.preventDefault();
    if (add(custom)) setCustom("");
  }

  const available = seedValues.filter((v) => !ranked.some((r) => r.toLowerCase() === v.name.toLowerCase()));
  const full = ranked.length >= MAX_RANKED_VALUES;

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Choose and rank up to {MAX_RANKED_VALUES} values that matter most to you right now. This list is yours alone: nothing is guessed or filled in for you, and you can change it whenever you like.
      </p>

      <section aria-labelledby="ranked-heading">
        <h3 id="ranked-heading" className="mb-3 text-2xl">
          Your values{" "}
          <span className="text-base font-normal text-muted-foreground">
            ({ranked.length} of {MAX_RANKED_VALUES})
          </span>
        </h3>
        {ranked.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">Pick a value below to begin.</p>
        ) : (
          <ol className="space-y-2">
            {ranked.map((value, index) => (
              <li key={value} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground" aria-hidden>
                  {index + 1}
                </span>
                <span className="flex-1 font-serif text-lg">{value}</span>
                <span className="sr-only">Rank {index + 1}.</span>
                <Button type="button" variant="ghost" size="icon" disabled={index === 0} aria-label={`Move ${value} up`} onClick={() => setRanked((r) => moveValue(r, index, -1))}>
                  <ArrowUp aria-hidden />
                </Button>
                <Button type="button" variant="ghost" size="icon" disabled={index === ranked.length - 1} aria-label={`Move ${value} down`} onClick={() => setRanked((r) => moveValue(r, index, 1))}>
                  <ArrowDown aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${value}`}
                  onClick={() => {
                    setRanked((r) => removeValue(r, value));
                    setError("");
                    setAnnouncement(`Removed ${value}.`);
                  }}
                >
                  <X aria-hidden />
                </Button>
              </li>
            ))}
          </ol>
        )}
        <p className="sr-only" role="status">
          {announcement}
        </p>
      </section>

      <section aria-labelledby="choose-heading">
        <h3 id="choose-heading" className="mb-3 text-2xl">
          Choose from these
        </h3>
        <ul className="flex flex-wrap gap-2">
          {available.map((v) => (
            <li key={v.name}>
              <button
                type="button"
                disabled={full}
                title={v.description}
                onClick={() => add(v.name)}
                className="rounded-full border border-border bg-card px-3.5 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {v.name}
              </button>
            </li>
          ))}
        </ul>
        {full && <p className="mt-3 text-sm text-muted-foreground">You have {MAX_RANKED_VALUES} values. Remove one to add another.</p>}
      </section>

      <form onSubmit={submitCustom} className="max-w-md space-y-2">
        <label htmlFor="custom-value" className="text-sm font-medium">
          Or add your own
        </label>
        <div className="flex gap-2">
          <Input
            id="custom-value"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              if (error) setError("");
            }}
            maxLength={MAX_VALUE_NAME_LENGTH + 10}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "custom-value-error" : undefined}
            placeholder="For example, Stewardship"
            className="h-10 text-base"
          />
          <Button type="submit" size="lg" className="h-10 px-4" disabled={!custom.trim() || full}>
            Add
          </Button>
        </div>
        {error && (
          <p id="custom-value-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
