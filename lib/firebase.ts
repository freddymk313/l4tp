import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATfO7XNHF1H7JTROwHpqjiTPWSUcUf9XI",
  authDomain: "l4tp-b75ea.firebaseapp.com",
  projectId: "l4tp-b75ea",
  storageBucket: "l4tp-b75ea.appspot.com",
  messagingSenderId: "1038298214592",
  appId: "1:1038298214592:web:1dde477b5f5bc1bbe37d25"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
