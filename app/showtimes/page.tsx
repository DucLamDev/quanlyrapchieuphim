'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Film, Filter, Search } from 'lucide-react'
import { api } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function ShowtimesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cinemaParam = searchParams.get('cinema')
  
  const [loading, setLoading] = useState(true)
  const [showtimes, setShowtimes] = useState<any[]>([])
  const [cinemas, setCinemas] = useState<any[]>([])
  const [movies, setMovies] = useState<any[]>([])
  const [selectedCinema, setSelectedCinema] = useState(cinemaParam || 'all')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (cinemaParam) {
      setSelectedCinema(cinemaParam)
    }
  }, [cinemaParam])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [showtimesRes, cinemasRes] = await Promise.all([
        api.getShowtimes(),
        api.getCinemas()
      ])
      
      setShowtimes(showtimesRes.showtimes || [])
      setCinemas(cinemasRes.cinemas || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter showtimes
  const filteredShowtimes = showtimes.filter(showtime => {
    const showtimeDate = format(new Date(showtime.startTime), 'yyyy-MM-dd')
    const matchesDate = showtimeDate === selectedDate
    const matchesCinema = selectedCinema === 'all' || showtime.cinemaId?._id === selectedCinema
    
    // Show scheduled showtimes that are active and not cancelled
    const isAvailable = showtime.isActive && showtime.status !== 'cancelled' && showtime.status !== 'completed'
    
    return matchesDate && matchesCinema && isAvailable
  })

  // Group by movie
  const groupedByMovie = filteredShowtimes.reduce((acc: any, showtime) => {
    const movieId = showtime.movieId?._id
    if (!movieId) return acc
    
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: showtime.movieId,
        showtimes: []
      }
    }
    
    acc[movieId].showtimes.push(showtime)
    return acc
  }, {})

  const handleBooking = (showtimeId: string) => {
    router.push(`/booking/${showtimeId}`)
  }

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cinema-600 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-cinema-600/50">
            <Calendar className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cinema-400 to-purple-400 bg-clip-text text-transparent">
            Lịch Chiếu
          </h1>
          <p className="text-gray-400 text-lg">
            Chọn suất chiếu phù hợp để đặt vé ngay
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mb-8"
        >
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-400">Chọn ngày:</label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {dates.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd')
                const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr
                const isSelected = selectedDate === dateStr
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl min-w-[100px] text-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cinema-600 to-purple-600 text-white shadow-lg shadow-cinema-600/50'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {isToday ? 'Hôm nay' : format(date, 'EEEE', { locale: vi })}
                    </div>
                    <div className="text-lg font-bold">
                      {format(date, 'dd/MM')}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cinema Filter */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-400">Chọn rạp:</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCinema('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCinema === 'all'
                    ? 'bg-gradient-to-r from-cinema-600 to-purple-600 text-white shadow-lg shadow-cinema-600/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                🌍 Tất cả rạp
              </button>
              {cinemas.map((cinema) => (
                <button
                  key={cinema._id}
                  onClick={() => setSelectedCinema(cinema._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCinema === cinema._id
                      ? 'bg-gradient-to-r from-cinema-600 to-purple-600 text-white shadow-lg shadow-cinema-600/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  📍 {cinema.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center text-sm text-gray-400">
            Tìm thấy <span className="text-cinema-400 font-semibold">{filteredShowtimes.length}</span> suất chiếu
          </div>
        </motion.div>

        {/* Showtimes by Movie */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-600"></div>
          </div>
        ) : Object.keys(groupedByMovie).length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Không có suất chiếu nào</p>
            <p className="text-gray-500 text-sm mt-2">Vui lòng chọn ngày hoặc rạp khác</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedByMovie).map((group: any, index: number) => (
              <motion.div
                key={group.movie._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
              >
                <div className="flex gap-6 p-6">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0 w-32 h-48 bg-gradient-to-br from-cinema-600 to-purple-600 rounded-xl overflow-hidden">
                    {group.movie.poster ? (
                      <img
                        src={group.movie.poster}
                        alt={group.movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                  </div>

                  {/* Movie Info & Showtimes */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{group.movie.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      <span>{group.movie.genres?.join(', ')}</span>
                      <span>•</span>
                      <span>{group.movie.duration} phút</span>
                      {group.movie.ageRating && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                            {group.movie.ageRating}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Showtimes Grid */}
                    <div className="space-y-4">
                      {/* Group by cinema */}
                      {Object.entries(
                        group.showtimes.reduce((acc: any, st: any) => {
                          const cinemaId = st.cinemaId?._id
                          if (!cinemaId) return acc
                          if (!acc[cinemaId]) {
                            acc[cinemaId] = {
                              cinema: st.cinemaId,
                              times: []
                            }
                          }
                          acc[cinemaId].times.push(st)
                          return acc
                        }, {})
                      ).map(([cinemaId, data]: [string, any]) => (
                        <div key={cinemaId} className="border-t border-gray-800 pt-4 first:border-t-0 first:pt-0">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-cinema-400" />
                            <span className="font-semibold">{data.cinema.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {data.times.map((showtime: any) => (
                              <Button
                                key={showtime._id}
                                onClick={() => handleBooking(showtime._id)}
                                size="sm"
                                className="bg-gray-800 hover:bg-gradient-to-r hover:from-cinema-600 hover:to-purple-600 border border-gray-700 hover:border-cinema-500"
                              >
                                <Clock className="w-3 h-3 mr-1.5" />
                                {format(new Date(showtime.startTime), 'HH:mm')}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
