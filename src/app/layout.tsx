// File: src/app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head />
      <body className="h-full bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-500">
        {/* ThemeProvider con default statico per evitare mismatch SSR/CSR */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
