import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize for production
  output: 'standalone',
  // Enable image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Allow data URLs for base64 images
    unoptimized: false,
  },
  // Environment variables that should be available on the client
  env: {
    // Add any public env vars here if needed
  },
  // Ignore ESLint during build to avoid dependency issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build (optional, remove if you want type checking)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
