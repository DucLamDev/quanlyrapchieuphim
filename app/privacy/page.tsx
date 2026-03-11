'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Shield, Eye, Lock, Server, UserCheck, Bell, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: '1. Thông tin chúng tôi thu thập',
      content: [
        'Thông tin cá nhân: Họ tên, email, số điện thoại, ngày sinh khi bạn đăng ký tài khoản.',
        'Thông tin giao dịch: Lịch sử đặt vé, phương thức thanh toán, các giao dịch.',
        'Thông tin thiết bị: Loại thiết bị, hệ điều hành, địa chỉ IP, trình duyệt web.',
        'Thông tin sử dụng: Các trang bạn truy cập, thời gian sử dụng, tương tác với hệ thống.',
        'Dữ liệu vị trí: Vị trí địa lý (nếu bạn cho phép) để đề xuất rạp gần nhất.'
      ]
    },
    {
      icon: Server,
      title: '2. Mục đích sử dụng thông tin',
      content: [
        'Cung cấp và cải thiện dịch vụ đặt vé xem phim.',
        'Xử lý thanh toán và giao dịch một cách an toàn.',
        'Gửi thông tin về vé đã đặt, xác nhận giao dịch qua email/SMS.',
        'Cá nhân hóa trải nghiệm: đề xuất phim, suất chiếu phù hợp với sở thích.',
        'Gửi thông tin khuyến mãi, ưu đãi (nếu bạn đồng ý nhận).',
        'Phân tích và cải thiện chất lượng dịch vụ.',
        'Đảm bảo an ninh và phát hiện gian lận.'
      ]
    },
    {
      icon: Lock,
      title: '3. Bảo mật thông tin',
      content: [
        'Chúng tôi sử dụng mã hóa SSL/TLS cho tất cả các giao dịch.',
        'Mật khẩu được mã hóa một chiều (hash) và không thể phục hồi.',
        'Dữ liệu được lưu trữ trên các máy chủ bảo mật với tường lửa và giám sát 24/7.',
        'Nhân viên chỉ truy cập dữ liệu khi cần thiết và được đào tạo về bảo mật.',
        'Chúng tôi thường xuyên kiểm tra và cập nhật các biện pháp bảo mật.',
        'Không lưu trữ thông tin thẻ thanh toán trên hệ thống.'
      ]
    },
    {
      icon: UserCheck,
      title: '4. Chia sẻ thông tin',
      content: [
        'Chúng tôi KHÔNG bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn.',
        'Thông tin có thể được chia sẻ với đối tác thanh toán để xử lý giao dịch.',
        'Có thể chia sẻ với cơ quan chức năng khi có yêu cầu pháp lý.',
        'Dữ liệu ẩn danh có thể được sử dụng cho mục đích nghiên cứu và thống kê.',
        'Các nhà cung cấp dịch vụ bên thứ ba (email, SMS) cam kết bảo mật thông tin.'
      ]
    },
    {
      icon: Bell,
      title: '5. Quyền của người dùng',
      content: [
        'Truy cập: Bạn có quyền xem và yêu cầu bản sao thông tin cá nhân của mình.',
        'Chỉnh sửa: Cập nhật thông tin cá nhân bất cứ lúc nào qua trang tài khoản.',
        'Xóa: Yêu cầu xóa tài khoản và dữ liệu cá nhân.',
        'Từ chối: Hủy đăng ký nhận email marketing bất cứ lúc nào.',
        'Khiếu nại: Liên hệ chúng tôi nếu có lo ngại về cách xử lý dữ liệu.'
      ]
    },
    {
      icon: Shield,
      title: '6. Cookie và công nghệ theo dõi',
      content: [
        'Cookie cần thiết: Đảm bảo website hoạt động đúng, ghi nhớ đăng nhập.',
        'Cookie phân tích: Giúp hiểu cách người dùng tương tác với website.',
        'Cookie quảng cáo: Hiển thị quảng cáo phù hợp (nếu có).',
        'Bạn có thể quản lý cookie qua cài đặt trình duyệt.',
        'Việc tắt một số cookie có thể ảnh hưởng đến trải nghiệm sử dụng.'
      ]
    }
  ]

  const additionalInfo = [
    {
      title: 'Thời gian lưu trữ',
      content: 'Chúng tôi lưu trữ thông tin trong thời gian cần thiết để cung cấp dịch vụ hoặc theo yêu cầu pháp luật. Sau khi xóa tài khoản, dữ liệu sẽ được xóa trong vòng 30 ngày.'
    },
    {
      title: 'Trẻ em',
      content: 'Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin từ trẻ em dưới độ tuổi này.'
    },
    {
      title: 'Thay đổi chính sách',
      content: 'Chúng tôi có thể cập nhật chính sách này theo thời gian. Các thay đổi quan trọng sẽ được thông báo qua email hoặc trên website.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-cinema-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-cinema-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Chính Sách Bảo Mật</h1>
          <p className="text-gray-400">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-700"
        >
          <p className="text-gray-300 leading-relaxed">
            CINEMA cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích 
            cách chúng tôi thu thập, sử dụng, bảo vệ và chia sẻ thông tin cá nhân của bạn 
            khi sử dụng dịch vụ của chúng tôi.
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-700"
        >
          <h2 className="font-semibold mb-4">Mục lục</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#privacy-section-${index}`}
                className="flex items-center gap-2 text-gray-400 hover:text-cinema-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>{section.title}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={index}
                id={`privacy-section-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cinema-500/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cinema-500" />
                  </div>
                  <h2 className="text-xl font-bold text-cinema-400">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-3 text-gray-300">
                      <span className="text-cinema-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          {additionalInfo.map((info, index) => (
            <div
              key={index}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="font-semibold mb-2 text-white">{info.title}</h3>
              <p className="text-gray-400">{info.content}</p>
            </div>
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-cinema-500/10 rounded-xl p-6 border border-cinema-500/30 text-center"
        >
          <h3 className="font-semibold mb-2">Liên hệ về quyền riêng tư</h3>
          <p className="text-gray-400 mb-4">
            Nếu bạn có câu hỏi hoặc lo ngại về chính sách bảo mật, vui lòng liên hệ:
          </p>
          <p className="text-cinema-400">
            Email: privacy@cinema.com | Hotline: 1900 6868
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
