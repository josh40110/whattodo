/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/whattodo',
  assetPrefix: '/whattodo/',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig 