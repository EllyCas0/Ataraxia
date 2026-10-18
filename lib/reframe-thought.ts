// Turns a thought someone types into the four reframing versions (Anxious, Stoic,
// Growth, Cosmic). This is rule-based, not a language model: it picks a topic from
// keywords and writes each version around it, echoing the person's own words in the
// Anxious one. `reframeThought` is the single place to swap in a real model later.

import { reframes } from "./reframing";
import type { FrameworkId, Reframe } from "./reframing";

export const MIN_THOUGHT_LENGTH = 3;
export const MAX_THOUGHT_LENGTH = 300;

export type Topic = "generic" | "work" | "school" | "relationship" | "health" | "money" | "self";

export type ReframeResult =
  | { kind: "reframes"; thought: string; topic: Topic; versions: Reframe[] }
  | { kind: "support"; thought: string };

export const SUPPORT_MESSAGE = [
  "What you wrote sounds really heavy, and you deserve more care than a few lines on a screen can give. This tool can't help with thoughts like these.",
  "If you might hurt yourself, or you are in danger, please contact your local emergency number or a crisis line right now. In the US you can call or text 988. In other countries, findahelpline.com lists lines near you.",
  "If you can, tell someone you trust how you feel, even in a single sentence.",
];

// Language that points to self-harm. When it appears we do not reframe anything.
const CRISIS =
  /\b(kill(ing)? myself|suicid(e|al)|end(ing)? my (own )?life|end it all|want(ed)? to die|wanna die|don'?t want to (be here|live|exist)|no reason to live|better off dead|better off without me|(hurt|harm|cut)(ting)? myself|self[- ]?harm|can'?t go on)\b/i;

// Checked in this order: a self-judgment outranks the situation it came from.
const TOPIC_WORDS: [Exclude<Topic, "generic">, string[]][] = [
  ["self", ["not good enough", "failure", "stupid", "worthless", "imposter", "impostor", "useless", "hate myself", "loser", "inadequate", "unlovable"]],
  ["relationship", ["friend", "partner", "boyfriend", "girlfriend", "wife", "husband", "family", "mom", "dad", "mother", "father", "sister", "brother", "relationship", "dating", "lonely", "alone", "breakup", "marriage", "crush"]],
  ["health", ["sick", "illness", "health", "doctor", "pain", "surgery", "symptom", "cancer", "diagnosis", "diagnosed", "disease", "medical"]],
  ["money", ["money", "debt", "rent", "bill", "afford", "broke", "salary", "loan", "mortgage", "savings", "financial"]],
  ["school", ["exam", "test", "grade", "class", "school", "thesis", "homework", "study", "professor", "teacher", "university", "college", "assignment"]],
  ["work", ["job", "boss", "work", "career", "interview", "presentation", "promotion", "project", "deadline", "coworker", "colleague", "manager", "client", "meeting", "fired"]],
];

const TOPIC_PATTERNS = TOPIC_WORDS.map(([topic, words]) => [topic, new RegExp(`\\b(?:${words.join("|")})(?:s|es|ed|ing)?\\b`, "i")] as const);

const ABSOLUTES = ["never", "always", "everyone", "everybody", "nobody", "no one", "nothing", "everything", "forever", "completely"];

export function detectTopic(text: string): Topic {
  for (const [topic, pattern] of TOPIC_PATTERNS) if (pattern.test(text)) return topic;
  return "generic";
}

export function findAbsolute(text: string): string | null {
  return ABSOLUTES.find((word) => new RegExp(`\\b${word}\\b`, "i").test(text)) ?? null;
}

