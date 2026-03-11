'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HelpCircle, ChevronDown, Search, Ticket, CreditCard, User, Gift, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  icon: any
  title: string
  items: FAQItem[]
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const categories: FAQCategory[] = [
    {
      icon: Ticket,
      title: 'Đặt vé',
      items: [
        {
          question: 'Làm thế nào để đặt vé xem phim?',
          answer: 'Bạn có thể đặt vé trực tuyến qua website hoặc ứng dụng CINEMA. Chọn phim, suất chiếu, ghế ngồi và thanh toán. Vé sẽ được gửi qua email ngay sau khi thanh toán thành công.'
        },
        {
          question: 'Tôi có thể đặt vé trước bao lâu?',
          answer: 'Bạn có thể đặt vé trước tối đa 7 ngày so với ngày chiếu. Lịch chiếu thường được cập nhật hàng tuần.'
        },
        {
          question: 'Tôi cần mang gì khi đến rạp?',
          answer: 'Bạn chỉ cần mang theo mã QR hoặc mã đặt vé được gửi qua email. Nhân viên sẽ quét mã để xác nhận vé của bạn.'
        },
        {
          question: 'Tôi có thể đặt vé cho nhóm không?',
          answer: 'Có, bạn có thể đặt vé cho nhóm (từ 10 người trở lên) với ưu đãi đặc biệt. Vui lòng liên hệ hotline 1900 6868 để được hỗ trợ.'
        },
        {
          question: 'Vé đã đặt có thể đổi hoặc hủy không?',
          answer: 'Vé đã mua không thể hoàn lại hoặc đổi sang suất chiếu khác. Tuy nhiên, nếu có lỗi hệ thống hoặc suất chiếu bị hủy, bạn sẽ được hoàn tiền.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: 'Thanh toán',
      items: [
        {
          question: 'Những phương thức thanh toán nào được chấp nhận?',
          answer: 'Chúng tôi chấp nhận thanh toán qua: Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), ví điện tử (MoMo, ZaloPay, VNPay), chuyển khoản ngân hàng, và thanh toán tại quầy.'
        },
        {
          question: 'Thanh toán có an toàn không?',
          answer: 'Tất cả giao dịch được mã hóa SSL và xử lý qua các cổng thanh toán uy tín. Chúng tôi không lưu trữ thông tin thẻ của bạn.'
        },
        {
          question: 'Tôi không nhận được email xác nhận sau khi thanh toán?',
          answer: 'Vui lòng kiểm tra thư mục spam/junk. Nếu vẫn không thấy, liên hệ hotline 1900 6868 với mã giao dịch để được hỗ trợ.'
        },
        {
          question: 'Làm sao để yêu cầu hoàn tiền?',
          answer: 'Trong trường hợp được hoàn tiền (lỗi hệ thống, suất chiếu bị hủy), tiền sẽ được hoàn về phương thức thanh toán ban đầu trong 7-14 ngày làm việc.'
        }
      ]
    },
    {
      icon: User,
      title: 'Tài khoản',
      items: [
        {
          question: 'Làm sao để tạo tài khoản?',
          answer: 'Click vào nút "Đăng ký" ở góc phải trên cùng, điền thông tin cá nhân và xác nhận email. Bạn cũng có thể đăng ký nhanh qua Google hoặc Facebook.'
        },
        {
          question: 'Tôi quên mật khẩu, phải làm sao?',
          answer: 'Click vào "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký. Link đặt lại mật khẩu sẽ được gửi đến email của bạn.'
        },
        {
          question: 'Làm sao để cập nhật thông tin cá nhân?',
          answer: 'Đăng nhập vào tài khoản, vào phần "Thông tin cá nhân" để cập nhật họ tên, số điện thoại, ngày sinh và ảnh đại diện.'
        },
        {
          question: 'Tôi muốn xóa tài khoản?',
          answer: 'Liên hệ support@cinema.com với tiêu đề "Yêu cầu xóa tài khoản" kèm email đã đăng ký. Tài khoản sẽ được xóa trong 30 ngày.'
        }
      ]
    },
    {
      icon: Gift,
      title: 'Thành viên & Ưu đãi',
      items: [
        {
          question: 'Chương trình thành viên hoạt động như thế nào?',
          answer: 'Mỗi giao dịch đặt vé sẽ tích điểm thưởng (10.000đ = 1 điểm). Điểm có thể đổi thành vé miễn phí hoặc ưu đãi khác. Hạng thành viên (Bronze, Silver, Gold, Platinum) dựa trên tổng chi tiêu trong năm.'
        },
        {
          question: 'Điểm thưởng có thời hạn không?',
          answer: 'Điểm thưởng có hiệu lực 12 tháng kể từ ngày giao dịch. Hãy sử dụng điểm trước khi hết hạn!'
        },
        {
          question: 'Làm sao để sử dụng mã khuyến mãi?',
          answer: 'Nhập mã khuyến mãi ở bước thanh toán. Mỗi mã có điều kiện áp dụng riêng (đơn tối thiểu, thời hạn, phim áp dụng).'
        },
        {
          question: 'Thành viên Platinum có quyền lợi gì?',
          answer: 'Giảm 15% tất cả vé, ưu tiên chọn ghế, vé sinh nhật miễn phí, phòng chờ VIP, đổi điểm với tỷ lệ ưu đãi, mời tham gia sự kiện đặc biệt.'
        }
      ]
    },
    {
      icon: Clock,
      title: 'Tại rạp',
      items: [
        {
          question: 'Tôi cần đến rạp trước bao lâu?',
          answer: 'Chúng tôi khuyến nghị đến trước 15-20 phút để check-in, mua đồ ăn nhẹ và tìm ghế. Cửa phòng chiếu sẽ đóng khi phim bắt đầu.'
        },
        {
          question: 'Rạp có bán đồ ăn không?',
          answer: 'Có, quầy snack của chúng tôi phục vụ bắp rang, nước ngọt, nachos, hot dog và nhiều món khác. Combo tiết kiệm hơn mua lẻ!'
        },
        {
          question: 'Có được mang đồ ăn từ ngoài vào không?',
          answer: 'Không, vì lý do vệ sinh và an toàn. Tuy nhiên, nước suối đóng chai nhỏ được phép.'
        },
        {
          question: 'Rạp có chỗ đỗ xe không?',
          answer: 'Hầu hết các rạp có bãi đỗ xe máy và ô tô. Một số rạp trong TTTM được miễn phí parking khi mua vé. Chi tiết xem tại trang thông tin từng rạp.'
        },
        {
          question: 'Phim có phụ đề không?',
          answer: 'Phim nước ngoài đều có phụ đề tiếng Việt. Một số phim có thêm phiên bản lồng tiếng (đặc biệt phim hoạt hình).'
        }
      ]
    }
  ]

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

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
            <HelpCircle className="w-8 h-8 text-cinema-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Câu Hỏi Thường Gặp</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tìm câu trả lời nhanh cho các thắc mắc của bạn. Nếu không tìm thấy, 
            đừng ngần ngại liên hệ với chúng tôi!
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-12 pr-4 py-4 bg-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cinema-500"
          />
        </motion.div>

        {/* Category Tabs */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === null
                  ? 'bg-cinema-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category.title)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeCategory === category.title
                      ? 'bg-cinema-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.title}
                </button>
              )
            })}
          </motion.div>
        )}

        {/* FAQ Content */}
        <div className="space-y-6">
          {(searchQuery ? filteredCategories : categories)
            .filter(category => !activeCategory || category.title === activeCategory)
            .map((category, categoryIndex) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + categoryIndex * 0.05 }}
                  className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 border-b border-gray-700">
                    <Icon className="w-5 h-5 text-cinema-500" />
                    <h2 className="font-semibold text-lg">{category.title}</h2>
                    <span className="text-sm text-gray-500">({category.items.length})</span>
                  </div>

                  <div className="divide-y divide-gray-700">
                    {category.items.map((item, itemIndex) => {
                      const isOpen = openItems[`${categoryIndex}-${itemIndex}`]
                      return (
                        <div key={itemIndex}>
                          <button
                            onClick={() => toggleItem(categoryIndex, itemIndex)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/30 transition-colors"
                          >
                            <span className="font-medium pr-4">{item.question}</span>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-gray-400 leading-relaxed">
                                  {item.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
        </div>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Không tìm thấy câu hỏi phù hợp</p>
            <p className="text-sm text-gray-500 mt-2">
              Thử từ khóa khác hoặc liên hệ hotline 1900 6868
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-cinema-500/10 rounded-xl p-8 border border-cinema-500/30 text-center"
        >
          <h3 className="text-xl font-semibold mb-2">Vẫn cần hỗ trợ?</h3>
          <p className="text-gray-400 mb-4">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="px-6 py-2 bg-cinema-600 hover:bg-cinema-700 rounded-lg transition-colors"
            >
              Liên hệ ngay
            </a>
            <a
              href="tel:19006868"
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Gọi 1900 6868
            </a>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
