import type { Metadata } from "next";
import Link from "next/link";
import { supportLinks } from "@/lib/support";

// Hidden from search engines until a support link is configured.
export const metadata: Metadata = {
  title: "Support The Agora",
  robots: supportLinks.donateUrl || supportLinks.waitlistUrl ? undefined : { index: false },
};

const PRO_PLANS = [
  "Unlimited AI-generated perspectives, challenges, and argument analyses",
  "Journal backup and sync across your devices",
  "The full library as it grows",
];

export default function SupportPage() {
  const { donateUrl, waitlistUrl } = supportLinks;
  if (!donateUrl && !waitlistUrl) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl mb-3">Support options aren&apos;t available yet</h1>
        <Link href="/" className="text-accent-strong underline">Back to The Agora</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
      <h1 className="font-serif text-3xl mb-2">Support The Agora</h1>
      <p className="text-foreground-muted mb-10 leading-relaxed">
        The Agora is free while we test it with real people. If it&apos;s helping you think, here are two ways to help it keep going.
      </p>

      {donateUrl && (
        <section className="rounded-xl border border-border bg-surface p-6 mb-6">
          <h2 className="font-serif text-xl mb-2">Chip in</h2>
          <p className="text-sm text-foreground-muted leading-relaxed mb-4">
            Contributions go toward hosting and AI costs. Choose any amount you like. Payment is handled by Stripe, so we never see your card details.
          </p>
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-accent-strong text-background font-medium px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            Support this project
          </a>
        </section>
      )}

      {waitlistUrl && (
        <section className="rounded-xl border border-border bg-surface p-6 mb-6">
          <h2 className="font-serif text-xl mb-2">Join the Pro waitlist</h2>
          <p className="text-sm text-foreground-muted leading-relaxed mb-3">
            We&apos;re considering a paid Pro plan. It isn&apos;t built yet, and the features and price aren&apos;t final. Joining costs nothing and just tells us whether it&apos;s worth building. What we&apos;re thinking of:
          </p>
          <ul className="text-sm space-y-1.5 mb-4">
            {PRO_PLANS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-foreground-muted">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href={waitlistUrl}
            {...(waitlistUrl.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-block rounded-lg border border-border px-5 py-2.5 text-sm hover:border-ring transition-colors"
          >
            Join the waitlist
          </a>
        </section>
      )}

      <Link href="/" className="text-sm text-foreground-muted hover:text-foreground">
        ← Back to The Agora
      </Link>
    </div>
  );
}
