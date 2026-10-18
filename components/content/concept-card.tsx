import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Concept } from "@/lib/content/types";

export function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Link
      href={`/ideas/${concept.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card"
    >
      <Badge variant="secondary" className="w-fit">
        {concept.tradition}
      </Badge>
      <div>
        <h3 className="text-xl leading-snug text-foreground group-hover:text-primary">{concept.title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{concept.philosopher}</p>
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{concept.summary}</p>
    </Link>
  );
}
