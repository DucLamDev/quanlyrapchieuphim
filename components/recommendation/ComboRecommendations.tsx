'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Zap, Star, Plus, Check } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'

interface ComboItem {
  name: string
  quantity: number
  size?: string
}

interface RecommendedCombo {
  _id: string
  name: string
  description: string
  items: ComboItem[]
  price: number
  originalPrice?: number
  image?: string
  category: string
  isPopular: boolean
  score: number
  reason: string
}

interface Props {
  seatCount?: number
  movieGenres?: string[]
  onSelectCombo?: (combo: RecommendedCombo, quantity: number) => void
  selectedCombos?: { comboId: string; quantity: number }[]
}

export function ComboRecommendations({ seatCount = 1, movieGenres = [], onSelectCombo, selectedCombos = [] }: Props) {
  const [combos, setCombos] = useState<RecommendedCombo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCombos()
  }, [seatCount, movieGenres.join(',')])

  const fetchCombos = async () => {
    try {
      setLoading(true)
      const hour = new Date().getHours()
      let timeSlot = 'afternoon'
      if (hour >= 17) timeSlot = 'evening'
      else if (hour < 12) timeSlot = 'morning'

      const res = await api.getComboRecommendations({ seatCount, movieGenres, timeSlot })
      setCombos(res.combos || [])
    } catch {
      setCombos([])
    } finally {
      setLoading(false)
    }
  }

  const getSelectedQty = (comboId: string) => {
    return selectedCombos.find(c => c.comboId === comboId)?.quantity || 0
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
  }

  if (loading) {
    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Combo Gợi Ý</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map(i => (
            <div key={i} className="h-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (combos.length === 0) return null

  const topCombos = combos.slice(0, 6)

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-md bg-orange-500/10">
          <ShoppingBag className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Combo Gợi Ý Cho Bạn</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Đề xuất dựa trên {seatCount} ghế & thể loại phim</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topCombos.map((combo, idx) => {
          const isSelected = getSelectedQty(combo._id) > 0
          const savings = combo.originalPrice && combo.originalPrice > combo.price
            ? Math.round((1 - combo.price / combo.originalPrice) * 100)
            : 0

          return (
            <motion.div
              key={combo._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative flex gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-orange-300 dark:hover:border-orange-700'
              }`}
              onClick={() => onSelectCombo?.(combo, isSelected ? 0 : 1)}
            >
              {idx === 0 && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold shadow-sm">
                  <Zap className="w-3 h-3" />
                  Đề xuất #1
                </div>
              )}

              {combo.image && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={combo.image} alt={combo.name} fill className="object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{combo.name}</h4>
                  {isSelected ? (
                    <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>

                {combo.items?.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {combo.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{formatPrice(combo.price)}</span>
                  {combo.originalPrice && combo.originalPrice > combo.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(combo.originalPrice)}</span>
                  )}
                  {savings > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                      -{savings}%
                    </span>
                  )}
                </div>

                {combo.reason && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-orange-400" />
                    {combo.reason}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
