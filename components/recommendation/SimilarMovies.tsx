'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Film, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'

interface SimilarMovie {
  _id: string
  title: string
  poster: string
  genres: string[]
  rating: { average: number; count: number }
  similarityScore: number
  commonGenres: string[]
  duration: number
}

export function SimilarMovies({ movieId }: { movieId: string }) {
  const [movies, setMovies] = useState<SimilarMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (movieId) fetchSimilar()
  }, [movieId])

  const fetchSimilar = async () => {
    try {
      setLoading(true)
      const res = await api.getSimilarMovies(movieId, 8)
      setMovies(res.movies || [])
    } catch {
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <Film className="w-6 h-6 text-cinema-500" />
          Phim Tương Tự
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (movies.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <Film className="w-6 h-6 text-cinema-500" />
        Phim Tương Tự
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie, idx) => (
          <Link key={movie._id} href={`/movies/${movie._id}`}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                <Image
                  src={movie.poster || '/placeholder-movie.jpg'}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {movie.similarityScore > 0 && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-cinema-600 text-white text-[10px] font-bold">
                    {Math.min(movie.similarityScore, 99)}% giống
                  </div>
                )}

                {movie.rating?.average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-[10px] font-semibold">{movie.rating.average.toFixed(1)}</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">{movie.title}</h3>
                  {movie.commonGenres?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.commonGenres.slice(0, 2).map(g => (
                        <span key={g} className="text-[9px] px-1 py-0.5 bg-cinema-500/30 text-cinema-300 rounded">{g}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}
