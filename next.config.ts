import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false,
  experimental: {
    swcPlugins: [],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  /* other config options here */
};

export default nextConfig;
