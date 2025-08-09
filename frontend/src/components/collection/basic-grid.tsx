'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { EnhancedNFTCard } from '@/components/cards/enhanced-nft-card'
import { ListNFTCard } from '@/components/cards/list-nft-card'
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
    <div className="space-y-6">
      {/* Controls */}
      <div className="card p-4">
        <div className="flex justify-end">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      <motion.div
        className={viewMode === 'grid' 
          ? 'nft-grid-mobile' 
          : 'nft-list'
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
                <ListNFTCard
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
          className="card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
          <p className="text-gray-600">
            Start collecting energy NFTs to build your portfolio!
          </p>
        </motion.div>
      )}
    </div>
  )
}