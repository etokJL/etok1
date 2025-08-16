'use client'

import { motion } from 'framer-motion'
import { ChartBarIcon, CubeIcon, SparklesIcon, BanknotesIcon } from '@heroicons/react/24/outline'

interface ShopStatsProps {
  stats: {
    totalSales: bigint
    totalQuestNFTsSold: bigint
    totalPlantTokensSold: bigint
    currentUSDTBalance: bigint
  }
  formatUSDT: (amount: bigint) => string
}

export function ShopStats({ stats, formatUSDT }: ShopStatsProps) {
  const statsData = [
    {
      label: 'Total Sales',
      value: `${formatUSDT(stats.totalSales)} USDT`,
      icon: BanknotesIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Quest NFTs Sold',
      value: stats.totalQuestNFTsSold.toString(),
      icon: CubeIcon,
      color: 'text-purple-600'
    },
    {
      label: 'Plant Tokens Sold',
      value: stats.totalPlantTokensSold.toString(),
      icon: SparklesIcon,
      color: 'text-green-600'
    },
    {
      label: 'Shop Balance',
      value: `${formatUSDT(stats.currentUSDTBalance)} USDT`,
      icon: ChartBarIcon,
      color: 'text-orange-600'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6"
    >
      <div className="flex items-center mb-6">
        <ChartBarIcon className="h-8 w-8 text-gray-600 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Shop Statistics</h3>
          <p className="text-gray-600">Live marketplace data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-3 bg-gray-50 rounded-lg"
          >
            <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="font-bold text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

