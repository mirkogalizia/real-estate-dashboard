import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Le tue altre configurazioni...
  eslint: {
    // Ignora gli errori di lint durante il build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
