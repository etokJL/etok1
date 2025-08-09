'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { UserNFT } from '@/types/nft'
import { X, ExternalLink, Copy } from 'lucide-react'
import { useState } from 'react'

interface NFTDetailModalProps {
  nft: UserNFT | null
  isOpen: boolean
  onClose: () => void
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

export function NFTDetailModal({ nft, isOpen, onClose }: NFTDetailModalProps) {
  const [copiedAddress, setCopiedAddress] = useState(false)

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2, ease: "easeIn" as const }
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!nft) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{energyIcons[nft.nftType.energyType]}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{nft.nftType.name}</h2>
                  <p className="text-sm text-gray-600">Token ID: {nft.tokenId.toString()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
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
                      <div className="text-8xl mb-4">{energyIcons[nft.nftType.energyType]}</div>
                      <div className="text-xl font-semibold text-gray-700">{nft.nftType.name}</div>
                    </div>
                  </div>

                  {/* Quantity Badge */}
                  {nft.quantity > 1 && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-white bg-opacity-90 text-gray-800 text-lg font-bold px-3 py-2 rounded-full border shadow-lg">
                        x{nft.quantity}
                      </div>
                    </div>
                  )}

                  {/* Rarity Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-block px-3 py-2 text-sm font-medium rounded-full border shadow-lg ${rarityColors[nft.nftType.rarity]}`}>
                      {nft.nftType.rarity}
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
                    {nft.nftType.description || `A ${nft.nftType.rarity.toLowerCase()} ${nft.nftType.energyType.toLowerCase()} energy NFT. Part of the Energy Quest Series.`}
                  </p>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Energy Type</span>
                      <span className="font-medium">{nft.nftType.energyType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Rarity</span>
                      <span className="font-medium">{nft.nftType.rarity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-medium">{nft.quantity}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">{nft.lastUpdated.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                              {/* Contract Information Cards */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* NFT Contract Card */}
                  <div className="card p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📋</span>
                      <h4 className="font-medium text-gray-900">NFT Contract</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <code className="text-xs font-mono text-gray-800 flex-1">
                          {formatAddress('0x1234567890abcdef1234567890abcdef12345678')}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('0x1234567890abcdef1234567890abcdef12345678')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy address"
                        >
                          <Copy className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open('https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678', '_blank')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="View on Etherscan"
                        >
                          <ExternalLink className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Chain:</span> Ethereum Mainnet
                      </div>
                    </div>
                  </div>

                  {/* Token ID Card */}
                  <div className="card p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🆔</span>
                      <h4 className="font-medium text-gray-900">Token ID</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <code className="text-xs font-mono text-gray-800 flex-1">
                          {nft.tokenId.toString()}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(nft.tokenId.toString())}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy token ID"
                        >
                          <Copy className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Standard:</span> ERC-721A
                      </div>
                    </div>
                  </div>

                  {/* Owner Card */}
                  <div className="card p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">👤</span>
                      <h4 className="font-medium text-gray-900">Current Owner</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <code className="text-xs font-mono text-gray-800 flex-1">
                          {formatAddress('0xabcdef1234567890abcdef1234567890abcdef12')}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('0xabcdef1234567890abcdef1234567890abcdef12')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy address"
                        >
                          <Copy className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Since:</span> {nft.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Card */}
                  <div className="card p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔗</span>
                      <h4 className="font-medium text-gray-900">Last Transaction</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <code className="text-xs font-mono text-gray-800 flex-1">
                          {formatAddress('0x9876543210fedcba9876543210fedcba98765432')}
                        </code>
                        <button
                          type="button"
                          onClick={() => window.open('https://etherscan.io/tx/0x9876543210fedcba9876543210fedcba98765432', '_blank')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="View transaction"
                        >
                          <ExternalLink className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Type:</span> Transfer
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button type="button" className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Trade NFT
                  </button>
                  <button type="button" className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View on OpenSea
                  </button>
                </div>

                {/* Copy Success Message */}
                {copiedAddress && (
                  <motion.div
                    className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    Address copied to clipboard!
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 