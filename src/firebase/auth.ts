import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export function listenAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function googleSignIn() {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

export async function firebaseLogout() {
  await signOut(auth);
}
