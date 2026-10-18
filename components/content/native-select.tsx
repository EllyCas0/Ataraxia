import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// A plain <select>, styled to match the inputs. It works inside a normal GET form with no JavaScript,
// which keeps the ideas filters usable even before the page has hydrated.
export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}
