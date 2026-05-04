import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/zekahub-website',
  assetPrefix: '/zekahub-website',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
