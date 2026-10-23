import type { TenetView } from "@/lib/philosophy/views";
import { StatusLegend } from "./status-badge";
import { TenetCard } from "./tenet-card";

export function TenetGrid({ tenets, frameworkNote, basePath }: { tenets: TenetView[]; frameworkNote: string; basePath: string }) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="max-w-3xl leading-relaxed text-muted-foreground">{frameworkNote}</p>
        <StatusLegend />
      </div>
      <ol aria-label="Core tenets" className="grid items-start gap-4 md:grid-cols-2">
        {tenets.map((tenet) => (
          <TenetCard key={tenet.id} tenet={tenet} basePath={basePath} />
        ))}
      </ol>
    </div>
  );
}
