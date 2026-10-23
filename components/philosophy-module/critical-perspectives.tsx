import { sourcesFor } from "@/lib/philosophy/registry";
import type { CriticalPerspective, PerspectiveKind, TraditionBundle } from "@/lib/philosophy/types";
import { cn } from "@/lib/utils";

const GROUPS: { kind: PerspectiveKind; title: string; intro: string }[] = [
  { kind: "criticism", title: "Major criticisms", intro: "The strongest objections philosophers have raised." },
  { kind: "debate", title: "Open debates", intro: "Questions where thoughtful people on different sides still disagree." },
  { kind: "defence", title: "Arguments in support", intro: "Why some philosophers think the tradition is right, with the replies critics give." },
];

const KIND_LABEL: Record<PerspectiveKind, string> = { criticism: "Criticism", debate: "Debate", defence: "Argument in support" };
const KIND_TONE: Record<PerspectiveKind, string> = {
  criticism: "border-[oklch(0.62_0.16_25)] text-[oklch(0.9_0.07_25)]",
  debate: "border-[oklch(0.6_0.13_85)] text-[oklch(0.92_0.08_90)]",
  defence: "border-[oklch(0.55_0.12_195)] text-[oklch(0.9_0.06_195)]",
};

function Perspective({ perspective, bundle }: { perspective: CriticalPerspective; bundle: TraditionBundle }) {
  const sources = sourcesFor(bundle, perspective.sourceIds);
  return (
    <li>
      {/* A native disclosure: keyboard accessible and works without scripts. */}
      <details className="group rounded-3xl border border-border bg-card open:border-accent-foreground/40">
        <summary className="flex cursor-pointer list-none items-start gap-3 p-5 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 flex-1">
            <span className={cn("inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold", KIND_TONE[perspective.kind])}>{KIND_LABEL[perspective.kind]}</span>
            <span className="mt-2 block text-lg font-extrabold leading-snug">{perspective.title}</span>
            <span className="mt-1 block leading-relaxed text-muted-foreground">{perspective.summary}</span>
          </span>
          <span aria-hidden className="mt-1 text-xl text-muted-foreground transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="space-y-3 px-5 pb-5">
          <p className="leading-relaxed">{perspective.detail}</p>
          {sources.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Sources:{" "}
              {sources.map((source, i) => (
                <span key={source.id}>
                  {i > 0 && "; "}
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent-foreground underline underline-offset-4">
                      {source.author}, {source.title}
                    </a>
                  ) : (
                    `${source.author}, ${source.title}`
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </details>
    </li>
  );
}

export function CriticalPerspectives({ bundle }: { bundle: TraditionBundle }) {
  return (
    <div className="space-y-12">
      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
        A theory is worth understanding partly because of the best arguments against it. These are the main criticisms of {bundle.tradition.name}, the strongest replies, and the questions that remain open. They are
        arguments, not settled facts: the aim is to help you weigh them yourself.
      </p>
      {GROUPS.map((group) => {
        const items = bundle.perspectives.filter((p) => p.kind === group.kind);
        if (items.length === 0) return null;
        return (
          <section key={group.kind} aria-labelledby={`group-${group.kind}`} className="space-y-4">
            <div>
              <h2 id={`group-${group.kind}`} className="text-2xl">
                {group.title}
              </h2>
              <p className="mt-1 text-muted-foreground">{group.intro}</p>
            </div>
            <ul className="space-y-3">
              {items.map((perspective) => (
                <Perspective key={perspective.id} perspective={perspective} bundle={bundle} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
