import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Environment variables for API URL
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },

  // Image domains (for external images if needed)
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },

  // Webpack configuration for Three.js
  webpack: (config, { isServer }) => {
    // Fix for Three.js in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['three'],
  },

  // React strict mode (enabled for development)
  reactStrictMode: process.env.NODE_ENV === 'development',

  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,
};

export default nextConfig;
