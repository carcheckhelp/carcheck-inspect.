
import admin from 'firebase-admin';

// This function ensures the app is initialized, but only once.
const initializeAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }

  const serviceAccountString = process.env.SERVICE_ACCOUNT;
  if (!serviceAccountString) {
    // This will only happen if the environment variable is missing at runtime.
    // During build, code using this won't be executed.
    throw new Error('SERVICE_ACCOUNT environment variable is not set.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e) {
    console.error("Firebase Admin SDK initialization error:", e);
    throw new Error('Failed to initialize Firebase Admin SDK.');
  }
};

// Export a function that returns the firestore instance.
// This function will initialize the app on the first call.
export const getDb = () => {
  initializeAdmin();
  return admin.firestore();
};
