import { WomenTimeline } from "@/components/content/women-timeline";
import { LuminousBanner } from "@/components/content/luminous-women";
import { AboutIllustration, AncientWomanDrawing } from "@/components/content/about-illustrations";
import { ABOUT_PHILOSOPHY_INTRO, ANCIENT_WOMEN_TEXT, ANCIENT_WOMEN_TITLE, ancientWomen, aboutPhilosophy } from "@/lib/content/about-philosophy";

// A short explanation for the home page, with a drawing above each block. Nothing in it can be tabbed to, so it
// adds no clutter for keyboard users, and the three blocks stack on small screens.
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
            <AboutIllustration id={block.id} />
            <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span aria-hidden className="size-2 rounded-full" style={{ background: DOT[block.id] }} />
              {block.eyebrow}
            </p>
            <h3 className="mt-3 text-xl leading-snug">{block.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{block.text}</p>
          </div>
        ))}
      </div>

      <div data-testid="ancient-women" className="mt-10 border-t border-border pt-8">
        <LuminousBanner />
        <h3 className="mt-8 text-2xl">{ANCIENT_WOMEN_TITLE}</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{ANCIENT_WOMEN_TEXT}</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {ancientWomen.map((woman) => (
            <li key={woman.id} className="rounded-2xl border border-border bg-background/60 p-3">
              <AncientWomanDrawing id={woman.id} />
              <p className="mt-2 text-sm font-semibold">{woman.role}</p>
              <p className="text-xs leading-snug text-muted-foreground">{woman.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <WomenTimeline />
    </section>
  );
}
