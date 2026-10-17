import Link from "next/link";
import { domainLabels } from "@/lib/domains";
import ContinueThinking from "@/components/ContinueThinking";
import { todaysQuestion } from "@/lib/questions";

export default function Home() {
  const daily = todaysQuestion();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-20 pb-12">
      <section aria-labelledby="welcome-title" className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:gap-12 items-center">
        <div>
          <h1 id="welcome-title" className="font-serif text-5xl sm:text-6xl leading-[1.08] tracking-tight">
            Clarify what<br /><span className="italic text-accent">you think.</span>
          </h1>
          <p className="text-foreground-muted mt-5 mb-7 leading-relaxed">
            Explore other perspectives and form your own response.
          </p>
          <Link href={`/council?slug=${daily.slug}`} className="inline-flex items-center rounded-lg bg-accent-strong text-background px-6 py-3 text-sm font-medium hover:opacity-90">Start reflecting →</Link>
          <form action="/questions" role="search" className="mt-6 flex flex-col sm:flex-row gap-2 rounded-xl border border-border bg-surface p-2 shadow-sm focus-within:border-ring">
            <label htmlFor="topic-search" className="sr-only">Search for a topic</label>
            <input id="topic-search" name="q" type="search" required maxLength={200} placeholder="A topic on your mind…" className="focusable min-w-0 flex-1 rounded-lg bg-surface px-3 py-3 text-sm" />
            <button type="submit" className="rounded-lg border border-border text-accent px-5 py-3 text-sm font-medium hover:border-ring">Search →</button>
          </form>
          <Link href="/questions" className="inline-flex min-h-11 items-center mt-2 text-sm text-accent hover:underline underline-offset-4">Browse questions</Link>
        </div>

        <aside aria-label="Today's inspiration" className="home-daily relative flex flex-col gap-6 overflow-hidden rounded-2xl p-7 sm:p-8">
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.16em] opacity-75 mb-2">Today’s topic</p>
            <Link href={`/questions?domain=${daily.domain}`} className="font-serif text-2xl hover:underline underline-offset-4">{domainLabels[daily.domain]} →</Link>
          </div>
          <Link href={`/council?slug=${daily.slug}`} className="relative group">
            <h2 className="font-serif text-3xl leading-snug">{daily.text}</h2>
            <span className="inline-block text-sm mt-3 group-hover:underline underline-offset-4">Consider this question →</span>
          </Link>
        </aside>
      </section>
      <ContinueThinking />
    </div>
  );
}
