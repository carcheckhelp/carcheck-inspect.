import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAojnCWlPR7GkKQDU7qtbWyC8SPe6ja-WY",
  authDomain: "carcheck-inspect.firebaseapp.com",
  projectId: "carcheck-inspect",
  storageBucket: "carcheck-inspect.firebasestorage.app",
  messagingSenderId: "787597042368",
  appId: "1:787597042368:web:de41a8893def12803d4325",
  measurementId: "G-MB0QN0J1P5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
