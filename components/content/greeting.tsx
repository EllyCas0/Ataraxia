"use client";

import { useSyncExternalStore } from "react";
import { greetingFor } from "@/lib/time";

const subscribe = () => () => {};

// The greeting follows the visitor's own clock. The server cannot know it, so it renders a neutral
// "Welcome" first and the browser swaps in the time-of-day greeting.
export function Greeting() {
  const text = useSyncExternalStore(
    subscribe,
    () => greetingFor(new Date(), Intl.DateTimeFormat().resolvedOptions().timeZone),
    () => "Welcome",
  );
  return <>{text}.</>;
}
