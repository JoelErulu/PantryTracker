// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1LZowh280Znje6IK88-gO1_FaXvim-Yg",
  authDomain: "inventory-management-481c6.firebaseapp.com",
  projectId: "inventory-management-481c6",
  storageBucket: "inventory-management-481c6.appspot.com",
  messagingSenderId: "541091198582",
  appId: "1:541091198582:web:39b3a3aa1c9ebb3ea2d157",
  measurementId: "G-NBL29M8V8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {firestore}