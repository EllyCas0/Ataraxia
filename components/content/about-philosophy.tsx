import { ABOUT_PHILOSOPHY_INTRO, aboutPhilosophy } from "@/lib/content/about-philosophy";

// A short, text-only explanation for the home page. Nothing in it can be tabbed to, so it adds no clutter
// for keyboard users, and the three blocks stack on small screens.
const DOT = { what: "oklch(0.8 0.17 25)", why: "oklch(0.88 0.16 95)", religion: "oklch(0.82 0.13 195)" } as const;

export function AboutPhilosophy() {
  return (
    <section aria-labelledby="about-philosophy" className="rounded-[2rem] border border-border bg-card/60 p-6 md:p-10">
      <h2 id="about-philosophy" className="text-3xl md:text-4xl">
        What is <span className="text-pop">philosophy?</span>
      </h2>
      <p className="mt-3 text-lg text-muted-foreground">{ABOUT_PHILOSOPHY_INTRO}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
        {aboutPhilosophy.map((block) => (
          <div key={block.id} data-testid={`about-${block.id}`}>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span aria-hidden className="size-2 rounded-full" style={{ background: DOT[block.id] }} />
              {block.eyebrow}
            </p>
            <h3 className="mt-3 text-xl leading-snug">{block.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{block.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
