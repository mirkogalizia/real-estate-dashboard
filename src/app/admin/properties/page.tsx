'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

export default function AdminPropertiesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cost, setCost] = useState<number>(0);
  const [msg, setMsg] = useState('');

  // Legge tutti gli immobili
  async function fetch() {
    const snap = await getDocs(collection(db, 'properties'));
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  }

  useEffect(() => {
    fetch();
  }, []);

  // Aggiunge un nuovo immobile
  async function handleAdd() {
    if (!name || !address || cost <= 0) {
      setMsg('Tutti i campi sono obbligatori.');
      return;
    }
    await addDoc(collection(db, 'properties'), {
      name,
      address,
      purchaseCost: cost,
      createdAt: serverTimestamp()
    });
    setName(''); setAddress(''); setCost(0); setMsg('Creato!');
    fetch();
  }

  // Elimina per ID
  async function handleDel(id: string) {
    await deleteDoc(doc(db, 'properties', id));
    fetch();
  }

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Back-Office Immobili</h1>

      <div className="space-y-2 p-4 border rounded">
        <input
          type="text"
          placeholder="Nome immobile"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Indirizzo"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Costo di acquisto"
          value={cost}
          onChange={e => setCost(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="w-full py-2 bg-indigo-600 text-white rounded"
        >
          Aggiungi Immobile
        </button>
        {msg && <p className="text-green-500">{msg}</p>}
      </div>

      <ul className="space-y-4">
        {items.map(i => (
          <li
            key={i.id}
            className="flex justify-between items-center p-4 border rounded"
          >
            <div>
              <p className="font-semibold">{i.name}</p>
              <p className="text-sm text-gray-500">{i.address}</p>
            </div>
            <button
              onClick={() => handleDel(i.id)}
              className="text-red-500 hover:text-red-700"
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
