'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  address: string;
  purchaseCost: number;
  ownerId: string;
  createdAt: number;
}

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    const q = query(collection(db, 'units'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as Omit<Unit, 'id'>) }));
    setUnits(list);
  }

  const filtered = units.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'units'), {
        name,
        address,
        purchaseCost: Number(purchaseCost),
        ownerId,
        createdAt: Date.now(),
      });
      setName(''); setAddress(''); setPurchaseCost(''); setOwnerId('');
      await fetchUnits();
    } catch (e) {
      console.error(e);
      setError('Failed to save unit.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete unit '${name}'?`)) return;
    await deleteDoc(doc(db, 'units', id));
    setUnits(units.filter(u => u.id !== id));
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Units</h1>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search units..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Units list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filtered.map(u => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Card className="rounded-2xl overflow-hidden">
              {/* Delete button */}
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10"
                onClick={() => handleDelete(u.id, u.name)}
              >
                ✕
              </button>
              <div className="relative h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Home className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <CardContent>
                <h2 className="text-lg font-medium mb-1">{u.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{u.address}</p>
                <p className="text-sm mb-2">Owner: <strong>{u.ownerId}</strong></p>
                <p className="text-sm font-semibold">€{u.purchaseCost}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Form to add unit */}
      <Card className="max-w-md mx-auto shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4 text-center">Add New Unit</h2>
          <div className="space-y-4">
            <Input
              placeholder="Unit Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Purchase Cost"
              value={purchaseCost}
              onChange={e => setPurchaseCost(e.target.value)}
            />
            <Input
              placeholder="Owner ID"
              value={ownerId}
              onChange={e => setOwnerId(e.target.value)}
            />
            <Button
              onClick={handleSave}
              disabled={isSaving || !name || !address || !purchaseCost || !ownerId}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Unit'}
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

