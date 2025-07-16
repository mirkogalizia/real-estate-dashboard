// File: src/app/admin/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import AdminMenu from './Menu';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Grid, User, Plus, Minus } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  return (
    <>
      <AdminMenu />
      <main className="relative p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Units Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
            onClick={() => router.push('/admin/units')}
          >
            <Card className="rounded-2xl overflow-hidden">
              <div className="h-32 bg-green-100 flex items-center justify-center">
                <Grid className="w-12 h-12 text-green-600" />
              </div>
              <CardContent>
                <h2 className="text-xl font-semibold">Units</h2>
              </CardContent>
            </Card>
          </motion.div>

          {/* Owners Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer"
            onClick={() => router.push('/admin/owners')}
          >
            <Card className="rounded-2xl overflow-hidden">
              <div className="h-32 bg-yellow-100 flex items-center justify-center">
                <User className="w-12 h-12 text-yellow-600" />
              </div>
              <CardContent>
                <h2 className="text-xl font-semibold">Owners</h2>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
          <button
            onClick={() => router.push('/admin/movements/create?type=in')}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg text-white"
            aria-label="Add Income"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={() => router.push('/admin/movements/create?type=out')}
            className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg text-white"
            aria-label="Add Expense"
          >
            <Minus size={24} />
          </button>
        </div>
      </main>
    </>
  );
}
