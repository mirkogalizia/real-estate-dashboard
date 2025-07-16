// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  // aggiungi qui eventuali altri campi (storageBucket, messagingSenderId, ecc.)
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// named exports per modulare
export const auth = getAuth(app);
export const db   = getFirestore(app);

// (Opzionale) default export se ti serve l’istanza app
export default app;
