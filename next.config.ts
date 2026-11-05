import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
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
