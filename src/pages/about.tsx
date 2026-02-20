import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/navbar"

const FEATURES = [
  {
    icon: "▶",
    title: "Stream Anything",
    desc: "Browse thousands of movies and TV shows from every genre, updated daily with the latest releases.",
  },
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Find exactly what you're looking for with our powerful search across movies and TV shows simultaneously.",
  },
  {
    icon: "📅",
    title: "Stay Ahead",
    desc: "Never miss a release with our upcoming section — complete with countdown timers for what's coming soon.",
  },
  {
    icon: "🔥",
    title: "Always Trending",
    desc: "See what the world is watching today or this week, filtered by movies, TV shows, or both.",
  },
  {
    icon: "⭐",
    title: "Audience Ratings",
    desc: "Real ratings and reviews from millions of viewers worldwide powered by TMDB.",
  },
  {
    icon: "🎬",
    title: "Full Details",
    desc: "Explore cast, trailers, similar titles, budgets, networks and everything in between.",
  },
]

const TEAM = [
  { initials: "AH", name: "Abdulrhman", role: "Founder & Developer" },
  { initials: "TM", name: "TMDB", role: "Data Provider" },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500/8 blur-[140px] rounded-full pointer-events-none z-0" />

      <Navbar />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pt-28 pb-24">

        {/* ── Hero section ── */}
        <div className="text-center mb-20 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-4xl">▶</span>
            <span className="text-4xl font-extrabold tracking-tight">
              STREAM<span className="text-blue-400">X</span>
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your universe of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              entertainment
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            StreamX is a modern movie and TV show discovery platform built with React and powered by TMDB.
            Browse trending titles, explore upcoming releases, and dive deep into any show or movie with full cast, trailer, and rating details.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/30"
            >
              ▶ Start Browsing
            </button>
            <button
              onClick={() => navigate("/trending")}
              className="flex items-center gap-2 bg-white/5 border border-white/20 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              🔥 See Trending
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {[
            { value: "1M+", label: "Titles Available" },
            { value: "Daily", label: "Data Updates" },
            { value: "2", label: "Media Types" },
            { value: "Free", label: "Always" },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-zinc-900/50 border border-white/8 rounded-xl p-6 text-center backdrop-blur-sm"
            >
              <p className="text-3xl font-extrabold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">What we offer</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(feature => (
              <div
                key={feature.title}
                className="bg-zinc-900/50 border border-white/8 rounded-xl p-6 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all duration-300 group"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-white font-bold text-base mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Built by</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {TEAM.map(member => (
              <div
                key={member.name}
                className="flex items-center gap-4 bg-zinc-900/50 border border-white/8 rounded-xl px-6 py-4 hover:border-blue-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-sm font-extrabold text-white border-2 border-white/20 shrink-0">
                  {member.initials}
                </div>
                <div>
                  <p className="text-white font-bold">{member.name}</p>
                  <p className="text-zinc-500 text-xs">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TMDB credit ── */}
        <div className="bg-zinc-900/50 border border-white/8 rounded-xl p-8 text-center">
          <p className="text-zinc-400 text-sm leading-relaxed">
            This product uses the{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline font-semibold"
            >
              TMDB API
            </a>{" "}
            but is not endorsed or certified by TMDB. All movie and TV show data, images, and metadata are provided by TMDB.
          </p>
          <p className="text-zinc-600 text-xs mt-3">© 2024 StreamX Entertainment. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}