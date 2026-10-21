import Link from "next/link";
import { SECTIONS, type SectionId } from "@/lib/philosophy/views";
import { cn } from "@/lib/utils";

// Each section is its own address (?section=...), so it can be bookmarked and works without scripts.
export function SectionNav({ basePath, current, label }: { basePath: string; current: SectionId; label: string }) {
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto px-1">
      <ul className="flex min-w-max gap-2 rounded-full border border-border bg-card p-1.5">
        {SECTIONS.map((section) => {
          const active = section.id === current;
          return (
            <li key={section.id}>
              <Link
                href={section.id === "overview" ? basePath : `${basePath}?section=${section.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
