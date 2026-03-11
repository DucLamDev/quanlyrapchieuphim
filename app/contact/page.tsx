'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Facebook, Instagram, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast({
      title: 'Gửi thành công!',
      description: 'Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
    })
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    setSending(false)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Hotline',
      value: '1900 6868',
      description: 'Hỗ trợ 24/7'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'support@cinema.com',
      description: 'Phản hồi trong 24h'
    },
    {
      icon: MapPin,
      title: 'Trụ sở chính',
      value: '123 Đường Lê Duẩn',
      description: 'Quận Hải Châu, TP. Đà Nẵng'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      value: '08:00 - 22:00',
      description: 'Tất cả các ngày trong tuần'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cinema-400 to-purple-500 bg-clip-text text-transparent">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-cinema-500" />
              <h2 className="text-2xl font-bold">Gửi Tin Nhắn</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500"
                    placeholder="0123456789"
                  />
                </div>
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
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cinema-500"
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="booking">Hỗ trợ đặt vé</option>
                  <option value="refund">Hoàn tiền / Hủy vé</option>
                  <option value="feedback">Góp ý / Phản hồi</option>
                  <option value="partnership">Hợp tác kinh doanh</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500 resize-none"
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-cinema-600 hover:bg-cinema-700 py-3 gap-2"
              >
                {sending ? (
                  'Đang gửi...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Gửi tin nhắn
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div
                  key={index}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 flex items-start gap-4 hover:border-cinema-500 transition-colors"
                >
                  <div className="w-12 h-12 bg-cinema-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-cinema-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                    <p className="text-white font-medium">{info.value}</p>
                    <p className="text-gray-400 text-sm">{info.description}</p>
                  </div>
                </div>
              )
            })}

            {/* Social Links */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold text-lg mb-4">Theo dõi chúng tôi</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center hover:bg-blue-600/30 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-500" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center hover:bg-pink-600/30 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-pink-500" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-colors"
                >
                  <Youtube className="w-6 h-6 text-red-500" />
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold text-lg mb-4">Bản đồ</h3>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Bản đồ vị trí rạp</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
