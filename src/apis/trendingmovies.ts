// /apis/trendingmovies.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY // Vite uses import.meta.env
const BASE_URL = "https://api.themoviedb.org/3";

export type Movie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
};

export type TrendingMovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

/**
 * Fetch trending movies from TMDB
 * @param timeWindow "day" or "week"
 * @param page page number (default = 1)
 */
export async function fetchTrendingMovies(
  timeWindow: "day" | "week" = "week",
  page: number = 1
): Promise<TrendingMovieResponse> {
  if (!API_KEY) {
    throw new Error("TMDB API key is missing. Check your .env.local file.");
  }

  const res = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  return res.json();
}