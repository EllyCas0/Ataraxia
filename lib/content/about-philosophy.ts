// The "What is philosophy?" section on the home page. It is plain, short, and deliberately even-handed about
// religion: it describes how philosophy and religion relate and takes no side on whether any religion is true.
// Keep each block short (at most 70 words) so the home page stays simple.
export interface AboutBlock {
  id: "what" | "why" | "religion";
  eyebrow: string;
  title: string;
  text: string;
}

export const ABOUT_PHILOSOPHY_INTRO = "The word comes from the Greek for “love of wisdom”.";

export const aboutPhilosophy: AboutBlock[] = [
  {
    id: "what",
    eyebrow: "The idea",
    title: "Asking big questions carefully",
    text: "Philosophy is the practice of asking the biggest questions: What is a good life? What is true? What do we owe each other? Instead of settling them by habit or authority, philosophers give reasons, test them against the best objections, and change their minds when the reasons are better.",
  },
  {
    id: "why",
    eyebrow: "Why it matters",
    title: "You already live by answers",
    text: "Everyone acts on answers to these questions, whether they notice or not. Philosophy helps you spot your own assumptions, weigh evidence, disagree without a fight, and make choices you can stand behind. Ideas we take for granted, like fairness and human rights, were argued out by philosophers, and science, law and politics all grew partly from it.",
  },
  {
    id: "religion",
    eyebrow: "Religion",
    title: "Same questions, different ways of answering",
    text: "Religion and philosophy often ask the same questions, such as why we are here and how to live. Religions usually rest on faith, scripture, tradition and community. Philosophy asks for reasons anyone can examine. They are not simply rivals: many philosophers were religious, some traditions blend both, and others are not religious at all. Stoa takes no side on whether any religion is true.",
  },
];
