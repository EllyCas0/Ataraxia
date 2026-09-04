import QuestionInput from "@/components/QuestionInput";
import { questionLibrary } from "@/lib/questions";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
          What are you wondering about?
        </h1>
        <p className="text-foreground-muted mt-4 max-w-xl mx-auto">
          Bring a question about life, humanity, reality, or meaning. We
          won&apos;t hand you a single answer — we&apos;ll help you explore
          how different traditions of thought have approached it.
        </p>
      </div>

      <QuestionInput />

      <div className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-4">
          Or start from a question others have asked
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {questionLibrary.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-2">
                <span>{cat.emoji}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </div>
              <ul className="space-y-1.5">
                {cat.questions.map((q) => (
                  <li key={q}>
                    <a
                      href={`/explore?q=${encodeURIComponent(q)}`}
                      className="text-sm text-foreground-muted hover:text-accent-strong hover:underline underline-offset-2"
                    >
                      {q}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
