"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DemoJournalEntry } from "@/lib/demo/data";
import { useJournal } from "@/lib/browser-library";
import { content } from "@/lib/content/repository";

const MAX_BODY = 20000;
const MAX_TITLE = 120;
const fmt = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

export function JournalPanel() {
  const [entries, setEntries] = useJournal();
  const [editing, setEditing] = useState<DemoJournalEntry | "new" | null>(null);

  function save(values: { title?: string; body: string }) {
    const now = new Date().toISOString();
    if (editing === "new") {
      if (!setEntries((list) => [{ id: crypto.randomUUID(), ...values, createdAt: now, updatedAt: now }, ...list])) return;
      toast("Entry saved in this browser");
    } else if (editing) {
      if (!setEntries((list) => list.map((e) => (e.id === editing.id ? { ...e, ...values, updatedAt: now } : e)))) return;
      toast("Entry updated in this browser");
    }
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Saved in this browser. Not synced between devices.</p>
        {editing === null && (
          <Button type="button" size="lg" className="h-10" onClick={() => setEditing("new")}>
            <Plus data-icon="inline-start" aria-hidden />
            New entry
          </Button>
        )}
      </div>

      {editing !== null && <EntryForm key={editing === "new" ? "new" : editing.id} initial={editing === "new" ? undefined : editing} onSave={save} onCancel={() => setEditing(null)} />}

      {entries.length === 0 && editing === null && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          <p>Nothing here yet. A few honest sentences are enough to begin.</p>
        </div>
      )}

      <ul className="space-y-4">
        {entries.map((entry) => {
          const concept = entry.linkedConceptSlug ? content.conceptBySlug(entry.linkedConceptSlug) : undefined;
          return (
            <li key={entry.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl leading-snug">{entry.title || "Untitled"}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {fmt(entry.createdAt)}
                    {entry.updatedAt !== entry.createdAt && ` · edited ${fmt(entry.updatedAt)}`}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button type="button" variant="outline" size="sm" onClick={() => setEditing(entry)} aria-label={`Edit ${entry.title || "untitled entry"}`}>
                    <Pencil data-icon="inline-start" aria-hidden />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm" aria-label={`Delete ${entry.title || "untitled entry"}`}>
                        <Trash2 data-icon="inline-start" aria-hidden />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                        <AlertDialogDescription>It will be permanently removed from your journal. This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep it</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            if (setEntries((list) => list.filter((e) => e.id !== entry.id))) toast("Entry deleted from this browser");
                          }}
                        >
                          Delete entry
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed">{entry.body}</p>
              {concept && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Linked idea:{" "}
                  <Link href={`/ideas/${concept.slug}`}>
                    <Badge variant="outline">{concept.title}</Badge>
                  </Link>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EntryForm({ initial, onSave, onCancel }: { initial?: DemoJournalEntry; onSave: (v: { title?: string; body: string }) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    onSave({ title: title.trim() || undefined, body: body.trim() });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-primary/30 bg-card p-5">
      <div className="space-y-1.5">
        <label htmlFor="entry-title" className="text-sm font-medium">
          Title <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input id="entry-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={MAX_TITLE} className="h-10 text-base" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="entry-body" className="text-sm font-medium">
          Reflection
        </label>
        <Textarea id="entry-body" value={body} onChange={(e) => setBody(e.target.value)} rows={7} maxLength={MAX_BODY} required className="text-base leading-relaxed" autoFocus />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="lg" className="h-10" disabled={!body.trim()}>
          Save entry
        </Button>
        <Button type="button" variant="ghost" size="lg" className="h-10" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
