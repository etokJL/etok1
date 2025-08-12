'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { UserNFT, NFTCardProps } from '@/types/nft'
import { NFTDetailModal } from './nft-detail-modal'

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

export function EnhancedNFTCard({ nft, onSelect, isSelected, showQuantity = true, animate = true }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" as const }
    },
    selected: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" as const }
    }
  }

  const handleClick = () => {
    if (onSelect) {
      onSelect(nft)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetailModal(true)
  }

  return (
    <motion.div
      className={`relative cursor-pointer ${animate ? '' : 'transform-none'}`}
      variants={animate ? cardVariants : {}}
      initial={animate ? "initial" : false}
      animate={animate ? "animate" : false}
      whileHover={animate ? "hover" : {}}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Selection Overlay */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg z-10 border-2 border-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative group transition-all duration-300 hover:shadow-xl">
        {/* Swiss Quality Badge */}
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <span>🇨🇭</span>
            <span>SWISS</span>
          </div>
        </div>

        {/* Quantity Badge */}
        {showQuantity && nft.quantity > 0 && (
          <div className="absolute top-3 left-3 z-20">
            <motion.div
              className="bg-black bg-opacity-80 text-white text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-sm"
              animate={{ scale: isSelected ? 1.1 : 1 }}
            >
              ×{nft.quantity}
            </motion.div>
          </div>
        )}

        {/* Rarity Badge */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${rarityColors[nft.nftType.rarity]}`}>
            {nft.nftType.rarity}
          </div>
        </div>

        {/* Image Area */}
        <button 
          className="relative h-64 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 overflow-hidden cursor-pointer w-full border-0 p-0 group-hover:from-blue-100 group-hover:via-green-100 group-hover:to-purple-100 transition-all duration-300"
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCardClick(e as any)
            }
          }}
          type="button"
        >
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
          
          {/* Fallback Icon Display */}
          <div className="hidden absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{energyIcons[nft.nftType.energyType]}</div>
              <div className="text-sm font-medium text-gray-600">{nft.nftType.name}</div>
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
                  <div className="text-sm opacity-90">Click to see full info</div>
                </div>
              </motion.div>
            )}
        </button>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Header with Energy Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{energyIcons[nft.nftType.energyType]}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {nft.nftType.name}
                </h3>
                <p className="text-sm text-gray-500">{nft.nftType.energyType} Energy</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">#{nft.tokenId.toString()}</div>
              <div className="text-xs text-gray-500">Token ID</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold text-gray-900">{nft.nftType.rarity}</div>
              <div className="text-xs text-gray-500">Rarity</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold text-gray-900">Swiss</div>
              <div className="text-xs text-gray-500">Quality</div>
            </div>
          </div>

          {/* Description */}
          {nft.nftType.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {nft.nftType.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
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
              className="py-2.5 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all flex items-center space-x-1"
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowDetailModal(true)
              }}
            >
              <span>👁️</span>
              <span>Details</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <NFTDetailModal
          nft={nft}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </motion.div>
  )
}