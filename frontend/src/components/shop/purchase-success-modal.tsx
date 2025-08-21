'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Gift, Package } from 'lucide-react'
import Image from 'next/image'
import { NFT_TYPES, RARITY_COLORS, RARITY_GLOW, type NFTRarity } from '@/lib/constants'

interface PurchaseSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  purchaseType: 'package' | 'single' | 'plant'
  purchasedItems?: {
    nftType?: number
    nftTypes?: number[]
    plantName?: string
  }
}

// Use NFT_TYPES from constants.ts as single source of truth
// No need for duplicate NFT_NAMES mapping

// All rarity data now comes from central constants.ts

export function PurchaseSuccessModal({ 
  isOpen, 
  onClose, 
  purchaseType, 
  purchasedItems 
}: PurchaseSuccessModalProps) {
  const [showItems, setShowItems] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowItems(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowItems(false)
    }
  }, [isOpen])

  const getNFTsToShow = () => {
    if (purchaseType === 'single' && purchasedItems?.nftType) {
      return [purchasedItems.nftType]
    }
    if (purchaseType === 'package' && purchasedItems?.nftTypes) {
      return purchasedItems.nftTypes
    }
    
    // Default fallback for package (5 random NFTs)
    if (purchaseType === 'package') {
      return [1, 2, 3, 4, 5] // Show first 5 as example
    }
    
    return []
  }

  const getNFTImagePath = (nftType: number) => {
    const nftData = NFT_TYPES.find(nft => nft.id === nftType)
    return nftData ? `/metadata/images/${nftData.image}` : `/metadata/images/e-car.png` // fallback
  }

  const getNFTDisplayName = (nftType: number) => {
    const nftData = NFT_TYPES.find(nft => nft.id === nftType)
    return nftData?.displayName || `NFT #${nftType}`
  }

  const nftsToShow = getNFTsToShow()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            console.log('🔄 Purchase Success Modal background clicked, closing modal')
            onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
              <button
                type="button"
                onClick={() => {
                  console.log('🔄 Purchase Success Modal X button clicked, closing modal')
                  onClose()
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center mb-4"
              >
                {purchaseType === 'package' ? (
                  <Package className="h-16 w-16" />
                ) : purchaseType === 'plant' ? (
                  <Sparkles className="h-16 w-16" />
                ) : (
                  <Gift className="h-16 w-16" />
                )}
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2"
              >
                🎉 Purchase Successful!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg opacity-90"
              >
                {purchaseType === 'package' && 'You received an NFT Package!'}
                {purchaseType === 'single' && 'You received a Quest NFT!'}
                {purchaseType === 'plant' && `You received a ${purchasedItems?.plantName} Plant Token!`}
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-6">
              {purchaseType === 'plant' ? (
                // Plant Token Display
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div className="inline-block p-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-lg">
                    <Sparkles className="h-24 w-24 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {purchasedItems?.plantName || 'Energy Plant'}
                    </h3>
                    <p className="text-green-600">
                      This Plant Token has been added to your collection!
                    </p>
                  </div>
                </motion.div>
              ) : (
                // NFT Cards Display
                <div className="space-y-6">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: showItems ? 1 : 0, y: showItems ? 0 : 20 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-center text-gray-800"
                  >
                    Your New Energy Cards:
                  </motion.h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nftsToShow.map((nftType, index) => {
                      const nftData = NFT_TYPES.find(nft => nft.id === nftType)
                      const rarity = nftData?.rarity || 'common' as NFTRarity
                      
                      return (
                        <motion.div
                          key={nftType}
                          initial={{ opacity: 0, y: 50, rotateY: -90 }}
                          animate={{ 
                            opacity: showItems ? 1 : 0, 
                            y: showItems ? 0 : 50,
                            rotateY: showItems ? 0 : -90
                          }}
                          transition={{ 
                            delay: 0.6 + (index * 0.1),
                            type: "spring",
                            duration: 0.6
                          }}
                          className="group"
                        >
                          <div className={`
                            relative p-6 rounded-2xl bg-gradient-to-br ${RARITY_COLORS[rarity]} 
                            text-white shadow-xl ${RARITY_GLOW[rarity]} 
                            transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                          `}>
                            {/* Rarity Badge */}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/20 rounded-lg text-xs font-semibold uppercase tracking-wide">
                              {rarity}
                            </div>
                            
                            {/* NFT Image */}
                            <div className="w-full h-32 mb-4 bg-white/20 rounded-xl overflow-hidden flex items-center justify-center relative">
                              <Image 
                                src={getNFTImagePath(nftType)}
                                alt={getNFTDisplayName(nftType)}
                                fill
                                className="object-cover rounded-lg"
                                onError={() => {
                                  console.log(`❌ Failed to load NFT image for type ${nftType}:`, getNFTImagePath(nftType))
                                }}
                              />
                            </div>
                            
                            {/* NFT Info */}
                            <div className="text-center">
                              <h4 className="text-lg font-bold mb-1">
                                {getNFTDisplayName(nftType)}
                              </h4>
                              <p className="text-sm opacity-80">
                                Type {nftType} • {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                              </p>
                            </div>
                            
                            {/* Sparkle Animation */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 + (index * 0.1), duration: 0.3 }}
                              className="absolute top-2 left-2"
                            >
                              <Sparkles className="h-5 w-5 text-white/80" />
                            </motion.div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue Shopping
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    // Navigate to collection page
                    window.location.href = '/'
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View Collection
                </button>
              </motion.div>
              
              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-6 text-gray-600"
              >
                <p className="text-sm">
                  🎊 Your new items have been added to your wallet and will appear in your collection shortly!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
