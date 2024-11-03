import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWg0UXAOY6QhJC8iMh0Rf0Eb-ZSwWf_h0",
  authDomain: "payapa-27f92.firebaseapp.com",
  databaseURL: "https://payapa-27f92-default-rtdb.firebaseio.com",
  projectId: "payapa-27f92",
  storageBucket: "payapa-27f92.appspot.com",
  messagingSenderId: "827106040341",
  appId: "1:827106040341:web:0bb3c39e3f40a7b7774c1c",
  measurementId: "G-VNQGLJ5KLK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { auth, database, firestore };
