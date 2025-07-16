// src/lib/middleware.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// Da qui: src/lib → lo stesso livello
import { adminAuth } from './firebaseAdmin';

export async function verifyIdToken(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).end('Unauthorized');
    return null;
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    return await adminAuth.verifyIdToken(idToken);
  } catch {
    res.status(401).end('Unauthorized');
    return null;
  }
}
