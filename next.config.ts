import type { NextConfig } from 'next';

let r2Hostname: string | undefined;
try {
  const raw = process.env.R2_PUBLIC_URL;
  if (raw) {
    const url = raw.startsWith('http') ? raw : `https://${raw}`;
    r2Hostname = new URL(url).hostname;
  }
} catch { /* ignore */ }

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      ...(r2Hostname
        ? [{ protocol: 'https' as const, hostname: r2Hostname, pathname: '/**' }]
        : []),
    ],
  },
};

export default nextConfig;
