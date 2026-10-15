export async function requestAI<T>(body: object, signal?: AbortSignal): Promise<{ result: T; model: string }> {
  const response = await fetch("/api/ai", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), signal,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Could not generate a response.");
  return data;
}
