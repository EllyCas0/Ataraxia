"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className="max-w-xl mx-auto px-6 py-24 text-center">
    <h1 className="font-serif text-3xl mb-3">Something went wrong</h1>
    <p className="text-foreground-muted mb-6">Try loading this page again. Your saved journal stays in this browser.</p>
    <button onClick={retry} className="rounded-lg bg-accent-strong text-background px-5 py-3 mr-4">Try again</button>
    <Link href="/" className="underline">Back home</Link>
  </div>;
}
