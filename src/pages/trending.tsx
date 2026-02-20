import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import { Navbar } from "@/components/navbar"

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_W500 = "https://image.tmdb.org/t/p/w500"

type MediaItem = {
  id: number
  media_type: "movie" | "tv"
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
}

type TimeWindow = "day" | "week"
type MediaFilter = "all" | "movie" | "tv"

async function fetchTrending(timeWindow: TimeWindow, page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`
  )
  return res.json()
}

export default function TrendingPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day")
  const [filter, setFilter] = useState<MediaFilter>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchTrending(timeWindow, 1).then(data => {
      setItems((data.results ?? []).filter((r: MediaItem) => r.media_type === "movie" || r.media_type === "tv"))
      setTotalPages(data.total_pages)
      setLoading(false)
    })
  }, [timeWindow])

  async function loadMore() {
    setLoadingMore(true)
    const next = page + 1
    const data = await fetchTrending(timeWindow, next)
    setItems(prev => [...prev, ...(data.results ?? []).filter((r: MediaItem) => r.media_type === "movie" || r.media_type === "tv")])
    setPage(next)
    setLoadingMore(false)
  }

  const filtered = filter === "all" ? items : items.filter(r => r.media_type === filter)
  const getTitle = (item: MediaItem) => item.title ?? item.name ?? "Unknown"
  const getDate  = (item: MediaItem) => item.release_date ?? item.first_air_date

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-0" />

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-28 pb-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <span className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Trending</h1>
              <p className="text-zinc-500 text-sm mt-1">What everyone is watching right now</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Time window toggle */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
              {(["day", "week"] as TimeWindow[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTimeWindow(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    timeWindow === t ? "bg-blue-500 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t === "day" ? "Today" : "This Week"}
                </button>
              ))}
            </div>

            {/* Media filter */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
              {(["all", "movie", "tv"] as MediaFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === f ? "bg-blue-500 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {f === "all" ? "All" : f === "movie" ? "Movies" : "TV"}
                </button>
              ))}
            </div>
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
            {filtered.map((item, index) => (
              <div
                key={`${item.media_type}-${item.id}`}
                onClick={() => navigate(item.media_type === "movie" ? `/movie/${item.id}` : `/show/${item.id}`)}
                className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/40 bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl shadow-black/40"
              >
                <div className="relative w-full aspect-[2/3] overflow-hidden">
                  <img
                    src={item.poster_path ? `${TMDB_W500}${item.poster_path}` : "/placeholder.jpg"}
                    alt={getTitle(item)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Rank badge */}
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#07070a]/80 border border-white/20 flex items-center justify-center text-xs font-extrabold text-white backdrop-blur-sm">
                    {index + 1}
                  </div>
                  {/* Type badge */}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    item.media_type === "movie"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  }`}>
                    {item.media_type === "movie" ? "Movie" : "TV"}
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-white truncate">{getTitle(item)}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <FaStar className="text-[10px]" />
                      <span className="font-semibold">{item.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">{getDate(item)?.slice(0, 4)}</span>
                  </div>
                </div>
              </div>
            ))}
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