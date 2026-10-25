import Link from "next/link";

// On small screens the brand sits in a slim top bar. Moving around is done with the bottom bar, and a new
// conversation starts from the main button on Discover or Reflect.
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
      <Link href="/discover" className="inline-flex items-baseline gap-2 font-serif text-lg tracking-tight">
        The Agora
        <span className="font-sans text-xs font-medium tracking-normal text-muted-foreground">v0.2.0</span>
      </Link>
    </header>
  );
}
