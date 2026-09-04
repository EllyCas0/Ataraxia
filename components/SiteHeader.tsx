import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg tracking-tight">
          Ask
        </Link>
        <nav className="flex items-center gap-6 text-sm text-foreground-muted">
          <Link href="/library" className="hover:text-foreground transition-colors">
            Library
          </Link>
          <Link href="/journey" className="hover:text-foreground transition-colors">
            My Journey
          </Link>
        </nav>
      </div>
    </header>
  );
}
