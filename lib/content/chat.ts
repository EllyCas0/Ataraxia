export const CONVERSATION_MODES = ["explore_idea", "examine_dilemma", "challenge_assumptions"] as const;
export type ConversationMode = (typeof CONVERSATION_MODES)[number];

export interface ModeInfo {
  id: ConversationMode;
  label: string;
  description: string;
}

export const modes: ModeInfo[] = [
  {
    id: "explore_idea",
    label: "Explore an idea",
    description: "Understand a concept, compare perspectives, and see why it matters.",
  },
  {
    id: "examine_dilemma",
    label: "Examine a dilemma",
    description: "Think through a personal or ethical question and the values in tension.",
  },
  {
    id: "challenge_assumptions",
    label: "Challenge my assumptions",
    description: "Test premises, blind spots, and alternative readings, respectfully.",
  },
];

export function isConversationMode(value: unknown): value is ConversationMode {
  return typeof value === "string" && (CONVERSATION_MODES as readonly string[]).includes(value);
}

// Three starters, one for each style of conversation. More would only make the choice harder.
export const starterPrompts: { text: string; mode: ConversationMode }[] = [
  { text: "What makes a life meaningful?", mode: "explore_idea" },
  { text: "Help me examine a difficult decision.", mode: "examine_dilemma" },
  { text: "What am I assuming without realizing it?", mode: "challenge_assumptions" },
];
