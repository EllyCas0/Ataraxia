import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ask — a philosophy companion",
  description:
    "Bring a question about life, and explore humanity's answers without being told what to believe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceSerif.variable} antialiased min-h-screen flex flex-col`}>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-8 mt-16">
          <div className="max-w-3xl mx-auto px-6 text-sm text-foreground-muted flex flex-col sm:flex-row gap-2 sm:gap-6 justify-between">
            <span>Be rigorous with ideas. Be compassionate with people.</span>
            <span className="opacity-70">This app does not tell you what to believe.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
