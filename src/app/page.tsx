
// File: src/app/page.tsx
'use client';

import Layout from '../components/Layout';
import PropertyCard from '../components/PropertyCard';

// Dati di esempio
const properties = [
  { id: 1, name: 'Appartamento #1', earnings: 1200, roi: '5.2%' },
  { id: 2, name: 'Loft Navigli', earnings: 900, roi: '4.8%' },
];

export default function HomePage() {
  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {properties.map((prop) => (
          <PropertyCard key={prop.id} name={prop.name} earnings={prop.earnings} roi={prop.roi} />
        ))}
      </div>
    </Layout>
  );
}
