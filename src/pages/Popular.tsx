import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/transitions.css";
import Header from "../components/Header/Header";
import Loading from "../components/Loading/Loading";
import MovieCard from "../components/MovieCard/MovieCard";
import { fetchMovies, tmdbEndpoints } from "../api/tmdb";
import type { Movie } from "../types/movie";
import type { User } from "firebase/auth";
import { listenAuth } from "../firebase/auth";
import { listenWishlist, type WishlistItem } from "../firebase/wishlist";

type ViewMode = "table" | "infinite";

export default function Popular() {
  const [user, setUser] = useState<User | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const isWished = (movieId: number) => wishlistItems.some((x) => x.movieId === movieId);

  useEffect(() => {
    const unsub = listenAuth(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    const unsub = listenWishlist(user.uid, setWishlistItems);
    return unsub;
  }, [user]);

  const [mode, setMode] = useState<ViewMode>("infinite"); // ✅ default infinite để “có scroll” ngay

  // table
  const [page, setPage] = useState(1);
  const [tableMovies, setTableMovies] = useState<Movie[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  // infinite
  const [infMovies, setInfMovies] = useState<Movie[]>([]);
  const [infPage, setInfPage] = useState(1);
  const [infLoading, setInfLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const canScroll = useMemo(() => mode === "infinite", [mode]);

  // ✅ Scroll rule:
  // - table: page scroll LOCK (body/html hidden) + pagination sticky (nên vẫn dùng được)
  // - infinite: page scroll ON
  useEffect(() => {
    const overflow = canScroll ? "auto" : "hidden";
    document.body.style.overflow = overflow;
    document.documentElement.style.overflow = overflow;

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [canScroll]);

  // table fetch
  useEffect(() => {
    if (mode !== "table") return;
    (async () => {
      setTableLoading(true);
      try {
        const data = await fetchMovies(tmdbEndpoints.popular, { page });
        setTableMovies(data.results);
      } finally {
        setTableLoading(false);
      }
    })();
  }, [mode, page]);

  // infinite init
  useEffect(() => {
    if (mode !== "infinite") return;
    (async () => {
      setInfLoading(true);
      try {
        const data = await fetchMovies(tmdbEndpoints.popular, { page: 1 });
        setInfMovies(data.results);
        setInfPage(1);
      } finally {
        setInfLoading(false);
      }
    })();
  }, [mode]);

  // infinite observer
  useEffect(() => {
    if (mode !== "infinite") return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(async (entries) => {
      const hit = entries.some((e) => e.isIntersecting);
      if (!hit) return;
      if (infLoading) return;

      setInfLoading(true);
      try {
        const nextPage = infPage + 1;
        const data = await fetchMovies(tmdbEndpoints.popular, { page: nextPage });
        setInfMovies((prev) => [...prev, ...data.results]);
        setInfPage(nextPage);
      } finally {
        setInfLoading(false);
      }
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [mode, infPage, infLoading]);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="page" style={pageWrap}>
      <Header />
      <main style={main}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h1 style={{ margin: 0 }}>Popular</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={btn(mode === "table")} onClick={() => setMode("table")}>
              Table View
            </button>
            <button style={btn(mode === "infinite")} onClick={() => setMode("infinite")}>
              Infinite Scroll
            </button>
          </div>
        </div>

        {!user ? <p style={{ opacity: 0.8, marginTop: 10 }}>※ 위시리스트 토글은 로그인 후 가능합니다. (/signin)</p> : null}

        {mode === "table" ? (
          <>
            {tableLoading ? <Loading label="Table 데이터 로딩 중..." /> : null}

            <div style={tableGrid}>
              {tableMovies.map((m) => (
                <MovieCard key={m.id} movie={m} wished={isWished(m.id)} />
              ))}
            </div>

            {/* ✅ Sticky pagination: scroll 없어도 항상 보임 */}
            <div style={pagerSticky}>
              <button style={btn2} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
              <div style={{ paddingTop: 8, opacity: 0.9 }}>Page {page}</div>
              <button style={btn2} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={grid}>
              {infMovies.map((m) => (
                <MovieCard key={`${m.id}-${m.release_date}`} movie={m} wished={isWished(m.id)} />
              ))}
            </div>

            {infLoading ? <Loading label="다음 페이지 로딩..." /> : null}
            <div ref={sentinelRef} style={{ height: 10 }} />

            <button style={topBtn} onClick={goTop}>
              TOP
            </button>
          </>
        )}
      </main>
    </div>
  );
}

const pageWrap: React.CSSProperties = { minHeight: "100vh", background: "#0b0b10", color: "white" };
const main: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "14px 14px 80px" };

const grid: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 12,
};

const tableGrid: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: 10,
};

const pagerSticky: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 14,
  display: "flex",
  justifyContent: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(10px)",
  zIndex: 50,
};

const btn = (active: boolean): React.CSSProperties => ({
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: active ? "rgba(255,40,90,0.25)" : "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
});

const btn2: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
};

const topBtn: React.CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  padding: "12px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.55)",
  color: "white",
  cursor: "pointer",
};
