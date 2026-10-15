"use client";

import { useEffect, useRef, useState } from "react";
import { requestAI } from "./ai-client";

export function useAI() {
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  function cancel() {
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
  }
  async function run<T>(body: object) {
    controller.current?.abort();
    const next = new AbortController();
    controller.current = next;
    setLoading(true);
    setError("");
    try {
      const data = await requestAI<T>({ ...body, ...(model ? { model } : {}) }, next.signal);
      return next.signal.aborted ? undefined : data;
    } catch (error) {
      if (!next.signal.aborted) setError(error instanceof Error ? error.message : "Generation failed. Please retry.");
    } finally {
      if (controller.current === next) { setLoading(false); controller.current = null; }
    }
  }
  return { model, setModel, loading, error, setError, cancel, run };
}
