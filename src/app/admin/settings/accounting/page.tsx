'use client';
import AdminMenu from '../../Menu';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  type: 'income' | 'expense';
}

export default function AdminAccountingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('new');
  const [newName, setNewName] = useState('');
  const [newSubs, setNewSubs] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState<string | null>(null);

  // Sottocategoria
  const [addSub, setAddSub] = useState('');
  const [addSubError, setAddSubError] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
    setCategories(list);
  }

  // Crea categoria nuova
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

  // Aggiungi sottocategoria
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

  // Elimina categoria
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Eliminare la categoria "${name}"? Verranno rimosse anche tutte le sue sottocategorie.`)) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
    } catch (e) {
      alert('Errore eliminazione categoria');
    }
  };

  // Elimina sottocategoria
  const handleDeleteSub = async (catId: string, sub: string) => {
    if (!confirm(`Eliminare la sottocategoria "${sub}"?`)) return;
    try {
      const ref = doc(db, 'categories', catId);
      await updateDoc(ref, { subcategories: arrayRemove(sub) });
      await fetchCategories();
    } catch (e) {
      alert('Errore eliminazione sottocategoria');
    }
  };

  // Filtra categorie per tipo (expense/income)
  const filteredCategories = categories.filter(c => c.type === categoryType);

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <>
      <AdminMenu />
      <main className="p-2 sm:p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-6">Contabilità</h1>

        {/* Elenco categorie */}
        <div className="mb-6">
          <h2 className="font-bold text-lg mb-2 sm:mb-4">Categorie esistenti</h2>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-6">
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-xl font-medium mb-1">
                        {cat.name} <span className="text-xs bg-gray-200 rounded px-2 py-0.5">{cat.type}</span>
                      </h3>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="ml-2 text-red-500 text-xl p-1 rounded-full hover:bg-red-100 transition"
                        aria-label="Elimina categoria"
                      >
                        🗑️
                      </button>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {cat.subcategories.map((s, idx) => (
                        <li key={idx} className="flex items-center justify-between group pr-2">
                          <span>{s}</span>
                          <button
                            onClick={() => handleDeleteSub(cat.id, s)}
                            className="ml-3 text-red-400 opacity-70 group-hover:opacity-100 hover:text-red-600 text-lg p-1 rounded transition"
                            aria-label={`Elimina sottocategoria ${s}`}
                          >✕</button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form: step type > category > subcategory */}
        <Card className="max-w-md w-full mx-auto shadow-lg rounded-2xl mb-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-center">Nuova o Gestisci Categoria</h2>
            <div className="space-y-4">

              {/* Step 1: Income/Expense */}
              <div className="flex justify-center gap-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="main-type"
                    value="expense"
                    checked={categoryType === 'expense'}
                    onChange={() => {
                      setCategoryType('expense');
                      setCategoryId('new');
                      setAddSub('');
                      setSelectedSub('');
                      setNewName('');
                      setNewSubs('');
                      setError(null);
                    }}
                    className="mr-2"
                  />
                  Spesa
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="main-type"
                    value="income"
                    checked={categoryType === 'income'}
                    onChange={() => {
                      setCategoryType('income');
                      setCategoryId('new');
                      setAddSub('');
                      setSelectedSub('');
                      setNewName('');
                      setNewSubs('');
                      setError(null);
                    }}
                    className="mr-2"
                  />
                  Entrata
                </label>
              </div>

              {/* Step 2: select categoria */}
              <select
                className="w-full p-2 border rounded"
                value={categoryId}
                onChange={e => {
                  setCategoryId(e.target.value);
                  setNewName('');
                  setNewSubs('');
                  setAddSub('');
                  setSelectedSub('');
                  setError(null);
                  setAddSubError(null);
                }}
              >
                <option value="new">+ Nuova categoria</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Step 3a: nuova categoria */}
              {categoryId === 'new' && (
                <>
                  <Input
                    placeholder="Nome categoria"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                  <Input
                    placeholder="Sottocategorie (separate da virgola)"
                    value={newSubs}
                    onChange={e => setNewSubs(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="w-full">
                      Crea categoria
                    </Button>
                  </div>
                  {error && <p className="text-red-500 text-center">{error}</p>}
                </>
              )}

              {/* Step 3b: gestisci sottocategorie di una categoria esistente */}
              {categoryId !== 'new' && selectedCategory && (
                <>
                  <div>
                    <div className="text-sm font-semibold mb-1">Sottocategorie:</div>
                    <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                      {selectedCategory.subcategories.map((s, idx) => (
                        <li key={idx} className="flex items-center">
                          <span>{s}</span>
                          {selectedSub === s ? (
                            <span className="ml-2 text-green-500 font-bold">✓</span>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => setSelectedSub(s)}
                              className="ml-2 px-2 py-1 text-xs"
                            >Seleziona</Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex">
                    <Input
                      placeholder="Aggiungi sottocategoria"
                      value={addSub}
                      onChange={e => setAddSub(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddSub} className="ml-2 px-4">
                      Aggiungi
                    </Button>
                  </div>
                  {addSubError && <p className="text-red-500 text-center">{addSubError}</p>}
                  {selectedSub && (
                    <div className="mt-2 text-sm text-green-700">
                      Sottocategoria selezionata: <strong>{selectedSub}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

