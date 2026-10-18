// PHASE 2 PREVIEW DATA. Everything here is fictional sample content used to show what the private
// areas will look like. It is replaced by the signed-in user's real data from Phase 3 onward.
import type { ConversationMode } from "@/lib/content/chat";

export interface DemoMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface DemoConversation {
  id: string;
  title: string;
  mode: ConversationMode;
  updatedAt: string;
  messages: DemoMessage[];
  followUps: string[];
}

export const demoConversations: DemoConversation[] = [
  {
    id: "demo-worry",
    title: "Worrying about things I can't control",
    mode: "explore_idea",
    updatedAt: "2026-10-16T19:20:00Z",
    messages: [
      { id: "m1", role: "user", content: "I keep losing sleep over a decision my manager is about to make. Does philosophy have anything useful to say about that?" },
      {
        id: "m2",
        role: "assistant",
        content:
          "It might. Before I offer anything, one question: is the worry mostly about the decision itself, or about what you would have to do if it goes the wrong way?\n\nA tradition that speaks directly to this is Stoicism. Epictetus separated what is up to us (our judgments, choices, and effort) from what is not (other people's decisions and how things turn out). The idea is to put your energy where you actually have some say.\n\nThat is one view, not the only one. Critics point out that the line between the two is blurrier than it sounds, and that in a workplace you can often influence a decision even if you do not control it.",
      },
    ],
    followUps: ["What parts of this are actually mine to act on?", "How is the Stoic view different from simply not caring?", "Where might this idea fall short?"],
  },
  {
    id: "demo-promise",
    title: "Is it ever right to break a promise?",
    mode: "examine_dilemma",
    updatedAt: "2026-10-12T08:05:00Z",
    messages: [
      { id: "m1", role: "user", content: "I promised a friend I'd help them move this weekend, but a family emergency came up." },
      {
        id: "m2",
        role: "assistant",
        content:
          "I'm sorry that things are hard right now. Let's slow down a little. What matters most to you in this situation: keeping your word, being there for family, or something else?\n\nThere is a real tension here, and thoughtful people weigh it differently. Some ethical views treat a promise as a firm duty. Others ask which choice leads to the better outcome for everyone involved. Your own sense of what a good friend would do counts too.",
      },
    ],
    followUps: ["What would you want your friend to do in your place?", "Is there a way to keep part of the promise?"],
  },
  {
    id: "demo-assumptions",
    title: "What do I assume about success?",
    mode: "challenge_assumptions",
    updatedAt: "2026-10-03T21:40:00Z",
    messages: [
      { id: "m1", role: "user", content: "I think success means being recognized for your work." },
      {
        id: "m2",
        role: "assistant",
        content:
          "That is a common view, and it may be right. I'd like to test it gently. If no one ever recognized your work but you knew it was excellent and useful, would you still call that success?\n\nYour answer would help show whether recognition is part of what you mean by success, or a sign of it.",
      },
    ],
    followUps: ["What would success look like if no one saw it?", "Whose idea of success am I using?"],
  },
];

export interface DemoJournalEntry {
  id: string;
  title?: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  linkedConceptSlug?: string;
}

export const demoJournal: DemoJournalEntry[] = [
  {
    id: "j1",
    title: "On what I can control",
    body: "I spent the evening drafting emails to people who may never respond. I want to try putting my effort into the draft and then letting go of the reply.",
    createdAt: "2026-10-16T21:10:00Z",
    updatedAt: "2026-10-16T21:10:00Z",
    linkedConceptSlug: "dichotomy-of-control",
  },
  {
    id: "j2",
    body: "Noticed how often I say 'I have no choice.' Most of the time that is not strictly true. It is more that the other choices cost something I do not want to pay.",
    createdAt: "2026-10-09T07:45:00Z",
    updatedAt: "2026-10-09T07:45:00Z",
    linkedConceptSlug: "bad-faith",
  },
];

export interface DemoSavedItem {
  id: string;
  type: "question" | "concept" | "insight";
  title: string;
  note?: string;
  href?: string;
  createdAt: string;
}

export const demoSaved: DemoSavedItem[] = [
  { id: "s1", type: "insight", title: "Put effort into the draft, then let go of the reply.", note: "From a conversation about worry", createdAt: "2026-10-16T19:30:00Z" },
  { id: "s2", type: "concept", title: "Bad faith", href: "/ideas/bad-faith", createdAt: "2026-10-09T07:50:00Z" },
  { id: "s3", type: "question", title: "What would you do differently if you were certain no one would judge you?", createdAt: "2026-10-05T12:00:00Z" },
];

export const demoRankedValues = ["Truth", "Curiosity", "Connection"];
