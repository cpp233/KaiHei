/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
    // remotePatterns: ['utfs.io'],
  },
  env: {
    DEFAULT_CHANNEL: '默认频道',
    WS_URL_IO: '/api/socket/io',
    WS_URL_MESSAGE: '/api/socket/messages',
    URL_MESSAGE: '/api/messages',
  },
  // webpack: config => {
  //   config.externals.push({
  //     'utf-8-validate': 'commonjs utf-8-validate',
  //     bufferutil: 'commonjs bufferutil',
  //   });
  //   return config;
  // },
};

export default nextConfig;
