'use client'

import { motion } from 'framer-motion'
import { CurrencyDollarIcon, GiftIcon } from '@heroicons/react/24/outline'

interface USDTBalanceProps {
  balance: bigint
  formatUSDT: (amount: bigint) => string
  onGetFaucet: () => void
  isProcessing: boolean
}

export function USDTBalance({ balance, formatUSDT, onGetFaucet, isProcessing }: USDTBalanceProps) {
  const needsFaucet = balance < BigInt(10) * BigInt(10)**BigInt(6) // Less than 10 USDT

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 mr-3" />
          <div>
            <h3 className="text-lg font-semibold">USDT Balance</h3>
            <p className="text-green-100">Your spending power</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{formatUSDT(balance)}</div>
          <div className="text-green-100">USDT</div>
        </div>
      </div>

      {needsFaucet && process.env.NODE_ENV === 'development' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center mb-2">
            <GiftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Need USDT? (DEV Only)</span>
          </div>
          <p className="text-sm text-green-100 mb-3">
            Get free USDT from our development faucet to start shopping!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetFaucet}
            disabled={isProcessing}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Getting USDT...' : 'Get 1000 USDT Free (DEV)'}
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-green-100">Can afford packages</div>
          <div className="font-semibold">
            {Math.floor(Number(formatUSDT(balance)) / 10)} packages
          </div>
        </div>
        <div>
          <div className="text-green-100">Can afford single NFTs</div>
          <div className="font-semibold">
            {Math.floor(Number(formatUSDT(balance)) / 2)} NFTs
          </div>
        </div>
      </div>
    </motion.div>
  )
}

