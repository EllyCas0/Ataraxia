"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// PHASE 2 DEMO: this toggles local state only. Saving to the account is wired up in Phase 6.
export function SaveButton({ label = "Save", className }: { label?: string; className?: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      aria-pressed={saved}
      onClick={() => {
        setSaved((v) => !v);
        toast(saved ? "Removed from saved" : "Saved (preview only; saving to your account comes with sign-in)");
      }}
    >
      {saved ? <BookmarkCheck data-icon="inline-start" aria-hidden /> : <Bookmark data-icon="inline-start" aria-hidden />}
      {saved ? "Saved" : label}
    </Button>
  );
}
