// File: pages/api/test-firestore.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../src/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const snap = await adminDb.collection('properties').limit(5).get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    console.error('Firestore test error:', e);
    return res.status(500).json({ ok: false, message: e.message });
  }
}
