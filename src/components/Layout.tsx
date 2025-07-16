'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Home, FileText, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? (systemTheme as string) : theme;

  // Evita rendering lato server del toggle, lo mostra solo dopo il montaggio
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-20 flex flex-col items-center py-8 space-y-8 bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-r-3xl shadow-inner">
        {mounted && (
          <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-full bg-white/50 dark:bg-gray-700 hover:scale-110 transition-transform transform-gpu"
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800" />
            )}
          </button>
        )}
        <Home className="w-8 h-8 cursor-pointer hover:text-indigo-500 transition-colors" />
        <FileText className="w-8 h-8 cursor-pointer hover:text-indigo-500 transition-colors" />
        <Settings className="w-8 h-8 cursor-pointer hover:text-indigo-500 transition-colors mt-auto" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-transparent">
        <header className="p-8 backdrop-blur-lg bg-white/20 dark:bg-black/20 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">Dashboard</h1>
        </header>
        <main className="p-8 space-y-8 flex-1 overflow-auto flex flex-col items-center">
          {children}
        </main>
      </div>
    </div>
  );
}
