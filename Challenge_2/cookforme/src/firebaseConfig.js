import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtfm0WM9dxeVGDfhxOUITsVtJnQC9AdX0",
  authDomain: "citieasy-91f87.firebaseapp.com",
  projectId: "citieasy-91f87",
  storageBucket: "citieasy-91f87.appspot.com",
  messagingSenderId: "6970698303",
  appId: "1:6970698303:web:646d15e7a09bababb5a68a",
  measurementId: "G-FM19YNP88V"
};

// Initialize Firebase only if no app is initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export services
export { auth, db };
