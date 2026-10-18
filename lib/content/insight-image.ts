import { existsSync } from "node:fs";
import path from "node:path";

export interface InsightImage {
  src: string;
  /** True when no real picture has been added yet and the generic placeholder is used. */
  placeholder: boolean;
}

// The picture for an insight: a file named after its slug in public/modern-minds/, or a generic placeholder.
export function insightImage(slug: string): InsightImage {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (existsSync(path.join(process.cwd(), "public", "modern-minds", `${slug}.${ext}`))) return { src: `/modern-minds/${slug}.${ext}`, placeholder: false };
  }
  return { src: "/modern-minds/placeholder.svg", placeholder: true };
}
