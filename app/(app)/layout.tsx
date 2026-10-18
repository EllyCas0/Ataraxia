import { BottomNav } from "@/components/shell/bottom-nav";
import { MobileHeader } from "@/components/shell/mobile-header";
import { Sidebar } from "@/components/shell/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh overflow-x-clip md:pl-24">
      <Sidebar />
      <MobileHeader />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-4xl px-5 pb-28 pt-8 outline-none md:px-8 md:pb-16 md:pt-12">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
