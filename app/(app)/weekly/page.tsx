import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WeeklyReflection } from "@/components/content/weekly-reflection";
import { Badge } from "@/components/ui/badge";
import { content } from "@/lib/content/repository";
import { getAppTimezone, weekStartKey, zonedDateKey } from "@/lib/time";

export const metadata: Metadata = { title: "This week's human perspective" };
export const dynamic = "force-dynamic";

export default function WeeklyPage() {
  const dateKey = zonedDateKey(new Date(), getAppTimezone());
  const prompt = content.weeklyPrompt(dateKey);
  const weekOf = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${weekStartKey(dateKey)}T00:00:00Z`));

  return (
    <div className="space-y-10">
      <div>
        <Link href="/discover" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Discover
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Human perspective · week of {weekOf}</p>
        <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{prompt.question}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{prompt.description}</p>
      </div>

      <section aria-labelledby="perspectives">
        <h2 id="perspectives" className="mb-4 text-2xl">
          Perspectives side by side
        </h2>
        <ul className={`grid gap-4 ${prompt.perspectives.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
          {prompt.perspectives.map((p) => (
            <li key={p.tradition} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              <Badge variant="secondary" className="w-fit">
                {p.tradition}
              </Badge>
              <p className="text-sm text-muted-foreground">{p.thinker}</p>
              <p className="font-serif text-xl leading-snug">{p.position}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.reasoning}</p>
              {p.conceptSlug && (
                <Link href={`/ideas/${p.conceptSlug}`} className="mt-auto pt-1 text-sm text-primary underline-offset-4 hover:underline">
                  Read more about this idea
                </Link>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          These are short summaries for orientation, not quotations, and each tradition contains more disagreement than a few lines can show.
        </p>
      </section>

      <section aria-labelledby="yours" className="rounded-2xl border border-border bg-secondary/50 p-6">
        <h2 id="yours" className="mb-4 text-2xl">
          Where do you land?
        </h2>
        <WeeklyReflection />
      </section>
    </div>
  );
}
