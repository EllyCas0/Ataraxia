import type { Metadata } from "next";
import ShadowChat from "@/components/ShadowChat";

export const metadata: Metadata = {
  title: "The Shadow — The Agora",
  description: "A Socratic conversation that only asks questions.",
};

export default function ShadowPage() {
  return <ShadowChat />;
}
