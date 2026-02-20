// API helper for fetching "Now Playing" movies from TMDB
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
   overview: string
   backdrop_path: string | null
  release_date: string;
};

export async function getNowPlayingMovies(): Promise<TMDBMovie[]> {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );
  if (!res.ok) throw new Error("Failed to fetch now playing movies");
  const data = await res.json();
  return data.results;
}
// API helper for fetching trending movies from TMDB
export async function getTrendingMovies(
  timeWindow: "day" | "week" = "day"
): Promise<TMDBMovie[]> {
  const res = await fetch(
    `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  const data = await res.json();
  return data.results;
}