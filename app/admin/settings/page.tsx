'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Settings, Save, Bell, Globe, Shield, 
  Mail, Database, Key, Eye, EyeOff 
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Cinema Management System',
    siteEmail: 'support@cinema.com',
    sitePhone: '1900 8888',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    currency: 'VND',
    enableNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maxBookingsPerUser: 10,
    bookingCancellationHours: 2,
    loyaltyPointsPerVND: 0.01,
    apiKey: '••••••••••••••••',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/')
      return
    }
  }, [isAuthenticated, user])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // In a real app, this would call an API to save settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Cài đặt đã lưu',
        description: 'Các thay đổi đã được áp dụng thành công'
      })
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu cài đặt',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-cinema-500" />
            <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          </div>
          <p className="text-gray-400">Quản lý cấu hình và tùy chọn hệ thống</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 sticky top-24">
              <nav className="space-y-2">
                <a href="#general" className="block px-4 py-2 rounded-lg bg-gray-800 text-cinema-400 font-semibold">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Thông tin chung
                </a>
                <a href="#notifications" className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400">
                  <Bell className="w-4 h-4 inline mr-2" />
                  Thông báo
                </a>
                <a href="#booking" className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400">
                  <Database className="w-4 h-4 inline mr-2" />
                  Đặt vé
                </a>
                <a href="#security" className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Bảo mật
                </a>
                <a href="#api" className="block px-4 py-2 rounded-lg hover:bg-gray-800 text-gray-400">
                  <Key className="w-4 h-4 inline mr-2" />
                  API & Tích hợp
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings */}
            <motion.div
              id="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-cinema-400" />
                <h2 className="text-xl font-bold">Thông tin chung</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên hệ thống</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email liên hệ</label>
                    <input
                      type="email"
                      name="siteEmail"
                      value={settings.siteEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      name="sitePhone"
                      value={settings.sitePhone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
                    <select
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Múi giờ</label>
                    <select
                      name="timezone"
                      value={settings.timezone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    >
                      <option value="Asia/Ho_Chi_Minh">GMT+7</option>
                      <option value="Asia/Bangkok">GMT+7 Bangkok</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tiền tệ</label>
                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    >
                      <option value="VND">VND</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              id="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-cinema-400" />
                <h2 className="text-xl font-bold">Cài đặt thông báo</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-semibold">Bật thông báo</p>
                    <p className="text-sm text-gray-400">Cho phép gửi thông báo cho người dùng</p>
                  </div>
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-semibold">Thông báo Email</p>
                    <p className="text-sm text-gray-400">Gửi thông báo qua email</p>
                  </div>
                  <input
                    type="checkbox"
                    name="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-semibold">Thông báo SMS</p>
                    <p className="text-sm text-gray-400">Gửi thông báo qua tin nhắn</p>
                  </div>
                  <input
                    type="checkbox"
                    name="enableSMSNotifications"
                    checked={settings.enableSMSNotifications}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </motion.div>

            {/* Booking Settings */}
            <motion.div
              id="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Database className="w-5 h-5 text-cinema-400" />
                <h2 className="text-xl font-bold">Cài đặt đặt vé</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Số vé tối đa / người dùng</label>
                  <input
                    type="number"
                    name="maxBookingsPerUser"
                    value={settings.maxBookingsPerUser}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Thời gian hủy vé (giờ)</label>
                  <input
                    type="number"
                    name="bookingCancellationHours"
                    value={settings.bookingCancellationHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Số giờ trước suất chiếu có thể hủy vé</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Điểm loyalty / 1000 VND</label>
                  <input
                    type="number"
                    name="loyaltyPointsPerVND"
                    value={settings.loyaltyPointsPerVND}
                    onChange={handleChange}
                    step="0.001"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              id="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-cinema-400" />
                <h2 className="text-xl font-bold">Bảo mật</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-semibold">Chế độ bảo trì</p>
                    <p className="text-sm text-gray-400">Tạm khóa truy cập hệ thống</p>
                  </div>
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-semibold">Cho phép đăng ký</p>
                    <p className="text-sm text-gray-400">Người dùng mới có thể tạo tài khoản</p>
                  </div>
                  <input
                    type="checkbox"
                    name="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer">
                  <div>
                    <p className="font-semibold">Yêu cầu xác thực email</p>
                    <p className="text-sm text-gray-400">Người dùng phải xác thực email trước khi đăng nhập</p>
                  </div>
                  <input
                    type="checkbox"
                    name="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </motion.div>

            {/* API Settings */}
            <motion.div
              id="api"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-5 h-5 text-cinema-400" />
                <h2 className="text-xl font-bold">API & Tích hợp</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      name="apiKey"
                      value={settings.apiKey}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Sử dụng cho các tích hợp bên ngoài</p>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-cinema-600 hover:bg-cinema-700"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
