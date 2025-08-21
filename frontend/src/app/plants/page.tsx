'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, CalendarIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'
import { useBlockchainPlantData } from '@/hooks/useBlockchainData'
import Image from 'next/image'

export default function PlantsPage() {
  const { isConnected } = useAccount()
  const { plants, plantsCreated, loading, error } = useBlockchainPlantData()

  useEffect(() => {
    document.title = 'Plants - Booster Energy'
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Wallet</h3>
            <p className="text-gray-600">
              Please connect your wallet to view your Plant Tokens.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Plant Tokens</h1>
                <p className="mt-1 text-gray-600">Your generated Plant Token collection</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{plantsCreated}</div>
              <div className="text-sm text-gray-500">Plant Tokens Created</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your Plant Tokens...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && plantsCreated === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
          >
            <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Plant Tokens Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first Plant Token by collecting all 15 NFT types and visiting the Home page.
            </p>
            <p className="text-sm text-gray-500">
              Plant Tokens are created by burning a complete set of 15 different Quest NFTs.
            </p>
          </motion.div>
        )}

        {!loading && !error && plantsCreated > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant, index) => (
              <motion.div
                key={plant.tokenId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Image
                        src="/metadata/images/plant.png"
                        alt="Plant Token"
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plant.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <SparklesIcon className="h-4 w-4" />
                        <span>Plant Token</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    #{plant.tokenId}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <QrCodeIcon className="h-4 w-4 mr-2" />
                    <span className="font-mono">{plant.qrCode}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Created {new Date(plant.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Sub-units</span>
                    <span className="text-sm font-medium text-gray-900">{plant.subUnits.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}