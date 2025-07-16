// next.config.ts (nella root del progetto)
import { join } from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // tutto il resto delle tue config...
  webpack(config) {
    // aggiungi questa riga:
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
