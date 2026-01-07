'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Tag, Calendar, Percent, DollarSign, X } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useAuthStore } from '@/lib/store'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AdminPromotions() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [promotions, setPromotions] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscountAmount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    isActive: true
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
    setAuthChecked(true)
    fetchPromotions()
  }, [isAuthenticated, user, router])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const res = await api.getPromotions()
      setPromotions(res.data || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khuyến mãi',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (promo?: any) => {
    if (promo) {
      setEditingPromotion(promo)
      setFormData({
        code: promo.code || '',
        description: promo.description || promo.name || '', // Backend uses 'name'
        discountType: promo.type || 'percentage', // Backend uses 'type'
        discountValue: promo.value?.toString() || '', // Backend uses 'value'
        minOrderValue: promo.minPurchaseAmount?.toString() || '', // Backend uses 'minPurchaseAmount'
        maxDiscountAmount: promo.maxDiscountAmount?.toString() || '',
        validFrom: promo.validFrom ? new Date(promo.validFrom).toISOString().split('T')[0] : '',
        validUntil: promo.validUntil ? new Date(promo.validUntil).toISOString().split('T')[0] : '',
        usageLimit: promo.usageLimit?.total?.toString() || '', // Backend uses nested object
        isActive: promo.isActive ?? true
      })
    } else {
      setEditingPromotion(null)
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: '',
        maxDiscountAmount: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        isActive: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingPromotion(null)
  }

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setSaving(true)
      // Map frontend fields to backend model fields
      const data = {
        code: formData.code,
        name: formData.description, // Backend expects 'name' not 'description'
        description: formData.description,
        type: formData.discountType, // Backend expects 'type' not 'discountType'
        value: parseFloat(formData.discountValue), // Backend expects 'value' not 'discountValue'
        minPurchaseAmount: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? { total: parseInt(formData.usageLimit) } : undefined,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil, // Backend expects 'validUntil' not 'validTo'
        isActive: formData.isActive
      }

      if (editingPromotion) {
        await api.updatePromotion(editingPromotion._id, data)
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật khuyến mãi'
        })
      } else {
        await api.createPromotion(data)
        toast({
          title: 'Thành công',
          description: 'Đã tạo khuyến mãi mới'
        })
      }

      await fetchPromotions()
      closeModal()
    } catch (error: any) {
      console.error('Error saving promotion:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể lưu khuyến mãi',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khuyến mãi này?')) return

    try {
      await api.deletePromotion(id)
      toast({
        title: 'Thành công',
        description: 'Đã xóa khuyến mãi'
      })
      await fetchPromotions()
    } catch (error: any) {
      console.error('Error deleting promotion:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa khuyến mãi',
        variant: 'destructive'
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.isActive && new Date(p.validUntil) > new Date()).length,
    expired: promotions.filter(p => new Date(p.validUntil) < new Date()).length,
    totalDiscount: promotions.reduce((sum, p) => sum + (p.totalUsed * p.discountValue || 0), 0)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cinema-600 to-purple-600 bg-clip-text text-transparent">
              Quản lý Khuyến mãi
            </h1>
            <p className="text-gray-400 mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
          </div>

          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tạo khuyến mãi
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng khuyến mãi', value: stats.total, icon: Tag, color: 'text-blue-400' },
            { label: 'Đang hoạt động', value: stats.active, icon: Percent, color: 'text-green-400' },
            { label: 'Đã hết hạn', value: stats.expired, icon: Calendar, color: 'text-gray-400' },
            { label: 'Tổng giảm giá', value: formatCurrency(stats.totalDiscount), icon: DollarSign, color: 'text-cinema-400' }
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
                    <p className="text-2xl font-bold">{typeof stat.value === 'number' && stat.label !== 'Tổng giảm giá' ? stat.value : stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo: any) => {
            const isActive = promo.isActive && new Date(promo.validUntil) > new Date()
            const usagePercent = promo.usageLimit ? (promo.totalUsed / promo.usageLimit) * 100 : 0

            return (
              <motion.div
                key={promo._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-cinema-600 transition-colors"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {isActive ? 'Hoạt động' : 'Hết hạn'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(promo)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Code */}
                <div className="mb-4">
                  <div className="text-2xl font-bold font-mono text-cinema-400 mb-2">
                    {promo.code}
                  </div>
                  <p className="text-gray-400 text-sm">{promo.description}</p>
                </div>

                {/* Discount Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Giảm giá:</span>
                    <span className="font-semibold">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}%`
                        : formatCurrency(promo.discountValue)}
                    </span>
                  </div>
                  {promo.minOrderValue && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Đơn tối thiểu:</span>
                      <span className="font-semibold">{formatCurrency(promo.minOrderValue)}</span>
                    </div>
                  )}
                  {promo.maxDiscountAmount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Giảm tối đa:</span>
                      <span className="font-semibold">{formatCurrency(promo.maxDiscountAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Usage */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Đã sử dụng:</span>
                    <span className="font-semibold">
                      {promo.totalUsed} / {promo.usageLimit || '∞'}
                    </span>
                  </div>
                  {promo.usageLimit && (
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cinema-600 to-purple-600"
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Từ {formatDate(promo.validFrom)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Đến {formatDate(promo.validUntil)}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {promotions.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có khuyến mãi nào</p>
            <Button onClick={() => openModal()} className="mt-4">
              Tạo khuyến mãi đầu tiên
            </Button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mã khuyến mãi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="SUMMER2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="Mô tả khuyến mãi"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Loại giảm giá <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      >
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền cố định</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Giá trị giảm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Đơn hàng tối thiểu</label>
                      <input
                        type="number"
                        name="minOrderValue"
                        value={formData.minOrderValue}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Giảm tối đa</label>
                      <input
                        type="number"
                        name="maxDiscountAmount"
                        value={formData.maxDiscountAmount}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                        placeholder="Không giới hạn"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ngày bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="validFrom"
                        value={formData.validFrom}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="validUntil"
                        value={formData.validUntil}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Giới hạn sử dụng</label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="Không giới hạn"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 bg-gray-800 rounded border-gray-700"
                    />
                    <label className="text-sm font-medium">Kích hoạt ngay</label>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-800">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-cinema-600 hover:bg-cinema-700"
                    >
                      {saving ? 'Đang lưu...' : editingPromotion ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                    <Button
                      type="button"
                      onClick={closeModal}
                      variant="outline"
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
