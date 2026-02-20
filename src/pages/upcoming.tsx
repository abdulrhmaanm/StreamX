import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import { Navbar } from "@/components/navbar"

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_W500 = "https://image.tmdb.org/t/p/w500"
const TMDB_ORIGINAL = "https://image.tmdb.org/t/p/original"

type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  genre_ids: number[]
}

type TvShow = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  first_air_date: string
  genre_ids: number[]
}

type Tab = "movies" | "tv"

async function fetchUpcomingMovies(page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`
  )
  return res.json()
}

async function fetchUpcomingTv(page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`
  )
  return res.json()
}

// Format date nicely
function formatDate(dateStr: string) {
  if (!dateStr) return "TBA"
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })
}

// Days until release
function daysUntil(dateStr: string) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return null
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `In ${days} days`
}

export default function UpcomingPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>("movies")
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<TvShow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    if (tab === "movies") {
      fetchUpcomingMovies(1).then(data => {
        setMovies(data.results ?? [])
        setTotalPages(data.total_pages)
        setFeaturedIndex(0)
        setLoading(false)
      })
    } else {
      fetchUpcomingTv(1).then(data => {
        setTvShows(data.results ?? [])
        setTotalPages(data.total_pages)
        setFeaturedIndex(0)
        setLoading(false)
      })
    }
  }, [tab])

  async function loadMore() {
    setLoadingMore(true)
    const next = page + 1
    if (tab === "movies") {
      const data = await fetchUpcomingMovies(next)
      setMovies(prev => [...prev, ...(data.results ?? [])])
    } else {
      const data = await fetchUpcomingTv(next)
      setTvShows(prev => [...prev, ...(data.results ?? [])])
    }
    setPage(next)
    setLoadingMore(false)
  }

  const items = tab === "movies" ? movies : tvShows
  const featured = items[featuredIndex]
  const featuredTitle = tab === "movies"
    ? (featured as Movie)?.title
    : (featured as TvShow)?.name
  const featuredDate = tab === "movies"
    ? (featured as Movie)?.release_date
    : (featured as TvShow)?.first_air_date

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-0" />

      <Navbar />

      {/* ── Featured Hero ── */}
      {featured && !loading && (
        <section className="relative h-[60vh] w-full overflow-hidden">
          <img
            src={featured.backdrop_path ? `${TMDB_ORIGINAL}${featured.backdrop_path}` : "/placeholder.jpg"}
            alt={featuredTitle}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-[#07070a]/40" />

          <div className="absolute bottom-0 left-0 max-w-7xl mx-auto px-8 sm:px-12 pb-12 flex flex-col gap-4">
            <span className="inline-flex w-fit items-center bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded">
              Coming Soon
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {featuredTitle}
            </h2>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              {featured.vote_average > 0 && (
                <>
                  <span className="flex items-center gap-1 text-yellow-400 font-bold">
                    <FaStar className="text-xs" />
                    {featured.vote_average.toFixed(1)}
                  </span>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                </>
              )}
              <span>{formatDate(featuredDate ?? "")}</span>
              {daysUntil(featuredDate ?? "") && (
                <>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <span className="text-emerald-400 font-semibold">{daysUntil(featuredDate ?? "")}</span>
                </>
              )}
            </div>
            <p className="max-w-xl text-zinc-400 text-sm leading-relaxed line-clamp-2">
              {featured.overview}
            </p>
            <button
              onClick={() => navigate(tab === "movies" ? `/movie/${featured.id}` : `/show/${featured.id}`)}
              className="w-fit flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm"
            >
              ▶ View Details
            </button>
          </div>
        </section>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-10 pb-20">

        {/* Header + tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <span className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Upcoming</h1>
              <p className="text-zinc-500 text-sm mt-1">What's coming soon to StreamX</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
            {(["movies", "tv"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  tab === t ? "bg-blue-500 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {t === "movies" ? "Movies" : "TV Shows"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[2/3] bg-zinc-800 rounded-xl mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, index) => {
              const itemTitle = tab === "movies" ? (item as Movie).title : (item as TvShow).name
              const itemDate  = tab === "movies" ? (item as Movie).release_date : (item as TvShow).first_air_date
              const countdown = daysUntil(itemDate)

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setFeaturedIndex(index)
                    navigate(tab === "movies" ? `/movie/${item.id}` : `/show/${item.id}`)
                  }}
                  className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/40 bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl shadow-black/40"
                >
                  <div className="relative w-full aspect-[2/3] overflow-hidden">
                    <img
                      src={item.poster_path ? `${TMDB_W500}${item.poster_path}` : "/placeholder.jpg"}
                      alt={itemTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Countdown badge */}
                    {countdown && (
                      <span className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                        {countdown}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-white truncate">{itemTitle}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <FaStar className="text-[10px]" />
                        <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{formatDate(itemDate)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Load more */}
        {!loading && page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 bg-white/5 border border-white/20 text-white font-bold px-10 py-3 rounded-full hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {loadingMore ? <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> Loading...</> : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}