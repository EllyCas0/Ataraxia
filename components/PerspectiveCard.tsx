import Link from "next/link";
import type { Perspective } from "@/lib/types";

export default function PerspectiveCard({
  perspective,
  question,
}: {
  perspective: Perspective;
  question?: string;
}) {
  const href = question
    ? `/perspective/${perspective.slug}?q=${encodeURIComponent(question)}`
    : `/perspective/${perspective.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-lg border border-border bg-surface p-5 transition-all hover:border-ring hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl mb-2">{perspective.emoji}</div>
          <h3 className="font-serif text-lg leading-snug">{perspective.name}</h3>
          <p className="text-xs uppercase tracking-wide text-foreground-muted mt-1">
            {perspective.tradition}
          </p>
        </div>
      </div>
      <p className="text-sm text-foreground-muted mt-3 leading-relaxed">
        {perspective.coreIdea}
      </p>
      <span className="inline-block mt-4 text-sm text-accent-strong group-hover:underline">
        Explore this view →
      </span>
    </Link>
  );
}
