// One thought, seen through four frameworks. The slider steps through this array in order.

export type FrameworkId = "anxious" | "stoic" | "growth" | "cosmic";

export interface Reframe {
  id: FrameworkId;
  label: string;
  lens: string; // the question this framework asks
  text: string; // the thought, rephrased through this framework
  accent: string; // hex color used for the slider and glow at this step
}

export const reframes: Reframe[] = [
  {
    id: "anxious",
    label: "Anxious",
    lens: "What fear says",
    text: "I'm going to fail this presentation. Everyone will see that I'm not good enough, and I'll never live it down.",
    accent: "#d9822b",
  },
  {
    id: "stoic",
    label: "Stoic",
    lens: "What is up to me?",
    text: "I can't control how the room reacts. I can control how well I prepare and how honestly I speak. I'll do my part well and let the rest be.",
    accent: "#5b86a6",
  },
  {
    id: "growth",
    label: "Growth",
    lens: "What can this teach me?",
    text: "This presentation is a chance to practice. If parts of it go badly, I'll learn exactly what to work on, and I'll be better the next time.",
    accent: "#4f9a5f",
  },
  {
    id: "cosmic",
    label: "Cosmic",
    lens: "How big is this, really?",
    text: "In a few years almost no one will remember this hour. Within a whole life, and the long age of the world, it is one small moment, and I get to take part in it.",
    accent: "#7c6bd0",
  },
];

export function clampStep(value: number, count = reframes.length): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(value)));
}

// 0 for the first step, 1 for the last; used to position things along the slider.
export function stepFraction(step: number, count = reframes.length): number {
  return count > 1 ? clampStep(step, count) / (count - 1) : 0;
}
