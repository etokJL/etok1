'use client'

import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ShopCardProps {
  title: string
  description: string
  price: bigint
  formatPrice: (amount: bigint) => string
  canAfford: boolean
  isProcessing: boolean
  onPurchase: () => void
  icon: React.ReactNode
  features: string[]
  extraContent?: React.ReactNode
}

export function ShopCard({
  title,
  description,
  price,
  formatPrice,
  canAfford,
  isProcessing,
  onPurchase,
  icon,
  features,
  extraContent
}: ShopCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="text-3xl font-bold text-blue-600">
          {formatPrice(price)} USDT
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {extraContent && (
        <div className="mb-6">
          {extraContent}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPurchase}
        disabled={!canAfford || isProcessing}
        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-colors ${
          canAfford && !isProcessing
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : !canAfford ? (
          'Insufficient USDT'
        ) : (
          `Purchase for ${formatPrice(price)} USDT`
        )}
      </motion.button>
    </motion.div>
  )
}

