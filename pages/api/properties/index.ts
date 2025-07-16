// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyIdToken } from '@/lib/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyIdToken(req, res);
  if (!user) return;

  const { method, body, query } = req;
  const collectionRef = adminDb.collection('properties');

  if (method === 'GET') {
    let q = collectionRef.orderBy('createdAt', 'desc');
    if (query.ownerId) {
      q = q.where('ownerId', '==', String(query.ownerId));
    }
    const snap = await q.get();
    const props = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(props);
  }

  if (method === 'POST') {
    const { name, address, purchaseCost, ownerId } = body;
    if (!name || !ownerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const docRef = await collectionRef.add({
      name,
      address: address || '',
      purchaseCost: purchaseCost || 0,
      ownerId,
      createdAt: Date.now(),
    });
    return res.status(201).json({ id: docRef.id });
  }

  if (method === 'DELETE') {
    const { id } = query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Property ID is required' });
    }
    await collectionRef.doc(id).delete();
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

