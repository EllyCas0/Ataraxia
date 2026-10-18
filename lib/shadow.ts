// The Shadow: a Socratic conversation partner that only asks questions.
//
// This is a scripted stand-in for a live model: it quotes back a fragment of what the
// person said and rotates through classic Socratic moves (meaning, grounds, assumptions,
// counterexamples, implications, other views, certainty). `shadowReply` is the single
// seam to replace with a real model call later.

export const SHADOW_NAME = "The Shadow";
export const OPENING = "Tell me something you believe. What is on your mind?";

const LEAD_IN = /^(i('m| am)? (really |honestly |just )?(think|believe|feel|guess|suppose|know)( that)?|in my opinion|personally)[\s,]+/i;
const STOPWORDS = new Set([
  "about", "after", "again", "against", "because", "being", "could", "doesn't", "every", "everyone", "from", "have",
  "just", "more", "most", "never", "other", "people", "really", "should", "since", "still", "than", "that", "their",
  "them", "then", "there", "these", "they", "thing", "things", "this", "those", "through", "very", "what", "when",
  "where", "which", "while", "will", "with", "without", "would", "always", "something", "nothing", "anything",
]);

const clean = (text: string) => text.trim().replace(/\s+/g, " ");

// The first sentence of what was said, without "I think"-style lead-ins, shortened if long.
export function claimOf(text: string): string {
  const firstSentence = clean(text).replace(LEAD_IN, "").split(/(?<=[.!?])\s/)[0].replace(/[.!?]+$/, "");
  const words = firstSentence.split(" ");
  return words.length > 14 ? `${words.slice(0, 14).join(" ")}…` : firstSentence;
}

// The longest meaningful word, a good candidate to ask the person to define.
function keyWordOf(text: string): string | null {
  const words = clean(text)
    .toLowerCase()
    .split(/[^a-z'’-]+/)
    .filter((word) => word.length >= 5 && !STOPWORDS.has(word));
  return words.sort((a, b) => b.length - a.length)[0] ?? null;
}

interface Context {
  claim: string;
  key: string | null;
}

const moves: ((context: Context) => string)[] = [
  ({ claim, key }) =>
    `What do you mean by “${key ?? claim}”? How would you say it to someone who has never heard the word?`,
  ({ claim }) => `What happened in your life that led you to say “${claim}”?`,
  ({ claim }) => `What would have to be true for “${claim}” to hold? Is it true?`,
  ({ claim }) => `Can you think of a case where “${claim}” would not be so? What would you say about that case?`,
  ({ claim }) => `If “${claim}”, what follows from it? Would you accept that too?`,
  () => "Who would disagree with you here? What is the strongest thing they could say?",
  () => "How sure are you, on a scale of one to ten? What would move that number?",
];

export function shadowReply(userText: string, turn: number): string {
  const text = clean(userText);
  if (!text) return "Take your time. What is on your mind?";

  if (text.includes("?")) {
    return "What would you say if you had to answer that yourself? Where would you start?";
  }
  if (/^(i )?(don'?t|do not) know\b|^not sure\b|^no idea\b|^maybe\b/i.test(text)) {
    return "Where would you like to begin? Which part feels least certain to you?";
  }
  if (text.split(" ").length <= 2) {
    return `What is the first thing that comes to mind when you say “${text}”? Can you say a little more?`;
  }

  const context: Context = { claim: claimOf(text), key: keyWordOf(claimOf(text)) };
  return moves[((turn % moves.length) + moves.length) % moves.length](context);
}
