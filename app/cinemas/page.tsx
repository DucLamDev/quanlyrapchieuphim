'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation, Star, Calendar, Search, Map, Grid, Film, ExternalLink } from 'lucide-react'
import { api } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CinemasPage() {
  const router = useRouter()
  const [cinemas, setCinemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCinema, setSelectedCinema] = useState<any>(null)

  useEffect(() => {
    fetchCinemas()
  }, [])

  const fetchCinemas = async () => {
    try {
      setLoading(true)
      const response = await api.getCinemas()
      setCinemas(response.cinemas || mockCinemas)
    } catch (error) {
      console.error('Error fetching cinemas:', error)
      setCinemas(mockCinemas)
    } finally {
      setLoading(false)
    }
  }

  const mockCinemas = [
    {
      _id: '1',
      name: 'CGV Vincom Center Đà Nẵng',
      address: '72 Lê Thánh Tôn, Quận Hải Châu, TP. Đà Nẵng',
      city: 'Đà Nẵng',
      phone: '1900 6017',
      screens: 8,
      totalSeats: 1200,
      facilities: ['IMAX', '4DX', 'Gold Class', 'Dolby Atmos'],
      openingHours: '08:00 - 23:00',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop'
    },
    {
      _id: '2',
      name: 'Lotte Cinema Đà Nẵng',
      address: '34 Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng',
      city: 'Đà Nẵng',
      phone: '1900 5454',
      screens: 12,
      totalSeats: 1800,
      facilities: ['IMAX', 'Premium', 'Dolby Atmos'],
      openingHours: '08:30 - 23:30',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop'
    },
    {
      _id: '3',
      name: 'Galaxy Cinema Đà Nẵng',
      address: '116 Nguyễn Văn Linh, Quận Thanh Khê, TP. Đà Nẵng',
      city: 'Đà Nẵng',
      phone: '1900 2224',
      screens: 6,
      totalSeats: 900,
      facilities: ['Premium', 'Dolby Atmos'],
      openingHours: '09:00 - 23:00',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=600&fit=crop'
    },
    {
      _id: '4',
      name: 'BHD Star Cineplex Đà Nẵng',
      address: '123 Trần Phú, Quận Hải Châu, TP. Đà Nẵng',
      city: 'Đà Nẵng',
      phone: '1900 2099',
      screens: 10,
      totalSeats: 1500,
      facilities: ['Gold Class', 'Dolby Atmos', '4DX'],
      openingHours: '08:00 - 23:30',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?w=800&h=600&fit=crop'
    }
  ]

  const cities = ['all', ...Array.from(new Set(cinemas.map(c => c.city)))]
  
  const filteredCinemas = cinemas
    .filter(c => selectedCity === 'all' || c.city === selectedCity)
    .filter(c => 
      searchQuery === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const handleDirections = (cinema: any) => {
    const address = cinema.address || cinema.location?.address || 'Unknown'
    const city = cinema.city || cinema.location?.city || ''
    const fullAddress = encodeURIComponent(`${address}, ${city}, Vietnam`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${fullAddress}`, '_blank')
  }

  const handleShowtimes = (cinema: any) => {
    router.push(`/showtimes?cinema=${cinema._id}`)
  }

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
            <MapPin className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cinema-400 to-purple-400 bg-clip-text text-transparent">
            Hệ Thống Rạp
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Trải nghiệm điện ảnh đẳng cấp tại <span className="text-cinema-400 font-semibold">{cinemas.length} rạp</span> hiện đại nhất Việt Nam
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm rạp theo tên, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cinema-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* City Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCity === city
                      ? 'bg-gradient-to-r from-cinema-600 to-purple-600 text-white shadow-lg shadow-cinema-600/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {city === 'all' ? '🌍 Tất cả' : `📍 ${city}`}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cinema-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-cinema-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center text-sm text-gray-400">
            Tìm thấy <span className="text-cinema-400 font-semibold">{filteredCinemas.length}</span> rạp chiếu phim
          </div>
        </motion.div>

        {/* Cinemas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCinemas.map((cinema, index) => (
              <motion.div
                key={cinema._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-cinema-500 hover:shadow-2xl hover:shadow-cinema-600/20 transition-all duration-300 group"
              >
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <>
                    {/* Cinema Image */}
                    <div className="relative h-52 bg-gradient-to-br from-cinema-600 via-purple-600 to-pink-600 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-20 h-20 text-white/30 group-hover:scale-110 transition-transform" />
                      </div>
                      
                      {/* Rating Badge */}
                      {(typeof cinema.rating === 'object' ? cinema.rating?.average : cinema.rating) > 0 && (
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-yellow-500 rounded-xl flex items-center gap-1.5 shadow-lg">
                          <Star className="w-4 h-4 fill-current text-yellow-900" />
                          <span className="font-bold text-sm text-yellow-900">
                            {typeof cinema.rating === 'object' 
                              ? cinema.rating.average.toFixed(1)
                              : cinema.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* City Badge */}
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-lg flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-medium">{cinema.city}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Name */}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-cinema-400 transition-colors line-clamp-1">
                        {cinema.name}
                      </h3>

                      {/* Info */}
                      <div className="space-y-2.5 mb-4 text-sm">
                        <div className="flex items-start gap-2.5 text-gray-400">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-cinema-400" />
                          <span className="line-clamp-2">{cinema.address}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-400">
                          <Phone className="w-4 h-4 text-cinema-400" />
                          <span>{cinema.phone}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-gray-400">
                          <Clock className="w-4 h-4 text-cinema-400" />
                          <span>{cinema.openingHours}</span>
                        </div>
                      </div>

                      {/* Screens & Seats */}
                      <div className="flex gap-4 mb-4 pb-4 border-b border-gray-700">
                        <div className="flex-1 text-center p-3 bg-gray-800/50 rounded-lg">
                          <p className="text-2xl font-bold text-cinema-400">
                            {Array.isArray(cinema.screens) ? cinema.screens.length : (cinema.screens || 0)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Phòng chiếu</p>
                        </div>
                        <div className="flex-1 text-center p-3 bg-gray-800/50 rounded-lg">
                          <p className="text-2xl font-bold text-cinema-400">
                            {cinema.totalSeats || (Array.isArray(cinema.screens) ? cinema.screens.reduce((sum: number, s: any) => sum + (s.totalSeats || s.capacity || 0), 0) : 0)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Ghế ngồi</p>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium">Tiện nghi:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cinema.facilities?.slice(0, 4).map((facility: string) => (
                            <span
                              key={facility}
                              className="px-2.5 py-1 bg-gradient-to-r from-cinema-600/20 to-purple-600/20 border border-cinema-600/30 rounded-lg text-xs text-cinema-300 font-medium"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDirections(cinema)}
                          className="flex-1 bg-gradient-to-r from-cinema-600 to-purple-600 hover:from-cinema-700 hover:to-purple-700 shadow-lg shadow-cinema-600/20"
                          size="sm"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Chỉ đường
                        </Button>
                        <Button
                          onClick={() => handleShowtimes(cinema)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-cinema-600/50 hover:bg-cinema-600/10 hover:border-cinema-600"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Lịch chiếu
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* List View */
                  <div className="flex gap-6 p-6">
                    {/* Cinema Image */}
                    <div className="relative w-48 h-48 flex-shrink-0 bg-gradient-to-br from-cinema-600 via-purple-600 to-pink-600 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="w-16 h-16 text-white/30" />
                      </div>
                      
                      {(typeof cinema.rating === 'object' ? cinema.rating?.average : cinema.rating) > 0 && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-yellow-500 rounded-lg flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-current text-yellow-900" />
                          <span className="font-bold text-xs text-yellow-900">
                            {typeof cinema.rating === 'object' 
                              ? cinema.rating.average.toFixed(1)
                              : cinema.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 group-hover:text-cinema-400 transition-colors">
                            {cinema.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span>{cinema.city}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                            <p className="text-lg font-bold text-cinema-400">
                              {Array.isArray(cinema.screens) ? cinema.screens.length : (cinema.screens || 0)}
                            </p>
                            <p className="text-[10px] text-gray-500">Phòng</p>
                          </div>
                          <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                            <p className="text-lg font-bold text-cinema-400">
                              {cinema.totalSeats || (Array.isArray(cinema.screens) ? cinema.screens.reduce((sum: number, s: any) => sum + (s.totalSeats || s.capacity || 0), 0) : 0)}
                            </p>
                            <p className="text-[10px] text-gray-500">Ghế</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-start gap-2 text-gray-400">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-cinema-400" />
                          <span>{cinema.address}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <Phone className="w-4 h-4 text-cinema-400" />
                          <span>{cinema.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4 text-cinema-400" />
                          <span>{cinema.openingHours}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cinema.facilities?.map((facility: string) => (
                            <span
                              key={facility}
                              className="px-2.5 py-1 bg-gradient-to-r from-cinema-600/20 to-purple-600/20 border border-cinema-600/30 rounded-lg text-xs text-cinema-300 font-medium"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDirections(cinema)}
                          className="bg-gradient-to-r from-cinema-600 to-purple-600 hover:from-cinema-700 hover:to-purple-700 shadow-lg shadow-cinema-600/20"
                          size="sm"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Chỉ đường
                        </Button>
                        <Button
                          onClick={() => handleShowtimes(cinema)}
                          variant="outline"
                          size="sm"
                          className="border-cinema-600/50 hover:bg-cinema-600/10 hover:border-cinema-600"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Lịch chiếu
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {filteredCinemas.length === 0 && !loading && (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Không tìm thấy rạp nào</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
