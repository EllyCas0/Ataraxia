"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryPanel } from "@/components/philosophy/history-panel";
import { JournalPanel } from "@/components/philosophy/journal-panel";
import { SavedPanel } from "@/components/philosophy/saved-panel";
import { ValuesPanel } from "@/components/philosophy/values-panel";
import { demoRankedValues } from "@/lib/demo/data";
import type { MyPhilosophyTab } from "@/lib/my-philosophy-tabs";

export function MyPhilosophyTabs({ defaultTab }: { defaultTab: MyPhilosophyTab }) {
  const [tab, setTab] = useState<string>(defaultTab);
  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-6">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 group-data-horizontal/tabs:h-auto sm:w-fit">
        <TabsTrigger value="journal" className="h-9 px-4 text-sm">
          Journal &amp; saved
        </TabsTrigger>
        <TabsTrigger value="values" className="h-9 px-4 text-sm">
          My values
        </TabsTrigger>
        <TabsTrigger value="history" className="h-9 px-4 text-sm">
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="journal" className="space-y-10">
        <JournalPanel />
        <section aria-labelledby="saved-heading" className="space-y-3">
          <h2 id="saved-heading" className="text-2xl">
            Saved for later
          </h2>
          <p className="text-sm text-muted-foreground">Saved in this browser. Not synced between devices.</p>
          <SavedPanel />
        </section>
      </TabsContent>
      <TabsContent value="values">
        <ValuesPanel initialRanked={demoRankedValues} />
      </TabsContent>
      <TabsContent value="history">
        <HistoryPanel />
      </TabsContent>
    </Tabs>
  );
}
