"use client";

import { useEffect, useRef, useState } from "react";
import { AmbientPlayer, moods } from "@/lib/ambient";
import { domainLabels } from "@/lib/domains";
import type { Domain } from "@/lib/types";

export default function AmbientSound({ domain }: { domain: Domain }) {
  const [on, setOn] = useState(false);
  const [volume, setVolume] = useState(40);
  const [error, setError] = useState("");
  const player = useRef<AmbientPlayer | null>(null);
  const mood = moods[domain];

  useEffect(() => {
    const current = player;
    return () => current.current?.dispose();
  }, []);

  async function toggle() {
    setError("");
    if (on) {
      player.current?.stop();
      setOn(false);
      return;
    }
    if (!AmbientPlayer.isSupported()) {
      setError("Sound isn't supported in this browser.");
      return;
    }
    try {
      player.current ??= new AmbientPlayer();
      await player.current.start(domain, volume / 100);
      setOn(true);
    } catch {
      setError("Couldn't start sound. Check that your browser allows audio on this page.");
    }
  }

  // Re-tune when the question's domain changes while sound is on.
  const lastDomain = useRef(domain);
  useEffect(() => {
    if (lastDomain.current !== domain) {
      lastDomain.current = domain;
      if (on) player.current?.setDomain(domain);
    }
  }, [domain, on]);

  return (
    <section aria-label="Ambient sound" className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
          on ? "border-accent-strong bg-accent-strong text-background" : "border-border text-foreground-muted hover:border-ring"
        }`}
      >
        {on ? "Sound on" : "Play ambient sound"}
      </button>
      {on && (
        <label className="flex items-center gap-2 text-xs text-foreground-muted">
          Volume
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVolume(next);
              player.current?.setVolume(next / 100);
            }}
            aria-label="Ambient sound volume"
            className="w-24 accent-[var(--accent-strong)]"
          />
        </label>
      )}
      <p role="status" className="text-xs text-foreground-muted">
        {error || (on ? `${mood.label} · matched to ${domainLabels[domain]}` : `Music matched to this question: ${mood.label.toLowerCase()}`)}
      </p>
    </section>
  );
}
