import Link from "next/link";
import QuestionInput from "@/components/QuestionInput";
import PerspectiveCard from "@/components/PerspectiveCard";
import { matchQuestion } from "@/lib/match";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const question = (q ?? "").trim();

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-20 text-center">
        <p className="text-foreground-muted mb-6">
          Ask a question to begin exploring.
        </p>
        <QuestionInput />
      </div>
    );
  }

  const { perspectives, blurb } = matchQuestion(question);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
      <p className="text-xs uppercase tracking-wide text-foreground-muted mb-2">
        Your question
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl leading-snug mb-4">
        {question}
      </h1>
      <p className="text-foreground-muted mb-8 max-w-xl">{blurb}</p>

      <div className="mb-8">
        <QuestionInput initialValue={question} compact />
      </div>

      <h2 className="text-sm font-medium uppercase tracking-wide text-foreground-muted mb-4">
        Explore through
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {perspectives.map((p) => (
          <PerspectiveCard key={p.slug} perspective={p} question={question} />
        ))}
      </div>

      <p className="text-sm text-foreground-muted mt-10">
        Not seeing the angle you wanted?{" "}
        <Link href="/library" className="text-accent-strong hover:underline">
          Browse the full philosophy library
        </Link>
        .
      </p>
    </div>
  );
}
