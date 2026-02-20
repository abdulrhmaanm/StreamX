import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { FaStar } from "react-icons/fa"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { getOnTheAirTvShows, TMDBTvShow } from "@/apis/tv2day.api"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original"

export default function FeaturedBanner() {
  const [shows, setShows] = useState<TMDBTvShow[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchOnAir() {
      try {
        const data = await getOnTheAirTvShows()
        setShows(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchOnAir()
  }, [])

  const activeShow = shows[activeIndex]
  const bgImage =
    activeShow?.backdrop_path || activeShow?.poster_path
      ? `${TMDB_IMAGE_BASE}${activeShow.backdrop_path || activeShow.poster_path}`
      : "/placeholder.jpg"

  return (
    <section
      className="relative w-full min-h-screen bg-[#07070a] overflow-hidden flex flex-col lg:flex-row items-center px-4 sm:px-6 lg:px-10 py-24 lg:py-0 gap-8 lg:gap-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-[#07070a]/40" />

      {/* ── Left: Carousel ── */}
      <div className="relative z-10 w-full lg:w-1/3 flex flex-col p-2 lg:p-6">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Featured Shows</h2>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        >
          <CarouselContent>
            {shows.map((show, index) => (
              <CarouselItem
                key={show.id}
                className="basis-1/2 sm:basis-1/3 lg:basis-full xl:basis-1/2 p-2"
                // ✅ Card click only changes the active index (background)
                onClick={() => setActiveIndex(index)}
              >
                <Card
                  className={`overflow-hidden w-full rounded-xl shadow-2xl shadow-black/60 cursor-pointer transition-all duration-300 border bg-zinc-900/80
                    ${index === activeIndex
                      ? "scale-105 border-blue-500/50"
                      : "border-white/10 hover:border-white/20 hover:scale-[1.02]"
                    }`}
                >
                  {/* Poster */}
                  <div className="w-full aspect-[2/3] overflow-hidden">
                    <img
                      src={
                        show.poster_path
                          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={show.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card content */}
                  <CardContent className="p-3 text-white flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold truncate">{show.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <FaStar className="shrink-0 text-[10px]" />
                      <span className="font-semibold">{show.vote_average.toFixed(1)}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                      {show.first_air_date}
                    </p>
                    <span className="inline-flex w-fit items-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                      On Air
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all" />
          <CarouselNext className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all" />
        </Carousel>
      </div>

      {/* ── Right: Active show details ── */}
      <div className="relative z-10 w-full lg:w-2/3 flex flex-col justify-center px-2 sm:px-6 lg:px-8 text-white">
        {activeShow && (
          <div className="flex flex-col gap-4 sm:gap-5 max-w-2xl">

            {/* Premium label */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded">
                Premium Content
              </span>
              <span className="text-zinc-500 text-sm">• Trending Now</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
              {activeShow.name}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <FaStar className="text-xs" />
                {activeShow.vote_average.toFixed(1)}
              </span>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span>{activeShow.first_air_date}</span>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span>TV Series</span>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span className="border border-zinc-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                TV-14
              </span>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span className="text-emerald-400 font-semibold">On Air</span>
            </div>

            {/* Overview */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed line-clamp-4">
              {activeShow.overview || "No description available."}
            </p>

            {/* Buttons — only Play Now navigates */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-1">
              <button
                // ✅ Only this button navigates to details page
                onClick={() => navigate(`/show/${activeShow.id}`)}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/30 text-sm sm:text-base"
              >
                ▶ Play Now
              </button>
              <button className="flex items-center gap-2 bg-white/5 border border-white/20 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm text-sm sm:text-base">
                + Watchlist
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}