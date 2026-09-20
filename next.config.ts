import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Hetzner'deki Docker imaji icin: Next tum gerekli dosyalari tek klasore
  // toplar, imaj kucuk kalir. Vercel bu ayardan olumsuz etkilenmez.
  output: 'standalone',
}

export default nextConfig
