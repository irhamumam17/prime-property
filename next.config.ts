import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    ignoreIssue: [
      {
        path: "[next]/internal/font/google/**",
        title: "Module not found",
      },
      {
        path: "[next]/internal/font/google/**",
        title: "next/font: error",
      },
    ],
  },
};

export default nextConfig;
