import type { QuestionCategory } from "./types";

export const questionLibrary: QuestionCategory[] = [
  {
    id: "self",
    emoji: "🧠",
    label: "Self",
    questions: [
      "Who am I?",
      "Can people fundamentally change?",
      "What is the self?",
    ],
  },
  {
    id: "love",
    emoji: "❤️",
    label: "Love",
    questions: [
      "What is love?",
      "Can love exist without attachment?",
      "What do we owe our partners?",
    ],
  },
  {
    id: "society",
    emoji: "🌎",
    label: "Society",
    questions: [
      "What do humans owe each other?",
      "What is justice?",
      "Is equality possible?",
    ],
  },
  {
    id: "ethics",
    emoji: "⚖️",
    label: "Ethics",
    questions: [
      "What makes an action morally good?",
      "Is there objective morality?",
    ],
  },
  {
    id: "meaning",
    emoji: "🌌",
    label: "Meaning",
    questions: [
      "What makes life meaningful?",
      "Does life have inherent purpose?",
    ],
  },
  {
    id: "death",
    emoji: "⚰️",
    label: "Death",
    questions: [
      "Why do humans fear death?",
      "Does mortality give life meaning?",
    ],
  },
  {
    id: "technology",
    emoji: "🤖",
    label: "Technology",
    questions: [
      "Can AI be conscious?",
      "What does humanity owe intelligent machines?",
    ],
  },
  {
    id: "knowledge",
    emoji: "🔬",
    label: "Knowledge",
    questions: [
      "What can humans actually know?",
      "How do we determine what is true?",
    ],
  },
];

export const allSuggestedQuestions = questionLibrary.flatMap(
  (c) => c.questions
);
