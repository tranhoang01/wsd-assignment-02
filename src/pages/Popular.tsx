import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/transitions.css";
import Header from "../components/Header/Header";
import Loading from "../components/Loading/Loading";
import MovieCard from "../components/MovieCard/MovieCard";
import { fetchMovies, tmdbEndpoints } from "../api/tmdb";
import type { Movie } from "../types/movie";
import { useWishlist } from "../hooks/useWishlist";

type ViewMode = "table" | "infinite";

export default function Popular() {
  const { toggle, isWished } = useWishlist();
  const [mode, setMode] = useState<ViewMode>("table");

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

  useEffect(() => {
    document.body.style.overflow = canScroll ? "auto" : "hidden"; // 요구: table view에서 scroll 불가
    return () => {
      document.body.style.overflow = "auto";
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

        {mode === "table" ? (
          <>
            {tableLoading ? <Loading label="Table 데이터 로딩 중..." /> : null}
            <div style={tableGrid}>
              {tableMovies.map((m) => (
                <MovieCard key={m.id} movie={m} wished={isWished(m.id)} onToggle={toggle} />
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
              <button style={btn2} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Prev
              </button>
              <div style={{ paddingTop: 8, opacity: 0.85 }}>Page {page}</div>
              <button style={btn2} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={grid}>
              {infMovies.map((m) => (
                <MovieCard key={`${m.id}-${m.release_date}`} movie={m} wished={isWished(m.id)} onToggle={toggle} />
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
const main: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "14px 14px 60px" };

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

const tableGridMedia = `
@media (max-width: 1100px){ .__tableGrid{ grid-template-columns: repeat(4, 1fr);} }
@media (max-width: 720px){ .__tableGrid{ grid-template-columns: repeat(2, 1fr);} }
`;
