import { notFound } from "next/navigation";
import { getPerspective } from "@/lib/perspectives";
import DialogueClient from "@/components/DialogueClient";

export default async function DialoguePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const p = getPerspective(slug);
  if (!p) notFound();

  return <DialogueClient perspective={p} question={(q ?? p.coreQuestion).trim()} />;
}
