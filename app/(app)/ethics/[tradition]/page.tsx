import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyReflect } from "@/components/philosophy-module/apply-reflect";
import { CriticalPerspectives } from "@/components/philosophy-module/critical-perspectives";
import { SectionNav } from "@/components/philosophy-module/section-nav";
import { TenetGrid } from "@/components/philosophy-module/tenet-grid";
import { TraditionOverview } from "@/components/philosophy-module/tradition-overview";
import { content } from "@/lib/content/repository";
import { getBundle } from "@/lib/philosophy/registry";
import { parseSection, tenetViews } from "@/lib/philosophy/views";

type Props = { params: Promise<{ tradition: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const bundle = getBundle((await params).tradition);
  return bundle ? { title: bundle.tradition.name, description: bundle.tradition.summary } : { title: "Ethics" };
}

// One page for every tradition in the registry: the tradition id in the address picks the content.
export default async function TraditionPage({ params, searchParams }: Props) {
  const bundle = getBundle((await params).tradition);
  if (!bundle) notFound();
  const section = parseSection(first((await searchParams).section));
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
        {section === "overview" && <TraditionOverview bundle={bundle} tenetsHref={`${basePath}?section=tenets`} />}
        {section === "tenets" && <TenetGrid tenets={tenets} frameworkNote={bundle.overview.frameworkNote} basePath={`${basePath}?section=overview`} />}
        {section === "perspectives" && <CriticalPerspectives bundle={bundle} />}
        {section === "reflect" && <ApplyReflect tenets={tenets} />}
      </div>
    </div>
  );
}
