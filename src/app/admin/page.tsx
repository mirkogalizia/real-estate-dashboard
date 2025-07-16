import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { List, ListItem } from '@/components/ui/list';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Plus } from 'lucide-react';

type Property = {
  id: string;
  name: string;
  address: string;
  purchaseCost: number;
  ownerId: string;
  createdAt: number;
};

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Property, 'id'>) }));
      setProperties(list);
    }
    fetchProperties();
  }, []);

  const filtered = properties.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Button variant="primary" className="flex items-center space-x-2">
          <Plus size={16} />
          <span>New Property</span>
        </Button>
      </div>

      <Card className="mb-6 shadow-md rounded-2xl">
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl shadow-lg bg-white p-4"
          >
            <h2 className="text-lg font-medium mb-1">{p.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{p.address}</p>
            <p className="text-sm">
              Owner: <span className="font-semibold">{p.ownerId}</span>
            </p>
            <p className="text-sm">
              Cost: <span className="font-semibold">€{p.purchaseCost}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
