'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Plus, User, Film, Calendar, Clock, MapPin, Printer, CheckCircle, XCircle, ArrowLeft, Popcorn } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import { SeatSelector } from '@/components/booking/seat-selector'
import { ComboSelector } from '@/components/booking/combo-selector'

export default function CounterBookingPageV2() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customer, setCustomer] = useState<any>(null)
  const [isWalkInCustomer, setIsWalkInCustomer] = useState(false)
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [showtimes, setShowtimes] = useState([])
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<any[]>([])
  const [selectedCombos, setSelectedCombos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'staff') {
      router.push('/')
      return
    }
    fetchMovies()
  }, [isAuthenticated, user])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      // Backend tự động lọc suất chiếu theo rạp của nhân viên
      const showtimeRes = await api.getShowtimes()
      
      // Extract unique movies from showtimes
      const uniqueMovies = new Map()
      showtimeRes.showtimes?.forEach((st: any) => {
        const movie = st.movieId
        if (movie && !uniqueMovies.has(movie._id)) {
          uniqueMovies.set(movie._id, movie)
        }
      })
      
      setMovies(Array.from(uniqueMovies.values()))
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách phim',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneInput = async () => {
    if (!customerPhone || customerPhone.length < 10) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập số điện thoại hợp lệ',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const response = await api.searchUser({ phone: customerPhone })
      if (response.user) {
        setCustomer(response.user)
        setIsWalkInCustomer(false)
        setStep(2)
        toast({
          title: 'Thành công',
          description: `Tìm thấy khách hàng: ${response.user.fullName}`
        })
      } else {
        // Khách vãng lai
        setIsWalkInCustomer(true)
        setStep(2)
        toast({
          title: 'Khách vãng lai',
          description: 'Khách hàng chưa có tài khoản. Tiếp tục đặt vé.'
        })
      }
    } catch (error: any) {
      // Nếu không tìm thấy, cũng cho phép tiếp tục như khách vãng lai
      setIsWalkInCustomer(true)
      setStep(2)
      toast({
        title: 'Khách vãng lai',
        description: 'Tiếp tục đặt vé cho khách vãng lai'
      })
    } finally {
      setLoading(false)
    }
  }

  const selectMovie = async (movie: any) => {
    setSelectedMovie(movie)
    setLoading(true)
    try {
      // Backend tự động lọc suất chiếu theo rạp của nhân viên
      const response = await api.getShowtimes({ movieId: movie._id })
      const showtimes = response.showtimes || []
      
      if (showtimes.length === 0) {
        toast({
          title: 'Thông báo',
          description: 'Không có suất chiếu nào tại rạp của bạn',
          variant: 'destructive'
        })
        return
      }
      
      setShowtimes(showtimes)
      setStep(3)
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải suất chiếu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const selectShowtime = async (showtime: any) => {
    setSelectedShowtime(showtime)
    setStep(4)
  }

  const handleSeatSelect = (seat: any) => {
    const isSelected = selectedSeats.some(s => s.row === seat.row && s.number === seat.number)
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => !(s.row === seat.row && s.number === seat.number)))
    } else {
      if (selectedSeats.length >= 10) {
        toast({
          title: 'Giới hạn ghế',
          description: 'Chỉ có thể chọn tối đa 10 ghế',
          variant: 'destructive'
        })
        return
      }
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const handleComboChange = (combo: any, quantity: number) => {
    if (quantity === 0) {
      setSelectedCombos(selectedCombos.filter(c => c._id !== combo._id && c.comboId !== combo._id))
    } else {
      const existingIndex = selectedCombos.findIndex(c => c._id === combo._id || c.comboId === combo._id)
      if (existingIndex >= 0) {
        const updated = [...selectedCombos]
        updated[existingIndex] = { ...combo, comboId: combo._id, quantity }
        setSelectedCombos(updated)
      } else {
        setSelectedCombos([...selectedCombos, { ...combo, comboId: combo._id, quantity }])
      }
    }
  }

  const calculateTotal = () => {
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    const combosTotal = selectedCombos.reduce((sum, combo) => sum + (combo.price * combo.quantity), 0)
    return seatsTotal + combosTotal
  }

  const completeBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ít nhất một ghế',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const bookingData = {
        showtimeId: selectedShowtime._id,
        seats: selectedSeats.map(s => ({
          row: s.row,
          number: s.number,
          type: s.type,
          price: s.price
        })),
        combos: selectedCombos.map(c => ({
          comboId: c.comboId || c._id,
          name: c.name,
          quantity: c.quantity,
          price: c.price
        })),
        bookingType: 'counter',
        customerPhone,
        customerName: isWalkInCustomer ? customerName || 'Khách vãng lai' : undefined
      }

      const response = await api.createBooking(bookingData)
      
      toast({
        title: 'Đặt vé thành công',
        description: 'Chuyển đến trang thanh toán...'
      })
      
      // Redirect to payment page like customer flow
      router.push(`/payment/${response.booking._id}`)
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể tạo booking',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetBooking = () => {
    setStep(1)
    setCustomerPhone('')
    setCustomerName('')
    setCustomer(null)
    setIsWalkInCustomer(false)
    setSelectedMovie(null)
    setSelectedShowtime(null)
    setSelectedSeats([])
    setSelectedCombos([])
    fetchMovies()
  }

  const handleNextStep = () => {
    if (step === 4 && selectedSeats.length === 0) {
      toast({
        title: 'Chưa chọn ghế',
        description: 'Vui lòng chọn ít nhất 1 ghế',
        variant: 'destructive'
      })
      return
    }
    
    if (step < 6) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cinema-600 to-purple-600 bg-clip-text text-transparent">
                Đặt vé tại quầy
              </h1>
              <p className="text-gray-400 mt-2">Hỗ trợ khách hàng đặt vé trực tiếp</p>
            </div>
            {(user as any)?.cinemaId && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-6 py-3">
                <p className="text-sm text-gray-400">Rạp làm việc</p>
                <p className="text-lg font-bold text-cinema-400">{(user as any).cinemaId.name}</p>
                <p className="text-xs text-gray-500">{(user as any).cinemaId.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Nhập SĐT' },
              { num: 2, label: 'Chọn phim' },
              { num: 3, label: 'Chọn suất' },
              { num: 4, label: 'Chọn ghế' },
              { num: 5, label: 'Thanh toán' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step >= s.num 
                    ? 'bg-cinema-600 border-cinema-600 text-white' 
                    : 'border-gray-700 text-gray-500 bg-gray-800'
                }`}>
                  {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  step >= s.num ? 'text-cinema-400' : 'text-gray-600'
                }`}>
                  {s.label}
                </div>
                {idx < 4 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step > s.num ? 'bg-cinema-600' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6">
          {/* Step 1: Customer Phone */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <User className="w-6 h-6 text-cinema-400" />
                Nhập số điện thoại khách hàng
              </h2>
              <p className="text-gray-400 text-sm">Nhập SĐT để tìm kiếm khách hàng hoặc đặt vé cho khách vãng lai</p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Số điện thoại *
                  </label>
                  <Input
                    placeholder="0xxx xxx xxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePhoneInput()}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
                
                <Button 
                  onClick={handlePhoneInput} 
                  disabled={loading}
                  className="w-full bg-cinema-600 hover:bg-cinema-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Movie */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Film className="w-6 h-6 text-cinema-400" />
                  Chọn phim
                </h2>
                <div className="text-sm text-gray-400">
                  {isWalkInCustomer ? (
                    <span>Khách vãng lai: {customerPhone}</span>
                  ) : (
                    <span>KH: <span className="font-semibold text-white">{customer?.fullName}</span> - {customer?.phone}</span>
                  )}
                </div>
              </div>
              
              {isWalkInCustomer && (
                <div className="mb-4 max-w-md">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên khách hàng (tùy chọn)
                  </label>
                  <Input
                    placeholder="Nhập tên khách hàng"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  />
                </div>
              )}
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="spinner" />
                </div>
              ) : movies.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Không có phim nào đang chiếu tại rạp của bạn</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movies.map((movie: any) => (
                  <motion.div
                    key={movie._id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-cinema-600 hover:shadow-lg transition-all bg-gray-800/50"
                    onClick={() => selectMovie(movie)}
                  >
                    <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover" />
                    <div className="p-3">
                      <h3 className="font-semibold text-white text-sm">{movie.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{movie.duration} phút</p>
                    </div>
                  </motion.div>
                ))}
                </div>
              )}
              
              <Button onClick={() => setStep(1)} variant="outline" className="border-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          )}

          {/* Step 3: Select Showtime */}
          {step === 3 && selectedMovie && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Calendar className="w-6 h-6 text-cinema-400" />
                Chọn suất chiếu - {selectedMovie.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showtimes
                  .map((showtime: any) => (
                  <motion.div
                    key={showtime._id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-800 rounded-lg p-4 cursor-pointer hover:border-cinema-600 bg-gray-800/50"
                    onClick={() => selectShowtime(showtime)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cinema-400" />
                        <span className="font-bold text-lg text-white">
                          {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {showtime.availableSeats} ghế trống
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Phòng: {showtime.room?.name || 'N/A'}</div>
                      <div>{new Date(showtime.startTime).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button onClick={() => setStep(2)} variant="outline" className="border-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </div>
          )}

          {/* Step 4: Select Seats */}
          {step === 4 && selectedShowtime && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Chọn ghế ngồi</h2>
              
              <SeatSelector 
                showtime={selectedShowtime}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
              
              {/* Summary */}
              {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Ghế đã chọn:</span>
                    <span className="font-bold text-white">
                      {selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tiền ghế:</span>
                    <span className="font-bold text-xl text-cinema-400">
                      {formatCurrency(selectedSeats.reduce((sum, s) => sum + s.price, 0))}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <Button onClick={handlePrevStep} variant="outline" className="border-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  disabled={selectedSeats.length === 0}
                  className="flex-1 bg-cinema-600 hover:bg-cinema-700"
                >
                  Tiếp tục
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Select Combos */}
          {step === 5 && (
            <div className="space-y-4">
              <ComboSelector 
                selectedCombos={selectedCombos}
                onComboChange={handleComboChange}
              />
              
              <div className="flex gap-4">
                <Button onClick={handlePrevStep} variant="outline" className="border-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <Button 
                  onClick={completeBooking} 
                  disabled={loading}
                  className="flex-1 bg-cinema-600 hover:bg-cinema-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tiếp tục thanh toán - {formatCurrency(calculateTotal())}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
