/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi untuk Docker
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost'],
  },
  
  // Webpack config (jika diperlukan)
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
