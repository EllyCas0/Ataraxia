import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CriticalPerspectives } from "@/components/philosophy-module/critical-perspectives";
import { SectionNav } from "@/components/philosophy-module/section-nav";
import { TenetGrid } from "@/components/philosophy-module/tenet-grid";
import { TraditionOverview } from "@/components/philosophy-module/tradition-overview";
import { content } from "@/lib/content/repository";
import { bundles, getBundle } from "@/lib/philosophy/registry";
import { SECTIONS, parseSection, tenetViews } from "@/lib/philosophy/views";

type Props = { params: Promise<{ tradition: string; section?: string[] }> };

// Each section has its own address: /ethics/natural-law, /ethics/natural-law/tenets, and so on. Every page
// is built ahead of time from the registry and anything else is a real HTTP 404, even with the loading
// screens (see the note on dynamicParams in the other dynamic pages).
export const dynamicParams = false;

export function generateStaticParams() {
  return bundles.flatMap((bundle) => [
    { tradition: bundle.tradition.id, section: [] as string[] },
    ...SECTIONS.filter((s) => s.id !== "overview").map((s) => ({ tradition: bundle.tradition.id, section: [s.id] })),
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tradition } = await params;
  const bundle = getBundle(tradition);
  return bundle ? { title: bundle.tradition.name, description: bundle.tradition.summary } : { title: "Ethics" };
}

// One page for every tradition in the registry: the tradition id in the address picks the content.
export default async function TraditionPage({ params }: Props) {
  const { tradition, section: segments } = await params;
  const bundle = getBundle(tradition);
  if (!bundle) notFound();
  // No segment means the overview. An unknown or repeated section is a 404, never a silent fallback.
  const requested = segments?.[0];
  if ((segments?.length ?? 0) > 1 || (requested !== undefined && !SECTIONS.some((s) => s.id === requested && s.id !== "overview"))) notFound();
  const section = parseSection(requested);
  const basePath = `/ethics/${bundle.tradition.id}`;
  const tenets = tenetViews(bundle, (slug) => content.conceptBySlug(slug));

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/ethics" className="hover:text-foreground">
            Ethics
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{bundle.tradition.name}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl">{bundle.tradition.name}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{bundle.tradition.summary}</p>
      </header>

      <SectionNav basePath={basePath} current={section} label={`${bundle.tradition.name} sections`} />

      <div id="section-content" className="pt-2">
        {section === "overview" && <TraditionOverview bundle={bundle} tenetsHref={`${basePath}/tenets`} />}
        {section === "tenets" && <TenetGrid tenets={tenets} frameworkNote={bundle.overview.frameworkNote} basePath={basePath} />}
        {section === "perspectives" && <CriticalPerspectives bundle={bundle} />}
      </div>
    </div>
  );
}
