import type { TraditionBundle } from "./types";

const STATUSES = ["classical", "interpretation", "contested"];
const KINDS = ["criticism", "defence", "debate"];

// Checks that a tradition's content is complete and that every cross-reference points at something real.
// Returns a list of problems (empty when the content is sound). Used by the tests, so a content mistake
// fails the build instead of showing a broken card.
export function validateBundle(bundle: TraditionBundle, options: { conceptExists: (slug: string) => boolean }): string[] {
  const problems: string[] = [];
  const { tradition, tenets, thinkers, perspectives, sources, overview } = bundle;
  const sourceIds = new Set(sources.map((s) => s.id));
  const thinkerIds = new Set(thinkers.map((t) => t.id));
  const need = (value: string | undefined, label: string) => {
    if (!value || value.trim().length === 0) problems.push(`${label} is empty`);
  };
  const unique = (ids: string[], label: string) => {
    if (new Set(ids).size !== ids.length) problems.push(`${label} contain duplicates`);
  };

  for (const [label, value] of [
    ["tradition.name", tradition.name],
    ["tradition.category", tradition.category],
    ["tradition.summary", tradition.summary],
    ["tradition.centralQuestion", tradition.centralQuestion],
    ["tradition.historicalContext", tradition.historicalContext],
    ["overview.definition", overview.definition],
    ["overview.frameworkNote", overview.frameworkNote],
  ] as const) need(value, label);

  unique(tenets.map((t) => t.id), "tenet ids");
  unique(tenets.map((t) => String(t.number)), "tenet numbers");
  unique(sources.map((s) => s.id), "source ids");
  unique(thinkers.map((t) => t.id), "thinker ids");
  unique(perspectives.map((p) => p.id), "perspective ids");

  if (tradition.tenetIds.join("|") !== tenets.map((t) => t.id).join("|")) problems.push("tradition.tenetIds does not match the tenets, in order");
  for (const id of tradition.thinkerIds) if (!thinkerIds.has(id)) problems.push(`tradition lists unknown thinker "${id}"`);

  for (const tenet of tenets) {
    const where = `tenet "${tenet.id}"`;
    if (tenet.traditionId !== tradition.id) problems.push(`${where} belongs to "${tenet.traditionId}", not "${tradition.id}"`);
    for (const [label, value] of [
      ["title", tenet.title],
      ["definition", tenet.definition],
      ["explanation", tenet.explanation],
      ["example", tenet.example],
      ["reflectionQuestion", tenet.reflectionQuestion],
    ] as const) need(value, `${where} ${label}`);
    if (!tenet.reflectionQuestion.trim().endsWith("?")) problems.push(`${where} reflectionQuestion should be a question`);
    if (!STATUSES.includes(tenet.status)) problems.push(`${where} has an unknown status "${tenet.status}"`);
    if (tenet.origins.length === 0) problems.push(`${where} has no origins`);
    if (tenet.criticisms.length === 0) problems.push(`${where} has no criticisms`);
    if (tenet.sourceIds.length === 0) problems.push(`${where} cites no sources`);
    for (const id of tenet.sourceIds) if (!sourceIds.has(id)) problems.push(`${where} cites unknown source "${id}"`);
    for (const id of tenet.relatedThinkerIds) if (!thinkerIds.has(id)) problems.push(`${where} lists unknown thinker "${id}"`);
    for (const slug of tenet.relatedConceptIds) if (!options.conceptExists(slug)) problems.push(`${where} lists unknown concept "${slug}"`);
  }

  for (const thinker of thinkers) for (const id of thinker.sourceIds) if (!sourceIds.has(id)) problems.push(`thinker "${thinker.id}" cites unknown source "${id}"`);
  for (const entry of overview.timeline) if (entry.thinkerId && !thinkerIds.has(entry.thinkerId)) problems.push(`timeline entry "${entry.who}" lists unknown thinker "${entry.thinkerId}"`);
  for (const perspective of perspectives) {
    if (!KINDS.includes(perspective.kind)) problems.push(`perspective "${perspective.id}" has an unknown kind "${perspective.kind}"`);
    for (const id of perspective.sourceIds) if (!sourceIds.has(id)) problems.push(`perspective "${perspective.id}" cites unknown source "${id}"`);
  }
  for (const source of sources) {
    if (source.url && !source.url.startsWith("https://")) problems.push(`source "${source.id}" url must be https`);
    need(source.notes, `source "${source.id}" notes`);
  }
  return problems;
}
