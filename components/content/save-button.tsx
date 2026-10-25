"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSavedItems } from "@/lib/browser-library";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SaveButton({ title, href, label = "Save", className }: { title: string; href: string; label?: string; className?: string }) {
  const [items, update] = useSavedItems();
  const id = `concept:${href}`;
  const saved = items.some((item) => item.id === id);
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      aria-pressed={saved}
      onClick={() => {
        if (update((list) => list.some((item) => item.id === id)
          ? list.filter((item) => item.id !== id)
          : [{ id, type: "concept", title, href, createdAt: new Date().toISOString() }, ...list])) {
          toast(saved ? "Removed from saved" : "Saved in this browser");
        }
      }}
    >
      {saved ? <BookmarkCheck data-icon="inline-start" aria-hidden /> : <Bookmark data-icon="inline-start" aria-hidden />}
      {saved ? "Saved" : label}
    </Button>
  );
}
