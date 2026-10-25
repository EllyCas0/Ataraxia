"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useSavedItems } from "@/lib/browser-library";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DemoSavedItem } from "@/lib/demo/data";

const typeLabel: Record<DemoSavedItem["type"], string> = { question: "Question", concept: "Idea", insight: "Insight" };
const fmt = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

export function SavedPanel() {
  const [items, setItems] = useSavedItems();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
        <p>Nothing saved yet. Save a question, an idea, or a line from a conversation, and it will wait for you here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <Badge variant="secondary">{typeLabel[item.type]}</Badge>
            <p className="font-serif text-lg leading-snug">
              {item.href ? (
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.note ? `${item.note} · ` : ""}
              Saved {fmt(item.createdAt)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove “${item.title}” from saved`}
            onClick={() => {
              if (setItems((list) => list.filter((i) => i.id !== item.id))) toast("Removed from saved");
            }}
          >
            <X aria-hidden />
          </Button>
        </li>
      ))}
    </ul>
  );
}
