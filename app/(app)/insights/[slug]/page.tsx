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

// Only the pages listed in generateStaticParams exist. Anything else is a real HTTP 404 straight away. Without this,
// the loading screens start streaming a "200 OK" response before the page can say it was not found.
export const dynamicParams = false;

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

      <div className="relative isolate mt-6 aspect-[4/3] overflow-hidden rounded-[2rem]">
        {image.placeholder ? (
          // A still gradient in the school's colour: the reading page is for reading, so nothing moves here.
          <div aria-hidden data-testid="static-gradient" className="absolute inset-0" style={{ background: `linear-gradient(160deg, oklch(0.5 0.19 ${insight.hue}), oklch(0.27 0.11 ${insight.hue}))` }} />
        ) : (
          <Image src={image.src} alt="" fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" priority />
        )}
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
          href={related ? `/reflect?concept=${related.slug}` : "/reflect"}
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
