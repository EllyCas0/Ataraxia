"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { DEFAULT_MUSIC_VOLUME, MUSIC_ENABLED_KEY, MUSIC_VOLUME_KEY, TRACK, parseEnabled, parseVolume } from "@/lib/music";

function readSavedVolume(): number {
  if (typeof window === "undefined") return DEFAULT_MUSIC_VOLUME;
  try {
    return parseVolume(window.localStorage.getItem(MUSIC_VOLUME_KEY));
  } catch {
    return DEFAULT_MUSIC_VOLUME; // Storage can be unavailable (private windows, blocked site data).
  }
}

function readEnabled(): boolean {
  try {
    return parseEnabled(window.localStorage.getItem(MUSIC_ENABLED_KEY));
  } catch {
    return false;
  }
}

function saveEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(MUSIC_ENABLED_KEY, enabled ? "1" : "0");
  } catch {
    // Not remembering the choice is harmless.
  }
}

// A small music control in the bottom-left corner. It never starts on a first visit: the round button plays
// and pauses, and the slider sets the volume. If the person left it playing last time, it tries to resume
// quietly; when the browser refuses (it usually does until the page has been used) it simply stays paused and
// waits for the button. It lives in the app layout, so the music keeps playing while you move between pages.
export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  // The slider is only drawn once music is playing, so reading storage here cannot change the server-rendered markup.
  const [volume, setVolume] = useState(readSavedVolume);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const element = audio.current;
    if (!element || !readEnabled()) return;
    element.play().catch((error: unknown) => {
      // A blocked autoplay is expected and not an error; anything else (such as a missing file) is reported.
      if (!(error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "AbortError"))) setFailed(true);
    });
  }, []);

  async function toggle() {
    const element = audio.current;
    if (!element) return;
    if (!element.paused) {
      element.pause();
      saveEnabled(false);
      return;
    }
    setFailed(false);
    saveEnabled(true);
    try {
      await element.play();
    } catch {
      setFailed(true);
    }
  }

  function changeVolume(next: number) {
    setVolume(next);
    try {
      window.localStorage.setItem(MUSIC_VOLUME_KEY, String(next));
    } catch {
      // Not remembering the volume is harmless.
    }
  }

  const showPill = playing || failed;

  return (
    <div className="group fixed bottom-[4.75rem] left-4 z-40 flex items-center gap-3 md:bottom-6 md:left-28">
      <audio
        ref={audio}
        src={TRACK.src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause music: ${TRACK.title} by ${TRACK.artist}` : `Play music: ${TRACK.title} by ${TRACK.artist}`}
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/40 transition-transform hover:scale-105 motion-reduce:transition-none"
      >
        {playing ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
      </button>

      {showPill && (
        <div className="hidden h-12 max-w-[calc(100vw-6.5rem)] items-center gap-3 rounded-full border border-border bg-card/90 px-4 backdrop-blur group-hover:flex group-has-[:focus-visible]:flex">
          {failed ? (
            <p role="status" className="truncate text-sm text-muted-foreground">
              Audio file not found
            </p>
          ) : (
            <>
              <p className="min-w-0 truncate text-sm" title={`${TRACK.title} by ${TRACK.artist} (${TRACK.licence})`}>
                <span className="font-semibold">{TRACK.title}</span>
                <span className="hidden text-muted-foreground sm:inline"> · {TRACK.artist}</span>
              </p>
              <label className="flex items-center">
                <span className="sr-only">Music volume</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(event) => changeVolume(Number(event.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-[oklch(0.9_0.2_125)] sm:w-24"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
}
