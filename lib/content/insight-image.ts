import { existsSync } from "node:fs";
import path from "node:path";

// Returns the public URL of the picture for an insight if one has been added to public/modern-minds/.
export function insightImage(slug: string): string | undefined {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (existsSync(path.join(process.cwd(), "public", "modern-minds", `${slug}.${ext}`))) return `/modern-minds/${slug}.${ext}`;
  }
  return undefined;
}
