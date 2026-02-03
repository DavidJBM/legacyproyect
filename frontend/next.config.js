/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir llamadas a la API del backend en desarrollo
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/:path*`,

      },
    ];
  },
};

module.exports = nextConfig;
