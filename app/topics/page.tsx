import { redirect } from "next/navigation";
import { domains } from "@/lib/domains";
import type { Domain } from "@/lib/types";

export default async function TopicsPage({ searchParams }: { searchParams: Promise<{ domain?: string }> }) {
  const { domain } = await searchParams;
  redirect(domains.includes(domain as Domain) ? `/questions?domain=${domain}` : "/questions");
}
