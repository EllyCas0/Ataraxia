"use client";

import { useState } from "react";
import { NotebookPen, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { newestFirst, reflectionFor } from "@/lib/reflections";
import { useReflections } from "@/lib/reflections-store";
import type { TenetView } from "@/lib/philosophy/views";
import { ReflectionEditor } from "./reflection-editor";

const formatWhen = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));

// Apply what you have read: each tenet is shown as a short scenario with a question, and anything you
// have already written can be revisited and edited. Nothing here scores or labels an answer.
export function ApplyReflect({ tenets }: { tenets: TenetView[] }) {
  const { reflections } = useReflections();
  const [editing, setEditing] = useState<string | null>(null);

  const mine = new Set(tenets.map((t) => t.id));
  const savedViews = newestFirst(reflections.filter((r) => mine.has(r.tenetId)));
  const byId = new Map(tenets.map((t) => [t.id, t]));
  const unanswered = tenets.filter((t) => !reflectionFor(reflections, t.id));

  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Each tenet comes with a short scenario and a question. Write as much or as little as you like. Nothing here is graded, and you can change your mind: come back and edit any reflection later.
      </p>
      <p role="status" className="text-sm font-semibold text-accent-foreground" data-testid="reflection-progress">
        {savedViews.length} of {tenets.length} questions reflected on so far
      </p>

      <section aria-labelledby="revisit" className="space-y-4">
        <h2 id="revisit" className="text-2xl">
          Revisit your reflections
        </h2>
        {savedViews.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-6 text-muted-foreground">You have not saved any reflections yet. Pick a question below to start.</p>
        ) : (
          <ul className="space-y-4">
            {savedViews.map((reflection) => {
              const tenet = byId.get(reflection.tenetId);
              if (!tenet) return null;
              const isEditing = editing === tenet.id;
              return (
                <li key={reflection.id} className="rounded-3xl border border-border bg-card p-5" data-testid="saved-reflection">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Tenet {tenet.number} · {tenet.title} · {formatWhen(reflection.updatedAt)}
                  </p>
                  {isEditing ? (
                    <div className="mt-3">
                      <ReflectionEditor tenetId={tenet.id} question={tenet.reflectionQuestion} focusOnMount />
                      <Button type="button" variant="ghost" className="mt-2" onClick={() => setEditing(null)}>
                        Close editor
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 font-semibold leading-snug">{tenet.reflectionQuestion}</p>
                      <p className="mt-3 whitespace-pre-wrap leading-relaxed">{reflection.response}</p>
                      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setEditing(tenet.id)} aria-label={`Edit your reflection on ${tenet.title}`}>
                        <Pencil data-icon="inline-start" aria-hidden />
                        Edit
                      </Button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="explore" className="space-y-4">
        <h2 id="explore" className="text-2xl">
          Questions still to explore
        </h2>
        {unanswered.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-6 text-muted-foreground">You have reflected on every question. You can revisit and edit any of them above.</p>
        ) : (
          <ul className="space-y-4">
            {unanswered.map((tenet) => {
              const isEditing = editing === tenet.id;
              return (
                <li key={tenet.id} className="rounded-3xl border border-border bg-card p-5" data-testid="open-question">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Tenet {tenet.number} · {tenet.title}
                  </p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.1em] text-accent-foreground">Scenario</p>
                  <p className="mt-1 leading-relaxed">{tenet.example}</p>
                  {isEditing ? (
                    <div className="mt-4">
                      <ReflectionEditor tenetId={tenet.id} question={tenet.reflectionQuestion} focusOnMount />
                    </div>
                  ) : (
                    <>
                      <p className="mt-4 text-lg font-semibold leading-snug">{tenet.reflectionQuestion}</p>
                      <Button type="button" className="mt-3" onClick={() => setEditing(tenet.id)} aria-label={`Reflect on ${tenet.title}`}>
                        <NotebookPen data-icon="inline-start" aria-hidden />
                        Reflect
                      </Button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
