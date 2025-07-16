// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = {
    project_id:   process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    // sostituisce i literal "\n" con newline veri
    private_key:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as ServiceAccount;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDb   = admin.firestore();
export const adminAuth = admin.auth();
