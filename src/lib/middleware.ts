// src/lib/middleware.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from './firebaseAdmin';

export async function verifyIdToken(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return null;
  }
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
}
