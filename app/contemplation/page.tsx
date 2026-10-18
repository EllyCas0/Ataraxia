import type { Metadata } from "next";
import DailyContemplation from "@/components/DailyContemplation";

export const metadata: Metadata = {
  title: "Daily Contemplation — The Agora",
  description: "One line of philosophy for the day. Press and hold to reveal it, then write down what it brings up.",
};

export default function ContemplationPage() {
  return <DailyContemplation />;
}
