import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyIdToken } from '@/lib/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await verifyIdToken(req, res);
  if (!user) return;

  const { method, body } = req;
  if (method === 'GET') {
    const snap = await adminDb.collection('properties')
      .where('ownerId', '==', user.uid)
      .get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json(data);
  }

  if (method === 'POST') {
    const doc = await adminDb.collection('properties').add({
      ...body,
      ownerId: user.uid,
      createdAt: Date.now()
    });
    return res.status(201).json({ id: doc.id });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
