import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bundlesInCategory } from "@/lib/philosophy/registry";

export const metadata: Metadata = {
  title: "Ethics",
  description: "Guided tours of ethical traditions, starting with Natural Law.",
};

export default function EthicsPage() {
  const traditions = bundlesInCategory("Ethics");
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground">Philosophy</p>
        <h1 className="text-4xl md:text-5xl">Ethics</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Ethics asks how we should live and what we owe each other. Each guided tour below explains one tradition, the strongest arguments for and against it, and lets you write down what you think.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {traditions.map(({ tradition, tenets }) => (
          <li key={tradition.id}>
            <Link
              href={`/ethics/${tradition.id}`}
              className="group flex h-full flex-col gap-3 rounded-[2rem] border border-border bg-card p-6 transition-colors hover:border-accent-foreground/60"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{tenets.length} core tenets</span>
              <span className="text-2xl font-extrabold">{tradition.name}</span>
              <span className="leading-relaxed text-muted-foreground">{tradition.summary}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-accent-foreground">
                Start the tour
                <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground">
        Looking for other ethical ideas, such as the categorical imperative or the ethics of care? Browse them in{" "}
        <Link href="/ideas?theme=ethics-morality" className="text-accent-foreground underline underline-offset-4">
          Explore ideas
        </Link>
        .
      </p>
    </div>
  );
}
