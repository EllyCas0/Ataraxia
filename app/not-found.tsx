import Link from "next/link";

export default function NotFound() {
  return <div className="max-w-xl mx-auto px-6 py-24 text-center">
    <h1 className="font-serif text-3xl mb-3">This page could not be found</h1>
    <Link href="/questions" className="text-accent-strong underline">Explore the question library</Link>
  </div>;
}
