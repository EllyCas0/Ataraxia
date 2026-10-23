export default function IdeasLoading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <header>
        <h1 className="text-4xl md:text-5xl">Explore ideas</h1>
        <p role="status" className="mt-3 text-lg text-muted-foreground">
          Loading your ideas…
        </p>
      </header>
      <div aria-hidden="true" className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-48 rounded-2xl border border-border bg-card motion-safe:animate-pulse" />
        ))}
      </div>
    </div>
  );
}
