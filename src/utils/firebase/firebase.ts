import firebase, { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import "firebase/storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let auth;
let firestore;
let storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("Conectado a Firebase :)");

  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Error al conectar a Firebase :(", error);
}

export { auth, firestore, storage };
export default firebase;
