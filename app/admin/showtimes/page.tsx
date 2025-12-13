'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, RefreshCw, Zap, CalendarPlus } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatDate, formatTime } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AdminShowtimesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  const [showtimes, setShowtimes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchShowtimes()
    fetchStats()
  }, [isAuthenticated, user])

  const fetchShowtimes = async () => {
    try {
      setLoading(true)
      const response = await api.getShowtimes()
      setShowtimes(response.showtimes || [])
    } catch (error) {
      console.error('Error fetching showtimes:', error)
      setShowtimes([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.getShowtimeStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleGenerateToday = async () => {
    try {
      setGenerating(true)
      const response = await api.generateShowtimesToday()
      toast({
        title: 'Thành công',
        description: response.message || `Đã tạo ${response.data?.count || 0} suất chiếu cho hôm nay`
      })
      fetchShowtimes()
      fetchStats()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tạo suất chiếu',
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateMultipleDays = async () => {
    try {
      setGenerating(true)
      const response = await api.generateShowtimesMultipleDays(7)
      toast({
        title: 'Thành công',
        description: response.message || `Đã tạo ${response.data?.totalCount || 0} suất chiếu cho 7 ngày tới`
      })
      fetchShowtimes()
      fetchStats()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tạo suất chiếu',
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleEnsureShowtimes = async () => {
    try {
      setGenerating(true)
      const response = await api.ensureShowtimesExist()
      toast({
        title: 'Thành công',
        description: response.message || 'Đã đảm bảo có suất chiếu'
      })
      fetchShowtimes()
      fetchStats()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể kiểm tra suất chiếu',
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleRegenerateToday = async () => {
    if (!confirm('Bạn có chắc muốn xóa và tạo lại TẤT CẢ suất chiếu cho hôm nay (bao gồm sáng, chiều, tối)?')) return
    
    try {
      setGenerating(true)
      const response = await api.regenerateShowtimesToday()
      toast({
        title: 'Thành công',
        description: response.message || 'Đã tạo lại suất chiếu cho hôm nay'
      })
      fetchShowtimes()
      fetchStats()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tạo lại suất chiếu',
        variant: 'destructive'
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa suất chiếu này?')) return

    try {
      await api.deleteShowtime(id)
      toast({
        title: 'Thành công',
        description: 'Đã xóa suất chiếu'
      })
      fetchShowtimes()
      fetchStats()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa suất chiếu',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Hôm nay</p>
              <p className="text-2xl font-bold text-green-400">{stats.today || 0}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Ngày mai</p>
              <p className="text-2xl font-bold text-blue-400">{stats.tomorrow || 0}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">7 ngày tới</p>
              <p className="text-2xl font-bold text-purple-400">{stats.nextWeek || 0}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">Tổng cộng</p>
              <p className="text-2xl font-bold text-cinema-400">{stats.total || 0}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý lịch chiếu</h1>
            <p className="text-gray-400">Thêm, sửa, xóa suất chiếu</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleEnsureShowtimes}
              disabled={generating}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              Kiểm tra & Tạo tự động
            </Button>
            <Button
              onClick={handleGenerateToday}
              disabled={generating}
              variant="outline"
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              Tạo cho hôm nay
            </Button>
            <Button
              onClick={handleGenerateMultipleDays}
              disabled={generating}
              variant="outline"
              className="gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              Tạo cho 7 ngày
            </Button>
            <Button
              onClick={handleRegenerateToday}
              disabled={generating}
              variant="outline"
              className="gap-2 text-orange-400 border-orange-400 hover:bg-orange-400/10"
            >
              <RefreshCw className="w-4 h-4" />
              Tạo lại hôm nay
            </Button>
            <Button
              onClick={() => router.push('/admin/showtimes/create')}
              className="bg-cinema-600 hover:bg-cinema-700 gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm thủ công
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : showtimes.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">Chưa có suất chiếu nào</h3>
            <p className="text-gray-400 mb-6">Bấm nút bên dưới để tự động tạo suất chiếu cho các phim đang chiếu</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleEnsureShowtimes}
                disabled={generating}
                className="bg-cinema-600 hover:bg-cinema-700 gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                Tự động tạo suất chiếu
              </Button>
              <Button
                onClick={() => router.push('/admin/showtimes/create')}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm thủ công
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phim</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rạp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Phòng</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Giờ chiếu</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {showtimes.map((showtime, index) => (
                    <motion.tr
                      key={showtime._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold">{showtime.movieId?.title}</p>
                        <p className="text-sm text-gray-400">{showtime.movieId?.duration} phút</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{showtime.cinemaId?.name}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm">{showtime.room?.name}</p>
                        <p className="text-xs text-gray-500">{showtime.room?.capacity} ghế</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-cinema-400" />
                          <div>
                            <p className="font-semibold">{formatDate(showtime.startTime)}</p>
                            <p className="text-gray-400">{formatTime(showtime.startTime)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          showtime.status === 'scheduled'
                            ? 'bg-green-500/20 text-green-400'
                            : showtime.status === 'ongoing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : showtime.status === 'completed'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {showtime.status === 'scheduled' ? 'Đã lên lịch' : 
                           showtime.status === 'ongoing' ? 'Đang chiếu' :
                           showtime.status === 'completed' ? 'Đã chiếu' : 'Đã hủy'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/showtimes/edit/${showtime._id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(showtime._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
