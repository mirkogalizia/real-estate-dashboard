// test-admin.js
require('dotenv').config();
const admin = require('firebase-admin');

// Inizializziamo l’Admin SDK esattamente come in src/lib/firebaseAdmin.ts
admin.initializeApp({
  credential: admin.credential.cert({
    projectId:   process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function test() {
  try {
    const snap = await db.collection('properties').limit(5).get();
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log('✅ Connection OK, sample data:', items);
    process.exit(0);
  } catch (e) {
    console.error('❌ Firestore connection failed:', e);
    process.exit(1);
  }
}

test();
