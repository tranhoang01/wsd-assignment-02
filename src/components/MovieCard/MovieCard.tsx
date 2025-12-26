import "./MovieCard.css";
import type { Movie } from "../../types/movie";
import { imgUrl } from "../../api/tmdb";
import { auth } from "../../firebase/firebase";
import { upsertWishlistItem, removeWishlistItem } from "../../firebase/wishlist";

export default function MovieCard({ movie, wished }: { movie: Movie; wished: boolean }) {
  const handleToggle = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("로그인이 필요합니다. (/signin에서 Google 로그인)");
      return;
    }

    try {
      if (wished) {
        await removeWishlistItem(uid, movie.id);
      } else {
        await upsertWishlistItem(uid, {
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path ?? "",
          rating: typeof movie.vote_average === "number" ? movie.vote_average : undefined,
          note: "",
        });
      }
    } catch (e: any) {
      alert(e?.message ?? "Wishlist update failed");
    }
  };

  return (
    <div
      className={`movieCard ${wished ? "wished" : ""}`}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleToggle();
      }}
    >
      <div className="posterWrap">
        {movie.poster_path ? (
          <img className="poster" src={imgUrl(movie.poster_path, "w342")} alt={movie.title} loading="lazy" />
        ) : (
          <div className="posterFallback">NO IMAGE</div>
        )}
        <div className="badge">{wished ? "✓ WISHLIST" : "+ ADD"}</div>
      </div>

      <div className="meta">
        <div className="title" title={movie.title}>
          {movie.title}
        </div>
        {movie.overview ? <div className="overview">{movie.overview}</div> : null}
        <div className="sub">
          {movie.release_date ? <span>{movie.release_date}</span> : <span>—</span>}
          {typeof movie.vote_average === "number" ? <span>⭐ {movie.vote_average.toFixed(1)}</span> : null}
        </div>
      </div>
    </div>
  );
}
