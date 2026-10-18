import { Info } from "lucide-react";

export const AI_NOTICE =
  "Replies are written by an AI and can be wrong or one-sided. This is a thinking tool, not therapy, medical advice, or crisis support.";

export function AiNotice() {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{AI_NOTICE}</span>
    </p>
  );
}
