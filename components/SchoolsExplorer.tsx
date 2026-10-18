"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PhilosophyMap from "./PhilosophyMap";
import { getSchool } from "@/lib/philosophy-map";
import type { LinkKind, School } from "@/lib/philosophy-map";

const NEON: Record<LinkKind, string> = { affinity: "#2ee6ff", tension: "#ff46c8" };

// Demo of the map's onSelect callback: the bottom sheet renders whichever school it receives.
export default function SchoolsExplorer() {
  const [selected, setSelected] = useState<School | null>(null);
  // Keep the last school around so the sheet's content doesn't vanish while it slides away.
  const [lastShown, setLastShown] = useState<School | null>(null);
  const shown = selected ?? lastShown;

  function handleSelect(school: School | null) {
    setSelected(school);
    if (school) setLastShown(school);
  }

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div className="relative h-full w-full">
      <PhilosophyMap className="h-full w-full" selectedId={selected?.id ?? null} onSelect={handleSelect} selectedOffsetY={-0.25} listClassName="left-5 top-28 right-5" />

      <div className={`pointer-events-none absolute left-5 top-5 z-10 max-w-[16rem] text-[#eef0ff] ${selected ? "hidden sm:block" : ""}`}>
        <h1 className="font-serif text-2xl">Schools of thought</h1>
        <p className="mt-1 text-sm text-[#eef0ff]/65">
          {selected ? "Neon lines show how this school connects to the others." : "Select a school to center it and see how it connects."}
        </p>
      </div>

      <section
        aria-label="School summary"
        aria-hidden={!selected}
        inert={!selected}
        style={{ transform: selected ? "translateY(0)" : "translateY(105%)", transition: "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        className="fixed inset-x-0 bottom-0 z-30 mx-auto h-[44dvh] min-h-[260px] w-full max-w-3xl overflow-y-auto rounded-t-[1.75rem] border border-b-0 border-[#8ea0ff]/25 bg-[#0a0c1f]/95 px-6 pb-24 pt-5 text-[#eef0ff] shadow-[0_-20px_60px_rgba(80,90,255,0.18)] backdrop-blur-xl"
      >
        {shown && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl leading-tight" style={{ textShadow: `0 0 18px hsla(${shown.hue}, 100%, 62%, 0.55)` }}>
                  {shown.name}
                </h2>
                <p className="mt-0.5 text-xs text-[#eef0ff]/60">
                  {shown.era} · {shown.region}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-full px-3 py-1 text-sm text-[#eef0ff]/65 hover:text-[#eef0ff]">
                Close
              </button>
            </div>

            <p className="mt-3 font-serif text-lg italic text-[#eef0ff]/90">{shown.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed text-[#eef0ff]/75">{shown.summary}</p>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#eef0ff]/50">Key ideas</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-[#eef0ff]/85">
                  {shown.keyIdeas.map((idea) => (
                    <li key={idea} className="flex gap-2">
                      <span aria-hidden="true" style={{ color: `hsl(${shown.hue}, 100%, 68%)` }}>
                        •
                      </span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#eef0ff]/50">Thinkers</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {shown.thinkers.map((thinker) =>
                    thinker.slug ? (
                      <Link
                        key={thinker.name}
                        href={`/philosophers/${thinker.slug}`}
                        className="rounded-full border border-[#8ea0ff]/40 px-3 py-1 text-xs hover:bg-[#8ea0ff]/15"
                      >
                        {thinker.name}
                      </Link>
                    ) : (
                      <span key={thinker.name} className="rounded-full border border-[#eef0ff]/15 px-3 py-1 text-xs text-[#eef0ff]/65">
                        {thinker.name}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <h3 className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[#eef0ff]/50">Connected to</h3>
            <ul className="mt-2 space-y-2">
              {shown.connections.map((connection) => (
                <li key={connection.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = getSchool(connection.id);
                      if (next) handleSelect(next);
                    }}
                    className="flex w-full items-start gap-3 rounded-xl border border-[#8ea0ff]/15 px-3 py-2.5 text-left hover:border-[#8ea0ff]/45 hover:bg-[#8ea0ff]/10"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: NEON[connection.kind], boxShadow: `0 0 8px ${NEON[connection.kind]}` }}
                    />
                    <span className="text-sm">
                      <span className="font-medium">{connection.name}</span>
                      <span className="text-[#eef0ff]/60"> · {connection.kind === "affinity" ? "shared ground" : "tension"}: {connection.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-[#eef0ff]/60">{connection.note}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
