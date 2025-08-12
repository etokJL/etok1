'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { UserNFT } from '@/types/nft'
import { NFTDetailModal } from './nft-detail-modal'

interface CompactNFTCardProps {
  nft: UserNFT
  onSelect?: (nft: UserNFT) => void
  isSelected?: boolean
}

const rarityColors = {
  Common: 'bg-gray-100 text-gray-800 border-gray-200',
  Uncommon: 'bg-green-100 text-green-800 border-green-200',
  Rare: 'bg-blue-100 text-blue-800 border-blue-200',
  Epic: 'bg-purple-100 text-purple-800 border-purple-200',
  Legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const energyIcons = {
  Solar: '☀️',
  Wind: '💨',
  Hydro: '🌊',
  Storage: '🔋',
  Smart: '🏠',
  Transport: '🚗'
}

export function CompactNFTCard({ nft, onSelect, isSelected = false }: CompactNFTCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(nft)
    }
  }

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetailModal(true)
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    hover: { 
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" as const }
    },
    tap: { scale: 0.98 }
  }

  return (
    <>
      <motion.div
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl ${
          isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Selection Overlay */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 bg-blue-500 bg-opacity-10 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        {/* Swiss Quality Badge */}
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <span>🇨🇭</span>
            <span>SWISS</span>
          </div>
        </div>

        {/* Quantity Badge */}
        {nft.quantity > 1 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-black bg-opacity-80 text-white text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              ×{nft.quantity}
            </div>
          </div>
        )}

        {/* Image Area */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center group-hover:from-blue-100 group-hover:via-green-100 group-hover:to-purple-100 transition-all duration-300">
          {/* NFT Image */}
          <img
            src={`/metadata/images/${nft.nftType.image}`}
            alt={nft.nftType.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          
          {/* Fallback Icon */}
          <div className="hidden absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">{energyIcons[nft.nftType.energyType]}</div>
              <div className="text-lg font-semibold text-gray-700">{nft.nftType.name}</div>
            </div>
          </div>

          {/* Hover Overlay */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-white font-semibold text-center">
                <div className="text-lg mb-1">View Details</div>
                <div className="text-sm opacity-90">Click to explore</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{energyIcons[nft.nftType.energyType]}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-tight">
                  {nft.nftType.name}
                </h3>
                <p className="text-xs text-gray-500">{nft.nftType.energyType} Energy</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">#{nft.tokenId.toString()}</div>
              <div className="text-xs text-gray-500">Token ID</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className={`text-xs px-2 py-1 rounded-full font-semibold ${rarityColors[nft.nftType.rarity]}`}>
                {nft.nftType.rarity}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <div className="text-xs font-semibold text-gray-900">Swiss Quality</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {nft.nftType.description || `A ${nft.nftType.rarity.toLowerCase()} ${nft.nftType.energyType.toLowerCase()} energy NFT from the Swiss Energy Collection.`}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <motion.button
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                isSelected 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              {isSelected ? "✕ Remove" : "✓ Select"}
            </motion.button>
            
            <motion.button
              className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs hover:bg-gray-200 transition-all flex items-center space-x-1"
              whileTap={{ scale: 0.95 }}
              onClick={handleDetailClick}
            >
              <span>👁️</span>
              <span>Details</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && (
        <NFTDetailModal
          nft={nft}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}

