"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// PHASE 2 PREVIEW: nothing is stored yet. Saving to a private journal entry arrives with sign-in.
export function WeeklyReflection() {
  const [text, setText] = useState("");
  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        toast("Preview only: saving reflections comes with sign-in");
      }}
    >
      <label htmlFor="weekly-reflection" className="block text-sm font-medium">
        Your own thoughts (private, and entirely optional)
      </label>
      <Textarea
        id="weekly-reflection"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        maxLength={8000}
        placeholder="Which perspective feels closest to your own view, and what does it leave out?"
        className="text-base"
      />
      <Button type="submit" size="lg" className="h-11 px-5 text-base" disabled={!text.trim()}>
        Save privately
      </Button>
    </form>
  );
}
