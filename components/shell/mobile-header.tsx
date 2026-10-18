import Link from "next/link";
import { Plus } from "lucide-react";
import { NEW_CONVERSATION_HREF } from "./nav-items";

// On small screens the "new conversation" entry point lives in a slim top bar so it is always
// reachable, without covering page content the way a floating button would.
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur md:hidden">
      <Link href="/discover" className="font-serif text-lg tracking-tight">
        The Agora
      </Link>
      <Link
        href={NEW_CONVERSATION_HREF}
        aria-label="Start a new conversation"
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
      >
        <Plus className="size-4" aria-hidden />
        New
      </Link>
    </header>
  );
}
