import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HydrationMarker } from "@/components/hydration-marker";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "The Agora", template: "%s · The Agora" },
  description: "A calm place to explore philosophical ideas, examine your assumptions, and reflect on your own life.",
};

export const viewport: Viewport = {
  themeColor: "#faf7f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
        <Toaster position="bottom-center" />
        <HydrationMarker />
      </body>
    </html>
  );
}
