// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCExU_Oze1Mn0ON8MdrhhiGjDshwKOUZMA",
  authDomain: "kvitt-8ede5.firebaseapp.com",
  projectId: "kvitt-8ede5",
  storageBucket: "kvitt-8ede5.firebasestorage.app",
  messagingSenderId: "946804735379",
  appId: "1:946804735379:web:2f74dcf728aa44f38d3c66",
  measurementId: "G-ZZD869EC09",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "europe-west3");

export default app;
