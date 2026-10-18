"use client";

import { Button } from "@/components/ui/button";

// Shown when something unexpected fails. It deliberately shows no technical detail to the visitor.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">That was our mistake, not yours. Your writing has not been lost. Please try again.</p>
      <Button type="button" size="lg" className="mt-6 h-11 px-5 text-base" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
