import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxBYH4wgewCLORF24UQcgKjlfjtTOvQm0",
  authDomain: "wsd-assignment-02.firebaseapp.com",
  projectId: "wsd-assignment-02",
  storageBucket: "wsd-assignment-02.firebasestorage.app",
  messagingSenderId: "1028506032740",
  appId: "1:1028506032740:web:74f8bcd084744869aedd71",
  measurementId: "G-ML8RC9W5DS",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
