import type { Metadata } from "next";
import { NewConversation } from "@/components/chat/new-conversation";
import { isConversationMode } from "@/lib/content/chat";
import { content } from "@/lib/content/repository";

export const metadata: Metadata = { title: "New conversation" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function NewConversationPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // Only known, approved items are accepted as starting context; anything else is ignored.
  const question = content.questionBySlug(first(params.question));
  const concept = content.conceptBySlug(first(params.concept));
  const requestedMode = first(params.mode);

  let initialText = "";
  let contextLabel: string | undefined;
  let mode = isConversationMode(requestedMode) ? requestedMode : undefined;

  if (concept) {
    initialText = `Help me understand ${concept.title}.`;
    contextLabel = `${concept.title} (${concept.tradition})`;
    mode ??= "explore_idea";
  } else if (question) {
    initialText = question.question;
    contextLabel = question.question;
    mode ??= "examine_dilemma";
  }

  return <NewConversation initialMode={mode ?? "explore_idea"} initialText={initialText} contextLabel={contextLabel} />;
}
