'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Film, Users, Award, MapPin, Star, Heart, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const stats = [
    { icon: Film, value: '10+', label: 'Rạp chiếu phim' },
    { icon: Users, value: '500K+', label: 'Khách hàng' },
    { icon: Star, value: '1M+', label: 'Vé đã bán' },
    { icon: Award, value: '5+', label: 'Năm hoạt động' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Khách hàng là trọng tâm',
      description: 'Chúng tôi luôn đặt trải nghiệm khách hàng lên hàng đầu, mang đến dịch vụ tốt nhất.'
    },
    {
      icon: Target,
      title: 'Chất lượng hàng đầu',
      description: 'Hệ thống âm thanh, hình ảnh hiện đại nhất, mang đến trải nghiệm điện ảnh đỉnh cao.'
    },
    {
      icon: Zap,
      title: 'Công nghệ tiên tiến',
      description: 'Ứng dụng AI và công nghệ mới nhất để nâng cao trải nghiệm đặt vé và xem phim.'
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
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cinema-400 to-purple-500 bg-clip-text text-transparent">
            Về Chúng Tôi
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            CINEMA là hệ thống rạp chiếu phim hàng đầu Việt Nam, mang đến trải nghiệm 
            điện ảnh tuyệt vời với công nghệ hiện đại và dịch vụ chuyên nghiệp.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700 hover:border-cinema-500 transition-colors"
              >
                <Icon className="w-10 h-10 text-cinema-500 mx-auto mb-4" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 rounded-2xl p-8 md:p-12 mb-16 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Câu Chuyện Của Chúng Tôi</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed max-w-4xl mx-auto">
            <p>
              Được thành lập từ năm 2019, CINEMA bắt đầu với một rạp chiếu phim nhỏ tại Đà Nẵng 
              với ước mơ mang đến trải nghiệm điện ảnh chất lượng cao cho khán giả Việt Nam.
            </p>
            <p>
              Qua nhiều năm phát triển, chúng tôi đã mở rộng hệ thống lên hơn 10 rạp trên toàn quốc, 
              phục vụ hàng triệu lượt khách hàng mỗi năm. Với công nghệ IMAX, Dolby Atmos và 
              các phòng chiếu VIP, CINEMA cam kết mang đến những trải nghiệm điện ảnh đỉnh cao.
            </p>
            <p>
              Chúng tôi không ngừng đổi mới, ứng dụng công nghệ AI để cá nhân hóa trải nghiệm, 
              giúp khách hàng dễ dàng tìm kiếm phim, đặt vé và nhận những đề xuất phù hợp với sở thích.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Giá Trị Cốt Lõi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-cinema-500 transition-colors"
                >
                  <div className="w-14 h-14 bg-cinema-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-cinema-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Hệ Thống Rạp</h2>
          <p className="text-gray-400 mb-8">
            Chúng tôi có mặt tại các thành phố lớn trên toàn quốc
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Đà Nẵng', 'Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Cần Thơ', 'Nha Trang'].map((city) => (
              <div
                key={city}
                className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700"
              >
                <MapPin className="w-4 h-4 text-cinema-500" />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
