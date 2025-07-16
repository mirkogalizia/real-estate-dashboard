// src/lib/middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';

export async function verifyIdToken(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return null;
  }
  try {
    const decoded = await adminDb.auth().verifyIdToken(token);
    return decoded;
  } catch (e: any) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
}
