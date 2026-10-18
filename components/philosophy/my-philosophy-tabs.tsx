"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryPanel } from "@/components/philosophy/history-panel";
import { JournalPanel } from "@/components/philosophy/journal-panel";
import { SavedPanel } from "@/components/philosophy/saved-panel";
import { ValuesPanel } from "@/components/philosophy/values-panel";
import { demoJournal, demoRankedValues, demoSaved } from "@/lib/demo/data";
import type { MyPhilosophyTab } from "@/lib/my-philosophy-tabs";

export function MyPhilosophyTabs({ defaultTab }: { defaultTab: MyPhilosophyTab }) {
  const [tab, setTab] = useState<string>(defaultTab);
  return (
    <Tabs value={tab} onValueChange={setTab} className="gap-6">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 group-data-horizontal/tabs:h-auto sm:w-fit">
        <TabsTrigger value="journal" className="h-9 px-4 text-sm">
          Journal
        </TabsTrigger>
        <TabsTrigger value="saved" className="h-9 px-4 text-sm">
          Saved insights
        </TabsTrigger>
        <TabsTrigger value="values" className="h-9 px-4 text-sm">
          My values
        </TabsTrigger>
        <TabsTrigger value="history" className="h-9 px-4 text-sm">
          History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="journal">
        <JournalPanel initialEntries={demoJournal} />
      </TabsContent>
      <TabsContent value="saved">
        <SavedPanel initialItems={demoSaved} />
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
