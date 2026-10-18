"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent } from "react";
import { createMapEngine } from "@/lib/map-engine";
import type { MapEngine } from "@/lib/map-engine";
import { schools as defaultSchools } from "@/lib/philosophy-map";
import type { School } from "@/lib/philosophy-map";

export interface PhilosophyMapProps {
  schools?: School[];
  /** Controlled selection. Leave undefined to let the map manage its own. */
  selectedId?: string | null;
  /** Called with the school's full data when one is clicked, or null when the selection is cleared. */
  onSelect?: (school: School | null) => void;
  /** Where the selected node sits, as a fraction of the map's height (negative = higher). Default 0 is true center. */
  selectedOffsetY?: number;
  className?: string;
  /** Positioning for the keyboard-accessible school list (shown while focused). Default: top-left corner. */
  listClassName?: string;
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export default function PhilosophyMap({
  schools = defaultSchools,
  selectedId,
  onSelect,
  selectedOffsetY = 0,
  className = "",
  listClassName = "left-3 top-3",
}: PhilosophyMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MapEngine | null>(null);
  const [internalId, setInternalId] = useState<string | null>(null);
  const activeId = selectedId !== undefined ? selectedId : internalId;
  const active = schools.find((school) => school.id === activeId) ?? null;
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const pick = useCallback(
    (id: string | null) => {
      setInternalId(id);
      onSelect?.(id ? schools.find((school) => school.id === id) ?? null : null);
    },
    [onSelect, schools],
  );

  // The engine's click handler always calls the latest `pick`.
  const pickRef = useRef(pick);
  useEffect(() => {
    pickRef.current = pick;
  }, [pick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = createMapEngine(canvas, schools, (id) => pickRef.current(id));
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [schools]);

  useEffect(() => {
    engineRef.current?.setActive(activeId);
  }, [activeId, schools]);

  useEffect(() => {
    engineRef.current?.setSelectedOffset(selectedOffsetY);
  }, [selectedOffsetY, schools]);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion, schools]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && activeId) pick(null);
  }

  return (
    <div onKeyDown={onKeyDown} className={`relative isolate overflow-clip bg-[#04050e] ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive map of five philosophical schools and how they relate. A list of the schools is available to keyboard users."
        className="absolute inset-0 h-full w-full"
        style={{ touchAction: "manipulation" }}
      />

      <div className={`absolute z-10 ${listClassName}`}>
        <ul
          aria-label="Philosophical schools"
          className="sr-only focus-within:not-sr-only focus-within:flex focus-within:flex-wrap focus-within:gap-2"
        >
          {schools.map((school) => (
            <li key={school.id}>
              <button
                type="button"
                aria-pressed={school.id === activeId}
                onClick={() => pick(school.id)}
                className="rounded-full border border-[#8ea0ff]/50 bg-[#0a0c1f] px-3 py-1.5 text-xs text-[#eef0ff] aria-pressed:bg-[#eef0ff] aria-pressed:text-[#0a0c1f]"
              >
                {school.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute right-4 top-4 z-10 flex flex-col gap-1.5 text-[11px] text-[#eef0ff]/70">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-[#2ee6ff] shadow-[0_0_8px_#2ee6ff]" /> Shared ground
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full bg-[#ff46c8] shadow-[0_0_8px_#ff46c8]" /> Tension
        </span>
      </div>

      <p role="status" className="sr-only">
        {active
          ? `${active.name} selected. Connected to ${active.connections.map((c) => `${c.name} (${c.label})`).join(", ")}.`
          : "No school selected."}
      </p>
    </div>
  );
}
