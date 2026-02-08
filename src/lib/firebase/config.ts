// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// IMPORTANT: In a real production app, use environment variables for this sensitive data.
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
// We add a check to see if the app is already initialized to prevent errors during hot-reloads in development.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
