// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG, ERROR_MESSAGES } from "../config/constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Guard: ensure required keys exist to avoid runtime crashes
if (!FIREBASE_CONFIG.projectId) {
  console.warn(ERROR_MESSAGES.FIREBASE_NOT_CONFIGURED);
}

export const app = initializeApp(FIREBASE_CONFIG);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
