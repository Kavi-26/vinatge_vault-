// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAw0ZWkHFW-UucHm0dzTL18LQxzRI2oPwo",
  authDomain: "vintage-vault-a219e.firebaseapp.com",
  projectId: "vintage-vault-a219e",
  storageBucket: "vintage-vault-a219e.firebasestorage.app",
  messagingSenderId: "654938887297",
  appId: "1:654938887297:web:395684ef5b3a1fa6ea6980"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Ensure AsyncStorage is installed
});


