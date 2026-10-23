import OpenAI from "openai";
import { z } from "zod";
import { CONVERSATION_MODES } from "@/lib/content/chat";

const requestSchema = z.object({
  mode: z.enum(CONVERSATION_MODES),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(12_000),
  })).min(1).max(20),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user" ||
      (parsed.data.messages.at(-1)?.content.length ?? 0) > 4000) {
    return Response.json({ error: "Please send a message of up to 4,000 characters and choose a conversation mode." }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "AI replies are not configured yet. Add OPENAI_API_KEY to .env.local and restart the server. Your message has been kept so you can try again." }, { status: 503 });
  }
  const guidance = {
    explore_idea: "Explore the idea through clear explanations and different philosophical perspectives.",
    examine_dilemma: "Help examine the decision, clarify competing values, and ask about missing context without deciding for the user.",
    challenge_assumptions: "Respectfully test assumptions, distinguish evidence from interpretation, and offer alternative readings.",
  }[parsed.data.mode];
  try {
    const client = new OpenAI({ timeout: 45_000, maxRetries: 0 });
    const reply = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: `You are The Agora, a thoughtful philosophical conversation partner. ${guidance} Keep replies concise, use plain text, and end with one useful question. Do not claim to be a therapist or provide medical advice.`,
      input: parsed.data.messages,
      max_output_tokens: 1000,
      store: false,
      stream: true,
    });
    const encoder = new TextEncoder();
    let cancelled = false;
    const stream = new ReadableStream({
      async start(controller) {
        const send = (event: object) => {
          if (!cancelled) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        };
        let text = "";
        let completed = false;
        try {
          for await (const event of reply) {
            if (event.type === "response.output_text.delta") {
              text += event.delta;
              send({ delta: event.delta });
            } else if (event.type === "response.completed") {
              completed = true;
            } else if (event.type === "response.failed" || event.type === "response.incomplete" || event.type === "error") {
              throw new Error("Incomplete reply");
            }
          }
          if (!completed || !text.trim()) throw new Error("Incomplete reply");
          send({ done: true });
        } catch {
          send({ error: "Unable to finish the reply. Please try again. Your message has been kept." });
        } finally {
          if (!cancelled) controller.close();
        }
      },
      cancel() {
        cancelled = true;
        reply.controller.abort();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "application/x-ndjson", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
    });
  } catch {
    return Response.json({ error: "Unable to get a reply right now. Please try again. Your message has been kept." }, { status: 502 });
  }
}
