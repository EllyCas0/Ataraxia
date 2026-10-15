import { generateJson as generateOllama, getOllamaModels, ollamaModel } from "@/lib/ollama";
import { analyze } from "@/lib/analyzer";
import { challenge, councilModes, matchPhilosophers } from "@/lib/council";
import { domains } from "@/lib/domains";
import { getQuestion, questionFromText } from "@/lib/questions";
import type { AnalyzerResult, CouncilMode, Question } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const models = await getOllamaModels();
    return Response.json({ connected: true, models, defaultModel: models.includes(ollamaModel) ? ollamaModel : models[0] ?? "" });
  } catch {
    return Response.json({ connected: false, models: [], defaultModel: ollamaModel, error: "Ollama is offline. Open Ollama and refresh the connection." }, { status: 503 });
  }
}

const string = { type: "string" };
const strings = { type: "array", items: string };
const flag = { type: "object", properties: { label: string, detail: string, matches: strings }, required: ["label", "detail", "matches"], additionalProperties: false };
const flagKeys = ["evidenceFlags", "logicFlags", "fallacyFlags", "rhetoricFlags", "valueFlags", "uncertaintyFlags", "factCheckFlags"] as const;
const analysisProperties = { claim: string, conclusion: string, premises: strings, missingEvidenceQuestions: strings, ...Object.fromEntries(flagKeys.map((key) => [key, { type: "array", items: flag }])) };
function objectSchema(properties: object) {
  return { type: "object", properties, required: Object.keys(properties), additionalProperties: false };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export async function POST(request: Request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!isRecord(body)) return Response.json({ error: "Invalid request." }, { status: 400 });
  const { action, text } = body;
  if (typeof text !== "string" || !text.trim() || text.length > 12000) return Response.json({ error: "Enter between 1 and 12,000 characters." }, { status: 400 });
  if (!["analyze", "council", "challenge"].includes(String(action))) return Response.json({ error: "Unknown action." }, { status: 400 });
  if (action === "challenge" && (typeof body.position !== "string" || !body.position.trim() || body.position.length > 12000 || (body.reasoning !== undefined && (typeof body.reasoning !== "string" || body.reasoning.length > 12000)))) return Response.json({ error: "Invalid position or reasoning." }, { status: 400 });
  if (action === "council" && !councilModes.some((item) => item.id === body.mode)) return Response.json({ error: "Invalid council mode." }, { status: 400 });
  const curated = typeof body.slug === "string" ? getQuestion(body.slug) : undefined;
  if (curated && curated.text !== text) return Response.json({ error: "Question does not match its identifier." }, { status: 400 });
  let model = ollamaModel;
  try {
    const models = await getOllamaModels(request.signal);
    model = typeof body.model === "string" ? body.model : models.includes(ollamaModel) ? ollamaModel : models[0];
    if (!model || !models.includes(model)) return Response.json({ error: "Choose an installed model and refresh the Ollama connection." }, { status: 400 });
    const language = /[¿¡áéíóúñ]|\b(que|como|vida|justicia|libertad|puede|deberia|porque|verdad|somos)\b/i.test(text) ? "Spanish" : "the language of the user's question or argument";
    const generateJson = (schema: object, prompt: string) => generateOllama(schema, `OUTPUT LANGUAGE: ${language}. ${prompt}\nAll generated text must be in ${language}.`, model, request.signal, language);
    if (action === "analyze") {
      const data = await generateJson(objectSchema(analysisProperties), `Analyze the argument below. Identify premises, conclusion, evidence, possible fallacies (tentative, never verdicts), rhetoric, values, uncertainty, questions about missing evidence, and facts needing external verification. Each flag must have label, detail, and exact excerpts in matches. Use empty arrays where appropriate. Argument: ${JSON.stringify(text)}`);
      if (!isRecord(data) || typeof data.claim !== "string" || typeof data.conclusion !== "string" || !isStrings(data.premises) || !isStrings(data.missingEvidenceQuestions) || !flagKeys.every((key) => Array.isArray(data[key]) && data[key].every((item: unknown) => isRecord(item) && typeof item.label === "string" && typeof item.detail === "string" && isStrings(item.matches)))) throw new Error("Invalid analysis");
      const result = { ...data, relatedPhilosophers: analyze(text).relatedPhilosophers } as unknown as AnalyzerResult;
      return Response.json({ result, model });
    }
    const question: Question = curated ?? questionFromText(text);
    if (!curated && domains.includes(body.domain as Question["domain"])) question.domain = body.domain as Question["domain"];
    const pool = matchPhilosophers(question);
    const profiles = pool.map(({ slug, name, period, frame, majorArguments, keyConcepts, criticisms }) => ({ slug, name, period, frame, majorArguments, keyConcepts, criticisms }));
    if (action === "challenge") {
      if (typeof body.position !== "string" || !body.position.trim() || body.position.length > 12000 || (body.reasoning !== undefined && (typeof body.reasoning !== "string" || body.reasoning.length > 12000))) return Response.json({ error: "Invalid position or reasoning." }, { status: 400 });
      const picked = challenge(body.position, pool).philosopher;
      const data = await generateJson(objectSchema({ text: string }), `Offer a thoughtful, specific challenge ending in an open question, grounded in this philosopher profile: ${JSON.stringify(picked)}. Question: ${JSON.stringify(text)}. User position: ${JSON.stringify(body.position)}. Their reasoning: ${JSON.stringify(body.reasoning ?? "")}. Use third-person attribution, not impersonation. Maximum 150 words.`);
      if (!isRecord(data) || typeof data.text !== "string" || !data.text.trim()) throw new Error("Invalid challenge");
      return Response.json({ result: { philosopher: picked, text: data.text }, model });
    }
    const mode = councilModes.find((item) => item.id === body.mode)?.id as CouncilMode | undefined;
    if (!mode) return Response.json({ error: "Invalid council mode." }, { status: 400 });
    const properties = Object.fromEntries(pool.map((p) => [p.slug, string]));
    const data = await generateJson(objectSchema(properties), `Question: ${JSON.stringify(text)}. Mode: ${mode}. ${councilModes.find((m) => m.id === mode)?.hint}. Write one concise perspective (50-90 words) per supplied philosopher, directly addressing the question and grounded in their profile. Socratic mode must only ask questions; steelman must explain the strongest argument; historical must include context. Attribute in third person. Profiles: ${JSON.stringify(profiles)}. Return an object mapping each exact philosopher slug to its perspective.`);
    if (!isRecord(data) || !pool.every((p) => typeof data[p.slug] === "string" && (data[p.slug] as string).trim())) throw new Error("Invalid council");
    return Response.json({ result: data, model });
  } catch {
    return Response.json({ error: `Could not get a valid response from Ollama (${model}). Open Ollama, check your model, and retry. A long request may have reached the three-minute limit.` }, { status: 503 });
  }
}
