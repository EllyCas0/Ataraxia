import { BookOpenCheck, Lightbulb, Scale } from "lucide-react";
import type { ClaimStatus } from "@/lib/philosophy/types";
import { STATUS_HELP, STATUS_LABEL } from "@/lib/philosophy/views";
import { cn } from "@/lib/utils";

// The status is always spelled out in words and given an icon, never shown by colour alone.
const STYLES: Record<ClaimStatus, { icon: typeof Scale; className: string }> = {
  classical: { icon: BookOpenCheck, className: "border-[oklch(0.55_0.12_195)] bg-[oklch(0.3_0.07_195)] text-[oklch(0.92_0.05_195)]" },
  interpretation: { icon: Lightbulb, className: "border-[oklch(0.6_0.13_85)] bg-[oklch(0.32_0.07_85)] text-[oklch(0.93_0.07_90)]" },
  contested: { icon: Scale, className: "border-[oklch(0.62_0.16_25)] bg-[oklch(0.32_0.09_25)] text-[oklch(0.94_0.05_25)]" },
};

export function StatusBadge({ status, className }: { status: ClaimStatus; className?: string }) {
  const { icon: Icon, className: tone } = STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", tone, className)}>
      <Icon className="size-3.5" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StatusLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(STATUS_LABEL) as ClaimStatus[]).map((status) => (
        <div key={status} className="rounded-2xl border border-border bg-card p-4">
          <dt>
            <StatusBadge status={status} />
          </dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{STATUS_HELP[status]}</dd>
        </div>
      ))}
    </dl>
  );
}
