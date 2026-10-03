"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/questions", label: "Questions" },
  { href: "/philosophers", label: "Philosophers" },
  { href: "/analyze", label: "Analyze" },
  { href: "/journal", label: "Journal" },
  { href: "/profile", label: "Profile" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/86 backdrop-blur">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2 font-serif text-lg tracking-tight whitespace-nowrap shrink-0">
          <span className="h-7 w-7 rounded-md border border-border bg-surface grid place-items-center text-sm text-accent-strong shadow-sm transition-colors group-hover:border-ring">
            A
          </span>
          The Agora
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-foreground-muted min-w-0" aria-label="Primary navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`hover:text-foreground transition-colors whitespace-nowrap shrink-0 ${
                pathname === item.href ? "text-foreground" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-foreground shadow-sm transition-colors hover:border-ring focusable"
        >
          <span className="grid gap-1.5" aria-hidden="true">
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Primary navigation"
          className="md:hidden border-t border-border/80 bg-background/96 shadow-sm"
        >
          <div className="max-w-4xl mx-auto px-3 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-surface-muted text-foreground"
                    : "text-foreground-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
