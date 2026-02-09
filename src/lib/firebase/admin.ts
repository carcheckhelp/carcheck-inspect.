import admin from 'firebase-admin';

// Check if we are in a server environment where environment variables are available
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
  try {
    if (projectId && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
       // Initialize with service account if available (preferred for server)
        const serviceAccount = {
            projectId: projectId,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        // Fallback to application default credentials (useful for GCP/Firebase hosting)
         admin.initializeApp();
    }

  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
