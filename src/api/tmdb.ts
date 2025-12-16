import axios from "axios";
import type { Genre, Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  // eslint-disable-next-line no-console
  console.warn("VITE_TMDB_API_KEY가 비어있습니다. .env를 확인하세요.");
}

export const imgUrl = (path?: string | null, size: "w342" | "w500" | "original" = "w342") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

const client = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "ko-KR",
  },
});

export async function fetchMovies(path: string, params?: Record<string, any>) {
  const res = await client.get(path, { params: { ...params } });
  return res.data as { page: number; results: Movie[]; total_pages: number; total_results: number };
}

export async function fetchGenres() {
  const res = await client.get("/genre/movie/list");
  return res.data.genres as Genre[];
}

// Home에 쓸 4개 엔드포인트 예시
export const tmdbEndpoints = {
  popular: "/movie/popular",
  nowPlaying: "/movie/now_playing",
  topRated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};

// Search/Discover
export async function discoverMovies(params?: Record<string, any>) {
  return fetchMovies("/discover/movie", params);
}

export async function searchMovies(query: string, page = 1) {
  return fetchMovies("/search/movie", { query, page, include_adult: false });
}
