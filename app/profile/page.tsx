"use client";

import { useEffect, useState } from "react";
import type { ProfileDimension, ProfileState } from "@/lib/types";
import { findTensions, getProfile, positionOptions, saveProfile, togglePosition } from "@/lib/profile";

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

  const tensions = findTensions(profile);
  const hasAny = DIMENSIONS.some((d) => profile[d.id].length > 0);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Personal Philosophy</h1>
      <p className="text-foreground-muted mb-2">
        Not a personality test — just the positions you&apos;ve explicitly chosen to hold, described in your own view. Select as many or as few as feel true.
      </p>
      <p className="text-xs text-foreground-muted mb-8 rounded-lg border border-border bg-surface-muted p-3">
        This lives only in your browser. Nothing here is inferred from your behavior, and you can clear it any time.
      </p>

      {DIMENSIONS.map((d) => (
        <section key={d.id} className="mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-3">{d.label}</h2>
          <div className="space-y-2">
            {positionOptions[d.id].map((opt) => {
              const active = profile[d.id].includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(d.id, opt.id)}
                  aria-pressed={active}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                    active ? "border-accent-strong bg-surface-muted" : "border-border bg-surface hover:border-ring"
                  }`}
                >
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-foreground-muted mt-0.5 leading-relaxed">{opt.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>
      ))}

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
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear your entire philosophy profile? This can't be undone.")) {
              const empty: ProfileState = { ethics: [], epistemology: [], metaphysics: [], "political-philosophy": [], notes: {} };
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
