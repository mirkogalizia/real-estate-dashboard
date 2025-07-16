import axios from 'axios';
import { auth } from '@/lib/firebase';

async function getToken() {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : '';
}

export async function fetchProperties() {
  const token = await getToken();
  const { data } = await axios.get('/api/properties', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function createProperty(payload) {
  const token = await getToken();
  const { data } = await axios.post('/api/properties', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
