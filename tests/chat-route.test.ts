import { afterEach, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("openai", () => ({ default: class { responses = { create }; } }));
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
const request = (body: unknown) => new Request("http://localhost/api/chat", {
  method: "POST", body: JSON.stringify(body),
});
const body = { mode: "examine_dilemma", messages: [{ role: "user", content: "Which path should I take?" }] };

it("rejects invalid requests before contacting the provider", async () => {
  expect((await POST(request({ ...body, mode: "invalid" }))).status).toBe(400);
  expect(create).not.toHaveBeenCalled();
});
it("explains missing configuration", async () => {
  vi.stubEnv("OPENAI_API_KEY", "");
  const response = await POST(request(body));
  expect(response.status).toBe(503);
  expect((await response.json()).error).toContain("OPENAI_API_KEY");
});
it("passes history and mode guidance and returns the reply", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test");
  create.mockResolvedValue({ output_text: "What values are in tension?" });
  const response = await POST(request(body));
  expect(await response.json()).toEqual({ content: "What values are in tension?" });
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ input: body.messages, store: false, instructions: expect.stringContaining("competing values") }));
});
it("handles provider failure without exposing details", async () => {
  vi.stubEnv("OPENAI_API_KEY", "test");
  create.mockRejectedValue(new Error("private provider details"));
  const response = await POST(request(body));
  expect(response.status).toBe(502);
  expect(JSON.stringify(await response.json())).not.toContain("private provider details");
});
