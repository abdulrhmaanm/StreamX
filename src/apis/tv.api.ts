// /apis/tv.ts
const API_KEY = process.env.VITE_PUBLIC_TMDB_API_KEY; // store your TMDB API key in .env.local
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

export type DiscoverTvResponse = {
  page: number;
  results: TvShow[];
  total_pages: number;
  total_results: number;
};

export async function fetchDiscoverTv(page: number = 1): Promise<DiscoverTvResponse> {
  const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&page=${page}`);
  
  if (!res.ok) {
    throw new Error("Failed to fetch Discover TV shows");
  }

  return res.json();
}
