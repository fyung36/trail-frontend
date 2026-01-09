/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['antd', 'rc-util', 'rc-pagination', 'rc-picker', '@ant-design/icons'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
