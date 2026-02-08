import admin from 'firebase-admin';

const serviceAccountString = process.env.SERVICE_ACCOUNT;

if (!serviceAccountString) {
  throw new Error('The SERVICE_ACCOUNT environment variable is not set.');
}

let serviceAccount;
try {
  // Try parsing the string as JSON. This will work if the env variable is a stringified JSON object.
  serviceAccount = JSON.parse(serviceAccountString);
} catch (e) {
    // If parsing fails, it might be because the environment variable is already an object
    // (though less common for process.env). Or, the string is malformed.
    // For safety, we'll assume it might be a raw object or we re-throw if it's truly a bad string.
    if (typeof serviceAccountString === 'object' && serviceAccountString !== null) {
        serviceAccount = serviceAccountString;
    } else {
        throw new Error('Failed to parse SERVICE_ACCOUNT. Check the format in your .env.local file.');
    }
}


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db };
