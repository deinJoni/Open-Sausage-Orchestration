import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  serverExternalPackages: ["@takumi-rs/image-response"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.jakerunzer.com",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
    ],
  },
};

export default nextConfig;
