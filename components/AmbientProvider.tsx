"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AmbientPlayer, moods } from "@/lib/ambient";
import { domainLabels } from "@/lib/domains";
import type { Domain } from "@/lib/types";

const DEFAULT_DOMAIN: Domain = "ethics";
const PREF_KEY = "agora:sound";
const VOLUME_KEY = "agora:sound-volume";

interface AmbientContextValue {
  setDomain: (domain: Domain) => void;
}

const AmbientContext = createContext<AmbientContextValue>({ setDomain: () => {} });

// Pages with a topic (the Council) call this so the music matches the question.
// Everywhere else the default mood plays.
export function useAmbientDomain(domain: Domain) {
  const { setDomain } = useContext(AmbientContext);
  useEffect(() => {
    setDomain(domain);
    return () => setDomain(DEFAULT_DOMAIN);
  }, [domain, setDomain]);
}

function readStorage(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function writeStorage(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* Preference just won't persist. */ }
}

export default function AmbientProvider({ children }: { children: React.ReactNode }) {
  const player = useRef<AmbientPlayer | null>(null);
  const [supported, setSupported] = useState(true);
  const [wanted, setWanted] = useState(false);
  const [running, setRunning] = useState(false);
  const [volume, setVolume] = useState(40);
  const [domain, setDomainState] = useState<Domain>(DEFAULT_DOMAIN);

  // Refs mirror state so event listeners and the imperative setDomain see current values.
  const wantedRef = useRef(false);
  const domainRef = useRef<Domain>(DEFAULT_DOMAIN);
  const volumeRef = useRef(40);

  const setDomain = useCallback((next: Domain) => {
    if (domainRef.current === next) return;
    domainRef.current = next;
    setDomainState(next);
    if (wantedRef.current) player.current?.setDomain(next);
  }, []);

  useEffect(() => {
    if (!AmbientPlayer.isSupported()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    const p = new AmbientPlayer();
    player.current = p;
    p.onStateChange((state) => setRunning(state === "running"));

    const storedVolume = Number(readStorage(VOLUME_KEY));
    if (Number.isFinite(storedVolume) && readStorage(VOLUME_KEY) !== null) {
      volumeRef.current = Math.min(100, Math.max(0, storedVolume));
      setVolume(volumeRef.current);
    }

    // Sound starts only after the visitor explicitly enables it.
    const want = readStorage(PREF_KEY) === "on";
    wantedRef.current = want;
    setWanted(want);
    if (want) p.start(domainRef.current, volumeRef.current / 100);

    const onGesture = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest?.("[data-sound-toggle]")) return; // the button handles its own click
      if (wantedRef.current) p.resume();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") p.pause();
      else if (wantedRef.current) p.resume();
    };
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      p.dispose();
      player.current = null;
    };
  }, []);

  function toggle() {
    const p = player.current;
    if (!p) return;
    if (wanted && running) {
      wantedRef.current = false;
      setWanted(false);
      writeStorage(PREF_KEY, "off");
      p.stop();
      return;
    }
    // Off, or waiting for the browser to allow sound: start it now (this click is the gesture).
    wantedRef.current = true;
    setWanted(true);
    writeStorage(PREF_KEY, "on");
    p.start(domainRef.current, volumeRef.current / 100);
  }

  function changeVolume(next: number) {
    volumeRef.current = next;
    setVolume(next);
    writeStorage(VOLUME_KEY, String(next));
    player.current?.setVolume(next / 100);
  }

  const status = !wanted ? "off" : running ? "playing" : "waiting";
  const mood = moods[domain];
  const label = status === "playing" ? "Turn music off" : status === "waiting" ? "Start music" : "Turn music on";

  return (
    <AmbientContext.Provider value={{ setDomain }}>
      {children}
      {supported && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
          {status === "waiting" && (
            <p role="status" className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground-muted shadow-sm">
              Music paused
            </p>
          )}
          {status === "playing" && (
            <div className="hidden sm:flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-1.5 shadow-sm">
              <span className="text-xs text-foreground-muted">{mood.label}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                aria-label="Music volume"
                className="w-20 accent-[var(--accent-strong)]"
              />
            </div>
          )}
          <button
            type="button"
            data-sound-toggle
            onClick={toggle}
            aria-label={label}
            title={status === "playing" ? `${label} · ${mood.label}, matched to ${domainLabels[domain]}` : label}
            className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-colors ${
              status === "playing"
                ? "border-accent-strong bg-accent-strong text-background"
                : "border-border bg-surface text-foreground-muted hover:border-ring hover:text-foreground"
            } ${status === "waiting" ? "animate-pulse" : ""}`}
          >
            <SoundIcon on={status === "playing"} />
          </button>
        </div>
      )}
    </AmbientContext.Provider>
  );
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <>
          <path d="m16 9 5 6" />
          <path d="m21 9-5 6" />
        </>
      )}
    </svg>
  );
}
