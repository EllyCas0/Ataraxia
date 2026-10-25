import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      // New conversations used to live at /reflect/new. The message box is now the Reflect page itself, and
      // the query (?question=, ?concept=, ?mode=) is carried across.
      { source: "/reflect/new", destination: "/reflect", permanent: false },
      // Sections used to be chosen with ?section=tenets. Old links go to the new address for that section.
      {
        source: "/ethics/:tradition",
        has: [{ type: "query", key: "section", value: "(?<section>tenets|perspectives)" }],
        destination: "/ethics/:tradition/:section",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
