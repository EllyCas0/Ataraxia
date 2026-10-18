import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Insight } from "@/lib/content/insights";

// The home page's daily insight. The whole card is one link to the reading view. With no picture it
// keeps the plain green background; with one, a bottom-heavy gradient keeps the text readable.
export function DailyInsightCard({ insight, image }: { insight: Insight; image?: string }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group relative isolate flex min-h-[28rem] flex-col justify-between overflow-hidden rounded-3xl bg-accent p-7 text-white transition-transform motion-safe:hover:scale-[1.01] md:p-9"
    >
      {image && <Image src={image} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="-z-20 object-cover" priority />}
      {image && <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />}

      <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">Daily insight</p>

      <div>
        <blockquote className="font-serif text-2xl leading-relaxed md:text-3xl md:leading-relaxed">&ldquo;{insight.quote}&rdquo;</blockquote>
        <p className="mt-6 inline-flex items-center gap-1.5 text-base">
          <span>
            &mdash; {insight.philosopher}, {insight.context}
          </span>
          <ArrowRight className="size-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
        </p>
        {image && <p className="mt-3 text-xs text-white/60">Illustration generated with AI</p>}
      </div>
    </Link>
  );
}
