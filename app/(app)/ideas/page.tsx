import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ConceptCard } from "@/components/content/concept-card";
import { NativeSelect } from "@/components/content/native-select";
import { Button } from "@/components/ui/button";
import { content } from "@/lib/content/repository";
import { themes } from "@/lib/content/themes";
import { THEME_SLUGS, type ThemeSlug } from "@/lib/content/types";

export const metadata: Metadata = { title: "Explore ideas" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function IdeasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = first(params.q).trim().slice(0, 100);
  const traditions = content.traditions();
  const tradition = traditions.includes(first(params.tradition)) ? first(params.tradition) : "";
  const themeParam = first(params.theme);
  const theme = (THEME_SLUGS as readonly string[]).includes(themeParam) ? (themeParam as ThemeSlug) : undefined;

  const results = content.search({ q, tradition: tradition || undefined, theme });
  const filtered = Boolean(q || tradition || theme);
  const activeTheme = themes.find((t) => t.slug === theme);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl md:text-5xl">Explore ideas</h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Short, plain-language notes on ideas from many traditions. They are starting points for your own thinking, not a replacement for the original texts.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/weekly" className="text-accent-foreground underline underline-offset-4">
            This week&apos;s human perspective
          </Link>
        </p>
      </header>

      <form method="get" action="/ideas" role="search" className="grid gap-3 md:grid-cols-[1fr_12rem_12rem_auto]">
        <div className="relative">
          <label htmlFor="q" className="sr-only">
            Search ideas
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={100}
            placeholder="Search ideas, thinkers, traditions"
            className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>
        <div>
          <label htmlFor="tradition" className="sr-only">
            Tradition
          </label>
          <NativeSelect id="tradition" name="tradition" defaultValue={tradition}>
            <option value="">All traditions</option>
            {traditions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <label htmlFor="theme" className="sr-only">
            Theme
          </label>
          <NativeSelect id="theme" name="theme" defaultValue={theme ?? ""}>
            <option value="">All themes</option>
            {themes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Button type="submit" size="lg" className="h-11 px-5 text-base">
          Search
        </Button>
      </form>

      <section aria-label="Results">
        <p className="mb-4 text-sm text-muted-foreground" role="status">
          {results.length === 0
            ? "No ideas match that search."
            : `${results.length} ${results.length === 1 ? "idea" : "ideas"}${activeTheme ? ` in ${activeTheme.name.toLowerCase()}` : ""}${q ? ` matching “${q}”` : ""}`}
          {filtered && (
            <>
              {" "}
              <Link href="/ideas" className="text-primary underline underline-offset-4">
                Clear filters
              </Link>
            </>
          )}
        </p>
        {results.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {results.map((concept) => (
              <li key={concept.slug}>
                <ConceptCard concept={concept} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            <p>Try fewer words, a different spelling, or browse by theme.</p>
          </div>
        )}
      </section>
    </div>
  );
}
