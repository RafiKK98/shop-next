import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,
  cacheLife: {
    default: {
      stale: 300,
      revalidate: 900,
      expire: 86400,
    },
    seconds: {
      stale: 30,
      revalidate: 1,
      expire: 60,
    },
    minutes: {
      stale: 300,
      revalidate: 60,
      expire: 3600,
    },
    hours: {
      stale: 300,
      revalidate: 3600,
      expire: 86400,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
