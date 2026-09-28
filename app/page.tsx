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
    <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-16 pb-24">
      <section className="grid lg:grid-cols-[1fr_18rem] gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-accent-warm mb-3">A quieter way to think in public or private</p>
          <h1 className="font-serif text-4xl sm:text-6xl leading-tight">
            What are you thinking about?
          </h1>
          <p className="text-foreground-muted mt-5 mb-8 max-w-2xl leading-relaxed">
            Bring a question, compare several philosophical lenses, then write the position you can actually defend.
          </p>

          <QuestionInput />
        </div>

        <div className="paper-panel hairline-grid rounded-xl border border-border p-5">
          <p className="text-xs uppercase tracking-wide text-foreground-muted mb-4">Today&apos;s path</p>
          <div className="space-y-3">
            {["Ask", "Compare", "Revise"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-lg border border-border bg-surface/80 p-3">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-surface-muted text-xs font-medium text-accent-strong">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12 grid sm:grid-cols-3 gap-3">
        <InfoBlock title="Compare" text="See how different traditions frame the same question without collapsing them into one answer." />
        <InfoBlock title="Pressure-test" text="Write your own view, then let the Council expose assumptions, values, and possible weak spots." />
        <InfoBlock title="Return" text="Save revised positions privately and watch how your thinking changes across questions." />
      </div>

      <div className="mt-14 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-accent-cool mb-2">Today&apos;s question</p>
        <h2 className="font-serif text-2xl sm:text-3xl leading-snug mb-4">{daily.text}</h2>
        <Link
          href={`/council?slug=${daily.slug}`}
          className="inline-block rounded-lg bg-accent-strong text-background font-medium px-5 py-2.5 text-sm shadow-sm hover:opacity-90 transition-opacity"
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

      <div className="mt-8 rounded-xl border border-border bg-surface/70 p-6">
        <p className="text-xs uppercase tracking-wide text-accent-warm mb-2">Challenge yourself</p>
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

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3 shadow-sm">
      <h2 className="font-medium text-sm">{title}</h2>
      <p className="text-xs text-foreground-muted leading-relaxed mt-1">{text}</p>
    </div>
  );
}
