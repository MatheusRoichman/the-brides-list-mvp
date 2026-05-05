import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tjsmvbmtcfiwnlvxalxk.supabase.co",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
