import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl">That page isn&apos;t here</h1>
      <p className="mt-3 text-muted-foreground">It may have moved, or the link may be mistyped.</p>
      <Link href="/discover" className="mt-6 text-primary underline underline-offset-4">
        Back to Discover
      </Link>
    </main>
  );
}
