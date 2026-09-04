"use client";

import Link from "next/link";
import { useState } from "react";
import type { Perspective } from "@/lib/types";
import { makeId, saveReflection } from "@/lib/journal";

export default function ReflectClient({
  perspective,
  question,
}: {
  perspective: Perspective;
  question: string;
}) {
  const [initialPosition, setInitialPosition] = useState("");
  const [newInsight, setNewInsight] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [remainingQuestions, setRemainingQuestions] = useState("");
  const [resonated, setResonated] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  function toggleIdea(idea: string) {
    setResonated((r) => (r.includes(idea) ? r.filter((x) => x !== idea) : [...r, idea]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveReflection({
      id: makeId(),
      createdAt: new Date().toISOString(),
      question,
      perspectiveSlug: perspective.slug,
      perspectiveName: perspective.name,
      initialPosition,
      newInsight,
      currentPosition,
      remainingQuestions,
      resonatedIdeas: resonated,
    });
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="max-w-xl mx-auto px-6 pt-24 pb-24 text-center">
        <div className="text-3xl mb-4">🌱</div>
        <h1 className="font-serif text-2xl mb-3">Recorded.</h1>
        <p className="text-foreground-muted mb-8">
          That&apos;s one more entry in your philosophy journey — a snapshot
          of how your thinking looked today, worth revisiting later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/journey"
            className="rounded-lg bg-accent-strong text-background font-medium px-6 py-3 hover:opacity-90 transition-opacity"
          >
            View My Journey
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-border px-6 py-3 hover:border-ring transition-colors"
          >
            Ask another question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 pt-14 pb-24">
      <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">
        Reflecting on &ldquo;{question}&rdquo; via {perspective.name}
      </p>
      <h1 className="font-serif text-3xl mb-8">What do you think now?</h1>

      <form onSubmit={submit} className="space-y-7">
        <Field
          label="Initial position"
          hint="What did you believe before this exploration?"
          value={initialPosition}
          onChange={setInitialPosition}
        />
        <Field
          label="New insights"
          hint="What idea challenged you most?"
          value={newInsight}
          onChange={setNewInsight}
        />
        <Field
          label="Current position"
          hint="What do you currently believe?"
          value={currentPosition}
          onChange={setCurrentPosition}
        />
        <Field
          label="Remaining questions"
          hint="What are you still uncertain about?"
          value={remainingQuestions}
          onChange={setRemainingQuestions}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Ideas that resonated</label>
          <p className="text-xs text-foreground-muted mb-3">
            Select any from {perspective.name} that stuck with you.
          </p>
          <div className="flex flex-wrap gap-2">
            {perspective.centralIdeas.map((idea) => {
              const active = resonated.includes(idea);
              return (
                <button
                  type="button"
                  key={idea}
                  onClick={() => toggleIdea(idea)}
                  className={`text-xs text-left px-3 py-2 rounded-lg border max-w-full transition-colors ${
                    active
                      ? "border-accent-strong bg-surface-muted"
                      : "border-border hover:border-ring"
                  }`}
                >
                  {idea}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-accent-strong text-background font-medium px-6 py-3.5 hover:opacity-90 transition-opacity"
        >
          Save to My Journey
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <p className="text-xs text-foreground-muted mb-2">{hint}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
        placeholder="Write freely…"
      />
    </div>
  );
}
