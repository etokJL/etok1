'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/outline'

export default function PlantsPage() {
  useEffect(() => {
    document.title = 'Plants - Booster Energy'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Plant Tokens</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Create and manage your Plant Tokens from NFT collections
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
        >
          <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Plant Token Creation Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            This dedicated plants page will show detailed Plant Token creation and management.
          </p>
          <p className="text-sm text-gray-500">
            For now, you can create Plant Tokens on the main dashboard.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

