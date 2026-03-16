'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface RecommendedMovie {
  _id: string
  title: string
  poster: string
  genres: string[]
  rating: { average: number; count: number }
  score: number
  matchPercent: number
  reason: string
  duration: number
  ageRating: string
}

export function PersonalizedMovies() {
  const { isAuthenticated } = useAuthStore()
  const [movies, setMovies] = useState<RecommendedMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollIndex, setScrollIndex] = useState(0)

  useEffect(() => {
    fetchRecommendations()
  }, [isAuthenticated])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      if (isAuthenticated) {
        const res = await api.getPersonalizedRecommendations(12)
        setMovies(res.recommendations || [])
      } else {
        const res = await api.getTrendingMovies(12)
        setMovies(res.movies || [])
      }
    } catch {
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const maxScroll = Math.max(0, movies.length - 4)
  const scrollLeft = () => setScrollIndex(i => Math.max(0, i - 1))
  const scrollRight = () => setScrollIndex(i => Math.min(maxScroll, i + 1))

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isAuthenticated ? 'Dành Riêng Cho Bạn' : 'Phim Nổi Bật'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (movies.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Sparkles className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isAuthenticated ? 'Dành Riêng Cho Bạn' : 'Phim Nổi Bật'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isAuthenticated ? 'Gợi ý dựa trên sở thích của bạn' : 'Những bộ phim được yêu thích nhất'}
              </p>
            </div>
          </motion.div>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              disabled={scrollIndex === 0}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              disabled={scrollIndex >= maxScroll}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${scrollIndex * 25.5}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {movies.map((movie, idx) => (
              <Link
                key={movie._id}
                href={`/movies/${movie._id}`}
                className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)] group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={movie.poster || '/placeholder-movie.jpg'}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {movie.matchPercent > 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-purple-600 text-white text-xs font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {movie.matchPercent}% phù hợp
                      </div>
                    )}

                    {movie.rating?.average > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-semibold">{movie.rating.average.toFixed(1)}</span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                      <div className="flex flex-wrap gap-1">
                        {movie.genres?.slice(0, 2).map(g => (
                          <span key={g} className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded text-white/90">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {movie.reason && (
                    <div className="mt-2 flex items-start gap-1.5 px-1">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{movie.reason}</p>
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
