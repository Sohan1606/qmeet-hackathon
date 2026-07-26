import type { NextConfig } from "next"

// Force redeploy - v2
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
}

export default nextConfig
