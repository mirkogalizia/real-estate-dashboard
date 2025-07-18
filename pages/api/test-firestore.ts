// pages/api/test-firestore.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../src/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const snap = await adminDb.collection('properties').limit(5).get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string,unknown>) }));
    return res.status(200).json({ ok: true, data });
  } catch (error: unknown) {
    console.error('Firestore test error:', error);
    const message = error instanceof Error ? error.message : 'Unknown';
    return res.status(500).json({ ok: false, message });
  }
}
