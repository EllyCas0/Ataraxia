"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProfileDimension, ProfileState } from "@/lib/types";
import { createEmptyProfile, findTensions, positionOptions, selectedPositionDetails, togglePosition, updatePositionNote } from "@/lib/profile";
import { getProfile, saveProfile } from "@/lib/profile-storage";

const DIMENSIONS: { id: ProfileDimension; label: string }[] = [
  { id: "ethics", label: "Ethics" },
  { id: "epistemology", label: "Epistemology" },
  { id: "metaphysics", label: "Metaphysics" },
  { id: "political-philosophy", label: "Political Philosophy" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState | null>(null);

  useEffect(() => {
    // localStorage only exists in the browser — read after mount so SSR markup matches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(getProfile());
  }, []);

  if (!profile) return null;

  function toggle(dimension: ProfileDimension, id: string) {
    const next = togglePosition(profile!, dimension, id);
    saveProfile(next);
    setProfile(next);
  }

  function updateNote(id: string, note: string) {
    const next = updatePositionNote(profile!, id, note);
    saveProfile(next);
    setProfile(next);
  }

  const tensions = findTensions(profile);
  const selected = selectedPositionDetails(profile);
  const hasAny = DIMENSIONS.some((d) => profile[d.id].length > 0);
  const completedDimensions = DIMENSIONS.filter((d) => profile[d.id].length > 0);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Personal Philosophy</h1>
      <p className="text-foreground-muted mb-2">
        Not a personality test — just the positions you&apos;ve explicitly chosen to hold, described in your own view. Select as many or as few as feel true.
      </p>
      <p className="text-xs text-foreground-muted mb-8 rounded-lg border border-border bg-surface-muted p-3">
        This lives only in your browser. Nothing here is inferred from your behavior, and you can clear it any time.
      </p>

      <section className="mb-10 rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">Profile shape</p>
            <h2 className="font-serif text-2xl">
              {selected.length > 0 ? `${selected.length} explicit position${selected.length === 1 ? "" : "s"}` : "No positions selected yet"}
            </h2>
            <p className="text-sm text-foreground-muted mt-2 leading-relaxed">
              {completedDimensions.length > 0
                ? `Mapped across ${completedDimensions.map((d) => d.label).join(", ")}.`
                : "Start by choosing one position that feels true enough to examine."}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 min-w-40" aria-label="Profile coverage">
            {DIMENSIONS.map((d) => (
              <div
                key={d.id}
                title={d.label}
                className={`h-2 rounded-full ${profile[d.id].length > 0 ? "bg-accent-strong" : "bg-surface-muted"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {DIMENSIONS.map((d) => (
        <section key={d.id} className="mb-10">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted">{d.label}</h2>
            <span className="text-xs text-foreground-muted">{profile[d.id].length} selected</span>
          </div>
          <div className="space-y-2">
            {positionOptions[d.id].map((opt) => {
              const active = profile[d.id].includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className={`rounded-lg border transition-colors ${
                    active ? "border-accent-strong bg-surface-muted" : "border-border bg-surface"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(d.id, opt.id)}
                    aria-pressed={active}
                    className="w-full text-left px-4 py-3"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="font-medium text-sm block">{opt.label}</span>
                        <span className="text-xs text-foreground-muted mt-0.5 leading-relaxed block">{opt.blurb}</span>
                      </span>
                      <span className={`mt-1 h-4 w-4 rounded-full border shrink-0 ${active ? "border-accent-strong bg-accent-strong" : "border-border"}`} />
                    </span>
                  </button>
                  {active && (
                    <div className="px-4 pb-4">
                      <label className="block text-xs text-foreground-muted mb-1" htmlFor={`note-${opt.id}`}>
                        Why this fits you
                      </label>
                      <textarea
                        id={`note-${opt.id}`}
                        value={profile.notes[opt.id] ?? ""}
                        onChange={(e) => updateNote(opt.id, e.target.value)}
                        rows={2}
                        placeholder="Add your own reason, example, or caveat."
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {hasAny && (
        <section className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">Your current commitments</h2>
          <div className="space-y-3">
            {selected.map(({ dimension, option, note }) => (
              <div key={option.id} className="rounded-lg border border-border bg-surface p-4">
                <p className="text-xs text-foreground-muted mb-1">{DIMENSIONS.find((d) => d.id === dimension)?.label}</p>
                <p className="font-medium text-sm">{option.label}</p>
                <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{note || option.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hasAny && (
        <section className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">Worth examining</h2>
          {tensions.length > 0 ? (
            <div className="space-y-3">
              {tensions.map((t) => (
                <div key={t.a + t.b} className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm leading-relaxed">{t.prompt}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground-muted">No classic tensions detected among your current positions.</p>
          )}
        </section>
      )}

      {hasAny && (
        <section className="mb-10 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">Next questions</h2>
          <div className="space-y-2">
            <Link href="/council?slug=what-is-the-self" className="block text-sm text-accent-strong hover:underline">
              Test this profile against the question of the self
            </Link>
            <Link href="/council?slug=what-is-justice" className="block text-sm text-accent-strong hover:underline">
              Put your political and ethical commitments under pressure
            </Link>
            <Link href="/questions" className="block text-sm text-accent-strong hover:underline">
              Browse questions by domain
            </Link>
          </div>
        </section>
      )}

      {hasAny && (
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear your entire philosophy profile? This can't be undone.")) {
              const empty = createEmptyProfile();
              saveProfile(empty);
              setProfile(empty);
            }
          }}
          className="text-xs text-foreground-muted hover:text-foreground"
        >
          Clear my profile
        </button>
      )}
    </div>
  );
}
