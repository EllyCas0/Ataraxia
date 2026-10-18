import Link from "next/link";
import { BookOpen, Bookmark, MessageCircle, type LucideIcon } from "lucide-react";
import { demoConversations, demoJournal, demoSaved } from "@/lib/demo/data";

interface HistoryItem {
  id: string;
  at: string;
  kind: string;
  title: string;
  href: string;
  icon: LucideIcon;
}

const fmt = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(iso));

// A single timeline of everything you have done here, newest first.
export function HistoryPanel() {
  const items: HistoryItem[] = [
    ...demoConversations.map((c) => ({ id: `c-${c.id}`, at: c.updatedAt, kind: "Conversation", title: c.title, href: `/reflect/${c.id}`, icon: MessageCircle })),
    ...demoJournal.map((j) => ({ id: `j-${j.id}`, at: j.createdAt, kind: "Journal entry", title: j.title || "Untitled entry", href: "/my-philosophy?tab=journal", icon: BookOpen })),
    ...demoSaved.map((s) => ({ id: `s-${s.id}`, at: s.createdAt, kind: "Saved", title: s.title, href: s.href ?? "/my-philosophy?tab=saved", icon: Bookmark })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Everything you have reflected on here, newest first. Sample entries shown as a preview.</p>
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href} className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40">
              <item.icon className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-serif text-lg leading-snug">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {item.kind} · {fmt(item.at)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
