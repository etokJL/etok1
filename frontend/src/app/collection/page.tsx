'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CubeIcon } from '@heroicons/react/24/outline'

export default function CollectionPage() {
  useEffect(() => {
    document.title = 'Collection - Booster Energy'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <CubeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">NFT Collection</h1>
          </div>
          <p className="mt-2 text-gray-600">
            View and manage your Swiss Energy NFTs
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
          <CubeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Collection View Coming Soon
          </h3>
          <p className="text-gray-600 mb-4">
            This dedicated collection page will show detailed views of all your NFTs.
          </p>
          <p className="text-sm text-gray-500">
            For now, you can view your NFTs on the main dashboard.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

