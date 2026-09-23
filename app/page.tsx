import Link from "next/link";
import QuestionInput from "@/components/QuestionInput";
import ContinueThinking from "@/components/ContinueThinking";
import { todaysQuestion, questions } from "@/lib/questions";
import { philosophers } from "@/lib/philosophers";

export default function Home() {
  const daily = todaysQuestion();
  const featured = philosophers.filter((p) =>
    ["kant", "hegel", "marx", "nietzsche", "arendt", "confucius"].includes(p.slug)
  );
  const challengeQuestion = questions[(new Date().getDate() + 7) % questions.length];

  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-24">
      <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-center">
        What are you thinking about?
      </h1>
      <p className="text-foreground-muted text-center mt-4 mb-10">
        Ask a philosophical question and meet a council of thinkers — no single answer, just better ways to reason it through.
      </p>

      <QuestionInput />

      <div className="mt-14 rounded-xl border border-border bg-surface p-6">
        <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">Today&apos;s question</p>
        <h2 className="font-serif text-2xl mb-4">{daily.text}</h2>
        <Link
          href={`/council?slug=${daily.slug}`}
          className="inline-block rounded-lg bg-accent-strong text-background font-medium px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          Explore
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-foreground-muted">
        <span>Thinkers</span>
        {featured.map((p, i) => (
          <span key={p.slug}>
            {i > 0 && <span className="mx-1">·</span>}
            <Link href={`/philosophers/${p.slug}`} className="hover:text-accent-strong hover:underline underline-offset-2">
              {p.name.split(" (")[0]}
            </Link>
          </span>
        ))}
      </div>

      <ContinueThinking />

      <div className="mt-8 rounded-xl border border-border p-6">
        <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">Challenge yourself</p>
        <p className="mb-4">
          Defend a position you disagree with: <span className="font-serif text-lg">{challengeQuestion.text}</span>
        </p>
        <Link
          href={`/council?slug=${challengeQuestion.slug}&mode=steelman`}
          className="inline-block rounded-lg border border-border px-5 py-2.5 text-sm hover:border-ring transition-colors"
        >
          Start
        </Link>
      </div>

      <p className="text-center mt-10">
        <Link href="/questions" className="text-sm text-foreground-muted hover:text-accent-strong hover:underline">
          Browse all questions →
        </Link>
      </p>
    </div>
  );
}
