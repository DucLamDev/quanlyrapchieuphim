'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { FileText, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsPage() {
  const sections = [
    {
      title: '1. Điều khoản chung',
      content: [
        'Bằng việc sử dụng dịch vụ của CINEMA, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định trong tài liệu này.',
        'CINEMA có quyền thay đổi, điều chỉnh các điều khoản sử dụng mà không cần thông báo trước. Người dùng có trách nhiệm theo dõi các cập nhật.',
        'Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.'
      ]
    },
    {
      title: '2. Đăng ký và tài khoản',
      content: [
        'Bạn phải cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản.',
        'Mỗi cá nhân chỉ được đăng ký một tài khoản duy nhất.',
        'Bạn có trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.',
        'CINEMA không chịu trách nhiệm cho các thiệt hại phát sinh do việc tài khoản bị truy cập trái phép.',
        'Chúng tôi có quyền khóa hoặc xóa tài khoản nếu phát hiện hành vi vi phạm điều khoản.'
      ]
    },
    {
      title: '3. Đặt vé và thanh toán',
      content: [
        'Vé xem phim sau khi mua sẽ không được hoàn lại hoặc đổi sang suất chiếu khác, trừ trường hợp có lỗi từ hệ thống.',
        'Giá vé có thể thay đổi tùy theo suất chiếu, loại ghế và các chương trình khuyến mãi.',
        'Thanh toán được thực hiện qua các phương thức: thẻ ngân hàng, ví điện tử, hoặc thanh toán tại quầy.',
        'Vé điện tử sẽ được gửi qua email sau khi thanh toán thành công.',
        'Khách hàng cần xuất trình vé (mã QR hoặc mã đặt vé) khi vào rạp.'
      ]
    },
    {
      title: '4. Quy định tại rạp',
      content: [
        'Khách hàng cần có mặt tại rạp ít nhất 15 phút trước giờ chiếu.',
        'Không được mang thức ăn, đồ uống từ bên ngoài vào phòng chiếu.',
        'Không sử dụng điện thoại hoặc thiết bị phát sáng trong suốt thời gian chiếu phim.',
        'Trẻ em dưới 13 tuổi cần có người lớn đi kèm đối với các phim có giới hạn độ tuổi.',
        'Không quay phim, chụp ảnh trong phòng chiếu.'
      ]
    },
    {
      title: '5. Chương trình thành viên',
      content: [
        'Điểm thưởng được tích lũy dựa trên giá trị giao dịch, không áp dụng cho các chương trình khuyến mãi đặc biệt.',
        'Điểm thưởng có giá trị trong 12 tháng kể từ ngày giao dịch.',
        'Hạng thành viên được xét duyệt dựa trên tổng chi tiêu trong năm.',
        'CINEMA có quyền điều chỉnh chính sách tích điểm và quyền lợi thành viên.'
      ]
    },
    {
      title: '6. Hoàn tiền và hủy vé',
      content: [
        'Vé đã mua không được hoàn lại trong mọi trường hợp, trừ khi suất chiếu bị hủy bởi rạp.',
        'Trong trường hợp lỗi kỹ thuật, khách hàng có thể liên hệ hotline để được hỗ trợ.',
        'Hoàn tiền sẽ được thực hiện trong vòng 7-14 ngày làm việc.'
      ]
    },
    {
      title: '7. Giới hạn trách nhiệm',
      content: [
        'CINEMA không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ.',
        'Chúng tôi có quyền từ chối phục vụ khách hàng vi phạm quy định của rạp.',
        'Nội dung phim thuộc quyền sở hữu của nhà sản xuất và phát hành.'
      ]
    },
    {
      title: '8. Liên hệ',
      content: [
        'Mọi thắc mắc hoặc khiếu nại, vui lòng liên hệ: Hotline 1900 6868 hoặc email support@cinema.com.',
        'Thời gian xử lý khiếu nại: 3-5 ngày làm việc.',
        'Địa chỉ: 123 Đường Lê Duẩn, Quận Hải Châu, TP. Đà Nẵng.'
      ]
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
            <FileText className="w-8 h-8 text-cinema-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Điều Khoản Sử Dụng</h1>
          <p className="text-gray-400">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-700"
        >
          <h2 className="font-semibold mb-4">Mục lục</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
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
          {sections.map((section, index) => (
            <motion.div
              key={index}
              id={`section-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold mb-4 text-cinema-400">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 text-gray-300">
                    <span className="text-cinema-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>
            Bằng việc sử dụng dịch vụ của CINEMA, bạn xác nhận đã đọc, hiểu và đồng ý 
            với tất cả các điều khoản trên.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
