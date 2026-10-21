"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MAX_REFLECTION_LENGTH, reflectionFor } from "@/lib/reflections";
import { useReflections } from "@/lib/reflections-store";

const formatWhen = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

// Write, save, edit, and delete a reflection on one tenet. It never judges the answer: there is no
// "correct" response, and nothing here marks one as right or wrong. Reflections stay on this device.
export function ReflectionEditor({ tenetId, question, focusOnMount = false }: { tenetId: string; question: string; focusOnMount?: boolean }) {
  const { reflections, save, remove } = useReflections();
  const saved = reflectionFor(reflections, tenetId);
  // null means "not edited yet": the box shows the saved text, including text that arrives after hydration.
  const [draft, setDraft] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const id = useId();

  useEffect(() => {
    if (focusOnMount) textarea.current?.focus();
  }, [focusOnMount]);

  const value = draft ?? saved?.response ?? "";
  const dirty = draft !== null && draft !== (saved?.response ?? "");
  const canSave = dirty && value.trim().length > 0;

  function onSave() {
    save(tenetId, value);
    setDraft(null);
    setJustSaved(true);
  }

  return (
    <div className="space-y-3">
      <label htmlFor={`${id}-text`} className="block text-lg font-semibold leading-snug">
        {question}
      </label>
      <Textarea
        id={`${id}-text`}
        ref={textarea}
        value={value}
        maxLength={MAX_REFLECTION_LENGTH}
        rows={5}
        placeholder="Write what you think. There are no right or wrong answers here."
        onChange={(event) => {
          setDraft(event.target.value);
          setJustSaved(false);
        }}
        className="min-h-32 text-base leading-relaxed"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={onSave} disabled={!canSave}>
          {saved ? "Save changes" : "Save reflection"}
        </Button>
        {dirty && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setDraft(null);
              setJustSaved(false);
            }}
          >
            Discard changes
          </Button>
        )}
        {saved && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline">
                <Trash2 data-icon="inline-start" aria-hidden />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this reflection?</AlertDialogTitle>
                <AlertDialogDescription>It will be removed from this device. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    remove(tenetId);
                    setDraft(null);
                    setJustSaved(false);
                  }}
                >
                  Delete reflection
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <span className="ml-auto text-xs text-muted-foreground" aria-hidden>
          {value.length} / {MAX_REFLECTION_LENGTH}
        </span>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {justSaved && saved ? `Saved ${formatWhen(saved.updatedAt)}.` : saved && !dirty ? `Last saved ${formatWhen(saved.updatedAt)}.` : dirty ? "Unsaved changes." : ""}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">Saved only on this device, in this browser. This is for your own thinking and is not therapy or advice.</p>
    </div>
  );
}
