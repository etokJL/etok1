'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { EnhancedNFTCard } from '@/components/cards/enhanced-nft-card'
import { ListNFTCard } from '@/components/cards/list-nft-card'
import { CompactNFTCard } from '@/components/cards/compact-nft-card'
import { UserNFT, ViewMode } from '@/types/nft'

interface BasicGridProps {
  nfts: UserNFT[]
  onNFTSelect?: (nft: UserNFT) => void
}

export function BasicGrid({ nfts, onNFTSelect }: BasicGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Energy NFT Collection</h2>
            <p className="text-gray-600 mt-1">
              {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
          <div className="flex bg-gray-50 rounded-xl p-1.5 border">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔲 Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📋 List
            </button>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <motion.div
        className={viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 4xl:grid-cols-10 gap-6' 
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {nfts.map((nft) => (
            <motion.div
              key={nft.tokenId.toString()}
              variants={itemVariants}
              layout
            >
              {viewMode === 'grid' ? (
                <EnhancedNFTCard
                  nft={nft}
                  onSelect={onNFTSelect}
                  isSelected={false}
                  showQuantity={true}
                  animate={true}
                />
              ) : (
                <CompactNFTCard
                  nft={nft}
                  onSelect={onNFTSelect}
                  isSelected={false}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {nfts.length === 0 && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl mb-6">🌱</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Energy Collection</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Connect your wallet and begin collecting Swiss-quality energy NFTs to build your sustainable portfolio!
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium text-blue-900">Solar Energy</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💨</div>
              <div className="text-sm font-medium text-green-900">Wind Energy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💧</div>
              <div className="text-sm font-medium text-purple-900">Hydro Energy</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}