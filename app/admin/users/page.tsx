'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, Search, Shield, UserX, User, Plus, X } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AdminUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  const [users, setUsers] = useState<any[]>([])
  const [cinemas, setCinemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [selectedCinemaId, setSelectedCinemaId] = useState('')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    cinemaId: ''
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchUsers()
    fetchCinemas()
  }, [isAuthenticated, user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.getUsers()
      setUsers(response.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCinemas = async () => {
    try {
      const response = await api.getCinemas()
      setCinemas(response.cinemas || [])
    } catch (error) {
      console.error('Error fetching cinemas:', error)
    }
  }

  const openModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'customer',
      cinemaId: ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.createUser(formData)
      toast({
        title: 'Thành công',
        description: 'Đã tạo người dùng mới'
      })
      await fetchUsers()
      closeModal()
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tạo người dùng',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return

    try {
      await api.deleteUser(id)
      toast({
        title: 'Thành công',
        description: 'Đã xóa người dùng'
      })
      fetchUsers()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa người dùng',
        variant: 'destructive'
      })
    }
  }

  const openEditCinemaModal = (user: any) => {
    setEditingUser(user)
    setSelectedCinemaId(user.cinemaId?._id || '')
    setShowEditCinemaModal(true)
  }

  const closeEditCinemaModal = () => {
    setShowEditCinemaModal(false)
    setEditingUser(null)
    setSelectedCinemaId('')
  }

  const handleUpdateCinema = async () => {
    if (!editingUser) return

    try {
      setSaving(true)
      await api.updateUser(editingUser._id, { cinemaId: selectedCinemaId || null })
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật rạp cho nhân viên'
      })
      await fetchUsers()
      closeEditCinemaModal()
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể cập nhật',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
            <p className="text-gray-400">Danh sách khách hàng và nhân viên</p>
          </div>
          <Button
            onClick={openModal}
            className="bg-cinema-600 hover:bg-cinema-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm người dùng
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full px-4 py-3 pl-12 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-2">
            {['all', 'customer', 'staff', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  roleFilter === role
                    ? 'bg-cinema-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {role === 'all' ? 'Tất cả' : 
                 role === 'customer' ? 'Khách hàng' : 
                 role === 'staff' ? 'Nhân viên' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Người dùng</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Vai trò</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rạp làm việc</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Loyalty</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ngày tạo</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cinema-600 rounded-full flex items-center justify-center font-bold">
                            {user.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold">{user.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400'
                            : user.role === 'staff'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 
                           user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.role === 'staff' ? (
                          user.cinemaId ? (
                            <div>
                              <p className="font-semibold">{user.cinemaId?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-500">
                                {typeof user.cinemaId?.location === 'string' 
                                  ? user.cinemaId.location 
                                  : user.cinemaId?.location?.city || 'N/A'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-red-400">Chưa gán rạp</span>
                          )
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-semibold text-cinema-400">
                            {user.loyalty?.tier || 'Bronze'}
                          </p>
                          <p className="text-gray-500">{user.loyalty?.points || 0} điểm</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.role === 'staff' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditCinemaModal(user)}
                              className="text-cinema-400 hover:text-cinema-300"
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400">Không tìm thấy người dùng</p>
              </div>
            )}
          </div>
        )}

        {/* Create User Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Tạo người dùng mới</h2>
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
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="Nguyễn Văn A"
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
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="Í t nhất 6 ký tự"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="staff">Nhân viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {formData.role === 'staff' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rạp làm việc <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="cinemaId"
                        value={formData.cinemaId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                      >
                        <option value="">Chọn rạp</option>
                        {cinemas.map((cinema) => (
                          <option key={cinema._id} value={cinema._id}>
                            {cinema.name} - {cinema.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-gray-800">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-cinema-600 hover:bg-cinema-700"
                    >
                      {saving ? 'Đang tạo...' : 'Tạo người dùng'}
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

        {/* Edit Cinema Modal */}
        {showEditCinemaModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Gán rạp cho nhân viên</h2>
                    <p className="text-sm text-gray-400 mt-1">{editingUser.fullName}</p>
                  </div>
                  <button
                    onClick={closeEditCinemaModal}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rạp làm việc
                    </label>
                    <select
                      value={selectedCinemaId}
                      onChange={(e) => setSelectedCinemaId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    >
                      <option value="">Không gán rạp</option>
                      {cinemas.map((cinema) => (
                        <option key={cinema._id} value={cinema._id}>
                          {cinema.name} - {typeof cinema.location === 'string' ? cinema.location : cinema.location?.city || 'N/A'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-800">
                    <Button
                      onClick={handleUpdateCinema}
                      disabled={saving}
                      className="flex-1 bg-cinema-600 hover:bg-cinema-700"
                    >
                      {saving ? 'Đang lưu...' : 'Cập nhật'}
                    </Button>
                    <Button
                      onClick={closeEditCinemaModal}
                      variant="outline"
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
