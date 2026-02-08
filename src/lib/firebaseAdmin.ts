import admin from 'firebase-admin';

// Check if the service account environment variable is available.
const serviceAccountString = process.env.SERVICE_ACCOUNT;

// Only initialize the app if the service account is available and the app has not been initialized yet.
if (serviceAccountString && !admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e) {
    console.error("Firebase Admin SDK initialization error:", e);
  }
}

// Export the firestore instance. If initialization failed, admin.firestore() will throw an error at runtime.
const db = admin.firestore();

export { db };
