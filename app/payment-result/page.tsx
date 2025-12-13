'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * Payment Result Redirect Page
 * This page receives VNPay callback and redirects to the proper handler
 */
export default function PaymentResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get all query parameters from VNPay
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })

    // Redirect to VNPay callback handler with all parameters
    const callbackUrl = `/payment/vnpay-callback?${params.toString()}`
    router.replace(callbackUrl)
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-6">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Đang xử lý thanh toán</h1>
        <p className="text-gray-400">Vui lòng đợi trong giây lát...</p>
      </div>
    </div>
  )
}
