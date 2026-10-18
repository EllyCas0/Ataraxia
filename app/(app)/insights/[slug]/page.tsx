import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { content } from "@/lib/content/repository";
import { insightImage } from "@/lib/content/insight-image";
import { insightBySlug, insights } from "@/lib/content/insights";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const insight = insightBySlug((await params).slug);
  return { title: insight ? `${insight.philosopher}: daily insight` : "Insight" };
}

export default async function InsightPage({ params }: { params: Params }) {
  const insight = insightBySlug((await params).slug);
  if (!insight) notFound();
  const image = insightImage(insight.slug);
  const related = insight.relatedConceptSlug ? content.conceptBySlug(insight.relatedConceptSlug) : undefined;

  return (
    <article className="mx-auto max-w-2xl">
      <Link href="/discover" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        Back to Discover
      </Link>

      <div
        className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[2rem]"
        style={image.placeholder ? { background: `linear-gradient(160deg, oklch(0.52 0.2 ${insight.hue}), oklch(0.3 0.12 ${insight.hue}))` } : undefined}
      >
        <Image src={image.src} alt="" fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" priority />
      </div>
      {!image.placeholder && <p className="mt-2 text-xs text-muted-foreground">Illustration generated with AI.</p>}

      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Daily insight</p>
      <h1 className="mt-3 font-serif text-3xl font-normal leading-relaxed md:text-4xl md:leading-relaxed">&ldquo;{insight.quote}&rdquo;</h1>
      <p className="mt-6 text-lg">
        &mdash; {insight.philosopher}, <span className="text-muted-foreground">{insight.context}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">Source: {insight.source}.</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href={related ? `/reflect/new?concept=${related.slug}` : "/reflect/new"}
          className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base")}
        >
          Reflect on this
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Link>
        {related && (
          <Link href={`/ideas/${related.slug}`} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5 text-base")}>
            Read about {related.title.toLowerCase()}
          </Link>
        )}
      </div>
    </article>
  );
}
