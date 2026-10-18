"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, RefObject } from "react";
import { createPortal } from "react-dom";
import type { Quote } from "@/lib/quotes";
import { makeId } from "@/lib/journal";
import { saveEntry } from "@/lib/journal-storage";

const DISMISS_DISTANCE_PX = 110;

export default function ContemplationDrawer({
  open,
  quote,
  returnFocusRef,
  onClose,
  onSaved,
}: {
  open: boolean;
  quote: Quote;
  returnFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const titleId = useId();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const wasOpen = useRef(false);

  // Move focus into the drawer when it opens and back to the trigger when it closes.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const id = window.setTimeout(() => textarea.current?.focus({ preventScroll: true }), 60);
      return () => window.clearTimeout(id);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      returnFocusRef.current?.focus({ preventScroll: true });
    }
  }, [open, returnFocusRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function trapTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !panel.current) return;
    const focusable = panel.current.querySelectorAll<HTMLElement>("button:not(:disabled), textarea, a[href]");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    dragStart.current = event.clientY;
    setDragging(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* Dragging still works without capture on most browsers. */
    }
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragStart.current === null) return;
    setDragY(Math.max(0, event.clientY - dragStart.current));
  }

  function endDrag() {
    if (dragStart.current === null) return;
    const shouldClose = dragY > DISMISS_DISTANCE_PX;
    dragStart.current = null;
    setDragging(false);
    setDragY(0);
    if (shouldClose) onClose();
  }

  function save() {
    const body = text.trim();
    if (!body) return;
    try {
      saveEntry({
        id: makeId(),
        createdAt: new Date().toISOString(),
        question: `Daily contemplation: “${quote.text}” (${quote.author})`,
        initialPosition: body,
        reasoning: "",
        counterargument: "",
        revisedPosition: "",
        remainingUncertainty: "",
        philosopherSlugs: [],
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your reflection. Copy your text before leaving.");
      return;
    }
    setText("");
    setError("");
    onSaved();
    onClose();
  }

  // Rendered at the page root so the drawer and its scrim sit above the app-wide music button,
  // which lives outside this screen's stacking context.
  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
        inert={!open}
        onKeyDown={trapTab}
        style={{
          transform: open ? `translateY(${dragY}px)` : "translateY(100%)",
          transition: dragging ? "none" : "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="fixed inset-x-0 bottom-0 z-[65] mx-auto max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-[1.75rem] border border-b-0 border-[#f5efe6]/15 bg-[#14122a]/95 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[#f5efe6] shadow-2xl backdrop-blur-xl"
      >
        <div
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex cursor-grab touch-none justify-center pb-3 pt-3 active:cursor-grabbing"
        >
          <span aria-hidden="true" className="h-1 w-10 rounded-full bg-[#f5efe6]/30" />
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-serif text-xl leading-snug">
              What does this bring up?
            </h2>
            <button type="button" onClick={onClose} className="rounded-full px-2 py-1 text-sm text-[#f5efe6]/60 hover:text-[#f5efe6]">
              Close
            </button>
          </div>
          <p className="mt-1 text-sm text-[#f5efe6]/60">
            &ldquo;{quote.text}&rdquo; Saved privately to your journal, on this device only.
          </p>

          <label htmlFor={`${titleId}-text`} className="sr-only">
            Your reflection
          </label>
          <textarea
            id={`${titleId}-text`}
            ref={textarea}
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (error) setError("");
            }}
            rows={5}
            placeholder="Write whatever comes. It doesn't need to be finished."
            className="mt-4 w-full resize-none rounded-2xl border border-[#f5efe6]/15 bg-[#f5efe6]/5 px-4 py-3 text-base leading-relaxed text-[#f5efe6] outline-none placeholder:text-[#f5efe6]/35 focus:border-[#f5efe6]/45"
          />

          {error && (
            <p role="alert" className="mt-3 text-sm text-[#f0b8a0]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={save}
            disabled={!text.trim()}
            className="mt-4 w-full rounded-full bg-[#f5efe6] px-6 py-3 text-sm font-medium tracking-wide text-[#14122a] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Save to journal
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
