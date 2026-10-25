import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const AI_NOTICE =
  "Replies are written by an AI and can be wrong or one-sided. This is a thinking tool, not therapy, medical advice, or crisis support.";

// The notice always stays. It has two looks: a boxed one, and a quiet single line for places where the box
// would compete with what people came to do (the new-conversation page).
export function AiNotice({ quiet = false }: { quiet?: boolean }) {
  return (
    <p className={cn("flex items-start gap-2 text-xs leading-relaxed text-muted-foreground", !quiet && "rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5", quiet && "px-2")}>
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{AI_NOTICE}</span>
    </p>
  );
}
