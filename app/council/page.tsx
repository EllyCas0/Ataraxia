import { redirect } from "next/navigation";
import CouncilClient from "@/components/CouncilClient";
import { getQuestion, questionFromText } from "@/lib/questions";
import type { CouncilMode } from "@/lib/types";

const VALID_MODES: CouncilMode[] = ["compare", "socratic", "steelman", "historical"];

export default async function CouncilPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; text?: string; mode?: string }>;
}) {
  const { slug, text, mode } = await searchParams;

  const question = slug ? getQuestion(slug) : text ? questionFromText(text) : undefined;
  if (!question) redirect("/questions");

  const initialMode = VALID_MODES.includes(mode as CouncilMode) ? (mode as CouncilMode) : "compare";

  return <CouncilClient question={question} initialMode={initialMode} />;
}
