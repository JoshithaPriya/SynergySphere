// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB11W4zYWc8HvOatOKiYUTzuja8V0Hnqo8",
  authDomain: "netflix-clone-d6bc3.firebaseapp.com",
  projectId: "netflix-clone-d6bc3",
  storageBucket: "netflix-clone-d6bc3.firebasestorage.app",
  messagingSenderId: "801709560408",
  appId: "1:801709560408:web:d300033c27a65b104bb02d"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);