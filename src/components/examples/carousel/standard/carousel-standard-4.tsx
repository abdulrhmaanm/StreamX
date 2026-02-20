import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

type TvShow = {
  id: number
  name: string
  overview: string
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original"

const Hero = () => {
  const [slides, setSlides] = useState<TvShow[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )

  // Track active slide index
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  useEffect(() => {
    const fetchDiscoverTv = async () => {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&page=1`
        )
        if (!res.ok) { setLoading(false); return }
        const data = await res.json()
        setSlides(data.results.slice(0, 5))
      } catch (err) {
        console.error("Failed to fetch TV shows:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDiscoverTv()
  }, [])

  if (loading)
    return (
      <section className="h-screen flex items-center justify-center bg-[#07070a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </section>
    )

  if (!slides.length)
    return (
      <section className="h-screen flex items-center justify-center bg-[#07070a] text-white">
        <p>No shows available</p>
      </section>
    )

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#07070a]">

      {/* Ambient glow blobs — matches ShowDetails */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-10" />

      {/* Embla carousel */}
      <div className="embla h-screen w-full" ref={emblaRef}>
        <div className="embla__container h-screen flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide relative h-screen w-full flex-shrink-0"
            >
              {/* Backdrop image */}
              <img
                src={
                  slide.backdrop_path
                    ? `${TMDB_IMAGE_BASE}${slide.backdrop_path}`
                    : "/fallback-hero.jpg"
                }
                alt={slide.name}
                className="absolute inset-0 h-screen w-full object-cover opacity-55"
              />

              {/* Same dual gradients as ShowDetails hero */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-transparent to-[#07070a]/40" />

              {/* Content */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-12 max-w-2xl z-10 gap-5">

                {/* Premium label */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded">
                    Premium Content
                  </span>
                  <span className="text-zinc-500 text-sm">• Trending Now</span>
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                  {slide.name}
                </h2>

                {/* Meta row — matches ShowDetails */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400">
                  {slide.vote_average > 0 && (
                    <>
                      <span className="flex items-center gap-1 text-yellow-400 font-bold">
                        <FaStar className="text-xs" />
                        {slide.vote_average.toFixed(1)}
                      </span>
                      <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                    </>
                  )}
                  <span>{slide.first_air_date?.slice(0, 4)}</span>
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
                <p className="text-sm md:text-base text-zinc-400 leading-relaxed line-clamp-3">
                  {slide.overview.length > 250
                    ? slide.overview.slice(0, 250) + "..."
                    : slide.overview}
                </p>

                {/* Buttons — matches ShowDetails */}
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-1">
                  <button
                    onClick={() => navigate(`/show/${slide.id}`)}
                    className="flex items-center gap-2 bg-white text-black font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/30 text-sm sm:text-base"
                  >
                    ▶ Play Now
                  </button>
                  <button className="flex items-center gap-2 bg-white/5 border border-white/20 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm text-sm sm:text-base">
                    Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots — bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 h-1.5 bg-blue-400"
                : "w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero