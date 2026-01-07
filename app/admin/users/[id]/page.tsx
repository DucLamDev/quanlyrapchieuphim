'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { user: currentUser, isAuthenticated } = useAuthStore()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'customer'
  })

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      router.push('/')
      return
    }
    setAuthChecked(true)
    if (params.id) {
      fetchUser()
    }
  }, [isAuthenticated, currentUser, params.id, router])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await api.getUser(params.id as string)
      const userData = response.user || response.data
      setUser(userData)
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'customer'
      })
    } catch (error: any) {
      console.error('Error fetching user:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin người dùng',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await api.updateUser(params.id as string, formData)
      
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin người dùng'
      })
      
      await fetchUser()
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể cập nhật người dùng',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (!authChecked) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">Chi tiết người dùng</h1>
          <p className="text-gray-400 mt-2">Xem và chỉnh sửa thông tin</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                >
                  <option value="customer">Khách hàng</option>
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Thông tin bổ sung</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Loyalty Tier:</span>
                  <p className="font-semibold text-cinema-400 mt-1">
                    {user?.loyalty?.tier || 'Bronze'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Điểm tích lũy:</span>
                  <p className="font-semibold mt-1">{user?.loyalty?.points || 0}</p>
                </div>
                <div>
                  <span className="text-gray-400">Ngày tạo:</span>
                  <p className="font-semibold mt-1">{formatDate(user?.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Trạng thái:</span>
                  <p className="font-semibold mt-1">
                    {user?.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-cinema-600 hover:bg-cinema-700 gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
