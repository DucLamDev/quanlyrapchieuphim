'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, AlertCircle, CheckCircle, Ticket } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface Review {
  _id: string
  userId: {
    _id: string
    fullName: string
    avatar?: string
  }
  rating: number
  title?: string
  content: string
  likes: string[]
  dislikes: string[]
  isVerifiedPurchase: boolean
  createdAt: string
  sentiment?: {
    label: string
  }
}

interface MovieReviewsProps {
  movieId: string
  movieTitle: string
}

export function MovieReviews({ movieId, movieTitle }: MovieReviewsProps) {
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [canReviewReason, setCanReviewReason] = useState('')
  const [myReview, setMyReview] = useState<Review | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [formData, setFormData] = useState({
    rating: 8,
    title: '',
    content: ''
  })

  useEffect(() => {
    fetchReviews()
    if (isAuthenticated) {
      checkCanReview()
      fetchMyReview()
    }
  }, [movieId, isAuthenticated, page])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.getReviews(movieId, { page, limit: 5 })
      setReviews(response.reviews || [])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkCanReview = async () => {
    try {
      const response = await api.canReviewMovie(movieId)
      setCanReview(response.canReview)
      setCanReviewReason(response.reason || '')
    } catch (error) {
      console.error('Error checking review eligibility:', error)
    }
  }

  const fetchMyReview = async () => {
    try {
      const response = await api.getMyReview(movieId)
      setMyReview(response.review)
    } catch (error) {
      console.error('Error fetching my review:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung đánh giá',
        variant: 'destructive'
      })
      return
    }

    try {
      setSubmitting(true)
      await api.createReview({
        movieId,
        rating: formData.rating,
        title: formData.title,
        content: formData.content
      })
      
      toast({
        title: 'Thành công',
        description: 'Đánh giá của bạn đã được gửi'
      })
      
      setShowReviewForm(false)
      setFormData({ rating: 8, title: '', content: '' })
      fetchReviews()
      fetchMyReview()
      setCanReview(false)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể gửi đánh giá',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeReview = async (reviewId: string, action: 'like' | 'dislike') => {
    if (!isAuthenticated) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thực hiện hành động này'
      })
      return
    }

    try {
      await api.likeReview(reviewId, action)
      fetchReviews()
    } catch (error) {
      console.error('Error liking review:', error)
    }
  }

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cinema-500" />
          Đánh giá phim
        </h2>
        
        {isAuthenticated && canReview && !showReviewForm && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-cinema-600 hover:bg-cinema-700"
          >
            <Star className="w-4 h-4 mr-2" />
            Viết đánh giá
          </Button>
        )}
      </div>

      {/* Review eligibility notice */}
      {isAuthenticated && !canReview && !myReview && (
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start gap-3">
          <Ticket className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-300">
              {canReviewReason === 'no_purchase' 
                ? 'Bạn cần mua vé xem phim này trước khi có thể đánh giá.'
                : 'Bạn đã đánh giá phim này rồi.'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Chỉ những khách hàng đã mua vé mới có thể đánh giá phim.
            </p>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-300">
            Vui lòng <a href="/login" className="text-cinema-500 hover:underline">đăng nhập</a> để viết đánh giá.
          </p>
        </div>
      )}

      {/* My Review */}
      {myReview && (
        <div className="mb-6 rounded-lg border border-cinema-200 bg-cinema-50 p-4 dark:border-cinema-700 dark:bg-cinema-900/30">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-medium">Đánh giá của bạn</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {myReview.userId?.avatar ? (
                <Image
                  src={myReview.userId.avatar}
                  alt={myReview.userId.fullName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-cinema-600 rounded-full flex items-center justify-center text-white font-bold">
                  {myReview.userId?.fullName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{myReview.userId?.fullName}</span>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{myReview.rating}/10</span>
                </div>
              </div>
              {myReview.title && (
                <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{myReview.title}</h4>
              )}
              <p className="text-gray-700 dark:text-gray-300">{myReview.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitReview}
            className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800/50"
          >
            <h3 className="text-lg font-semibold mb-4">Đánh giá "{movieTitle}"</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Điểm đánh giá</label>
              <div className="flex items-center gap-4">
                {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                <span className="text-2xl font-bold text-yellow-400">{formData.rating}/10</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tiêu đề (tùy chọn)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tóm tắt đánh giá của bạn..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cinema-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nội dung đánh giá *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Chia sẻ cảm nhận của bạn về phim..."
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-cinema-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-cinema-600 hover:bg-cinema-700"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Gửi đánh giá
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Hủy
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cinema-500" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/30"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.userId?.avatar ? (
                    <Image
                      src={review.userId.avatar}
                      alt={review.userId.fullName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-800 dark:bg-gray-700 dark:text-white">
                      {review.userId?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{review.userId?.fullName}</span>
                    
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{review.rating}/10</span>
                    </div>
                    
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        Đã mua vé
                      </span>
                    )}
                    
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                  
                  {review.title && (
                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{review.title}</h4>
                  )}
                  
                  <p className="mb-3 text-gray-700 dark:text-gray-300">{review.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeReview(review._id, 'like')}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        review.likes?.includes((user as any)?._id) 
                          ? 'text-green-500' 
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.likes?.length || 0}</span>
                    </button>
                    
                    <button
                      onClick={() => handleLikeReview(review._id, 'dislike')}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        review.dislikes?.includes((user as any)?._id) 
                          ? 'text-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{review.dislikes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Trước
              </Button>
              <span className="px-4 py-2 text-gray-500 dark:text-gray-400">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có đánh giá nào cho phim này</p>
          {isAuthenticated && canReview && (
            <p className="mt-2 text-sm">Hãy là người đầu tiên đánh giá!</p>
          )}
        </div>
      )}
    </section>
  )
}
