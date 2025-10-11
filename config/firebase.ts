// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "kvitt-8ede5.firebaseapp.com",
  projectId: "kvitt-8ede5",
  storageBucket: "kvitt-8ede5.firebasestorage.app",
  messagingSenderId: "946804735379",
  appId: "1:946804735379:web:2f74dcf728aa44f38d3c66",
  measurementId: "G-ZZD869EC09",
};

// Initialize Firebase app
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const { getReactNativePersistence } = require("firebase/auth");

let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "europe-west3");

export default app;
