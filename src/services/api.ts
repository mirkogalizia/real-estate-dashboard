// src/services/api.ts
import axios from 'axios';
import { auth } from '@/lib/firebase';

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Nessun utente loggato');
  }
  return await user.getIdToken();
}

// esempio di uso:
export async function fetchProperties() {
  const token = await getToken();
  const res = await axios.get('/api/properties', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
