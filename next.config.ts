// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // This increases the file size limit
    },
  },
  reactStrictMode: false, // Optional: You can enable or disable react strict mode
};

export default nextConfig;
