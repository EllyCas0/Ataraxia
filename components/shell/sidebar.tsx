"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { NEW_CONVERSATION_HREF, isActive, navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-24 flex-col items-center gap-6 border-r border-sidebar-border bg-sidebar py-6 md:flex">
      <Link href="/discover" className="font-serif text-lg leading-none tracking-tight text-foreground" aria-label="The Agora home">
        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.8_0.17_25)] via-[oklch(0.88_0.16_95)] to-[oklch(0.9_0.2_135)] text-[1.05rem] font-extrabold text-[oklch(0.2_0.04_285)]">A</span>
      </Link>

      <Link
        href={NEW_CONVERSATION_HREF}
        aria-label="Start a new conversation"
        className="group flex w-16 flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium text-primary"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-primary/85">
          <Plus className="size-5" aria-hidden />
        </span>
        New
      </Link>

      <nav aria-label="Primary" className="flex w-full flex-col items-center gap-1">
        {navItems.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-[4.5rem] flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-center text-[11px] font-medium leading-tight transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <item.icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
