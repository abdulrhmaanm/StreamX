import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_ORIGINAL = "https://image.tmdb.org/t/p/original"
const TMDB_W500 = "https://image.tmdb.org/t/p/w500"
const TMDB_W185 = "https://image.tmdb.org/t/p/w185"
const TMDB_W300 = "https://image.tmdb.org/t/p/w300"

async function fetchMediaById(id: number, type: "tv" | "movie") {
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations`
  )
  return res.json()
}

type Props = {
  type: "tv" | "movie"
}

export default function ShowDetails({ type }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [media, setMedia] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    window.scrollTo(0, 0)
    fetchMediaById(Number(id), type)
      .then(setMedia)
      .finally(() => setLoading(false))
  }, [id, type])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!media || media.success === false) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <p className="text-2xl font-bold">Not found</p>
          <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline text-sm">
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  // ── Normalise TV vs Movie fields ─────────────────────────────────────────
  const isMovie       = type === "movie"
  const title         = isMovie ? media.title       : media.name
  const releaseDate   = isMovie ? media.release_date : media.first_air_date
  const runtime       = isMovie
    ? media.runtime ? `${media.runtime}m` : null
    : media.episode_run_time?.[0] ? `${media.episode_run_time[0]}m / ep` : null
  const seasonsLabel  = !isMovie
    ? `${media.number_of_seasons} Season${media.number_of_seasons !== 1 ? "s" : ""}`
    : null
  const statusLabel   = media.status
  const statusColor   = isMovie
    ? "text-blue-400"
    : media.status === "Returning Series" ? "text-emerald-400" : "text-zinc-400"
  const typeLabel     = isMovie ? "Movie" : "TV Series"

  const backdrop = media.backdrop_path
    ? `${TMDB_ORIGINAL}${media.backdrop_path}`
    : media.poster_path
    ? `${TMDB_ORIGINAL}${media.poster_path}`
    : "/placeholder.jpg"

  const poster          = media.poster_path ? `${TMDB_W500}${media.poster_path}` : "/placeholder.jpg"
  const cast            = media.credits?.cast?.slice(0, 8) ?? []
  const trailer         = media.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")
  const recommendations = media.recommendations?.results?.slice(0, 3) ?? []
  const genres          = media.genres?.map((g: any) => g.name) ?? []
  const ratingPercent   = Math.round((media.vote_average / 10) * 100)
  const fullStars       = Math.round(media.vote_average / 2)

  return (
    <div className="min-h-screen bg-[#07070a] text-white">

      {/* Ambient glow blobs */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-5"
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(7,7,10,0.6)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all text-lg"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-2xl">▶</span>
            <span className="text-xl font-extrabold tracking-tight">
              STREAM<span className="text-blue-400">X</span>
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/10 transition-all">
          + Add to List
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-55 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-[#07070a]/40" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 w-full max-w-7xl mx-auto px-8 sm:px-12 pb-16 flex flex-col gap-5">

          {/* Label + genres */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded">
              Premium Content
            </span>
            {genres.slice(0, 3).map((g: string) => (
              <span key={g} className="flex items-center gap-3 text-zinc-400 text-sm">
                <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl xl:text-7xl font-extrabold leading-[1.0] tracking-tight text-white">
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400">
            <span className="flex items-center gap-1 text-yellow-400 font-bold">
              <FaStar className="text-xs" />
              {media.vote_average?.toFixed(1)}
            </span>
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span>{releaseDate?.slice(0, 4)}</span>
            {runtime && (
              <>
                <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                <span>{runtime}</span>
              </>
            )}
            {seasonsLabel && (
              <>
                <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                <span>{seasonsLabel}</span>
              </>
            )}
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span className="border border-zinc-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              {typeLabel}
            </span>
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
          </div>

          {/* Overview */}
          <p className="max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed line-clamp-3">
            {media.overview || "No description available."}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-1">
            {trailer ? (
              <a
                href={`https://youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white text-black font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/30 text-sm sm:text-base"
              >
                ▶ Watch Trailer
              </a>
            ) : (
              <button className="flex items-center gap-2 bg-white text-black font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/30 text-sm sm:text-base">
                ▶ Play Now
              </button>
            )}
            <button className="flex items-center gap-2 bg-white/5 border border-white/20 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm text-sm sm:text-base">
              + Watchlist
            </button>
          </div>
        </div>
      </section>

      {/* ── Info Section ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* LEFT: Poster + Synopsis + Cast */}
        <div className="lg:col-span-2 space-y-14">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <img
              src={poster}
              alt={title}
              className="hidden sm:block w-44 rounded-xl flex-shrink-0 border border-white/10 shadow-2xl shadow-black/60"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500" />
                <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Synopsis</h3>
              </div>
              <p className="text-lg leading-relaxed text-zinc-300 font-light">
                {media.overview || "No description available."}
              </p>

              {/* Stats — different for TV vs Movie */}
              <div className="grid grid-cols-3 gap-6 pt-6 mt-6 border-t border-white/5 max-w-md">
                {isMovie ? (
                  <>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Director</p>
                      <p className="text-sm text-zinc-300">
                        {media.credits?.crew?.find((c: any) => c.job === "Director")?.name ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Budget</p>
                      <p className="text-sm text-zinc-300">
                        {media.budget ? `$${(media.budget / 1_000_000).toFixed(0)}M` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Revenue</p>
                      <p className="text-sm text-zinc-300">
                        {media.revenue ? `$${(media.revenue / 1_000_000).toFixed(0)}M` : "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Network</p>
                      <p className="text-sm text-zinc-300">{media.networks?.[0]?.name ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Episodes</p>
                      <p className="text-sm text-zinc-300">{media.number_of_episodes ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Language</p>
                      <p className="text-sm text-zinc-300">{media.original_language?.toUpperCase() ?? "—"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500" />
                  <h3 className="text-white text-xl font-bold tracking-tight">Top Cast</h3>
                </div>
                <button className="text-blue-400 text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                {cast.map((member: any) => (
                  <div key={member.id} className="flex flex-col items-center text-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-blue-500 transition-all mb-2">
                      <img
                        src={member.profile_path ? `${TMDB_W185}${member.profile_path}` : "/placeholder.jpg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300 leading-tight">{member.name}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{member.character}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Rating + Recommendations */}
        <div className="space-y-10">

          {/* Rating */}
          <div className="bg-zinc-900/50 border border-white/8 p-8 rounded-xl backdrop-blur-md">
            <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-6 text-center">
              Audience Rating
            </h3>
            <div className="flex flex-col items-center gap-2">
              <div className="text-7xl font-extrabold text-white tracking-tighter">
                {ratingPercent}<span className="text-3xl font-bold text-zinc-400">%</span>
              </div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FaStar key={s} className={`text-sm ${s <= fullStars ? "text-yellow-400" : "text-zinc-700"}`} />
                ))}
              </div>
              <p className="text-zinc-500 text-xs mt-3 font-medium">
                Based on {media.vote_count?.toLocaleString()}+ reviews
              </p>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500" />
                <h3 className="text-white text-lg font-bold tracking-tight">You May Also Like</h3>
              </div>
              <div className="space-y-3">
                {recommendations.map((rec: any) => (
                  <div
                    key={rec.id}
                    onClick={() => navigate(`/${type}/${rec.id}`)}
                    className="flex gap-4 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/8"
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={
                          rec.backdrop_path ? `${TMDB_W300}${rec.backdrop_path}`
                          : rec.poster_path ? `${TMDB_W185}${rec.poster_path}`
                          : "/placeholder.jpg"
                        }
                        alt={rec.title ?? rec.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-white font-semibold text-sm leading-tight">{rec.title ?? rec.name}</span>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <FaStar className="text-yellow-400 text-[10px]" />
                        <span>{rec.vote_average?.toFixed(1)}</span>
                        <span>•</span>
                        <span>{(rec.release_date ?? rec.first_air_date)?.slice(0, 4)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 mt-4 px-12 text-center text-zinc-700 text-sm border-t border-white/5">
        <p>© 2024 StreamX Entertainment. All rights reserved.</p>
      </footer>
    </div>
  )
}