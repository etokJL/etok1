'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EnhancedNFTCard } from '@/components/cards/enhanced-nft-card'
import { CompactNFTCard } from '@/components/cards/compact-nft-card'
import type { UserNFT, ViewMode } from '@/types/nft'
import { X } from 'lucide-react'

interface ResponsiveGridWithDetailProps {
  nfts: UserNFT[]
  onNFTSelect?: (nft: UserNFT) => void
}

export function ResponsiveGridWithDetail({ nfts, onNFTSelect }: ResponsiveGridWithDetailProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedNFT, setSelectedNFT] = useState<UserNFT | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get selected NFT from URL
  useEffect(() => {
    const cardId = searchParams.get('card')
    if (cardId) {
      const nft = nfts.find(n => n.tokenId.toString() === cardId)
      if (nft) {
        setSelectedNFT(nft)
      }
    } else {
      setSelectedNFT(null)
    }
  }, [searchParams, nfts])

  const openDetailView = (nft: UserNFT) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('card', nft.tokenId.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const closeDetailView = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('card')
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNFT) {
        closeDetailView()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [selectedNFT, closeDetailView])

  // Prevent scroll when detail view is open
  useEffect(() => {
    if (selectedNFT) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedNFT])

  const handleCardClick = (nft: UserNFT) => {
    openDetailView(nft)
    if (onNFTSelect) {
      onNFTSelect(nft)
    }
  }

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

  const detailVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.23, 1, 0.320, 1] as const // easeOutQuart
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { 
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1] as const // easeInQuart
      }
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }

  const energyIcons = {
    Solar: '☀️',
    Wind: '💨',
    Hydro: '🌊',
    Storage: '🔋',
    Smart: '🏠',
    Transport: '🚗'
  }

  const rarityColors = {
    Common: 'bg-gray-100 text-gray-800 border-gray-200',
    Uncommon: 'bg-green-100 text-green-800 border-green-200',
    Rare: 'bg-blue-100 text-blue-800 border-blue-200',
    Epic: 'bg-purple-100 text-purple-800 border-purple-200',
    Legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  return (
    <div className="space-y-8 relative">
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
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-6' 
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {nfts.map((nft, index) => (
            <motion.div
              key={nft.uniqueId || nft.originalTokenId || `${nft.tokenId.toString()}-${index}`}
              variants={itemVariants}
              layoutId={`card-${nft.uniqueId || nft.originalTokenId || nft.tokenId.toString()}`}
            >
              {viewMode === 'grid' ? (
                <EnhancedNFTCard
                  nft={nft}
                  onSelect={handleCardClick}
                  isSelected={false}
                  showQuantity={true}
                  animate={true}
                />
              ) : (
                <CompactNFTCard
                  nft={nft}
                  onSelect={handleCardClick}
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

      {/* Animated Detail Overlay */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeDetailView}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
            
            {/* Detail Card */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              variants={detailVariants}
              layoutId={`card-${selectedNFT.uniqueId || selectedNFT.originalTokenId || selectedNFT.tokenId.toString()}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{energyIcons[selectedNFT.nftType.energyType]}</div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedNFT.nftType.name}</h2>
                    <p className="text-sm text-gray-600">Token ID: {selectedNFT.tokenId.toString()}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeDetailView}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2 p-6">
                  <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden">
                    {/* NFT Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/metadata/images/${selectedNFT.nftType.image}`}
                      alt={selectedNFT.nftType.name}
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
                        <div className="text-8xl mb-4">{energyIcons[selectedNFT.nftType.energyType]}</div>
                        <div className="text-xl font-semibold text-gray-700">{selectedNFT.nftType.name}</div>
                      </div>
                    </div>

                    {/* Quantity Badge */}
                    {selectedNFT.quantity > 1 && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-white bg-opacity-90 text-gray-800 text-lg font-bold px-3 py-2 rounded-full border shadow-lg">
                          x{selectedNFT.quantity}
                        </div>
                      </div>
                    )}

                    {/* Rarity Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-3 py-2 text-sm font-medium rounded-full border shadow-lg ${rarityColors[selectedNFT.nftType.rarity]}`}>
                        {selectedNFT.nftType.rarity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedNFT.nftType.description || `A ${selectedNFT.nftType.rarity.toLowerCase()} ${selectedNFT.nftType.energyType.toLowerCase()} energy NFT. Part of the Swiss Energy Quest Series.`}
                    </p>
                  </div>

                  {/* Properties */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">NFT Properties</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">{energyIcons[selectedNFT.nftType.energyType]}</div>
                        <div className="text-sm font-semibold text-blue-900">{selectedNFT.nftType.energyType}</div>
                        <div className="text-xs text-blue-600">Energy Type</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">🇨🇭</div>
                        <div className="text-sm font-semibold text-green-900">Swiss</div>
                        <div className="text-xs text-green-600">Quality</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Token ID</span>
                        <span className="font-bold text-gray-900">#{selectedNFT.tokenId.toString()}</span>
                      </div>
                      <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Energy Type</span>
                        <span className="font-semibold text-gray-900">{selectedNFT.nftType.energyType}</span>
                      </div>
                      <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Rarity</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rarityColors[selectedNFT.nftType.rarity]}`}>
                          {selectedNFT.nftType.rarity}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Quantity Owned</span>
                        <span className="font-bold text-gray-900">×{selectedNFT.quantity}</span>
                      </div>
                      <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Last Updated</span>
                        <span className="font-medium text-gray-900">{selectedNFT.lastUpdated.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-medium">Collection</span>
                        <span className="font-semibold text-gray-900">Swiss Energy Quest</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button" 
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      onClick={() => {
                        if (onNFTSelect) {
                          onNFTSelect(selectedNFT)
                        }
                      }}
                    >
                      Select NFT
                    </button>
                    <button 
                      type="button" 
                      className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      View on Explorer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
