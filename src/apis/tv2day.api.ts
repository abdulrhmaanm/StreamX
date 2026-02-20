// src/apis/tv.api.ts
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
export const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export type TMDBTvShow = {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  overview: string
  first_air_date: string
}

export async function getOnTheAirTvShows(): Promise<TMDBTvShow[]> {
  const res = await fetch(
    `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  )
  if (!res.ok) throw new Error("Failed to fetch on-the-air TV shows")
  const data = await res.json()
  return data.results
}