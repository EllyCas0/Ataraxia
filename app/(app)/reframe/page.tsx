import type { Metadata } from "next";
import { Reframe } from "@/components/reframe/reframe";

export const metadata: Metadata = {
  title: "Reframe a worried thought",
  description: "See one thought through four lenses: anxious, Stoic, growth, and cosmic.",
};

export default function ReframePage() {
  return <Reframe />;
}
