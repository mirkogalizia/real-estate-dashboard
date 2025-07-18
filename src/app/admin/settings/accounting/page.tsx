'use client';
import AdminMenu from '../../Menu';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  type: 'income' | 'expense';
}

export default function AdminAccountingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('new');
  const [newName, setNewName] = useState('');
  const [newSubs, setNewSubs] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState<string | null>(null);

  // Per aggiungere sottocategoria a categoria esistente
  const [addSub, setAddSub] = useState('');
  const [addSubError, setAddSubError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
    setCategories(list);
  }

  // Creazione nuova categoria
  const handleSave = async () => {
    if (categoryId !== 'new') {
      setError('Per creare una nuova categoria scegli "Nuova categoria"');
      return;
    }
    if (!newName.trim()) {
      setError('Category name is required');
      return;
    }
    const subs = newSubs
      .split(',')
      .map(s => s.trim())
      .filter(s => s);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newName.trim(),
        subcategories: subs,
        type: newType,
      });
      setNewName('');
      setNewSubs('');
      setError(null);
      await fetchCategories();
    } catch (e) {
      console.error(e);
      setError('Failed to save category');
    }
  };

  // Aggiunta sottocategoria a categoria esistente
  const handleAddSub = async () => {
    if (!addSub.trim()) {
      setAddSubError('Sottocategoria obbligatoria');
      return;
    }
    try {
      const ref = doc(db, 'categories', categoryId);
      await updateDoc(ref, {
        subcategories: arrayUnion(addSub.trim())
      });
      setAddSub('');
      setAddSubError(null);
      await fetchCategories();
    } catch (e) {
      console.error(e);
      setAddSubError('Errore aggiunta sottocategoria');
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <>
      <AdminMenu />
      <main className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">Contabilità</h1>

        {/* List existing categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map(cat => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className="rounded-2xl">
                <CardContent>
                  <h2 className="text-xl font-medium mb-2">
                    {cat.name} ({cat.type})
                  </h2>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {cat.subcategories.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Category management */}
        <Card className="max-w-md mx-auto shadow-lg rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-center">Gestisci Categoria</h2>
            <div className="space-y-4">

              {/* Select category */}
              <select
                className="w-full p-2 border rounded"
                value={categoryId}
                onChange={e => {
                  setCategoryId(e.target.value);
                  setNewName('');
                  setNewSubs('');
                  setError(null);
                  setAddSub('');
                  setAddSubError(null);
                }}
              >
                <option value="new">+ Nuova categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                ))}
              </select>

              {/* Form NUOVA categoria */}
              {categoryId === 'new' && (
                <>
                  <Input
                    placeholder="Category Name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                  <Input
                    placeholder="Subcategories (comma separated)"
                    value={newSubs}
                    onChange={e => setNewSubs(e.target.value)}
                  />
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="expense"
                        checked={newType === 'expense'}
                        onChange={() => setNewType('expense')}
                        className="mr-2"
                      />
                      Expense
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="income"
                        checked={newType === 'income'}
                        onChange={() => setNewType('income')}
                        className="mr-2"
                      />
                      Income
                    </label>
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    Save Category
                  </Button>
                  {error && <p className="text-red-500 text-center">{error}</p>}
                </>
              )}

              {/* Form aggiunta sottocategoria a categoria esistente */}
              {categoryId !== 'new' && selectedCategory && (
                <>
                  <div>
                    <div className="text-sm font-semibold mb-1">Sottocategorie esistenti:</div>
                    <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                      {selectedCategory.subcategories.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex">
                    <Input
                      placeholder="Nuova sottocategoria"
                      value={addSub}
                      onChange={e => setAddSub(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddSub} className="ml-2 px-4">
                      Aggiungi
                    </Button>
                  </div>
                  {addSubError && <p className="text-red-500 text-center">{addSubError}</p>}
                </>
              )}

            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

