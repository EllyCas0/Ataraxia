import { notFound } from "next/navigation";
import { getPerspective } from "@/lib/perspectives";
import ReflectClient from "@/components/ReflectClient";

export default async function ReflectPage({
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

  return <ReflectClient perspective={p} question={(q ?? p.coreQuestion).trim()} />;
}
