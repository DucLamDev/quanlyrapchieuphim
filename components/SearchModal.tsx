'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Film, Clock, Star } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/lib/api'
import { useUIStore } from '@/lib/store'

export function SearchModal() {
  const router = useRouter()
  const { isSearchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const response = await api.getMovies({ search: query })
        setResults(response.movies || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleClose = () => {
    setSearchOpen(false)
    setQuery('')
    setResults([])
  }

  const handleMovieClick = (movieId: string) => {
    router.push(`/movies/${movieId}`)
    handleClose()
  }

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen])

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-4 border-b border-gray-800">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm phim..."
                  className="flex-1 bg-transparent text-white text-lg placeholder-gray-500 focus:outline-none"
                />
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cinema-600"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((movie) => (
                      <motion.button
                        key={movie._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleMovieClick(movie._id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition-colors text-left"
                      >
                        <div className="flex-shrink-0 w-16 h-24 bg-gray-800 rounded-lg overflow-hidden">
                          {movie.poster ? (
                            <Image
                              src={movie.poster}
                              alt={movie.title}
                              width={64}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{movie.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {movie.duration} phút
                            </span>
                            {movie.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                {movie.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {movie.genres?.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="py-12 text-center text-gray-500">
                    <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Không tìm thấy kết quả cho "{query}"</p>
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nhập tên phim để tìm kiếm</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
