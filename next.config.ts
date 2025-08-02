import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove swcMinify as it's deprecated in Next.js 15+
  experimental: {
    swcPlugins: [],
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'meeristore.store', // Your domain
        port: '', // Leave empty if default
        pathname: '/**', // Allows all paths
      },
    ],
  },
  // Add this to properly handle Suspense boundaries
  reactStrictMode: true,
};

export default nextConfig;