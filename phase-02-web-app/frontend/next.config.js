/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://faryal16-todo-app-backend.hf.space/',
    BACKEND_URL: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faryal16-todo-app-backend.hf.space/',
    BACKEND_TYPE: process.env.BACKEND_TYPE || 'huggingface',
  },
  async rewrites() {
    // Determine the backend URL based on environment variable
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://faryal16-todo-app-backend.hf.space/';

    return [
      {
        source: '/api/:user_id/:path*',
        destination: `${backendUrl}/api/:user_id/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${backendUrl}/auth/:path*`,
      },
      // Additional rewrite for health check or other endpoints if needed
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
    ]
  },
};

module.exports = nextConfig;