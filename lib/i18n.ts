import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'vi' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.movies': 'Phim',
    'nav.cinemas': 'Rạp',
    'nav.promotions': 'Ưu đãi',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.account': 'Tài khoản',
    'nav.myTickets': 'Vé của tôi',
    'nav.admin': 'Quản trị',
    'nav.staff': 'Quầy vé',
    'nav.logout': 'Đăng xuất',
    
    // Common
    'common.search': 'Tìm kiếm',
    'common.loading': 'Đang tải...',
    'common.error': 'Lỗi',
    'common.success': 'Thành công',
    'common.cancel': 'Hủy',
    'common.confirm': 'Xác nhận',
    'common.save': 'Lưu',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.view': 'Xem',
    'common.add': 'Thêm',
    
    // Booking
    'booking.selectSeats': 'Chọn ghế',
    'booking.selectCombos': 'Bắp nước',
    'booking.payment': 'Thanh toán',
    'booking.total': 'Tổng cộng',
    'booking.continue': 'Tiếp tục',
    'booking.back': 'Quay lại',
    
    // Footer
    'footer.contact': 'Liên Hệ',
    'footer.support': 'Hỗ Trợ',
    'footer.links': 'Liên Kết'
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.movies': 'Movies',
    'nav.cinemas': 'Cinemas',
    'nav.promotions': 'Promotions',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.account': 'Account',
    'nav.myTickets': 'My Tickets',
    'nav.admin': 'Admin',
    'nav.staff': 'Counter',
    'nav.logout': 'Logout',
    
    // Common
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.add': 'Add',
    
    // Booking
    'booking.selectSeats': 'Select Seats',
    'booking.selectCombos': 'Combos',
    'booking.payment': 'Payment',
    'booking.total': 'Total',
    'booking.continue': 'Continue',
    'booking.back': 'Back',
    
    // Footer
    'footer.contact': 'Contact',
    'footer.support': 'Support',
    'footer.links': 'Links'
  }
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'vi',
      setLanguage: (language: Language) => set({ language }),
      t: (key: string) => {
        const { language } = get()
        return translations[language][key as keyof typeof translations.vi] || key
      }
    }),
    {
      name: 'language-storage'
    }
  )
)
