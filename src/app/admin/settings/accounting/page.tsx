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

interface Category {
  id: string;
  name: string;
  subcategories: string[];
  type: 'income' | 'expense';
}

export default function AdminAccountingPage() {
  // Stato e hooks
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addSub, setAddSub] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Carica categorie da Firestore
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const snap = await getDocs(collection(db, 'categories'));
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
    setCategories(list);
  }

  // Aggiungi nuova categoria
  async function handleSaveCategory() {
    if (!newCategoryName.trim()) {
      setError('Nome categoria obbligatorio');
      return;
    }
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName.trim(),
        subcategories: [],
        type,
      });
      setNewCategoryName('');
      setError(null);
      await fetchCategories();
    } catch (e) {
      setError('Errore creazione categoria');
    }
  }

  // Aggiungi sottocategoria
  async function handleAddSub() {
    if (!addSub.trim() || !categoryId) {
      setError('Sottocategoria obbligatoria e seleziona categoria');
      return;
    }
    try {
      const ref = doc(db, 'categories', categoryId);
      await updateDoc(ref, {
        subcategories: arrayUnion(addSub.trim())
      });
      setAddSub('');
      setError(null);
      await fetchCategories();
    } catch (e) {
      setError('Errore aggiunta sottocategoria');
    }
  }

  // Elimina categoria
  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Eliminare la categoria "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
    } catch (e) {
      alert('Errore eliminazione categoria');
    }
  }

  // Elimina sottocategoria
  async function handleDeleteSub(catId: string, sub: string) {
    if (!confirm(`Eliminare la sottocategoria "${sub}"?`)) return;
    try {
      const ref = doc(db, 'categories', catId);
      await updateDoc(ref, { subcategories: arrayRemove(sub) });
      await fetchCategories();
    } catch (e) {
      alert('Errore eliminazione sottocategoria');
    }
  }

  // Solo categorie del tipo selezionato
  const filteredCategories = categories.filter(c => c.type === type);
  // Opzioni per il combobox
  const categoryOptions = filteredCategories.map(c => ({
    value: c.id,
    label: c.name
  }));
  // Sottocategorie della categoria selezionata
  const selectedCategory = filteredCategories.find(c => c.id === categoryId);
  const subOptions = (selectedCategory?.subcategories || []).map(sub => ({
    value: sub,
    label: sub
  }));

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

        {/* Form UX migliorata per mobile */}
        <Card className="max-w-md w-full mx-auto shadow-lg rounded-2xl mb-6">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-center">Gestione Categoria</h2>
            <div className="space-y-4">

              {/* Tipo: Entrata o Spesa */}
              <div className="flex justify-center gap-4 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="main-type"
                    value="expense"
                    checked={type === 'expense'}
                    onChange={() => { setType('expense'); setCategoryId(''); setSelectedSub(''); }}
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
                    onChange={() => { setType('income'); setCategoryId(''); setSelectedSub(''); }}
                    className="mr-2"
                  />
                  Entrata
                </label>
              </div>

              {/* Combobox Categoria */}
              <Combobox
                options={[{ value: '', label: '+ Nuova categoria' }, ...categoryOptions]}
                value={categoryId}
                onChange={v => setCategoryId(v)}
                placeholder="Scegli o cerca categoria"
              />

              {/* Se + Nuova categoria, mostra input per aggiungere */}
              {categoryId === '' && (
                <div className="flex flex-row gap-2">
                  <Input
                    placeholder="Nome categoria"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveCategory}>
                    Salva
                  </Button>
                </div>
              )}

              {/* Sottocategorie */}
              {categoryId && selectedCategory && (
                <>
                  <Combobox
                    options={subOptions}
                    value={selectedSub}
                    onChange={v => setSelectedSub(v)}
                    placeholder="Scegli sottocategoria"
                  />
                  <div className="flex flex-row gap-2">
                    <Input
                      placeholder="Aggiungi sottocategoria"
                      value={addSub}
                      onChange={e => setAddSub(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddSub}>
                      Aggiungi
                    </Button>
                  </div>
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

