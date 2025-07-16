import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from './firebaseAdmin';

export async function verifyIdToken(req: NextApiRequest, res: NextApiResponse) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    res.status(401).end('Unauthorized');
    return null;
  }
  const idToken = h.split('Bearer ')[1];
  try {
    return await adminAuth.verifyIdToken(idToken);
  } catch {
    res.status(401).end('Unauthorized');
    return null;
  }
}
