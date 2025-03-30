/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  output: 'export',
  trailingSlash: true,
  // Ensure images are unoptimized for static export
  images: {
    unoptimized: true,
  },
  // Make custom environment variables available to the client
  env: {
    NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE || 'production',
  },
};

module.exports = nextConfig;
