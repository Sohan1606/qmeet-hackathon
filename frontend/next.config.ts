import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Skip type checking during builds (for hackathon speed)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Skip ESLint during builds
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
