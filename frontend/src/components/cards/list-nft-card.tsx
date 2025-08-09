'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { UserNFT } from '@/types/nft'
import { formatAddress } from '@/lib/utils'
import { NFTDetailModal } from './nft-detail-modal'

interface ListNFTCardProps {
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

export function ListNFTCard({ nft, onSelect, isSelected = false }: ListNFTCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  const handleClick = () => {
    if (onSelect) {
      onSelect(nft)
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
    },
    tap: { scale: 0.98 }
  }

  return (
    <motion.div
      className={`card p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
          : 'hover:bg-gray-50 border-gray-200'
      }`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
    >
      <div className="flex items-center gap-4">
        {/* NFT Image */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border">
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
            <div className="hidden absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">{energyIcons[nft.nftType.energyType]}</div>
            </div>
          </div>
          
          {/* Quantity Badge */}
          {nft.quantity > 1 && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              x{nft.quantity}
            </div>
          )}
        </div>

        {/* NFT Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {nft.nftType.name}
            </h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${rarityColors[nft.nftType.rarity]}`}>
              {nft.nftType.rarity}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <span>{energyIcons[nft.nftType.energyType]}</span>
              <span>{nft.nftType.energyType}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🆔</span>
              <span className="font-mono">{nft.tokenId.toString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{nft.lastUpdated.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Contract Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>📋</span>
              <span className="font-mono">{formatAddress('0x1234567890abcdef1234567890abcdef12345678')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔗</span>
              <span>Chain: Ethereum</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Implement trade action
            }}
          >
            Trade
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setShowDetailModal(true)
            }}
          >
            Details
          </button>
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
