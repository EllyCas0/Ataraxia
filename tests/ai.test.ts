import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/ai/route";
import { getQuestion } from "../lib/questions";
import { matchPhilosophers } from "../lib/council";

function request(body: unknown) {
  return new Request("http://localhost/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

test("invalid AI input is rejected before contacting Ollama", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("Should not contact Ollama"); };
  try {
    for (const body of [null, {action:"unknown",text:"test"}, {action:"analyze",text:" "}, {action:"analyze",text:"a".repeat(12001)}, {action:"council",text:"test",mode:"invalid"}, {action:"challenge",text:"test",position:""}, {action:"council",slug:"meaningful-life",text:"different",mode:"compare"}]) {
      assert.equal((await POST(request(body))).status, 400);
    }
  } finally { globalThis.fetch = original; }
});

test("connection reports offline Ollama and models when connected", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new Error("offline"); };
    assert.equal((await GET()).status, 503);
    globalThis.fetch = async () => Response.json({models:[{name:"test-model"}]});
    const data = await (await GET()).json();
    assert.equal(data.connected, true);
    assert.equal(data.defaultModel, "test-model");
  } finally { globalThis.fetch = original; }
});

test("curated question keeps the same council on client and server", async () => {
  const original = globalThis.fetch;
  const question = getQuestion("meaningful-life")!;
  const pool = matchPhilosophers(question);
  try {
    globalThis.fetch = async (input, init) => {
      if (String(input).endsWith("/api/tags")) return Response.json({models:[{name:"test-model"}]});
      const payload = JSON.parse(String(init?.body));
      assert.equal(payload.model, "test-model");
      assert.deepEqual(Object.keys(payload.format.properties), pool.map((p) => p.slug));
      return Response.json({message:{content:JSON.stringify(Object.fromEntries(pool.map((p) => [p.slug, "Perspective on the question."])))}});
    };
    const response = await POST(request({action:"council",text:question.text,slug:question.slug,mode:"compare",model:"test-model"}));
    assert.equal(response.status, 200);
    assert.deepEqual(Object.keys((await response.json()).result), pool.map((p) => p.slug));
  } finally { globalThis.fetch = original; }
});

test("uninstalled models and malformed model output never reach the UI as results", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (input) => String(input).endsWith("/api/tags") ? Response.json({models:[{name:"test-model"}]}) : Response.json({message:{content:'{"claim":42}'}});
    assert.equal((await POST(request({action:"analyze",text:"An argument",model:"missing"}))).status, 400);
    assert.equal((await POST(request({action:"analyze",text:"An argument",model:"test-model"}))).status, 503);
  } finally { globalThis.fetch = original; }
});

test("Spanish input explicitly sets Spanish output while retaining JSON identifiers", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (input, init) => {
      if (String(input).endsWith("/api/tags")) return Response.json({models:[{name:"test-model"}]});
      const payload = JSON.parse(String(init?.body));
      assert.match(payload.messages[0].content, /Required output language: Spanish/);
      return Response.json({message:{content:'{"text":"¿Cómo justificas esa posición?"}'}});
    };
    assert.equal((await POST(request({action:"challenge",text:"¿Qué es la justicia?",position:"Tratar bien a los demás."}))).status, 200);
  } finally { globalThis.fetch = original; }
});
