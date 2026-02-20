import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { getTrendingMovies, TMDBMovie } from "@/apis/release.api"

export default function JustReleased() {
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await getTrendingMovies("day")
        setMovies(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTrending()
  }, [])

  return (
    <section className="w-full px-4 sm:px-6 md:px-12 py-12 bg-[#07070a] text-white">

      {/* Section heading — matches ShowDetails accent bar */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Trending Movies
        </h2>
      </div>

      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: true })]}
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <div className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/40 bg-zinc-900/60 transition-all duration-300 hover:bg-zinc-900/80 shadow-xl shadow-black/40">

                {/* Poster */}
                <div className="w-full aspect-[2/3] overflow-hidden">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1.5">
                  <h3 className="text-sm font-semibold text-white truncate leading-tight">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs">
                    <FaStar className="shrink-0 text-[10px]" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                    {movie.release_date}
                  </p>
                  {/* Movie badge — matches ShowDetails genre pill */}
                  <span className="inline-flex w-fit items-center bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
                    Movie
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all" />
        <CarouselNext className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all" />
      </Carousel>
    </section>
  )
}