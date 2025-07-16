// File: src/components/PropertyCard.tsx
'use client';

import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

interface PropertyCardProps {
  name: string;
  earnings: number;
  roi: string;
}

export default function PropertyCard({ name, earnings, roi }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ rotateY: 10, rotateX: 6, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ perspective: 1200 }}
      className="will-change-transform"
    >
      <Card className="hover:shadow-4xl">
        {/* Image Placeholder */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl overflow-hidden">
          <Home className="absolute top-1/2 left-1/2 w-16 h-16 text-gray-300 dark:text-gray-500 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <CardContent>
          <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 transform translateZ(40px)">{name}</h2>
          <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white drop-shadow-sm">€{earnings}</p>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">ROI: {roi}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
