import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import { searchMulti, SearchResult } from "@/apis/Search.api"
import { Navbar } from "@/components/navbar"

const TMDB_W500 = "https://image.tmdb.org/t/p/w500"
const TMDB_W300 = "https://image.tmdb.org/t/p/w300"

type Filter = "all" | "movie" | "tv"

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") ?? ""

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState<Filter>("all")
  const [inputValue, setInputValue] = useState(query)

  // Fetch results whenever query or page changes
  const fetchResults = useCallback(async (q: string, p: number) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const data = await searchMulti(q, p)
      setResults(p === 1 ? data.results : (prev) => [...prev, ...data.results] as any)
      setTotalResults(data.total_results)
      setTotalPages(data.total_pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    setResults([])
    setInputValue(query)
    fetchResults(query, 1)
  }, [query])

  useEffect(() => {
    if (page > 1) fetchResults(query, page)
  }, [page])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (inputValue.trim() && inputValue.trim() !== query) {
      setSearchParams({ q: inputValue.trim() })
    }
  }

  function handleCardClick(result: SearchResult) {
    const path = result.media_type === "movie" ? `/movie/${result.id}` : `/show/${result.id}`
    navigate(path)
  }

  const filtered = filter === "all" ? results : results.filter(r => r.media_type === filter)
  const title = (result: SearchResult) => result.title ?? result.name ?? "Unknown"
  const date  = (result: SearchResult) => result.release_date ?? result.first_air_date

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* Ambient glow blobs */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 pt-28 pb-20">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2 rounded-full transition-all mb-8"
        >
          ← Back
        </button>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search movies & TV shows..."
            className="flex-1 bg-white/5 border border-white/10 hover:border-blue-500/40 focus:border-blue-500/60 text-white placeholder:text-zinc-500 rounded-full px-6 py-3 text-sm outline-none transition-all backdrop-blur-sm"
          />
          <button
            type="submit"
            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm"
          >
            Search
          </button>
        </form>

        {/* ── Header + filters ── */}
        {query && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Results for <span className="text-blue-400">"{query}"</span>
                </h1>
                {!loading && (
                  <p className="text-zinc-500 text-sm mt-0.5">
                    {totalResults.toLocaleString()} results found
                  </p>
                )}
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
              {(["all", "movie", "tv"] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === f
                      ? "bg-blue-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Shows"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="text-6xl">🔍</span>
            <h2 className="text-2xl font-bold text-white">Search for something</h2>
            <p className="text-zinc-500 text-sm max-w-sm">
              Type a movie or TV show name in the search bar above to get started.
            </p>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && results.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[2/3] bg-zinc-800 rounded-xl mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* ── No results ── */}
        {!loading && query && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="text-6xl">😕</span>
            <h2 className="text-2xl font-bold text-white">No results found</h2>
            <p className="text-zinc-500 text-sm max-w-sm">
              Try a different search term or change the filter.
            </p>
          </div>
        )}

        {/* ── Results grid ── */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(result => (
              <div
                key={`${result.media_type}-${result.id}`}
                onClick={() => handleCardClick(result)}
                className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/40 bg-zinc-900/60 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl shadow-black/40"
              >
                {/* Poster */}
                <div className="w-full aspect-[2/3] overflow-hidden relative">
                  <img
                    src={
                      result.poster_path
                        ? `${TMDB_W500}${result.poster_path}`
                        : result.backdrop_path
                        ? `${TMDB_W300}${result.backdrop_path}`
                        : "/placeholder.jpg"
                    }
                    alt={title(result)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Media type badge */}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    result.media_type === "movie"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  }`}>
                    {result.media_type === "movie" ? "Movie" : "TV"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-white truncate leading-tight">
                    {title(result)}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <FaStar className="text-[10px] shrink-0" />
                      <span className="font-semibold">{result.vote_average.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {date(result)?.slice(0, 4) ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Load more ── */}
        {filtered.length > 0 && page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="flex items-center gap-2 bg-white/5 border border-white/20 text-white font-bold px-10 py-3 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}