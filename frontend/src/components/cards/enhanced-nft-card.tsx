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
      <div className="card overflow-hidden relative">
        {/* Swiss Quality Badge */}
        <div className="absolute top-2 right-2 z-20">
                          <span className="text-lg"></span>
        </div>

        {/* Quantity Badge */}
        {showQuantity && nft.quantity > 0 && (
          <div className="absolute top-2 left-2 z-20">
            <motion.div
              className="bg-white bg-opacity-90 text-gray-800 text-sm font-bold px-2 py-1 rounded-full border"
              animate={{ scale: isSelected ? 1.1 : 1 }}
            >
              x{nft.quantity}
            </motion.div>
          </div>
        )}

        {/* Image Area */}
        <button 
          className="relative h-48 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden cursor-pointer w-full border-0 p-0"
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
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate flex-1">
              {nft.nftType.name}
            </h3>
          </div>

          {/* Rarity Badge */}
          <div className="mb-3">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${rarityColors[nft.nftType.rarity]}`}>
              {nft.nftType.rarity}
            </span>
          </div>

          {/* Description */}
          {nft.nftType.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {nft.nftType.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              className="btn btn-outline flex-1 text-sm"
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              {isSelected ? "Remove" : "Select"}
            </motion.button>
            
            <motion.button
              className="btn btn-primary text-sm px-3"
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                setShowDetailModal(true)
              }}
            >
              👁️
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