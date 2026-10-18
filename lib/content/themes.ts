import type { Theme, ThemeSlug } from "./types";

export const themes: Theme[] = [
  { slug: "meaning-purpose", name: "Meaning and purpose", description: "What makes a life worth living, and who decides?" },
  { slug: "identity-self-knowledge", name: "Identity and self-knowledge", description: "Who you are, and how well you can know it." },
  { slug: "ethics-morality", name: "Ethics and morality", description: "How to act well, and what that even means." },
  { slug: "love-relationships", name: "Love and relationships", description: "What we owe the people closest to us." },
  { slug: "freedom-responsibility", name: "Freedom and responsibility", description: "How free you are, and for what you answer." },
  { slug: "death-impermanence", name: "Death and impermanence", description: "Living with the fact that everything passes." },
  { slug: "knowledge-truth", name: "Knowledge and truth", description: "What we can know, and how to tell." },
  { slug: "society-technology-humanity", name: "Society, technology, and humanity", description: "Living well together in a changing world." },
];

export function getTheme(slug: ThemeSlug): Theme {
  const theme = themes.find((t) => t.slug === slug);
  if (!theme) throw new Error(`Unknown theme: ${slug}`);
  return theme;
}
