import "../styles/transitions.css";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header/Header";
import MovieCard from "../components/MovieCard/MovieCard";
import { listenAuth } from "../firebase/auth";
import { listenWishlist, removeWishlistItem} from "../firebase/wishlist";
import type { WishlistItem } from "../firebase/wishlist";
import { auth } from "../firebase/firebase";

type CardMovie = {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
};

export default function Wishlist() {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid ?? null);
  const [items, setItems] = useState<WishlistItem[]>([]);

  // 1) listen auth
  useEffect(() => {
    const unsub = listenAuth((u) => setUid(u?.uid ?? null));
    return unsub;
  }, []);

  // 2) listen wishlist (Firestore realtime)
  useEffect(() => {
    if (!uid) {
      setItems([]);
      return;
    }
    const unsub = listenWishlist(uid, setItems);
    return unsub;
  }, [uid]);

  // map Firestore item -> MovieCard movie shape
  const movies: CardMovie[] = useMemo(() => {
    return items.map((it) => ({
      id: it.movieId,
      title: it.title,
      poster_path: it.posterPath,
      vote_average: it.rating,
    }));
  }, [items]);

  const isWished = (movieId: number) => items.some((x) => x.movieId === movieId);

  

  const clear = async () => {
    if (!uid) return alert("로그인이 필요합니다.");
    // xoá từng doc (đơn giản, đủ cho bài)
    await Promise.all(items.map((it) => removeWishlistItem(uid, it.movieId)));
  };

  return (
    <div className="page" style={pageWrap}>
      <Header />

      <main style={main}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0 }}>Wishlist</h1>
          <button style={btn} onClick={clear} disabled={!uid || items.length === 0}>
            Clear
          </button>
        </div>

        <p style={{ opacity: 0.75, marginTop: 10 }}>
          이 페이지는 <b>TMDB API 호출 없이</b> Firebase Firestore(users/&lt;uid&gt;/wishlist)만 사용합니다.
        </p>

        {!uid ? (
          <div style={{ marginTop: 18, opacity: 0.9 }}>
            로그인 후 사용 가능합니다. <span style={{ opacity: 0.8 }}>(/signin에서 Google 로그인)</span>
          </div>
        ) : items.length === 0 ? (
          <div style={{ marginTop: 18, opacity: 0.8 }}>비어있습니다.</div>
        ) : null}

        <div style={grid}>
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m as any} wished={isWished(m.id)}  />
          ))}
        </div>
      </main>
    </div>
  );
}

const pageWrap: React.CSSProperties = { minHeight: "100vh", background: "#0b0b10", color: "white" };
const main: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "14px 14px 40px" };
const grid: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 12,
};
const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  opacity: 1,
};
