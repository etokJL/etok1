'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Copy, QrCode, Calendar, Hash } from 'lucide-react'
import { useState } from 'react'
import { type BackendToken } from '@/types'

interface TokenDetailModalProps {
  token: BackendToken | null
  isOpen: boolean
  onClose: () => void
}

const energyIcons: Record<string, string> = {
  'Solar Panel': '☀️',
  'Wind Turbine': '💨',
  'Battery': '🔋',
  'Smart Home': '🏠',
  'E-Car': '🚗',
  'Heat Pump': '🌡️',
  'Smart Meter': '⚡',
  'E-Bike': '🚴',
  'Charging Station': '🔌',
  'Home Battery': '🔋',
  'Power Bank': '🔋',
  'Electric Boiler': '🔥',
  'E-Roller': '🛴',
  'Charge Controller': '⚙️',
  'Smartphone': '📱',
  'Quest NFT Type 1': '⚡',
  'Quest NFT Type 2': '🌞',
  'Quest NFT Type 3': '💨',
  'Quest NFT Type 4': '🔋',
  'Quest NFT Type 5': '🏠',
  'Quest NFT Type 6': '🚗',
  'Quest NFT Type 7': '🌡️',
  'Quest NFT Type 8': '⚡',
  'Quest NFT Type 9': '🚴',
  'Quest NFT Type 10': '🌱',
  'Quest NFT Type 11': '🔌',
  'Quest NFT Type 12': '💡',
  'Quest NFT Type 13': '🌍',
  'Quest NFT Type 14': '⚙️',
  'Quest NFT Type 15': '🎯',
  'Plant Token A': '🌱',
  'Plant Token B': '🌿',
  'E car': '🚗',
  'Smart home': '🏠',
  'Charge controller': '⚙️',
  'Power bank': '🔋',
  'Charging station': '🔌',
  'Home battery': '🔋',
  'Smart meter': '⚡',
  'E roller': '🛴',
  'Electric boiler': '🔥'
}

export function TokenDetailModal({ token, isOpen, onClose }: TokenDetailModalProps) {
  const [copiedText, setCopiedText] = useState('')
  const [imageError, setImageError] = useState(false)

  // Map token names to image file names
  const getImagePath = (tokenName: string): string => {
    const imageMap: Record<string, string> = {
      'Solar Panel': 'solar-panel.png',
      'Wind Turbine': 'wind-turbine.png',
      'Battery': 'home-battery.png',
      'Smart Home': 'smart-home.png',
      'E-Car': 'e-car.png',
      'Heat Pump': 'heat-pump.png',
      'Smart Meter': 'smart-meter.png',
      'E-Bike': 'e-bike.png',
      'Charging Station': 'charging-station.png',
      'Home Battery': 'home-battery.png',
      'Power Bank': 'power-bank.png',
      'Electric Boiler': 'electric-boiler.png',
      'E-Roller': 'e-roller.png',
      'Charge Controller': 'charge-controller.png',
      'Smartphone': 'smartphone.png',
      'E car': 'e-car.png',
      'Smart home': 'smart-home.png',
      'Charge controller': 'charge-controller.png',
      'Power bank': 'power-bank.png',
      'Charging station': 'charging-station.png',
      'Home battery': 'home-battery.png',
      'Smart meter': 'smart-meter.png',
      'E roller': 'e-roller.png',
      'Electric boiler': 'electric-boiler.png'
    }
    return `/metadata/images/${imageMap[tokenName] || 'solar-panel.png'}`
  }

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!token) return null

  const icon = energyIcons[token.name] || '🎁'

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
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-white rounded-full p-3 shadow-sm">{icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{token.name}</h2>
                  <p className="text-sm text-gray-600">Token ID: #{token.token_id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      token.token_type === 'erc721a' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {token.token_type.toUpperCase()}
                    </span>
                    {token.sub_units && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {token.sub_units} units
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Image Section */}
              <div className="lg:w-1/2 p-6 sticky top-0 self-start">
                <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden shadow-inner">
                  {/* Token Image */}
                  {!imageError && (
                    <img
                      src={getImagePath(token.name)}
                      alt={token.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  )}
                  
                  {/* Fallback Icon */}
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-8xl mb-4">{icon}</div>
                        <div className="text-xl font-semibold text-gray-700">{token.name}</div>
                        <div className="text-sm text-gray-500 mt-2">No image available</div>
                      </div>
                    </div>
                  )}

                  {/* Token Type Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white bg-opacity-90 text-gray-800 text-sm font-bold px-3 py-2 rounded-full border shadow-lg">
                      {token.token_type.toUpperCase()}
                    </div>
                  </div>

                  {/* Sub-units Badge */}
                  {token.sub_units && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 bg-opacity-90 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                        {token.sub_units} units
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Code Section */}
                {token.qr_code && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-4 h-4 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">QR Code</h4>
                    </div>
                    <code className="text-sm font-mono text-gray-800 break-all">{token.qr_code}</code>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="lg:w-1/2 p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Token Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium text-right">{token.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Token ID</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{token.token_id}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(token.token_id, 'Token ID')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy token ID"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Token Type</span>
                      <span className="font-medium">{token.token_type.toUpperCase()}</span>
                    </div>
                    {token.sub_units && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Sub Units</span>
                        <span className="font-medium text-green-600">{token.sub_units}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contract Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="block text-sm font-medium text-gray-600 mb-1">
                        Contract Address
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm font-mono text-gray-800 flex-1">
                          {formatAddress(token.contract_address)}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(token.contract_address, 'Contract address')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy address"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open(`https://polygonscan.com/address/${token.contract_address}`, '_blank')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="View on PolygonScan"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-600 mb-1">
                        Owner Address
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm font-mono text-gray-800 flex-1">
                          {formatAddress(token.owner_address)}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(token.owner_address, 'Owner address')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy address"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open(`https://polygonscan.com/address/${token.owner_address}`, '_blank')}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="View on PolygonScan"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {token.transaction_hash && (
                      <div>
                        <div className="block text-sm font-medium text-gray-600 mb-1">
                          Transaction Hash
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <code className="text-sm font-mono text-gray-800 flex-1">
                            {formatAddress(token.transaction_hash)}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(token.transaction_hash || '', 'Transaction hash')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Copy transaction hash"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => window.open(`https://polygonscan.com/tx/${token.transaction_hash}`, '_blank')}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="View on PolygonScan"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                {token.metadata && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
                    <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(token.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timestamps
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-sm">{formatDate(token.created_at)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-sm">{formatDate(token.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button type="button" className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Trade Token
                  </button>
                  <button 
                    type="button"
                    onClick={() => window.open(`https://opensea.io/assets/matic/${token.contract_address}/${token.token_id}`, '_blank')}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    View on OpenSea
                  </button>
                </div>
              </div>
            </div>

            {/* Copy Success Message */}
            {copiedText && (
              <motion.div
                className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-60"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {copiedText} copied to clipboard!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
