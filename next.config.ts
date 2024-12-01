import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Increase the limit to 20 MB, you can set it to whatever fits your use case
    },
  },
};

export default nextConfig;
