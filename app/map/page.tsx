import type { Metadata } from "next";
import SchoolsExplorer from "@/components/SchoolsExplorer";

export const metadata: Metadata = {
  title: "Schools of Thought — The Agora",
  description: "An interactive map of five major philosophical schools and how they connect.",
};

export default function MapPage() {
  return (
    <div className="h-[calc(100dvh-4.1rem)] min-h-[520px] w-full">
      <SchoolsExplorer />
    </div>
  );
}
