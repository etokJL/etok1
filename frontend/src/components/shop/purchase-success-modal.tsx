'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Gift, Package } from 'lucide-react'

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

const NFT_NAMES: { [key: number]: string } = {
  1: 'Solar Panel Alpha',
  2: 'Wind Turbine Beta',
  3: 'Hydro Generator Gamma',
  4: 'Nuclear Core Delta',
  5: 'Geothermal Epsilon',
  6: 'Biomass Zeta',
  7: 'Tidal Wave Eta',
  8: 'Fusion Reactor Theta',
  9: 'Carbon Capture Iota',
  10: 'Smart Grid Kappa',
  11: 'Battery Storage Lambda',
  12: 'Hydrogen Cell Mu',
  13: 'Quantum Energy Nu',
  14: 'Plasma Generator Xi',
  15: 'Zero Point Omicron'
}

const NFT_RARITIES: { [key: number]: string } = {
  1: 'common', 2: 'common', 3: 'common', 4: 'common', 5: 'common',
  6: 'uncommon', 7: 'uncommon', 8: 'uncommon', 9: 'uncommon', 10: 'uncommon',
  11: 'rare', 12: 'rare', 13: 'rare',
  14: 'epic', 15: 'legendary'
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
}

const RARITY_GLOW = {
  common: 'shadow-lg',
  uncommon: 'shadow-green-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50'
}

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

  const nftsToShow = getNFTsToShow()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
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
                onClick={onClose}
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
                      const rarity = NFT_RARITIES[nftType]
                      
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
                            
                            {/* NFT Image Placeholder */}
                            <div className="w-full h-32 mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                              <div className="text-4xl font-bold opacity-70">
                                #{nftType}
                              </div>
                            </div>
                            
                            {/* NFT Info */}
                            <div className="text-center">
                              <h4 className="text-lg font-bold mb-1">
                                {NFT_NAMES[nftType]}
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
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue Shopping
                </button>
                
                <button
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
