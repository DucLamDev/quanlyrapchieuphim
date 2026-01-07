'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MapPin, Phone, Film, Edit, Trash2, X } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AdminCinemasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  const [cinemas, setCinemas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCinema, setEditingCinema] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    district: '',
    phone: '',
    email: '',
    screens: '',
    totalSeats: '',
    facilities: [] as string[],
    isActive: true
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
    setAuthChecked(true)
    fetchCinemas()
  }, [isAuthenticated, user, router])

  const fetchCinemas = async () => {
    try {
      setLoading(true)
      const response = await api.getCinemas()
      setCinemas(response.cinemas || mockCinemas)
    } catch (error) {
      console.error('Error fetching cinemas:', error)
      setCinemas(mockCinemas)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách rạp',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (cinema?: any) => {
    if (cinema) {
      setEditingCinema(cinema)
      setFormData({
        name: cinema.name || '',
        address: (typeof cinema.address === 'string' ? cinema.address : cinema.location?.address) || '',
        city: cinema.city || cinema.location?.city || '',
        district: cinema.district || cinema.location?.district || '',
        phone: cinema.phone || cinema.contactInfo?.phone || '',
        email: cinema.email || cinema.contactInfo?.email || '',
        screens: (Array.isArray(cinema.screens) ? cinema.screens.length : cinema.screens || '').toString(),
        totalSeats: (cinema.totalSeats || '').toString(),
        facilities: Array.isArray(cinema.facilities) ? cinema.facilities : [],
        isActive: cinema.isActive ?? (cinema.status === 'active')
      })
    } else {
      setEditingCinema(null)
      setFormData({
        name: '',
        address: '',
        city: '',
        district: '',
        phone: '',
        email: '',
        screens: '',
        totalSeats: '',
        facilities: [],
        isActive: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCinema(null)
  }

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      setSaving(true)
      const data = {
        name: formData.name,
        location: {
          address: formData.address,
          city: formData.city,
          district: formData.district
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email
        },
        facilities: formData.facilities,
        isActive: formData.isActive
      }

      if (editingCinema) {
        await api.updateCinema(editingCinema._id, data)
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật thông tin rạp'
        })
      } else {
        await api.createCinema(data)
        toast({
          title: 'Thành công',
          description: 'Đã thêm rạp mới'
        })
      }

      await fetchCinemas()
      closeModal()
    } catch (error: any) {
      console.error('Error saving cinema:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể lưu thông tin rạp',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa rạp này?')) return

    try {
      await api.deleteCinema(id)
      toast({
        title: 'Thành công',
        description: 'Đã xóa rạp'
      })
      await fetchCinemas()
    } catch (error: any) {
      console.error('Error deleting cinema:', error)
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể xóa rạp',
        variant: 'destructive'
      })
    }
  }

  const availableFacilities = [
    { value: 'parking', label: 'Bãi đỗ xe' },
    { value: 'food-court', label: 'Khu ăn uống' },
    { value: 'wifi', label: 'WiFi miễn phí' },
    { value: '3d-available', label: '3D' },
    { value: 'imax', label: 'IMAX' },
    { value: 'wheelchair-access', label: 'Tiếp cận xe lăn' },
    { value: 'arcade', label: 'Khu trò chơi' }
  ]

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
      status: 'active'
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
      status: 'active'
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
      status: 'active'
    }
  ]

  const filteredCinemas = cinemas.filter(cinema =>
    cinema.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!authChecked) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quản lý rạp chiếu</h1>
            <p className="text-gray-400">Danh sách rạp chiếu trong hệ thống</p>
          </div>
          <Button onClick={() => openModal()} className="bg-cinema-500 hover:bg-cinema-600">
            <Plus className="w-5 h-5 mr-2" />
            Thêm rạp mới
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm rạp..."
              className="w-full px-4 py-3 pl-12 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Cinemas Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCinemas.map((cinema, index) => (
              <motion.div
                key={cinema._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-cinema-500 transition-colors"
              >
                <h3 className="text-xl font-bold mb-4">{cinema.name || 'Chưa đặt tên'}</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {typeof cinema.address === 'string' 
                        ? cinema.address 
                        : cinema.location?.address || 'Chưa có địa chỉ'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{cinema.phone || cinema.contact?.phone || 'Chưa có SĐT'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400">
                    <Film className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {Array.isArray(cinema.screens) ? cinema.screens.length : cinema.screens || 0} phòng chiếu
                      {cinema.totalSeats && ` - ${cinema.totalSeats} ghế`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(cinema.facilities) && cinema.facilities.length > 0 ? (
                      cinema.facilities.map((facility: string, idx: number) => (
                        <span
                          key={`${facility}-${idx}`}
                          className="px-2 py-1 bg-cinema-500/20 text-cinema-400 rounded text-xs"
                        >
                          {typeof facility === 'string' ? facility : 'N/A'}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">Không có tiện ích</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    (cinema.status === 'active' || cinema.isActive === true)
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {(cinema.status === 'active' || cinema.isActive === true) ? 'Hoạt động' : 'Tạm ngừng'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(cinema)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(cinema._id)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden"
              >
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{editingCinema ? 'Chỉnh sửa rạp' : 'Thêm rạp mới'}</h2>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-800 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tên rạp *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-500"
                        placeholder="VD: CGV Vincom Center"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Địa chỉ *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-500"
                        placeholder="VD: 72 Lê Thánh Tôn"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Thành phố *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-500"
                          placeholder="VD: Đà Nẵng"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Quận/Huyện</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-500"
                          placeholder="VD: Hải Châu"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-500"
                          placeholder="VD: 1900 6017"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-500"
                          placeholder="VD: contact@cinema.vn"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tiện ích</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableFacilities.map(facility => (
                          <label key={facility.value} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
                            <input
                              type="checkbox"
                              checked={formData.facilities.includes(facility.value)}
                              onChange={() => handleFacilityToggle(facility.value)}
                              className="rounded"
                            />
                            <span className="text-sm">{facility.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded"
                      />
                      <label className="text-sm">Đang hoạt động</label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      onClick={closeModal}
                      disabled={saving}
                      className="flex-1 bg-gray-800 hover:bg-gray-700"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-cinema-500 hover:bg-cinema-600"
                    >
                      {saving ? 'Đang lưu...' : (editingCinema ? 'Cập nhật' : 'Tạo mới')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filteredCinemas.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">Không tìm thấy rạp chiếu nào</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
