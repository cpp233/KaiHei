/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
    // remotePatterns: ['utfs.io'],
  },
  env: {
    DEFAULT_CHANNEL: '默认频道',
  },
};

export default nextConfig;
