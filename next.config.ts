import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    swcPlugins: [],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Cloudinary
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "meeristore.store", // ✅ Your domain
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
