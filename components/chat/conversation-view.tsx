"use client";

import { useSavedItems } from "@/lib/browser-library";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AssistantMessage, UserMessage } from "@/components/chat/message";
import { Composer } from "@/components/chat/composer";
import { FollowUps } from "@/components/chat/follow-ups";
import { StyleControl } from "@/components/chat/style-control";
import { AiNotice } from "@/components/chat/notice";
import type { DemoConversation } from "@/lib/demo/data";
import type { ConversationMode } from "@/lib/content/chat";

// Sample conversations stay read-only; insights can be saved to this browser's library.
export function ConversationView({ conversation }: { conversation: DemoConversation }) {
  const [, updateSaved] = useSavedItems();
  const [mode, setMode] = useState<ConversationMode>(conversation.mode);
  const [seed, setSeed] = useState({ text: "", n: 0 });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="max-w-2xl text-3xl leading-tight md:text-4xl">{conversation.title}</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline" size="lg" className="h-10">
              <Trash2 data-icon="inline-start" aria-hidden />
              Clear conversation
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear this conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the conversation and its messages from your account. Insights you saved are kept. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => toast("Preview only: nothing was deleted")}>
                Clear conversation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <p className="text-sm text-muted-foreground">Read-only example. Save responses in this browser; they are not synced between devices.</p>
      <StyleControl value={mode} onChange={setMode} />
      <AiNotice />

      <section aria-label="Conversation" className="space-y-8 py-2">
        {conversation.messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} content={message.content} />
          ) : (
            <AssistantMessage key={message.id} content={message.content} onSaveInsight={() => {
              const id = `insight:${conversation.id}:${message.id}`;
              if (updateSaved((items) => items.some((item) => item.id === id) ? items : [{
                id, type: "insight", title: message.content, note: `From example: ${conversation.title}`,
                createdAt: new Date().toISOString(),
              }, ...items])) toast("Insight saved in this browser");
            }} />
          ),
        )}
      </section>

      <FollowUps suggestions={conversation.followUps} onPick={(text) => setSeed((s) => ({ text, n: s.n + 1 }))} />

      <Composer
        key={seed.n}
        initialValue={seed.text}
        onSend={() => {}}
        disabled
        disabledReason="Read-only example. Live replies are unavailable in example conversations."
      />
    </div>
  );
}
