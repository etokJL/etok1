'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { EnhancedTokenCard } from '@/components/cards/enhanced-token-card'
import { type BackendToken } from '@/types'

interface TradingOffer {
  id: string
  from: string
  to: string
  offerTokens: BackendToken[]
  requestTokens: BackendToken[]
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  createdAt: Date
  expiresAt: Date
}

interface TradingInterfaceProps {
  userTokens: BackendToken[]
  onTradeComplete?: () => void
}

export function TradingInterface({ userTokens, onTradeComplete }: TradingInterfaceProps) {
  const { address } = useAccount()
  const [activeTab, setActiveTab] = useState<'market' | 'offers' | 'history'>('market')
  const [selectedTokens, setSelectedTokens] = useState<BackendToken[]>([])
  const [searchAddress, setSearchAddress] = useState('')
  const [offers, setOffers] = useState<TradingOffer[]>([])
  const [isCreatingOffer, setIsCreatingOffer] = useState(false)

  // Mock trading offers for demonstration
  const mockOffers: TradingOffer[] = [
    {
      id: '1',
      from: '0x1234...5678',
      to: address || '',
      offerTokens: userTokens.slice(0, 2),
      requestTokens: userTokens.slice(2, 4),
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 86400000),
    },
    {
      id: '2',
      from: address || '',
      to: '0x8765...4321',
      offerTokens: userTokens.slice(4, 6),
      requestTokens: userTokens.slice(6, 8),
      status: 'pending',
      createdAt: new Date(Date.now() - 7200000),
      expiresAt: new Date(Date.now() + 172800000),
    },
  ]

  const handleTokenSelect = useCallback((token: BackendToken) => {
    setSelectedTokens(prev => {
      const isSelected = prev.some(t => t.id === token.id)
      if (isSelected) {
        return prev.filter(t => t.id !== token.id)
      } else {
        return [...prev, token]
      }
    })
  }, [])

  const handleCreateOffer = useCallback(async () => {
    if (!searchAddress || selectedTokens.length === 0) return

    setIsCreatingOffer(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newOffer: TradingOffer = {
      id: Date.now().toString(),
      from: address || '',
      to: searchAddress,
      offerTokens: selectedTokens,
      requestTokens: [], // This would be set by the other user
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000), // 24 hours
    }

    setOffers(prev => [newOffer, ...prev])
    setSelectedTokens([])
    setSearchAddress('')
    setIsCreatingOffer(false)
    
    onTradeComplete?.()
  }, [address, searchAddress, selectedTokens, onTradeComplete])

  const handleAcceptOffer = useCallback(async (offerId: string) => {
    setOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'accepted' as const }
          : offer
      )
    )
    onTradeComplete?.()
  }, [onTradeComplete])

  const handleRejectOffer = useCallback(async (offerId: string) => {
    setOffers(prev => 
      prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'rejected' as const }
          : offer
      )
    )
  }, [])

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const formatTime = (date: Date) => date.toLocaleString()

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">NFT Trading Market</h2>
        <p className="text-gray-600">Trade your energy NFTs with other users</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'market', label: 'Market', icon: '🏪' },
          { id: 'offers', label: 'Offers', icon: '📋' },
          { id: 'history', label: 'History', icon: '📊' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            type="button"
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'market' && (
          <motion.div
            key="market"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Create Offer Section */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Create Trading Offer</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Select Tokens to Offer */}
                <div>
                  <div className="block text-sm font-medium mb-2">
                    Select Tokens to Offer ({selectedTokens.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {userTokens.map(token => (
                      <button
                        key={token.id}
                        onClick={() => handleTokenSelect(token)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleTokenSelect(token)
                          }
                        }}
                        className={`cursor-pointer transition-all border-0 bg-transparent p-0 ${
                          selectedTokens.some(t => t.id === token.id)
                            ? 'ring-2 ring-blue-500 scale-105'
                            : 'hover:scale-102'
                        }`}
                        type="button"
                      >
                        <EnhancedTokenCard
                          token={token}
                          viewMode="grid"
                          onViewDetails={() => {}}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trade Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="recipient-address" className="block text-sm font-medium mb-2">
                      Recipient Address
                    </label>
                    <input
                      id="recipient-address"
                      type="text"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="offer-message" className="block text-sm font-medium mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      id="offer-message"
                      placeholder="Add a message to your offer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleCreateOffer}
                    disabled={!searchAddress || selectedTokens.length === 0 || isCreatingOffer}
                    className="w-full btn btn-primary"
                    type="button"
                  >
                    {isCreatingOffer ? 'Creating Offer...' : 'Create Offer'}
                  </button>
                </div>
              </div>
            </div>

            {/* Market Listings */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Market Activity</h3>
              <div className="space-y-4">
                {mockOffers.filter(offer => offer.status === 'pending').map(offer => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          From: {formatAddress(offer.from)}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm text-gray-600">
                          To: {formatAddress(offer.to)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTime(offer.createdAt)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Offering:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {offer.offerTokens.map(token => (
                            <EnhancedTokenCard
                              key={token.id}
                              token={token}
                              viewMode="grid"
                              onViewDetails={() => {}}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Requesting:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {offer.requestTokens.map(token => (
                            <EnhancedTokenCard
                              key={token.id}
                              token={token}
                              viewMode="grid"
                              onViewDetails={() => {}}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'offers' && (
          <motion.div
            key="offers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">Your Trading Offers</h3>
            
            {offers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <p>No trading offers yet</p>
                <p className="text-sm">Create an offer in the Market tab</p>
              </div>
            ) : (
              offers.map(offer => (
                <div key={offer.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {offer.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {offer.to === address ? 'Incoming' : 'Outgoing'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTime(offer.createdAt)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Offering:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {offer.offerTokens.map(token => (
                          <EnhancedTokenCard
                            key={token.id}
                            token={token}
                            viewMode="grid"
                            onViewDetails={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Requesting:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {offer.requestTokens.map(token => (
                          <EnhancedTokenCard
                            key={token.id}
                            token={token}
                            viewMode="grid"
                            onViewDetails={() => {}}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {offer.status === 'pending' && offer.to === address && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="btn btn-primary text-sm"
                        type="button"
                      >
                        Accept Offer
                      </button>
                      <button
                        onClick={() => handleRejectOffer(offer.id)}
                        className="btn btn-outline text-sm"
                        type="button"
                      >
                        Reject Offer
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">Trading History</h3>
            
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>No trading history yet</p>
              <p className="text-sm">Complete your first trade to see history</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
