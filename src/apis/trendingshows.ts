// /apis/trendingtv.ts
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Vite uses import.meta.env
const BASE_URL = "https://api.themoviedb.org/3";

export type TvShow = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
};

export type TrendingTvResponse = {
  page: number;
  results: TvShow[];
  total_pages: number;
  total_results: number;
};

/**
 * Fetch trending TV shows from TMDB
 * @param timeWindow "day" or "week"
 * @param page page number (default = 1)
 */
export async function fetchTrendingTv(
  timeWindow: "day" | "week" = "week",
  page: number = 1
): Promise<TrendingTvResponse> {
  if (!API_KEY) {
    throw new Error("TMDB API key is missing. Check your .env.local file.");
  }

  const res = await fetch(
    `${BASE_URL}/trending/tv/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch trending TV shows");
  }

  return res.json();
}