import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Agora — think better, understand civilization",
  description:
    "An AI-assisted philosophical thinking platform. Ask a question, meet a council of thinkers, and articulate what you actually believe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:p-3 focus:rounded-lg">Skip to content</a>
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 mt-16 bg-surface/40">
          <div className="max-w-4xl mx-auto px-6 text-sm text-foreground-muted flex flex-col sm:flex-row gap-2 sm:gap-6 justify-between">
            <span>Think better. Understand yourself. Understand civilization.</span>
            <span className="opacity-70">This platform does not tell you what to believe.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
