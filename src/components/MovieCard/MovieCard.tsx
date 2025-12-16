import "./MovieCard.css";
import type { Movie } from "../../types/movie";
import { imgUrl } from "../../api/tmdb";

export default function MovieCard({
  movie,
  wished,
  onToggle,
}: {
  movie: Movie;
  wished: boolean;
  onToggle: (m: Movie) => void;
}) {
  return (
    <div className={`movieCard ${wished ? "wished" : ""}`} onClick={() => onToggle(movie)} role="button" tabIndex={0}>
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
