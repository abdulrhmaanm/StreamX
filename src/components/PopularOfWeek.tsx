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
import { fetchTrendingMovies, Movie } from "@/apis/trendingmovies"

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
}

export default function PopularOfWeekCarousel() {
  const [movies, setMovies] = useState<Movie[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    async function loadTrending() {
      try {
        const data = await fetchTrendingMovies("week", 1)
        setMovies(data.results.slice(0, 10))
      } catch (err) {
        console.error("Failed to fetch trending movies", err)
      }
    }
    loadTrending()
  }, [])

  return (
    <section className="w-full px-4 sm:px-6 md:px-12 py-12 bg-[#07070a] text-white">

      {/* Section heading — matches ShowDetails accent bar style */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          Popular Movies of the Week
        </h2>
      </div>

      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[
          Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true }),
        ]}
      >
        <CarouselContent className="-ml-4">
          {movies.map((movie, index) => {
            const genres = movie.genre_ids
              .map(id => GENRE_MAP[id])
              .filter(Boolean)
              .slice(0, 2)
              .join(" + ")

            return (
              <CarouselItem
                key={movie.id}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="flex gap-4 p-3 rounded-xl border border-transparent hover:border-white/8 hover:bg-white/5 transition-all cursor-pointer group">

                  {/* Rank */}
                  <span className="text-3xl md:text-4xl font-extrabold text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0 self-center">
                    {index + 1}
                  </span>

                  {/* Poster */}
                  <div className="w-20 sm:w-24 md:w-28 aspect-[2/3] shrink-0 overflow-hidden rounded-lg border border-white/10 group-hover:border-blue-500/40 transition-all">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center gap-1.5 overflow-hidden">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate">
                      {movie.release_date?.slice(0, 4)} • {genres || "Unknown"}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <FaStar className="shrink-0" />
                      <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                      <span className="text-zinc-600">• Movie</span>
                    </div>
                    {/* Genre pill — matches ShowDetails genre badges */}
                    {genres && (
                      <span className="inline-flex w-fit items-center bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mt-0.5">
                        {genres.split(" + ")[0]}
                      </span>
                    )}
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all" />
        <CarouselNext className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-black transition-all" />
      </Carousel>
    </section>
  )
}