import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConversationView } from "@/components/chat/conversation-view";
import { demoConversations } from "@/lib/demo/data";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: demoConversations.find((c) => c.id === id)?.title ?? "Conversation" };
}

export default async function ConversationPage({ params }: { params: Params }) {
  const { id } = await params;
  const conversation = demoConversations.find((c) => c.id === id);
  if (!conversation) notFound();

  return (
    <div>
      <Link href="/reflect" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All conversations
      </Link>
      <ConversationView conversation={conversation} />
    </div>
  );
}
