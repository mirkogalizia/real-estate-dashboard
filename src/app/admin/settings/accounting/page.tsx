'use client';
import AdminMenu from '../../Menu';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  type: 'income' | 'expense';
}

export default function AdminAccountingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addSub, setAddSub] = useState('');
  const [sub, setSub] = useState('');
  const [addingSub, setAddingSub] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
    setCategories(list);
  }

  async function handleSaveCategory() {
    if (!newCategoryName.trim()) return setError('Nome categoria obbligatorio');
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName.trim(),
        subcategories: [],
        type,
      });
      setNewCategoryName('');
      setError(null);
      setAddingCategory(false);
      await fetchCategories();
    } catch {
      setError('Errore creazione categoria');
    }
  }

  async function handleAddSub() {
    if (!addSub.trim() || !categoryId) return setError('Sottocategoria obbligatoria e seleziona categoria');
    try {
      const ref = doc(db, 'categories', categoryId);
      await updateDoc(ref, {
        subcategories: arrayUnion(addSub.trim())
      });
      setAddSub('');
      setAddingSub(false);
      setError(null);
      await fetchCategories();
    } catch {
      setError('Errore aggiunta sottocategoria');
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Eliminare la categoria "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
      if (categoryId === id) setCategoryId('');
    } catch {
      alert('Errore eliminazione categoria');
    }
  }

  async function handleDeleteSub(catId: string, sub: string) {
    if (!confirm(`Eliminare la sottocategoria "${sub}"?`)) return;
    try {
      const ref = doc(db, 'categories', catId);
      await updateDoc(ref, { subcategories: arrayRemove(sub) });
      await fetchCategories();
      if (sub === sub) setSub('');
    } catch {
      alert('Errore eliminazione sottocategoria');
    }
  }

  const filteredCategories = categories.filter(c => c.type === type);
  const categoryOptions = [
    { value: '', label: '+ Nuova categoria' },
    ...filteredCategories.map(c => ({
      value: c.id,
      label: c.name
    })),
  ];
  const selectedCategory = filteredCategories.find(c => c.id === categoryId);
  const subOptions = [
    { value: '', label: '+ Nuova sottocategoria' },
    ...(selectedCategory?.subcategories || []).map(subc => ({
      value: subc,
      label: subc
    }))
  ];

  // Resetta sottocategoria se cambi categoria
  useEffect(() => { setSub(''); setAddingSub(false); }, [categoryId]);

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

        {/* Form UX */}
        <Card className="max-w-md w-full mx-auto shadow-lg rounded-2xl mb-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-center">Gestione Categoria</h2>
            <div className="space-y-4">
              {/* Tipo */}
              <div className="flex justify-center gap-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="main-type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => { setType('expense'); setCategoryId(''); setAddingCategory(false); }}
                    className="mr-2"
                  />
                  Spesa
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="main-type"
                    value="income"
                    checked={type === 'income'}
                    onChange={() => { setType('income'); setCategoryId(''); setAddingCategory(false); }}
                    className="mr-2"
                  />
                  Entrata
                </label>
              </div>

              {/* Combobox Categoria */}
              <div className="relative">
                <Combobox
                  options={categoryOptions}
                  value={categoryId}
                  onChange={v => {
                    if (v === '') {
                      setCategoryId('');
                      setAddingCategory(true);
                    } else {
                      setCategoryId(v);
                      setAddingCategory(false);
                    }
                  }}
                  placeholder="Scegli o cerca categoria"
                />
                {categoryId && (
                  <button
                    onClick={() => { setCategoryId(''); setAddingCategory(false); }}
                    className="absolute top-2 right-2 z-10 bg-gray-200 rounded-full p-1 text-gray-500 hover:bg-gray-300"
                    aria-label="Azzera selezione categoria"
                    type="button"
                  ><X size={18}/></button>
                )}
              </div>

              {/* Se + Nuova categoria, mostra input */}
              {addingCategory && (
                <div className="flex flex-row gap-2">
                  <Input
                    placeholder="Nome categoria"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveCategory}>Salva</Button>
                </div>
              )}

              {/* Sottocategorie */}
              {categoryId && selectedCategory && (
                <>
                  <div className="relative">
                    <Combobox
                      options={subOptions}
                      value={sub}
                      onChange={v => {
                        if (v === '') {
                          setSub('');
                          setAddingSub(true);
                        } else {
                          setSub(v);
                          setAddingSub(false);
                        }
                      }}
                      placeholder="Scegli sottocategoria"
                    />
                    {sub && (
                      <button
                        onClick={() => { setSub(''); setAddingSub(false); }}
                        className="absolute top-2 right-2 z-10 bg-gray-200 rounded-full p-1 text-gray-500 hover:bg-gray-300"
                        aria-label="Azzera selezione sottocategoria"
                        type="button"
                      ><X size={18}/></button>
                    )}
                  </div>
                  {/* Input nuova sottocategoria */}
                  {addingSub && (
                    <div className="flex flex-row gap-2">
                      <Input
                        placeholder="Nuova sottocategoria"
                        value={addSub}
                        onChange={e => setAddSub(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleAddSub}>Aggiungi</Button>
                    </div>
                  )}
                </>
              )}

              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

