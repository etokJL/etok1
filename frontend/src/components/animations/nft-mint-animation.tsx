'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { UserNFT } from '@/types/nft'

interface NFTMintAnimationProps {
  nft: UserNFT
  isVisible: boolean
  onComplete: () => void
  delay?: number
}

export function NFTMintAnimation({ nft, isVisible, onComplete, delay = 0 }: NFTMintAnimationProps) {
  const [showCompleteMessage, setShowCompleteMessage] = useState(false)

  const energyIcons = {
    Solar: '☀️',
    Wind: '💨',
    Hydro: '🌊',
    Storage: '🔋',
    Smart: '🏠',
    Transport: '🚗'
  }

  // Animation Sequence
  const mintSequence = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
      filter: 'blur(10px)'
    },
    visible: {
      scale: [0, 1.2, 1],
      rotate: [0, 360, 0],
      opacity: [0, 1, 1],
      filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
      transition: {
        duration: 1.5,
        delay: delay,
        times: [0, 0.6, 1],
        ease: [0.23, 1, 0.320, 1]
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  }

  const glowEffect = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [1, 1.5, 2],
      transition: {
        duration: 2,
        delay: delay + 0.5,
        ease: "easeOut"
      }
    }
  }

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, Math.cos(i * 60) * 100],
      y: [0, Math.sin(i * 60) * 100],
      transition: {
        duration: 1.5,
        delay: delay + 0.3 + (i * 0.1),
        ease: "easeOut"
      }
    })
  }

  const titleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: delay + 1.2,
        ease: "easeOut"
      }
    }
  }

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowCompleteMessage(true)
        setTimeout(() => {
          onComplete()
        }, 2000)
      }, delay + 1500)

      return () => clearTimeout(timer)
    }
  }, [isVisible, delay, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onComplete}
        >
          <div className="relative">
            {/* Glow Effect Background */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 blur-xl"
              variants={glowEffect}
              initial="initial"
              animate="animate"
            />

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-300 rounded-full"
                custom={i}
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}

            {/* Main NFT Card */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-auto text-center"
              variants={mintSequence}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Swiss Quality Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                  <span>🇨🇭</span>
                  <span>SWISS</span>
                </div>
              </div>

              {/* NEW Badge */}
              <div className="absolute top-4 left-4">
                <motion.div
                  className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 0.6,
                    delay: delay + 1,
                    repeat: 2
                  }}
                >
                  ✨ NEW!
                </motion.div>
              </div>

              {/* NFT Image/Icon */}
              <motion.div
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center text-6xl relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                {/* NFT Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/metadata/images/${nft.nftType.image}`}
                  alt={nft.nftType.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                
                {/* Fallback Icon */}
                <div className="hidden absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{energyIcons[nft.nftType.energyType]}</span>
                </div>

                {/* Quantity Badge */}
                {nft.quantity > 1 && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full">
                    x{nft.quantity}
                  </div>
                )}
              </motion.div>

              {/* Title and Details */}
              <motion.div variants={titleVariants} initial="hidden" animate="visible">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {nft.nftType.name}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {nft.nftType.energyType} Energy • {nft.nftType.rarity}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <span className="text-2xl">⚡</span>
                  <span className="font-semibold">Successfully Minted!</span>
                </div>

                <p className="text-xs text-gray-500">
                  Token ID: #{nft.tokenId.toString()}
                </p>
              </motion.div>

              {/* Complete Message */}
              <AnimatePresence>
                {showCompleteMessage && (
                  <motion.div
                    className="absolute inset-x-0 bottom-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <p className="text-sm text-gray-600">
                      Click anywhere to continue
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 30) * 200],
                  y: [0, Math.sin(i * 30) * 200],
                  opacity: [1, 0],
                  scale: [1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: delay + 0.8 + (i * 0.05),
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

