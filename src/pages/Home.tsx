import { useEffect, useState } from "react";
import "../styles/transitions.css";
import Header from "../components/Header/Header";
import Loading from "../components/Loading/Loading";
import MovieCard from "../components/MovieCard/MovieCard";
import { fetchMovies, tmdbEndpoints } from "../api/tmdb";
import type { Movie } from "../types/movie";
import { useWishlist } from "../hooks/useWishlist";

function Section({ title, movies, onToggle, isWished }: any) {
  return (
    <section style={{ marginTop: 18 }}>
      <h2 style={{ margin: "8px 0 12px" }}>{title}</h2>
      <div style={grid}>
        {movies.map((m: Movie) => (
          <MovieCard key={m.id} movie={m} wished={isWished(m.id)} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { toggle, isWished } = useWishlist();
  const [loading, setLoading] = useState(true);

  const [popular, setPopular] = useState<Movie[]>([]);
  const [now, setNow] = useState<Movie[]>([]);
  const [top, setTop] = useState<Movie[]>([]);
  const [up, setUp] = useState<Movie[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [a, b, c, d] = await Promise.all([
          fetchMovies(tmdbEndpoints.popular, { page: 1 }),
          fetchMovies(tmdbEndpoints.nowPlaying, { page: 1 }),
          fetchMovies(tmdbEndpoints.topRated, { page: 1 }),
          fetchMovies(tmdbEndpoints.upcoming, { page: 1 }),
        ]);
        setPopular(a.results.slice(0, 12));
        setNow(b.results.slice(0, 12));
        setTop(c.results.slice(0, 12));
        setUp(d.results.slice(0, 12));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page" style={pageWrap}>
      <Header />
      <main style={main}>
        <h1 style={{ marginTop: 6 }}>Home</h1>
        <p style={{ opacity: 0.75, marginTop: 6 }}>
          포스터 클릭 → Wishlist(추천) 토글. (LocalStorage 저장)
        </p>

        {loading ? <Loading label="TMDB에서 영화 불러오는 중..." /> : null}

        {!loading ? (
          <>
            <Section title="Popular" movies={popular} onToggle={toggle} isWished={isWished} />
            <Section title="Now Playing" movies={now} onToggle={toggle} isWished={isWished} />
            <Section title="Top Rated" movies={top} onToggle={toggle} isWished={isWished} />
            <Section title="Upcoming" movies={up} onToggle={toggle} isWished={isWished} />
          </>
        ) : null}
      </main>
    </div>
  );
}

const pageWrap: React.CSSProperties = { minHeight: "100vh", background: "#0b0b10", color: "white" };
const main: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "14px 14px 40px" };
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 12,
};
