"use client";

import { Dialog } from "radix-ui";
import { Settings as SettingsIcon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { TRACK } from "@/lib/music";

interface SettingsProps {
  playing: boolean;
  failed: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

export function Settings({ playing, failed, volume, onToggle, onVolumeChange }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Settings" title="Settings" className="fixed right-3 top-1.5 z-40 flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground md:bottom-24 md:left-7 md:right-auto md:top-auto">
          <SettingsIcon className="size-5" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-2xl">
          <Dialog.Title className="pr-10 text-2xl font-bold">Settings</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">Make a little space for yourself.</Dialog.Description>
          <Dialog.Close asChild>
            <button type="button" aria-label="Close settings" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full hover:bg-secondary"><X className="size-5" aria-hidden /></button>
          </Dialog.Close>

          <section className="mt-8" aria-labelledby="appearance-heading">
            <h2 id="appearance-heading" className="text-base">Appearance</h2>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <label htmlFor="settings-theme">Theme</label>
              <select id="settings-theme" value={theme ?? "dark"} onChange={(event) => setTheme(event.target.value)} className="rounded-xl border border-input bg-card px-3 py-2">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </section>

          <section className="mt-6 border-t border-border pt-6" aria-labelledby="music-heading">
            <h2 id="music-heading" className="text-base">Music</h2>
            <p className="mt-1 text-sm text-muted-foreground">{TRACK.title} · {TRACK.artist}</p>
            <button type="button" aria-pressed={playing} onClick={onToggle} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">{playing ? "Pause music" : "Play music"}</button>
            <label className="mt-5 block text-sm">
              <span className="flex justify-between">Volume <span>{Math.round(volume * 100)}%</span></span>
              <input aria-label="Settings music volume" type="range" min={0} max={1} step={0.05} value={volume} onChange={(event) => onVolumeChange(Number(event.target.value))} className="mt-3 h-6 w-full cursor-pointer accent-primary" />
            </label>
            {failed && <p role="status" className="mt-2 text-sm text-destructive">Music could not play. Try again.</p>}
          </section>

          <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">Your journal and saved items stay in this browser. They are not synced between devices. Your preferences are remembered here too.</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
