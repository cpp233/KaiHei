/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['utfs.io', 'uploadthing.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '**',
      },
    ],
    // remotePatterns: ['utfs.io'],
  },
  env: {
    DEFAULT_CHANNEL: '默认频道',
    WS_URL_IO: '/api/socket/io',
    WS_URL_MESSAGE: '/api/socket/messages',
    WS_URL_DIRECT_MESSAGE: '/api/socket/direct-messages',
    URL_MESSAGE: '/api/messages',
    URL_DIRECT_MESSAGE: '/api/direct-messages',
  },
  // webpack: config => {
  //   config.externals.push({
  //     'utf-8-validate': 'commonjs utf-8-validate',
  //     bufferutil: 'commonjs bufferutil',
  //   });
  //   return config;
  // },
  // output: 'standalone',
};

export default nextConfig;
