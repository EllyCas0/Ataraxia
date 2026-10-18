"use client";

import { useEffect } from "react";

// Sets a flag on <html> once React has taken over the page. End-to-end tests wait for it so they
// never click a button that is rendered but not yet interactive.
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
