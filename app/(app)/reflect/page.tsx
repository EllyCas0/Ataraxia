import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { modes } from "@/lib/content/chat";
import { demoConversations } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Reflect" };

const modeLabel = (id: string) => modes.find((m) => m.id === id)?.label ?? id;
const formatDate = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

export default function ReflectPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl">Reflect</h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">A place to think out loud with a patient partner. Pick up an earlier conversation or begin a new one.</p>
        </div>
        <Link href="/reflect/new" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}>
          <Plus data-icon="inline-start" aria-hidden />
          New conversation
        </Link>
      </header>

      <section aria-labelledby="recent">
        <h2 id="recent" className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Recent conversations
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">Sample conversations shown as a preview.</p>
        <ul className="space-y-3">
          {demoConversations.map((c) => (
            <li key={c.id}>
              <Link href={`/reflect/${c.id}`} className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40">
                <span className="font-serif text-xl leading-snug">{c.title}</span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{modeLabel(c.mode)}</Badge>
                  <span>Updated {formatDate(c.updatedAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
