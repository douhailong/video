import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '30682yjiga.ufs.sh'
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com'
      }
    ]
  }
};

export default nextConfig;
