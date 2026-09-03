import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16 requires an explicit allowlist; a `quality` prop outside it is
    // silently downgraded to the closest allowed value.
    qualities: [75, 90],
  },
};

export default nextConfig;
