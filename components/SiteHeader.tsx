import Link from "next/link";

const NAV = [
  { href: "/questions", label: "Questions" },
  { href: "/philosophers", label: "Philosophers" },
  { href: "/analyze", label: "Analyze" },
  { href: "/journal", label: "Journal" },
  { href: "/profile", label: "Profile" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/86 backdrop-blur">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2 font-serif text-lg tracking-tight whitespace-nowrap shrink-0">
          <span className="h-7 w-7 rounded-md border border-border bg-surface grid place-items-center text-sm text-accent-strong shadow-sm transition-colors group-hover:border-ring">
            A
          </span>
          The Agora
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm text-foreground-muted overflow-x-auto min-w-0">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground transition-colors whitespace-nowrap shrink-0">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
