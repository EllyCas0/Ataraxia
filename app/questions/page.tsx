import QuestionsClient from "@/components/QuestionsClient";
import { domains } from "@/lib/domains";
import type { Domain } from "@/lib/types";

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ q?: string; domain?: string }> }) {
  const { q, domain } = await searchParams;
  return <QuestionsClient key={`${q ?? ""}:${domain ?? ""}`} initialQuery={q ?? ""} initialDomain={domains.includes(domain as Domain) ? domain as Domain : null} />;
}
