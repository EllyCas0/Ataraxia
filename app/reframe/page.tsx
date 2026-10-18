import type { Metadata } from "next";
import MentalReframing from "@/components/MentalReframing";

export const metadata: Metadata = {
  title: "Mental Reframing — The Agora",
  description: "See one thought through four lenses: anxious, Stoic, growth, and cosmic.",
};

export default function ReframePage() {
  return <MentalReframing />;
}
