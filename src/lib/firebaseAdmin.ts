// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import type { ServiceAccount } from 'firebase-admin';

// Costruiamo il path al file JSON nella root del progetto
const serviceAccountPath = path.join(process.cwd(), 'airbnb-3cb50-firebase-adminsdk-fbsvc-504ab1e523.json');

// Leggiamo e parsifichiamo il JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf8')
) as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDb   = admin.firestore();
export const adminAuth = admin.auth();
