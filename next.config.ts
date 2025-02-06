import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false,
  experimental: {
    swcPlugins: [],
  },
  images: {
    domains: ['meeriproject.onrender.com'],
  },
  /* other config options here */
};

export default nextConfig;
