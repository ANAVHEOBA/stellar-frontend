import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for sodium-native
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "fs": false,
      };
    }

    // Ignore require-addon warnings
    config.ignoreWarnings = [
      { module: /node_modules\/require-addon/ },
      { module: /node_modules\/sodium-native/ },
    ];

    return config;
  },
  // Increase build time if needed
  staticPageGenerationTimeout: 120,
  // Add any environment variables you need
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
};

export default nextConfig;
