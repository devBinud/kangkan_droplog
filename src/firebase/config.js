// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-Ld0BuPCWbBxRw-ww2dPhgt217tqQids",
  authDomain: "kangkandroplog.firebaseapp.com",
  projectId: "kangkandroplog",
  storageBucket: "kangkandroplog.firebasestorage.app",
  messagingSenderId: "341489401170",
  appId: "1:341489401170:web:f61db2f239f9efd22dce8b",
  measurementId: "G-KYKBPRC05K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
