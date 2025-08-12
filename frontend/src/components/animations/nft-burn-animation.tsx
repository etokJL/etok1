'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { UserNFT } from '@/types/nft'

interface NFTBurnAnimationProps {
  nft: UserNFT
  isVisible: boolean
  onComplete: () => void
  delay?: number
}

export function NFTBurnAnimation({ nft, isVisible, onComplete, delay = 0 }: NFTBurnAnimationProps) {
  const [showCompleteMessage, setShowCompleteMessage] = useState(false)

  const energyIcons = {
    Solar: '☀️',
    Wind: '💨',
    Hydro: '🌊',
    Storage: '🔋',
    Smart: '🏠',
    Transport: '🚗'
  }

  // Burn Animation Sequence
  const burnSequence = {
    hidden: {
      scale: 1,
      opacity: 1,
      filter: 'brightness(1)'
    },
    burning: {
      scale: [1, 1.1, 0.9, 1.2, 0],
      opacity: [1, 1, 0.8, 0.5, 0],
      filter: [
        'brightness(1) hue-rotate(0deg)',
        'brightness(1.5) hue-rotate(30deg)',
        'brightness(2) hue-rotate(60deg)',
        'brightness(0.5) hue-rotate(90deg)',
        'brightness(0) hue-rotate(120deg)'
      ],
      transition: {
        duration: 2.5,
        delay: delay,
        times: [0, 0.3, 0.6, 0.8, 1],
        ease: [0.23, 1, 0.320, 1]
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  }

  // Fire/Burn Effect
  const fireEffect = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1.5, 2],
      y: [0, -20, -40, -60],
      transition: {
        duration: 2,
        delay: delay + 0.5,
        ease: "easeOut"
      }
    }
  }

  // Smoke particles
  const smokeVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 0.8, 0],
      scale: [0, 1, 1.5],
      x: [0, (Math.random() - 0.5) * 100],
      y: [0, -100 - (i * 20)],
      rotate: [0, 360],
      transition: {
        duration: 3,
        delay: delay + 1 + (i * 0.2),
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
        delay: delay + 2,
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
      }, delay + 2500)

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
            {/* Fire/Burn Effect Background */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,69,0,0.8) 0%, rgba(255,140,0,0.6) 50%, rgba(255,215,0,0.4) 100%)',
                filter: 'blur(20px)'
              }}
              variants={fireEffect}
              initial="hidden"
              animate="visible"
            />

            {/* Smoke Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`smoke-${i}`}
                className="absolute top-1/2 left-1/2 w-8 h-8 bg-gray-400 rounded-full opacity-60"
                custom={i}
                variants={smokeVariants}
                initial="hidden"
                animate="visible"
                style={{
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(4px)'
                }}
              />
            ))}

            {/* Main NFT Card */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-auto text-center"
              variants={burnSequence}
              initial="hidden"
              animate="burning"
              exit="exit"
            >
              {/* BURNING Badge */}
              <div className="absolute top-4 right-4">
                <motion.div
                  className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    delay: delay + 0.5,
                    repeat: 3
                  }}
                >
                  <span>🔥</span>
                  <span>BURNING</span>
                </motion.div>
              </div>

              {/* Warning Badge */}
              <div className="absolute top-4 left-4">
                <motion.div
                  className="bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full"
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    delay: delay
                  }}
                >
                  ⚠️ BURN
                </motion.div>
              </div>

              {/* NFT Image/Icon with Fire Overlay */}
              <motion.div
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center text-6xl relative overflow-hidden"
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

                {/* Fire Overlay Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300 mix-blend-overlay"
                  animate={{
                    opacity: [0, 0.3, 0.7, 1],
                    scale: [1, 1.1, 1.2, 1.5]
                  }}
                  transition={{
                    duration: 2,
                    delay: delay + 0.5,
                    ease: "easeOut"
                  }}
                />

                {/* Quantity Badge (fading) */}
                {nft.quantity > 1 && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-full"
                    animate={{
                      opacity: [1, 0.5, 0],
                      scale: [1, 1.2, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: delay + 1
                    }}
                  >
                    x{nft.quantity}
                  </motion.div>
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
                
                <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
                  <span className="text-2xl">🔥</span>
                  <span className="font-semibold">Successfully Burned!</span>
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

            {/* Flame particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`flame-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  top: '60%',
                  left: '50%',
                  background: `hsl(${20 + (i * 10)}, 100%, ${60 + (i * 2)}%)`
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -150 - (Math.random() * 50)],
                  opacity: [1, 0.8, 0],
                  scale: [0.5, 1, 0]
                }}
                transition={{
                  duration: 1.5 + (Math.random() * 1),
                  delay: delay + 0.3 + (i * 0.1),
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

