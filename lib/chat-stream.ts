export async function readChatReply(response: Response, onText: (text: string) => void): Promise<string> {
  if (!response.headers.get("content-type")?.includes("application/x-ndjson")) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to send your message. Please try again.");
    if (typeof data.content !== "string" || !data.content.trim()) throw new Error("No reply was returned. Please try again.");
    onText(data.content);
    return data.content;
  }
  if (!response.ok || !response.body) throw new Error("Unable to get a reply. Please try again.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let done = false;
  const consume = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.error) throw new Error(event.error);
    if (typeof event.delta === "string") {
      text += event.delta;
      onText(text);
    }
    if (event.done === true) done = true;
  };
  try {
    while (true) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        consume(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
      }
      if (chunk.done) break;
    }
    consume(buffer);
    if (!done || !text.trim()) throw new Error("The reply was interrupted. Please try again.");
    return text;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
