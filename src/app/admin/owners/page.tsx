'use client';
import { useEffect, useState } from 'react';
import AdminMenu from '../Menu';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Owner { id: string; name: string; email: string; createdAt: number; }

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchOwners(); }, []);
  async function fetchOwners(){ const q=query(collection(db,'owners'),orderBy('createdAt','desc')); const snap=await getDocs(q); setOwners(snap.docs.map(d=>({id:d.id,...(d.data() as any)}))); }

  const filtered = owners.filter(o=>o.name.toLowerCase().includes(search.toLowerCase()));

  async function handleSave(){ setIsSaving(true); setError(null); try{ await addDoc(collection(db,'owners'),{ name,email,createdAt:Date.now() }); setName('');setEmail(''); await fetchOwners(); }catch(e){ console.error(e); setError('Failed to save owner.'); }finally{ setIsSaving(false);} }
  async function handleDelete(id:string,name:string){ if(!confirm(`Delete owner '${name}'?`)) return; await deleteDoc(doc(db,'owners',id)); setOwners(owners.filter(o=>o.id!==id)); }

  return (
    <>
      <AdminMenu />
      <main className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-4">Owners</h1>
        <div className="mb-6 max-w-md"><Input placeholder="Search owners..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filtered.map(o=>(
            <motion.div key={o.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} whileHover={{scale:1.03}} transition={{duration:0.3}} className="relative">
              <Card className="rounded-2xl overflow-hidden">
                <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10" onClick={()=>handleDelete(o.id,o.name)}>✕</button>
                <div className="relative h-32 bg-gray-200 flex items-center justify-center"><User className="w-12 h-12 text-gray-400"/></div>
                <CardContent>
                  <h2 className="text-lg font-medium mb-1">{o.name}</h2>
                  <p className="text-sm text-gray-500 mb-2">{o.email}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <Card className="max-w-md mx-auto shadow-lg rounded-2xl"><CardContent>
          <h2 className="text-2xl font-semibold mb-4 text-center">Add New Owner</h2>
          <div className="space-y-4">
            <Input placeholder="Owner Name" value={name} onChange={e=>setName(e.target.value)}/>
            <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <Button onClick={handleSave} disabled={isSaving||!name||!email} className="w-full">{isSaving?'Saving...':'Save Owner'}</Button>
            {error&&<p className="text-red-500 text-center">{error}</p>}
          </div>
        </CardContent></Card>
      </main>
    </>
  );
}