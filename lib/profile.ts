import type { PositionOption, ProfileDimension, ProfileState } from "./types";

// Spec §12: "This is not a personality test. It represents positions the
// user has explicitly expressed" — so this module only ever stores what the
// user directly picks. Nothing here is inferred from behavior.

export const positionOptions: Record<ProfileDimension, PositionOption[]> = {
  ethics: [
    { id: "virtue", label: "Virtue ethics", blurb: "Right action flows from good character, built through habit and practice." },
    { id: "deontology", label: "Deontology", blurb: "Actions are right or wrong based on principle and duty, not just outcomes." },
    { id: "consequentialism", label: "Consequentialism", blurb: "An action is right if it produces the best overall outcome." },
    { id: "care", label: "Care ethics", blurb: "Ethics grows from attentiveness and responsibility within relationships." },
    { id: "existential", label: "Existential ethics", blurb: "We are responsible for creating our own values through free choice." },
  ],
  epistemology: [
    { id: "empiricism", label: "Empiricism", blurb: "Knowledge comes primarily from sensory experience." },
    { id: "rationalism", label: "Rationalism", blurb: "Reason, not experience, is the primary source of genuine knowledge." },
    { id: "pragmatism", label: "Pragmatism", blurb: "A belief's truth is tied to its practical consequences when acted on." },
    { id: "skepticism", label: "Skepticism", blurb: "Most claims to certain knowledge should be doubted until rigorously tested." },
    { id: "fallibilism", label: "Fallibilism", blurb: "We can have justified knowledge while accepting it might later be revised." },
  ],
  metaphysics: [
    { id: "physicalism", label: "Physicalism", blurb: "Everything that exists is physical, including mind and consciousness." },
    { id: "dualism", label: "Dualism", blurb: "Mind and body are two fundamentally different kinds of thing." },
    { id: "idealism", label: "Idealism", blurb: "Mind or consciousness is more fundamental than physical matter." },
    { id: "existential-approach", label: "Existential approach", blurb: "Existence and lived experience take priority over fixed essence or category." },
  ],
  "political-philosophy": [
    { id: "liberalism", label: "Liberalism", blurb: "Individual rights and liberties are the primary basis for political order." },
    { id: "communitarianism", label: "Communitarianism", blurb: "Community and shared tradition are essential to a good political order, not optional." },
    { id: "republicanism", label: "Republicanism", blurb: "Freedom means not being subject to arbitrary power, secured through self-governance." },
    { id: "socialist", label: "Socialist traditions", blurb: "Economic structures should be organized for collective benefit, not private accumulation." },
    { id: "anarchist", label: "Anarchist traditions", blurb: "Legitimate cooperation is possible without coercive state authority." },
    { id: "conservative", label: "Conservative traditions", blurb: "Inherited institutions and gradual change are generally wiser than radical redesign." },
  ],
};

const DIMENSIONS: ProfileDimension[] = ["ethics", "epistemology", "metaphysics", "political-philosophy"];

export function createEmptyProfile(): ProfileState {
  return { ethics: [], epistemology: [], metaphysics: [], "political-philosophy": [], notes: {} };
}

export function getPositionOption(id: string): PositionOption | undefined {
  return Object.values(positionOptions).flat().find((option) => option.id === id);
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function notesRecord(value: unknown): Record<string, string> {
  if (!isStringRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export function parseProfile(value: unknown): ProfileState {
  if (!isStringRecord(value)) return createEmptyProfile();
  const profile = createEmptyProfile();
  for (const dimension of DIMENSIONS) {
    profile[dimension] = stringArray(value[dimension]);
  }
  profile.notes = notesRecord(value.notes);
  return profile;
}

export function togglePosition(profile: ProfileState, dimension: ProfileDimension, id: string): ProfileState {
  const current = profile[dimension];
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  const notes = next.includes(id) ? profile.notes : removeNote(profile.notes, id);
  return { ...profile, [dimension]: next, notes };
}

export function updatePositionNote(profile: ProfileState, id: string, note: string): ProfileState {
  const trimmed = note.trim();
  if (!trimmed) return { ...profile, notes: removeNote(profile.notes, id) };
  return { ...profile, notes: { ...profile.notes, [id]: trimmed } };
}

export function selectedPositionDetails(profile: ProfileState): { dimension: ProfileDimension; option: PositionOption; note: string }[] {
  return DIMENSIONS.flatMap((dimension) =>
    profile[dimension].map((id) => {
      const option = getPositionOption(id);
      return option ? { dimension, option, note: profile.notes[id] ?? "" } : null;
    })
  ).filter((item): item is { dimension: ProfileDimension; option: PositionOption; note: string } => item !== null);
}

function removeNote(notes: Record<string, string>, id: string): Record<string, string> {
  if (!(id in notes)) return notes;
  const next = { ...notes };
  delete next[id];
  return next;
}

// A small, explicit table of commonly-tense position pairs — not a general
// "contradiction engine" (out of this MVP's scope, see README), just enough
// to surface the most classic tensions for reflection.
const TENSION_PAIRS: { a: string; b: string; prompt: string }[] = [
  { a: "liberalism", b: "communitarianism", prompt: "You lean toward both liberalism and communitarianism. Which wins when individual choice conflicts with a community's shared norms?" },
  { a: "consequentialism", b: "deontology", prompt: "You lean toward both consequentialism and deontology. Which wins when the right principle would produce a worse outcome?" },
  { a: "liberalism", b: "socialist", prompt: "You lean toward both liberalism and socialist traditions. Which wins when redistribution requires limiting individual economic choice?" },
  { a: "skepticism", b: "rationalism", prompt: "You lean toward both skepticism and rationalism. How much can reason alone establish, if most claims deserve doubt?" },
  { a: "physicalism", b: "existential-approach", prompt: "You lean toward both physicalism and an existential approach. If everything is physical, what grounds the freedom existentialism asks you to exercise?" },
  { a: "conservative", b: "anarchist", prompt: "You lean toward both conservative and anarchist traditions. Which wins: the wisdom of inherited institutions, or suspicion of coercive authority?" },
];

export function findTensions(profile: ProfileState): { a: string; b: string; prompt: string }[] {
  const all = new Set([...profile.ethics, ...profile.epistemology, ...profile.metaphysics, ...profile["political-philosophy"]]);
  return TENSION_PAIRS.filter((t) => all.has(t.a) && all.has(t.b));
}
