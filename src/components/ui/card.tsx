// File: src/components/ui/card.tsx
'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`relative bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden transform-gpu ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-xl pointer-events-none"></div>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`relative p-6 space-y-4 ${className}`}>{children}</div>;
}
