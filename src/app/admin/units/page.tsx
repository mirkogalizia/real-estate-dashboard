'use client';
import { useEffect, useState, useRef } from 'react';
import AdminMenu from '../Menu';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, where } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

interface Unit { id: string; name: string; address: string; purchaseCost: number; ownerId: string; createdAt: number; }
interface Owner { id: string; name: string; }

export default function AdminUnitsPage() {
  const ownerInputRef = useRef<HTMLInputElement>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [ownersMap, setOwnersMap] = useState<Record<string,string>>({});
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [ownerQuery, setOwnerQuery] = useState('');
  const [ownerSuggestions, setOwnerSuggestions] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { fetchOwnersMap(); fetchUnits(); }, []);
  async function fetchOwnersMap() { const snap = await getDocs(collection(db,'owners')); const m:Record<string,string>={}; snap.docs.forEach(d=>m[d.id]=(d.data() as any).name); setOwnersMap(m);}  
  async function fetchUnits() { const q=query(collection(db,'units'),orderBy('createdAt','desc')); const snap=await getDocs(q); setUnits(snap.docs.map(d=>({id:d.id,...(d.data() as any)}))); }

  useEffect(() => {
    if (!ownerQuery) return setOwnerSuggestions([]);
    async function f() {
      const q = query(
        collection(db,'owners'), where('name','>=',ownerQuery), where('name','<=',ownerQuery+'\uf8ff'), orderBy('name')
      );
      const snap=await getDocs(q);
      setOwnerSuggestions(snap.docs.map(d=>({ id:d.id, name:(d.data() as any).name }))); }
    f();
  }, [ownerQuery]);

  const filtered = units.filter(u=>u.name.toLowerCase().includes(search.toLowerCase()));

  async function handleSave(){
    if(!selectedOwner){ setError('Owner not found'); return; }
    setIsSaving(true); setError(null);
    try{ await addDoc(collection(db,'units'),{ name,address,purchaseCost:Number(purchaseCost),ownerId:selectedOwner.id,createdAt:Date.now() }); setName(''); setAddress(''); setPurchaseCost(''); setOwnerQuery(''); setSelectedOwner(null); await fetchUnits(); }
    catch(e){ console.error(e); setError('Failed to save unit.'); }
    finally{ setIsSaving(false); }
  }

  async function handleDelete(id:string,name:string){ if(!confirm(`Delete unit '${name}'?`)) return; await deleteDoc(doc(db,'units',id)); setUnits(units.filter(u=>u.id!==id)); }

  return (
    <>
      <AdminMenu />
      <main className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-4">Units</h1>
        <div className="mb-6 max-w-md"><Input placeholder="Search units..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {filtered.map(u=>(
            <motion.div key={u.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} whileHover={{scale:1.03}} transition={{duration:0.3}} className="relative">
              <Card className="rounded-2xl overflow-hidden">
                <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 z-10" onClick={()=>handleDelete(u.id,u.name)}>✕</button>
                <div className="relative h-32 bg-gray-200 flex items-center justify-center"><Home className="w-12 h-12 text-gray-400"/></div>
                <CardContent>
                  <h2 className="text-lg font-medium mb-1">{u.name}</h2>
                  <p className="text-sm text-gray-500 mb-2">{u.address}</p>
                  <p className="text-sm mb-2">Owner: <strong>{ownersMap[u.ownerId]}</strong></p>
                  <p className="text-sm font-semibold">€{u.purchaseCost}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <Card className="max-w-md mx-auto shadow-lg rounded-2xl"><CardContent>
          <h2 className="text-2xl font-semibold mb-4 text-center">Add New Unit</h2>
          <div className="space-y-4">
            <Input placeholder="Unit Name" value={name} onChange={e=>setName(e.target.value)}/>
            <Input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)}/>
            <Input type="number" placeholder="Purchase Cost" value={purchaseCost} onChange={e=>setPurchaseCost(e.target.value)}/>
            <div className="relative">
              <Input placeholder="Search Owner by name" value={ownerQuery} onChange={e=>{setOwnerQuery(e.target.value);setSelectedOwner(null);}} ref={ownerInputRef}/>
              {ownerSuggestions.length>0&&(
                <ul className="absolute z-20 bg-white border rounded-md w-full mt-1 max-h-48 overflow-auto">
                  {ownerSuggestions.map(o=>(
                    <li key={o.id} className="px-3 py-1 hover:bg-gray-100 cursor-pointer" onMouseDown={e=>{e.preventDefault();setSelectedOwner(o);setOwnerQuery(o.name);setOwnerSuggestions([]);ownerInputRef.current?.blur();}}>{o.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <Button onClick={handleSave} disabled={isSaving||!name||!address||!purchaseCost||!selectedOwner} className="w-full">{isSaving?'Saving...':'Save Unit'}</Button>
            {error&&<p className="text-red-500 text-center">{error}</p>}
          </div>
        </CardContent></Card>
      </main>
    </>
  );
}