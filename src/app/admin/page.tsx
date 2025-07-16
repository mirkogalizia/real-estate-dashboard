// src/app/admin/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Grid, User } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
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
    </main>
  );
}

