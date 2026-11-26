import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // R2 media is served by the Worker route, not the static image optimizer.
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/departments/work-development",
        destination: "/departments/research-development",
        permanent: true,
      },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
