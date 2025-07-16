// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth }                from 'firebase/auth';
import { getFirestore }           from 'firebase/firestore';

const cfg = {
  apiKey:         process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:     process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
};

if (!getApps().length) initializeApp(cfg);

export const auth = getAuth();
export const db   = getFirestore();
