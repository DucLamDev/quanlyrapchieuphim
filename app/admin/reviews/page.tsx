'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Trash2, Eye, EyeOff, MessageSquare, ThumbsUp, ThumbsDown, Filter, CheckCircle, XCircle, Clock } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'

export default function AdminReviews() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])
  const [filteredReviews, setFilteredReviews] = useState<any[]>([])
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [authChecked, setAuthChecked] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewStats, setReviewStats] = useState({ 
    total: 0, pending: 0, approved: 0, rejected: 0,
    positive: 0, neutral: 0, negative: 0, averageRating: '0'
  })
  const itemsPerPage = 10

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
    setAuthChecked(true)
    fetchReviews()
  }, [isAuthenticated, user, router])

  useEffect(() => {
    filterReviews()
  }, [reviews, sentimentFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.getAllReviews({ limit: 100, status: statusFilter !== 'all' ? statusFilter : undefined })
      const allReviews = (response.data || []).map((r: any) => ({
        ...r,
        movieTitle: r.movieId?.title || 'N/A',
        sentiment: r.sentiment?.label || 'neutral',
        comment: r.content || r.comment || '',
        moderationStatus: r.moderationStatus || 'approved'
      }))
      setReviews(allReviews)
      
      // Calculate stats
      const positive = allReviews.filter((r: any) => r.sentiment === 'positive').length
      const neutral = allReviews.filter((r: any) => r.sentiment === 'neutral').length
      const negative = allReviews.filter((r: any) => r.sentiment === 'negative').length
      const avgRating = allReviews.length > 0 
        ? (allReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / allReviews.length).toFixed(1)
        : '0'
      
      setReviewStats({
        total: response.stats?.total || allReviews.length,
        pending: response.stats?.pending || 0,
        approved: response.stats?.approved || 0,
        rejected: response.stats?.rejected || 0,
        positive,
        neutral,
        negative,
        averageRating: avgRating
      })
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    let filtered = reviews

    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(r => r.sentiment === sentimentFilter)
    }

    setFilteredReviews(filtered)
    setCurrentPage(1) // Reset page when filter changes
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xóa review này?')) return

    try {
      await api.deleteReview(reviewId)
      await fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const getSentimentBadge = (sentiment: string) => {
    const styles = {
      positive: 'bg-green-500/20 text-green-400 border-green-500',
      neutral: 'bg-gray-500/20 text-gray-400 border-gray-500',
      negative: 'bg-red-500/20 text-red-400 border-red-500'
    }

    const icons = {
      positive: <ThumbsUp className="w-3 h-3" />,
      neutral: <MessageSquare className="w-3 h-3" />,
      negative: <ThumbsDown className="w-3 h-3" />
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${styles[sentiment as keyof typeof styles] || styles.neutral}`}>
        {icons[sentiment as keyof typeof icons]}
        {sentiment === 'positive' ? 'Tích cực' : sentiment === 'negative' ? 'Tiêu cực' : 'Trung lập'}
      </span>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
      />
    ))
  }

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await api.moderateReview(reviewId, { status })
      await fetchReviews()
    } catch (error) {
      console.error('Error moderating review:', error)
    }
  }

  const handleToggleVisibility = async (reviewId: string) => {
    try {
      await api.toggleReviewVisibility(reviewId)
      await fetchReviews()
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      approved: 'bg-green-500/20 text-green-400 border-green-500',
      rejected: 'bg-red-500/20 text-red-400 border-red-500'
    }
    const icons: Record<string, JSX.Element> = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />
    }
    const labels: Record<string, string> = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối'
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${styles[status] || styles.pending}`}>
        {icons[status]}
        {labels[status] || status}
      </span>
    )
  }

  if (!authChecked) {
    return null
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cinema-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý Đánh giá
          </h1>
          <p className="text-gray-400 mt-1">Kiểm duyệt và quản lý reviews của khách hàng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Tổng reviews', value: reviewStats.total, icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Chờ duyệt', value: reviewStats.pending, icon: Clock, color: 'text-yellow-400' },
            { label: 'Đã duyệt', value: reviewStats.approved, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Từ chối', value: reviewStats.rejected, icon: XCircle, color: 'text-red-400' },
            { label: 'Trung bình', value: `${reviewStats.averageRating} ⭐`, icon: Star, color: 'text-yellow-400' }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Trạng thái:</span>
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'pending', label: 'Chờ duyệt' },
              { value: 'approved', label: 'Đã duyệt' },
              { value: 'rejected', label: 'Từ chối' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => { setStatusFilter(filter.value); fetchReviews(); }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-cinema-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Sentiment:</span>
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'positive', label: 'Tích cực' },
              { value: 'neutral', label: 'Trung lập' },
              { value: 'negative', label: 'Tiêu cực' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSentimentFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  sentimentFilter === filter.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {paginatedReviews.map((review: any) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{review.movieTitle}</h3>
                    {getStatusBadge(review.moderationStatus)}
                    {getSentimentBadge(review.sentiment)}
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border bg-blue-500/20 text-blue-400 border-blue-500">
                        <CheckCircle className="w-3 h-3" />
                        Đã mua vé
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{review.userId?.fullName || 'Anonymous'}</span>
                    <span>{review.userId?.email}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{review.rating}/10</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {review.moderationStatus === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleModerate(review._id, 'approved')}
                        variant="outline"
                        size="sm"
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Duyệt
                      </Button>
                      <Button
                        onClick={() => handleModerate(review._id, 'rejected')}
                        variant="outline"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Từ chối
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleToggleVisibility(review._id)}
                    variant="outline"
                    size="sm"
                    className="text-gray-400 hover:text-gray-300"
                    title={review.isVisible ? 'Ẩn đánh giá' : 'Hiện đánh giá'}
                  >
                    {review.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => handleDelete(review._id)}
                    variant="outline"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium text-white mb-2">{review.title}</h4>
              )}

              <p className="text-gray-300 mb-4">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {review.likes?.length || 0}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="w-4 h-4" />
                  {review.dislikes?.length || 0}
                </span>
                {!review.isVisible && (
                  <span className="text-yellow-500">• Đang ẩn</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Không có reviews nào</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredReviews.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </AdminLayout>
  )
}
