import { useEffect, useMemo, useState } from "react";
import "../styles/transitions.css";
import Header from "../components/Header/Header";
import Loading from "../components/Loading/Loading";
import MovieCard from "../components/MovieCard/MovieCard";
import type { Genre, Movie } from "../types/movie";
import { discoverMovies, fetchGenres, searchMovies } from "../api/tmdb";
import { useWishlist } from "../hooks/useWishlist";

const FALLBACK_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

type SortKey = "popularity.desc" | "vote_average.desc" | "primary_release_date.desc";

export default function Search() {
  const { toggle, isWished } = useWishlist();

  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<number | "all">("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>("popularity.desc");

  useEffect(() => {
  (async () => {
    try {
      const gs = await fetchGenres();

      // nếu TMDB trả về rỗng thì dùng fallback luôn
      if (!gs || gs.length === 0) {
        setGenres(FALLBACK_GENRES);
      } else {
        setGenres(gs);
      }
    } catch (e) {
      // TMDB lỗi -> dùng fallback để dropdown có nhiều lựa chọn
      setGenres(FALLBACK_GENRES);
    }
  })();
}, []);

  const onReset = () => {
    setQuery("");
    setGenre("all");
    setMinRating(0);
    setSort("popularity.desc");
    setMovies([]);
  };

  const runSearch = async () => {
    setLoading(true);
    try {
      // 1) query가 있으면 search API
      if (query.trim()) {
        const data = await searchMovies(query.trim(), 1);
        // rating filter + sort는 client-side로 처리
        const filtered = data.results
          .filter((m) => (typeof m.vote_average === "number" ? m.vote_average >= minRating : true))
          .sort((a, b) => {
            if (sort === "vote_average.desc") return (b.vote_average ?? 0) - (a.vote_average ?? 0);
            if (sort === "primary_release_date.desc")
              return (b.release_date ?? "").localeCompare(a.release_date ?? "");
            return 0; // popularity는 search 응답 기본 정렬 신뢰
          });
        setMovies(filtered);
        return;
      }

      // 2) query 없으면 discover로 필터 (genre + sort + rating)
      const params: any = { page: 1, sort_by: sort, "vote_average.gte": minRating };
      if (genre !== "all") params.with_genres = genre;
      const data = await discoverMovies(params);
      setMovies(data.results);
    } finally {
      setLoading(false);
    }
  };

  const selectedGenreName = useMemo(() => {
    if (genre === "all") return "All";
    return genres.find((g) => g.id === genre)?.name ?? "Unknown";
  }, [genre, genres]);

  return (
    <div className="page" style={pageWrap}>
      <Header />
      <main style={main}>
        <h1 style={{ marginTop: 6 }}>Search / Filtering</h1>
        <p style={{ opacity: 0.75, marginTop: 6 }}>
          Genre: {selectedGenreName} / Min Rating: {minRating} / Sort: {sort}
        </p>

        <div style={panel}>
          <input
            style={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어 입력 (없으면 discover 필터)"
          />

          <select style={input} value={genre} onChange={(e) => setGenre(e.target.value === "all" ? "all" : Number(e.target.value))}>
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option value={g.id} key={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select style={input} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="popularity.desc">인기순</option>
            <option value="vote_average.desc">평점순</option>
            <option value="primary_release_date.desc">개봉일 최신순</option>
          </select>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, opacity: 0.8 }}>Min Rating: {minRating}</label>
            <input
              type="range"
              min={0}
              max={9}
              step={1}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </div>

          <button style={btn} onClick={runSearch}>
            Apply
          </button>
          <button style={btn2} onClick={onReset}>
            Reset
          </button>
        </div>

        {loading ? <Loading label="검색 결과 로딩..." /> : null}

        <div style={grid}>
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} wished={isWished(m.id)} onToggle={toggle} />
          ))}
        </div>
      </main>
    </div>
  );
}

const pageWrap: React.CSSProperties = { minHeight: "100vh", background: "#0b0b10", color: "white" };
const main: React.CSSProperties = { maxWidth: 1100, margin: "0 auto", padding: "14px 14px 40px" };

const panel: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "1.3fr 1fr 1fr 1fr auto auto",
  gap: 10,
  alignItems: "end",
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
};

const input: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.22)",
  color: "white",
  outline: "none",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,40,90,0.25)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const btn2: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const grid: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: 12,
};
