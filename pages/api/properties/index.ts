// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../src/lib/firebaseAdmin';
import { verifyIdToken } from '../../../src/lib/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyIdToken(req, res);
  if (!user) return;

  const { method, body, query } = req;
  const col = adminDb.collection('properties');

  if (method === 'GET') {
    let q = col.orderBy('createdAt', 'desc');
    if (query.ownerId) q = q.where('ownerId', '==', String(query.ownerId));
    const snap = await q.get();
    return res.status(200).json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  if (method === 'POST') {
    const { name, address, purchaseCost, ownerId } = body;
    if (!name || !ownerId) return res.status(400).json({ message: 'Missing fields' });
    const doc = await col.add({
      name,
      address: address || '',
      purchaseCost: purchaseCost || 0,
      ownerId,
      createdAt: Date.now(),
    });
    return res.status(201).json({ id: doc.id });
  }

  if (method === 'DELETE') {
    const { id } = query;
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'Bad request' });
    await col.doc(id).delete();
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET','POST','DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

