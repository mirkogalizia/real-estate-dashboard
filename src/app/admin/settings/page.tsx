// File: src/app/admin/settings/page.tsx
'use client';
import AdminMenu from '../Menu';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const router = useRouter();

  return (
    <>
      <AdminMenu />
      <main className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Settings</h1>
        <Card className="max-w-md mx-auto rounded-2xl shadow-lg">
          <CardContent>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/admin/settings/accounting')}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                >
                  Contabilità
                </button>
              </li>
              {/* Aggiungi qui altre voci di menu */}
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
