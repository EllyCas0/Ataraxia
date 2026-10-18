import type { Metadata } from "next";
import { MyPhilosophyTabs } from "@/components/philosophy/my-philosophy-tabs";
import { PhilosophyHeader } from "@/components/philosophy/philosophy-header";
import { parseMyPhilosophyTab } from "@/lib/my-philosophy-tabs";

export const metadata: Metadata = { title: "My Philosophy" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MyPhilosophyPage({ searchParams }: { searchParams: SearchParams }) {
  const defaultTab = parseMyPhilosophyTab((await searchParams).tab);

  return (
    <div className="space-y-8">
      <PhilosophyHeader />
      <MyPhilosophyTabs defaultTab={defaultTab} />
    </div>
  );
}
