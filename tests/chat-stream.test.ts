import { expect, it, vi } from "vitest";
import { readChatReply } from "@/lib/chat-stream";

it("shows partial text before completion and handles split Unicode and JSON", async () => {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const response = new Response(new ReadableStream({ start(c) { controller = c; } }), {
    headers: { "Content-Type": "application/x-ndjson" },
  });
  const update = vi.fn();
  const reading = readChatReply(response, update);
  const bytes = new TextEncoder().encode('{"delta":"¿Qué"}\n');
  controller.enqueue(bytes.slice(0, 11));
  controller.enqueue(bytes.slice(11));
  await vi.waitFor(() => expect(update).toHaveBeenCalledWith("¿Qué"));
  controller.enqueue(new TextEncoder().encode('{"delta":" importa?"}\n{"done":true}\n'));
  controller.close();
  await expect(reading).resolves.toBe("¿Qué importa?");
});

it("rejects a disconnected stream rather than accepting a partial reply", async () => {
  const response = new Response('{"delta":"Partial"}\n', { headers: { "Content-Type": "application/x-ndjson" } });
  await expect(readChatReply(response, () => {})).rejects.toThrow("interrupted");
});

it("reports server errors", async () => {
  const response = new Response('{"error":"Please retry"}\n', { headers: { "Content-Type": "application/x-ndjson" } });
  await expect(readChatReply(response, () => {})).rejects.toThrow("Please retry");
});
