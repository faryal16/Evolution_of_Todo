/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:user_id/:path*',
        destination: 'http://localhost:8000/api/:user_id/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:8000/auth/:path*',
      },
    ]
  },
};

module.exports = nextConfig;