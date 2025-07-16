// File: src/app/admin/Menu.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Home, Settings } from 'lucide-react';

export default function AdminMenu() {
  const router = useRouter();
  return (
    <nav className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-white shadow-lg rounded-l-full p-2 z-20 flex flex-col space-y-4">
      {/* Home */}
      <button
        onClick={() => router.push('/admin')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Go to Admin Home"
      >
        <Home size={24} />
      </button>
      {/* Settings */}
      <button
        onClick={() => router.push('/admin/settings')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Go to Settings"
      >
        <Settings size={24} />
      </button>
    </nav>
);
}
