"use client";

import { useEffect, useState } from "react";

export default function OllamaControl({ model, onChange, disabled = false }: { model: string; onChange: (model: string) => void; disabled?: boolean }) {
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState("Checking Ollama…");
  const [checking, setChecking] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function check() {
      setChecking(true);
      try {
        const response = await fetch("/api/ai", { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setModels(data.models);
        setStatus(data.models.length ? "Ollama connected · local generation" : "No models installed. Download a model in Ollama, then refresh.");
        let stored = "";
        try { stored = window.localStorage.getItem("agora:model") ?? ""; } catch { /* Storage is optional. */ }
        if (!model || !data.models.includes(model)) onChange(data.models.includes(stored) ? stored : data.defaultModel);
      } catch (error) {
        if (!controller.signal.aborted) setStatus(error instanceof Error ? error.message : "Could not connect to Ollama.");
      } finally { if (!controller.signal.aborted) setChecking(false); }
    }
    void check();
    return () => controller.abort();
  }, [revision, model, onChange]);
  return (
    <section aria-label="Local AI connection" className="rounded-xl border border-border bg-surface-muted p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-xs text-foreground-muted">{status}</p>
        <button type="button" disabled={checking || disabled} onClick={() => setRevision((n) => n + 1)} className="text-xs text-accent-strong underline disabled:opacity-40">Refresh connection</button>
      </div>
      {models.length > 0 && <label className="flex flex-wrap items-center gap-3 mt-3 text-sm">Model
        <select value={model} disabled={disabled} onChange={(e) => {
          onChange(e.target.value);
          try { window.localStorage.setItem("agora:model", e.target.value); } catch { /* Selection still works for this session. */ }
        }} className="rounded-lg border border-border bg-surface px-3 py-2 min-w-0 max-w-full">
          {models.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>}
    </section>
  );
}
