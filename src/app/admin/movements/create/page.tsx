// File: src/app/admin/movements/create/page.tsx
'use client';
import AdminMenu from '../../Menu';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { DocumentData } from 'firebase/firestore';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Unit { id: string; name: string; }
interface Category { id: string; name: string; subcategories: string[]; type: 'income' | 'expense'; }

type MovementType = 'income' | 'expense';

export default function CreateMovementPage() {
  const router = useRouter();
  const params = useSearchParams();
  const paramType = params.get('type');
  const type: MovementType = paramType === 'in' ? 'income' : 'expense';

  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [unitId, setUnitId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [sub, setSub] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(today);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    const snap = await getDocs(query(collection(db, 'units'), orderBy('name')));
    const list: Unit[] = snap.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return { id: doc.id, name: data.name as string };
    });
    setUnits(list);
  }, []);

  const fetchCategories = useCallback(async () => {
    const snap = await getDocs(query(collection(db, 'categories'), where('type', '==', type)));
    const list: Category[] = snap.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        name: data.name as string,
        subcategories: data.subcategories as string[],
        type: data.type as MovementType,
      };
    });
    list.sort((a, b) => a.name.localeCompare(b.name));
    setCategories(list);
  }, [type]);

  useEffect(() => {
    fetchUnits();
    fetchCategories();
  }, [fetchUnits, fetchCategories]);

  const handleSave = async () => {
    if (!unitId || !categoryId || !sub || !amount || !date) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await addDoc(collection(db, 'movements'), {
        unitId,
        type,
        categoryId,
        subcategory: sub,
        amount: parseFloat(amount),
        date: new Date(date).toISOString(),
        createdAt: Date.now(),
      });
      router.push('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to save movement');
    }
  };

  const subList = categories.find(c => c.id === categoryId)?.subcategories ?? [];

  return (
    <>
      <AdminMenu />
      <main className="p-8 bg-gray-100 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            {type === 'income' ? 'Add Income' : 'Add Expense'}
          </h1>
          <Card className="shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <h2 className="text-white text-xl font-semibold text-center">
                New {type === 'income' ? 'Income' : 'Expense'}
              </h2>
            </div>
            <CardContent className="p-6 space-y-4">
              {/** Unit Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Unit</label>
                <select
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select unit...</option>
                  {units.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              {/** Category Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={categoryId}
                  onChange={e => { setCategoryId(e.target.value); setSub(''); }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              {/** Subcategory Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Subcategory</label>
                <select
                  value={sub}
                  onChange={e => setSub(e.target.value)}
                  disabled={!subList.length}
                  className="w-full p-2 border rounded bg-white disabled:bg-gray-200"
                >
                  <option value="">Select sub...</option>
                  {subList.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {/** Amount Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Amount (€)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              {/** Date Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              {error && <p className="text-red-600 text-center">{error}</p>}
            </CardContent>
            <div className="bg-gray-50 p-4 flex justify-end">
              <Button
                onClick={handleSave}
                className="px-6 py-2"
              >
                Save
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </>
  );
}


