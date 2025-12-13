'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Calendar, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function CreateMoviePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    director: '',
    cast: '',
    genres: '',
    duration: '',
    releaseDate: '',
    language: 'Tiếng Việt',
    ageRating: 'P',
    country: 'Việt Nam',
    trailer: '',
    poster: '',
    status: 'coming-soon'
  })

  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/')
    return null
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const movieData = {
        ...formData,
        cast: formData.cast.split(',').map(c => c.trim()),
        genres: formData.genres.split(',').map(g => g.trim()),
        duration: parseInt(formData.duration)
      }

      await api.createMovie(movieData)
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm phim mới'
      })
      
      router.push('/admin/movies')
    } catch (error: any) {
      console.error('Error creating movie:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể thêm phim',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold">Thêm phim mới</h1>
          <p className="text-gray-400 mt-2">Điền thông tin phim</p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Tên phim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Nhập tên phim"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Nhập mô tả phim"
              />
            </div>

            {/* Director */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Đạo diễn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Nhập tên đạo diễn"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Thời lượng (phút) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="120"
              />
            </div>

            {/* Cast */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Diễn viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Ngăn cách bằng dấu phẩy: Diễn viên 1, Diễn viên 2"
              />
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Thể loại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Hành động, Phiêu lưu"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              >
                <option>Tiếng Việt</option>
                <option>Tiếng Anh</option>
                <option>Phụ đề</option>
              </select>
            </div>

            {/* Release Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ngày phát hành <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
            </div>

            {/* Age Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phân loại độ tuổi <span className="text-red-500">*</span>
              </label>
              <select
                name="ageRating"
                value={formData.ageRating}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              >
                <option value="P">P - Phổ thông</option>
                <option value="K">K - Dưới 13 tuổi với phụ huynh</option>
                <option value="T13">T13 - 13+</option>
                <option value="T16">T16 - 16+</option>
                <option value="T18">T18 - 18+</option>
                <option value="C">C - Cấm</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quốc gia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="Việt Nam"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
              >
                <option value="coming-soon">Sắp chiếu</option>
                <option value="now-showing">Đang chiếu</option>
                <option value="ended">Ngừng chiếu</option>
              </select>
            </div>

            {/* Poster URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                URL Poster <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            {/* Trailer URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">URL Trailer</label>
              <input
                type="url"
                name="trailer"
                value={formData.trailer}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                placeholder="https://youtube.com/watch?v=..."
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
              {loading ? 'Đang tạo...' : 'Thêm phim'}
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
