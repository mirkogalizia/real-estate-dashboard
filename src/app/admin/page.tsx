'use client';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <Card className="max-w-xl mx-auto shadow-lg rounded-2xl">
        <CardContent>
          <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>
          <div className="flex flex-col items-center space-y-4">
            <Button
              variant="primary"
              className="flex items-center space-x-2 w-full justify-center"
              onClick={() => router.push('/admin/properties/create')}
            >
              <Plus size={20} />
              <span>Add New Property</span>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/admin/properties')}
            >
              View Properties
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


