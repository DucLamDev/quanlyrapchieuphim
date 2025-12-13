'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function CreateShowtimePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<any[]>([])
  const [cinemas, setCinemas] = useState<any[]>([])
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    roomName: 'Phòng 1',
    startTime: '',
    date: '',
    priceStandard: '80000',
    priceVIP: '120000',
    priceCouple: '150000'
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchData()
  }, [isAuthenticated, user])

  const fetchData = async () => {
    try {
      const [moviesRes, cinemasRes] = await Promise.all([
        api.getMovies(),
        api.getCinemas()
      ])
      setMovies(moviesRes.movies || [])
      setCinemas(cinemasRes.cinemas || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    if (!formData.movieId || !formData.cinemaId || !formData.date || !formData.startTime) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      })
      return
    }
    
    try {
      setLoading(true)
      
      const showtimeData = {
        movieId: formData.movieId,
        cinemaId: formData.cinemaId,
        room: {
          name: formData.roomName,
          capacity: 150
        },
        startTime: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
        price: {
          standard: parseInt(formData.priceStandard),
          vip: parseInt(formData.priceVIP),
          couple: parseInt(formData.priceCouple)
        }
      }

      await api.createShowtime(showtimeData)
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm suất chiếu mới'
      })
      
      router.push('/admin/showtimes')
    } catch (error: any) {
      console.error('Error creating showtime:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể thêm suất chiếu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">Thêm suất chiếu mới</h1>
          <p className="text-gray-400 mt-2">Điền thông tin suất chiếu</p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movie */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Phim <span className="text-red-500">*</span>
              </label>
              <select
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              >
                <option value="">-- Chọn phim --</option>
                {movies.map(movie => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title} ({movie.duration} phút)
                  </option>
                ))}
              </select>
            </div>

            {/* Cinema */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Rạp <span className="text-red-500">*</span>
              </label>
              <select
                name="cinemaId"
                value={formData.cinemaId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              >
                <option value="">-- Chọn rạp --</option>
                {cinemas.map(cinema => (
                  <option key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phòng chiếu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Phòng 1"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ngày chiếu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Giờ chiếu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
            </div>

            {/* Price Standard */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Giá ghế thường (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="priceStandard"
                value={formData.priceStandard}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
            </div>

            {/* Price VIP */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Giá ghế VIP (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="priceVIP"
                value={formData.priceVIP}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
            </div>

            {/* Price Couple */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Giá ghế đôi (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="priceCouple"
                value={formData.priceCouple}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cinema-600 hover:bg-cinema-700"
            >
              {loading ? 'Đang tạo...' : 'Thêm suất chiếu'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </motion.form>
      </div>

      <Footer />
    </div>
  )
}
