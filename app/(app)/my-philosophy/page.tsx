import type { Metadata } from "next";
import { MyPhilosophyTabs } from "@/components/philosophy/my-philosophy-tabs";
import { PrivacyNotice } from "@/components/philosophy/privacy-notice";
import { parseMyPhilosophyTab } from "@/lib/my-philosophy-tabs";

export const metadata: Metadata = { title: "My Philosophy" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MyPhilosophyPage({ searchParams }: { searchParams: SearchParams }) {
  const defaultTab = parseMyPhilosophyTab((await searchParams).tab);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl md:text-5xl">My Philosophy</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">A private room for your own thinking: what you have written, saved, and decided matters most.</p>
      </header>
      <PrivacyNotice />
      <MyPhilosophyTabs defaultTab={defaultTab} />
    </div>
  );
}
