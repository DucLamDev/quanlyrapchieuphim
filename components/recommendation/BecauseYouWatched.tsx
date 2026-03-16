'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface SeedMovie {
  _id: string
  title: string
  poster: string
}

interface RecommendedMovie {
  _id: string
  title: string
  poster: string
  genres: string[]
  rating: { average: number; count: number }
  similarityScore: number
  commonGenres: string[]
}

export function BecauseYouWatched() {
  const { isAuthenticated } = useAuthStore()
  const [seedMovie, setSeedMovie] = useState<SeedMovie | null>(null)
  const [movies, setMovies] = useState<RecommendedMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) fetchData()
    else setLoading(false)
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.getBecauseYouWatched(6)
      setSeedMovie(res.seedMovie || null)
      setMovies(res.recommendations || [])
    } catch {
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || loading || !seedMovie || movies.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Eye className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vì Bạn Đã Xem
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {seedMovie.poster && (
                <div className="relative w-6 h-8 rounded overflow-hidden">
                  <Image src={seedMovie.poster} alt="" fill className="object-cover" />
                </div>
              )}
              <Link href={`/movies/${seedMovie._id}`} className="text-sm text-blue-500 hover:underline font-medium">
                {seedMovie.title}
              </Link>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {movies.map((movie, idx) => (
            <Link key={movie._id} href={`/movies/${movie._id}`}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={movie.poster || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {movie.rating?.average > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-[10px] font-semibold">{movie.rating.average.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-xs line-clamp-2">{movie.title}</h3>
                    {movie.commonGenres?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {movie.commonGenres.slice(0, 2).map(g => (
                          <span key={g} className="text-[9px] px-1 py-0.5 bg-blue-500/30 text-blue-200 rounded">{g}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
