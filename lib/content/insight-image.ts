import { existsSync } from "node:fs";
import path from "node:path";

// A real picture, or none yet (the card then shows the animated lava-lamp background instead).
export type InsightImage = { placeholder: false; src: string } | { placeholder: true };

// The picture for an insight: a file named after its slug in public/modern-minds/, if one has been added.
export function insightImage(slug: string): InsightImage {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (existsSync(path.join(process.cwd(), "public", "modern-minds", `${slug}.${ext}`))) return { src: `/modern-minds/${slug}.${ext}`, placeholder: false };
  }
  return { placeholder: true };
}
