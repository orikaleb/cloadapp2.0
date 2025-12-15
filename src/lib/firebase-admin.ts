import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;
let adminAuth: Auth;

// Initialize Firebase Admin SDK (server-side only)
try {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'claodapp',
      });
    } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Use individual credentials
      app = initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'claodapp',
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'claodapp',
      });
    } else {
      // Fallback: Initialize without credentials (for development with emulator or public access)
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'claodapp',
      });
    }
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  adminAuth = getAuth(app);
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  // Initialize with minimal config to prevent crashes
  app = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'claodapp',
  });
  db = getFirestore(app);
  adminAuth = getAuth(app);
}

export { db, adminAuth };
export default app;

