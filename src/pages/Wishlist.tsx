import "../styles/transitions.css";
import Header from "../components/Header/Header";
import MovieCard from "../components/MovieCard/MovieCard";
import { useWishlist } from "../hooks/useWishlist";

export default function Wishlist() {
  const { wishlist, toggle, isWished, clear } = useWishlist();

  return (
    <div className="page" style={pageWrap}>
      <Header />
      <main style={main}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0 }}>Wishlist</h1>
          <button style={btn} onClick={clear}>
            Clear
          </button>
        </div>

        <p style={{ opacity: 0.75, marginTop: 10 }}>
          이 페이지는 API 호출 없이 LocalStorage(movieWishlist)만 사용합니다.
        </p>

        {wishlist.length === 0 ? <div style={{ marginTop: 18, opacity: 0.8 }}>비어있습니다.</div> : null}

        <div style={grid}>
          {wishlist.map((m) => (
            <MovieCard key={m.id} movie={m} wished={isWished(m.id)} onToggle={toggle} />
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
};
