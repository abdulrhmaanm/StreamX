// src/apis/search.api.ts

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export type SearchResult = {
  id: number
  media_type: "movie" | "tv"
  title?: string        // movies
  name?: string         // tv shows
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string  // movies
  first_air_date?: string // tv shows
  genre_ids: number[]
}

export type SearchResponse = {
  results: SearchResult[]
  total_results: number
  total_pages: number
  page: number
}

export async function searchMulti(
  query: string,
  page: number = 1
): Promise<SearchResponse> {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  )
  const data = await res.json()

  // Filter to only movies and TV shows (excludes people)
  return {
    ...data,
    results: (data.results ?? []).filter(
      (r: SearchResult) => r.media_type === "movie" || r.media_type === "tv"
    ),
  }
}