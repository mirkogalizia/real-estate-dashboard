'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

type Property = {
  id: string;
  name: string;
  address: string;
  purchaseCost: number;
  ownerId: string;
  createdAt: number;
};

export default function AdminPropertiesPage() {
  const [props, setProps] = useState<Property[]>([]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        // Crea una query ordinata per createdAt
        const q = query(
          collection(db, 'properties'),
          orderBy('createdAt', 'desc')
        );
        // Esegui la query
        const snap = await getDocs(q);
        // Mappa i documenti in oggetti Property
        const list: Property[] = snap.docs.map((doc) => {
          const data = doc.data() as Omit<Property, 'id'>;
          return { id: doc.id, ...data };
        });
        setProps(list);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {props.map((p) => (
          <li key={p.id}>
            {p.name} — {p.ownerId} — €{p.purchaseCost}
          </li>
        ))}
      </ul>
    </div>
  );
}