export function cleanThought(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^["“”‘’']+|["“”‘’']+$/g, "")
    .trim()
    .slice(0, MAX_THOUGHT_LENGTH);
}

function asSentence(text: string): string {
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

interface TopicVoices {
  anxious: string; // what comes after the person's own words
  stoic: string;
  growth: string;
  cosmic: string;
}

const VOICES: Record<Topic, TopicVoices> = {
  generic: {
    anxious: "I keep going over it, and it feels certain. If this goes wrong, it will be a disaster I can't recover from.",
    stoic: "I can't control how this turns out or what other people think. I can control my effort, my choices, and how I respond. I'll put my attention there and let the rest be.",
    growth: "This is one thought, not a verdict on me or my future. If part of it turns out to be true, I'll learn what to work on and get better. What is one small thing I can try next?",
    cosmic: "In a few years I may barely remember this worry. Within a whole life, and the long age of the world, this is one small moment, and I get to live through it.",
  },
  work: {
    anxious: "I keep replaying it, and it feels certain. If this goes wrong, everyone will notice, and it will follow me forever.",
    stoic: "I can't control how others judge my work or what decisions get made. I can control how well I prepare, how clearly I communicate, and how I handle whatever comes. I'll do my part well and let the rest be.",
    growth: "Work is where I get to practice. If something goes badly, I'll ask for feedback, find the exact thing to improve, and be stronger the next time.",
    cosmic: "In a few years almost no one will remember this week at work. Within a whole career, and a whole life, it is one small moment, and I get to take part in it.",
  },
  school: {
    anxious: "I keep replaying it, and it feels certain. If this goes wrong, it will ruin everything I've worked for.",
    stoic: "I can't control exactly what is asked or how it is marked. I can control how I study, how I rest, and how calm I stay while I work. I'll do those parts well and accept the result.",
    growth: "A grade measures how I did this time, not what I can become. If I fall short, I'll look at which parts I missed and learn them, and I'll do better the next time.",
    cosmic: "In a few years this result will be a small line in a long story. Within a whole life it is one small moment, and I get to keep learning long after it.",
  },
  relationship: {
    anxious: "I keep replaying it, and it feels certain. If this is as bad as it feels, I'll lose them, and it will all be my fault.",
    stoic: "I can't control what someone else feels or chooses. I can control how kindly and honestly I speak, how well I listen, and what I do next. I'll offer my part with care and let their part be theirs.",
    growth: "Hard moments with people are a chance to understand them, and myself, better. I can ask a question instead of guessing, say what I need plainly, and learn how to do this well.",
    cosmic: "People and seasons of life change more than they seem to in the moment. Within a whole life, this worry is one small thread in a very large web of connection, and I get to keep tending it.",
  },
  health: {
    anxious: "I keep checking and imagining the worst, and it feels certain. If something is wrong, I won't be able to cope.",
    stoic: "I can't control everything that happens in my body. I can control how I look after myself, which questions I ask, and who I ask for help. I'll do those things and let the rest be.",
    growth: "Worry about my health is a signal to take good care and ask good questions. I can get proper advice, learn what is in my hands, and build one small habit that helps.",
    cosmic: "Within a whole life, and the long age of the world, this is one small moment. That doesn't make my worry silly. It reminds me I'm held inside something much bigger than this moment.",
  },
  money: {
    anxious: "I keep running the numbers in my head, and it feels certain. If this goes wrong, I'll lose everything and there will be no way out.",
    stoic: "I can't control prices, markets, or what other people decide. I can control how I plan, what I spend, and what I do next. I'll act on the parts that are mine and let the rest be.",
    growth: "Money worries are a problem I can work on. I can look at the real numbers, find one thing to change, and build skills that make me steadier over time.",
    cosmic: "In a few years this stretch may look very different. Within a whole life it is one chapter, and I get to keep writing it.",
  },
  self: {
    anxious: "I keep going over it, and it feels true. Everyone can probably see it, and nothing will ever change.",
    stoic: "My worth isn't something one result or one person can hand me or take away. What is up to me is how I act today: with effort, with honesty, and with some kindness toward myself.",
    growth: "‘Not good enough’ is a story, not a measurement. Skills grow with practice, and everyone I admire was once a beginner. What is one thing I can practice today?",
    cosmic: "Against the age of the world, no one's worth is settled by one hour. I'm one small, real person doing my best in one small moment, and that is allowed to be enough.",
  },
};

// Returns null when there is nothing to reframe, the support message when the text points
// to self-harm, and otherwise the four versions in slider order.
export function reframeThought(raw: string): ReframeResult | null {
  const thought = cleanThought(raw);
  if (thought.length < MIN_THOUGHT_LENGTH) return null;
  if (CRISIS.test(thought)) return { kind: "support", thought };

  const topic = detectTopic(thought);
  const voices = VOICES[topic];
  const absolute = findAbsolute(thought);
  const texts: Record<FrameworkId, string> = {
    anxious: `${asSentence(thought)} ${voices.anxious}`,
    stoic: voices.stoic,
    growth: absolute ? `${voices.growth} Words like ‘${absolute}’ leave no room for exceptions, so I'll look for one.` : voices.growth,
    cosmic: voices.cosmic,
  };

  return { kind: "reframes", thought, topic, versions: reframes.map((reframe) => ({ ...reframe, text: texts[reframe.id] })) };
}
