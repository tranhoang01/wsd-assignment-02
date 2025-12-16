import { useEffect, useMemo, useState } from "react";
import type { Movie } from "../types/movie";

const KEY = "movieWishlist";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Movie[]>(() => safeParse<Movie[]>(localStorage.getItem(KEY), []));

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const ids = useMemo(() => new Set(wishlist.map((m) => m.id)), [wishlist]);

  const isWished = (id: number) => ids.has(id);

  const toggle = (movie: Movie) => {
    setWishlist((prev) => {
      const idx = prev.findIndex((m) => m.id === movie.id);
      if (idx === -1) return [movie, ...prev];
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  const clear = () => setWishlist([]);

  return { wishlist, isWished, toggle, clear };
}
