// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY_47tsaD5tAd9CUDXhDE91vF8WdROs0s",
  authDomain: "chello-71211.firebaseapp.com",
  projectId: "chello-71211",
  storageBucket: "chello-71211.appspot.com",
  messagingSenderId: "14975475263",
  appId: "1:14975475263:web:76e482ac8c3540436c228a",
  measurementId: "G-CX0EWJQ8C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storages = getStorage(app); 
export {db, storages}