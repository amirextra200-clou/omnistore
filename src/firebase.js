// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb0hakJIbIZ30I2Dc44hnp6N2zDLYiZPM",
  authDomain: "omnistore-597f1.firebaseapp.com",
  projectId: "omnistore-597f1",
  storageBucket: "omnistore-597f1.firebasestorage.app",
  messagingSenderId: "678681317639",
  appId: "1:678681317639:web:95646b705b49c529d9b5a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };