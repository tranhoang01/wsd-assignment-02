import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type WishlistItem = {
  movieId: number;
  title: string;
  posterPath?: string;
  rating?: number;
  note?: string;
  updatedAt?: any;
};

export function listenWishlist(uid: string, cb: (items: WishlistItem[]) => void) {
  const colRef = collection(db, "users", uid, "wishlist");
  return onSnapshot(colRef, (snap) => {
    const items = snap.docs.map((d) => d.data() as WishlistItem);
    // sort mới cập nhật lên trước (optional)
    items.sort((a, b) => (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0));
    cb(items);
  });
}

export async function upsertWishlistItem(uid: string, item: WishlistItem) {
  const ref = doc(db, "users", uid, "wishlist", String(item.movieId));
  await setDoc(
    ref,
    { ...item, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function removeWishlistItem(uid: string, movieId: number) {
  const ref = doc(db, "users", uid, "wishlist", String(movieId));
  await deleteDoc(ref);
}

export async function updateWishlistNote(uid: string, movieId: number, note: string) {
  const ref = doc(db, "users", uid, "wishlist", String(movieId));
  await updateDoc(ref, { note, updatedAt: serverTimestamp() });
}
