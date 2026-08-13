// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI8B6d7xQWk6dyrT0zFc7H3KEhZ9wzLwc",
  authDomain: "campusconnect-3f361.firebaseapp.com",
  projectId: "campusconnect-3f361",
  storageBucket: "campusconnect-3f361.firebasestorage.app",
  messagingSenderId: "927315176795",
  appId: "1:927315176795:web:b3d8a86951d7ecda4dfe7e",
  measurementId: "G-PD85Z6HRQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

