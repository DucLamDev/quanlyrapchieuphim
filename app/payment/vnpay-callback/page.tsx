'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function VNPayCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing')
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    try {
      // Get all query parameters from VNPay callback
      const params: any = {}
      searchParams.forEach((value, key) => {
        params[key] = value
      })

      // Extract booking ID from vnp_TxnRef (format: bookingId_timestamp)
      const txnRef = params.vnp_TxnRef || ''
      const extractedBookingId = txnRef.split('_')[0] // Get booking ID before timestamp
      setBookingId(extractedBookingId)

      console.log('VNPay callback params:', params)
      console.log('Extracted booking ID:', extractedBookingId)

      // Verify payment with backend
      const response = await api.verifyVNPayCallback(params)

      console.log('Verify payment response:', response)

      if (response.success) {
        setStatus('success')
        setMessage('Thanh toán thành công! Vé của bạn đã được xác nhận.')
        
        toast({
          title: 'Thanh toán thành công',
          description: 'Vé của bạn đã được xác nhận'
        })

        // Redirect to booking details after 2 seconds
        setTimeout(() => {
          if (extractedBookingId) {
            router.push(`/payment/${extractedBookingId}`)
          } else {
            router.push('/profile/bookings')
          }
        }, 2000)
      } else {
        throw new Error(response.message || 'Thanh toán thất bại')
      }
    } catch (error: any) {
      console.error('Error verifying VNPay payment:', error)
      setStatus('failed')
      setMessage(error.response?.data?.message || error.message || 'Thanh toán thất bại. Vui lòng liên hệ hỗ trợ.')
      
      toast({
        title: 'Thanh toán thất bại',
        description: error.response?.data?.message || 'Đã có lỗi xảy ra',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-8 text-center"
        >
          {status === 'processing' ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Đang xác thực thanh toán</h1>
              <p className="text-gray-400">Vui lòng đợi trong giây lát...</p>
            </>
          ) : status === 'success' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-3 text-green-400">Thanh toán thành công!</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <p className="text-sm text-gray-400 mb-8">
                Bạn sẽ được chuyển đến trang chi tiết vé trong giây lát...
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => router.push(bookingId ? `/payment/${bookingId}` : '/profile')}
                  className="bg-cinema-600 hover:bg-cinema-700"
                >
                  Xem vé ngay
                </Button>
                <Button 
                  onClick={() => router.push('/profile')}
                  variant="outline"
                >
                  Xem vé của tôi
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold mb-3 text-red-400">Thanh toán thất bại</h1>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-8">
                <p className="text-sm text-yellow-300">
                  Nếu tiền đã bị trừ, vui lòng liên hệ hotline: <strong>1900 6868</strong> để được hỗ trợ
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => bookingId ? router.push(`/payment/${bookingId}`) : router.push('/movies')}
                  className="bg-cinema-600 hover:bg-cinema-700"
                >
                  Thử lại
                </Button>
                <Button 
                  onClick={() => router.push('/movies')}
                  variant="outline"
                >
                  Về trang chủ
                </Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Transaction Info */}
        {status !== 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gray-900 rounded-lg border border-gray-800 p-6"
          >
            <h3 className="font-bold mb-4">Thông tin giao dịch</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Mã giao dịch VNPay:</span>
                <span className="font-mono">{searchParams.get('vnp_TransactionNo') || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mã đặt vé:</span>
                <span className="font-mono">{searchParams.get('vnp_TxnRef') || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Số tiền:</span>
                <span className="font-semibold">
                  {searchParams.get('vnp_Amount') 
                    ? (parseInt(searchParams.get('vnp_Amount')!) / 100).toLocaleString('vi-VN') + ' VNĐ'
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ngân hàng:</span>
                <span>{searchParams.get('vnp_BankCode') || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Thời gian:</span>
                <span>
                  {searchParams.get('vnp_PayDate')
                    ? new Date(
                        searchParams.get('vnp_PayDate')!.replace(
                          /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                          '$1-$2-$3T$4:$5:$6'
                        )
                      ).toLocaleString('vi-VN')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
