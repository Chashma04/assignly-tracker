// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBspOKNfyhkLFwnwH8H4efqOh6C0BwWYLY",
  authDomain: "assingly-6c446.firebaseapp.com",
  projectId: "assingly-6c446",
  storageBucket: "assingly-6c446.firebasestorage.app",
  messagingSenderId: "1045859512404",
  appId: "1:1045859512404:web:22bb53e5b62957e423bdc1",
  measurementId: "G-J350FZLCER"
};

// Guard: ensure required keys exist to avoid runtime crashes
if (!firebaseConfig.projectId) {
  console.warn("Firebase not configured: missing REACT_APP_FIREBASE_* env vars");
}

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
