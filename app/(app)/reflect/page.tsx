import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { NewConversation } from "@/components/chat/new-conversation";
import { isConversationMode, modes } from "@/lib/content/chat";
import { content } from "@/lib/content/repository";
import { demoConversations } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Reflect" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
const modeLabel = (id: string) => modes.find((m) => m.id === id)?.label ?? id;
const formatDate = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

// Reflect opens straight onto a message box. Shortcuts from other pages (?question=, ?concept=, ?mode=) start the
// conversation from that item. Past conversations and the Reframe tool sit quietly underneath.
export default async function ReflectPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // Only known, approved items are accepted as starting context; anything else is ignored.
  const question = content.questionBySlug(first(params.question));
  const concept = content.conceptBySlug(first(params.concept));
  const requestedMode = first(params.mode);

  let initialText = "";
  let contextLabel: string | undefined;
  let mode = isConversationMode(requestedMode) ? requestedMode : undefined;

  if (concept) {
    initialText = `Help me understand ${concept.title}.`;
    contextLabel = `${concept.title} (${concept.tradition})`;
    mode ??= "explore_idea";
  } else if (question) {
    initialText = question.question;
    contextLabel = question.question;
    mode ??= "examine_dilemma";
  }

  return (
    <div className="space-y-12">
      <NewConversation initialMode={mode ?? "explore_idea"} initialText={initialText} contextLabel={contextLabel} />

      <section aria-labelledby="recent" className="space-y-3">
        <h2 id="recent" className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Recent conversations
        </h2>
        <p className="text-xs text-muted-foreground">Sample conversations shown as a preview.</p>
        <ul className="space-y-2">
          {demoConversations.map((c) => (
            <li key={c.id}>
              <Link href={`/reflect/${c.id}`} className="flex flex-col gap-1 rounded-2xl border border-border bg-card px-5 py-3 transition-colors hover:border-primary/40">
                <span className="font-serif text-lg leading-snug">{c.title}</span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{modeLabel(c.mode)}</Badge>
                  <span>Updated {formatDate(c.updatedAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="pt-2 text-muted-foreground">
          Carrying a worry?{" "}
          <Link href="/reframe" className="text-accent-foreground underline underline-offset-4">
            Reframe a worried thought
          </Link>{" "}
          to see it through four lenses.
        </p>
      </section>
    </div>
  );
}
