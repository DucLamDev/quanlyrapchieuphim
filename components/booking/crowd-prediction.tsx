'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, Calendar, Info, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { getCrowdLevelColor, getCrowdLevelText } from '@/lib/utils'

interface CrowdPredictionProps {
  showtimeId: string
}

export function CrowdPrediction({ showtimeId }: CrowdPredictionProps) {
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrediction()
  }, [showtimeId])

  const fetchPrediction = async () => {
    try {
      setLoading(true)
      const response = await api.predictShowtimeCrowd(showtimeId)
      const payload = response?.prediction || null

      if (!payload) {
        setPrediction(null)
        return
      }

      setPrediction({
        occupancyLevel:
          payload.occupancyLevel ||
          (payload.predictedOccupancy < 40 ? 'low' : payload.predictedOccupancy < 70 ? 'medium' : 'high'),
        occupancyPercentage: payload.occupancyPercentage ?? payload.predictedOccupancy ?? 0,
        prediction: payload.prediction || {
          confidence: Math.round((payload.confidence || 0) * 100),
          reasoning: Array.isArray(payload.reasons) ? payload.reasons.join(' • ') : '',
          recommendation: ''
        },
        factors: Array.isArray(payload.factors) ? payload.factors : [],
        reasons: Array.isArray(payload.reasons) ? payload.reasons : []
      })
    } catch (error) {
      console.error('Error fetching crowd prediction:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
      </div>
    )
  }

  if (!prediction) return null

  const { occupancyLevel, occupancyPercentage, prediction: predictionData, factors = [], reasons = [] } = prediction
  const summaryText = predictionData?.reasoning || (reasons.length > 0 ? reasons.join(' • ') : 'Đang phân tích xu hướng đặt vé của suất chiếu này')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Dự Đoán Độ Đông AI</h3>
          <p className="text-sm text-gray-400">Phân tích thông minh dựa trên nhiều yếu tố</p>
        </div>
      </div>

      {/* Main Prediction */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400">Mức độ đông:</span>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getCrowdLevelColor(occupancyLevel)}`}>
            {getCrowdLevelText(occupancyLevel).toUpperCase()}
          </span>
        </div>

        <p className="text-sm text-gray-300 mb-3">
          <span className="font-semibold text-cinema-400">Phân tích nhanh: </span>
          {summaryText}
        </p>

        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${occupancyPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              occupancyLevel === 'low'
                ? 'bg-gradient-to-r from-green-600 to-green-400'
                : occupancyLevel === 'medium'
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                : 'bg-gradient-to-r from-red-600 to-red-400'
            }`}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {Math.max(0, Math.min(100, occupancyPercentage))}% dự kiến lấp đầy
          </span>
        </div>
      </div>

      {/* Prediction Confidence */}
      {predictionData?.confidence && (
        <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Độ tin cậy AI</span>
          </div>
          <p className="text-sm text-gray-300">{predictionData.confidence}% - {predictionData.reasoning}</p>
        </div>
      )}

      {/* Factors */}
      {factors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Các yếu tố ảnh hưởng:
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {factors.map((item: any, index: number) => (
              <div key={`${item.factor}-${index}`} className="flex items-center gap-2 p-2 bg-gray-800/60 rounded border border-gray-700">
                {String(item.factor).toLowerCase().includes('giờ') ? (
                  <Clock className="w-4 h-4 text-yellow-400" />
                ) : String(item.factor).toLowerCase().includes('cuối tuần') ? (
                  <Calendar className="w-4 h-4 text-purple-400" />
                ) : String(item.factor).toLowerCase().includes('phim') ? (
                  <Users className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                )}
                <span className="text-xs text-gray-300">
                  {item.factor} {typeof item.impact === 'number' ? (item.impact > 0 ? `(+${item.impact})` : `(${item.impact})`) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reasons.length > 0 && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-cinema-400">Phân tích: </span>
            {reasons.join(' • ')}
          </p>
        </div>
      )}

      {/* Recommendations */}
      {predictionData?.recommendation && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-cinema-400">💡 Gợi ý: </span>
            {predictionData.recommendation}
          </p>
        </div>
      )}
    </motion.div>
  )
}
