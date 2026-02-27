import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // only for local development
    remotePatterns: [
      {
        hostname: process.env.IMAGES_DOMAIN,
      },
    ],
  },
};

export default nextConfig;
