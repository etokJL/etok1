'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { type BackendToken } from '@/types'
import { EnhancedTokenCard } from '@/components/cards/enhanced-token-card'
import { BasicGrid } from '@/components/collection/basic-grid'
import { TokenDetailModal } from '@/components/cards/token-detail-modal'
import { AppNavigation } from '@/components/navigation/app-navigation'
import { TradingInterface } from '@/components/trading/trading-interface'
import { useContracts } from '@/hooks/useContracts'

interface NFT {
  id: number
  name: string
  emoji: string
  quantity: number
  rarity: string
}

export default function SimplePage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { questNFT, plantToken } = useContracts()
  
  const [activeTab, setActiveTab] = useState('collection')
  const [nfts, setNfts] = useState<NFT[]>([])
  const [tokens, setTokens] = useState<BackendToken[]>([])
  const [totalNFTs, setTotalNFTs] = useState(0)
  const [uniqueTypes, setUniqueTypes] = useState(0)
  const [plantsCreated, setPlantsCreated] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedToken, setSelectedToken] = useState<BackendToken | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const getEmojiForNFT = useCallback((name: string): string => {
    const emojiMap: Record<string, string> = {
      'Solar Panel': '☀️',
      'Wind Turbine': '💨',
      'Battery': '🔋',
      'Smart Home': '🏠',
      'E-Car': '🚗',
      'Heat Pump': '🌡️',
      'Smart Meter': '⚡',
      'E-Bike': '🚴',
      'Quest NFT Type 1': '⚡',
      'Quest NFT Type 2': '🌞',
      'Quest NFT Type 3': '💨',
      'Quest NFT Type 4': '🔋',
      'Quest NFT Type 5': '🏠',
      'Quest NFT Type 6': '🚗',
      'Quest NFT Type 7': '🌡️',
      'Quest NFT Type 8': '⚡',
      'Quest NFT Type 9': '🚴',
      'Quest NFT Type 10': '☀️',
      'Quest NFT Type 11': '💨',
      'Quest NFT Type 12': '🔋',
      'Quest NFT Type 13': '🏠',
      'Quest NFT Type 14': '🚗',
      'Quest NFT Type 15': '🌡️'
    }
    return emojiMap[name] || '⚡'
  }, [])

  const getRarityForNFT = useCallback((name: string, quantity: number): string => {
    if (quantity <= 1) return 'Legendary'
    if (quantity <= 3) return 'Epic'
    if (quantity <= 5) return 'Rare'
    if (quantity <= 10) return 'Uncommon'
    return 'Common'
  }, [])

  const setDemoData = useCallback(() => {
    const demoNFTs: NFT[] = [
      { id: 1, name: 'Solar Panel', emoji: '☀️', quantity: 3, rarity: 'Rare' },
      { id: 2, name: 'Wind Turbine', emoji: '💨', quantity: 2, rarity: 'Epic' },
      { id: 3, name: 'Battery', emoji: '🔋', quantity: 5, rarity: 'Uncommon' },
      { id: 4, name: 'Smart Home', emoji: '🏠', quantity: 1, rarity: 'Legendary' },
      { id: 5, name: 'E-Car', emoji: '🚗', quantity: 4, rarity: 'Rare' },
      { id: 6, name: 'Heat Pump', emoji: '🌡️', quantity: 2, rarity: 'Epic' },
      { id: 7, name: 'Smart Meter', emoji: '⚡', quantity: 8, rarity: 'Common' },
      { id: 8, name: 'E-Bike', emoji: '🚴', quantity: 3, rarity: 'Rare' }
    ]
    
    setNfts(demoNFTs)
    setTotalNFTs(demoNFTs.length)
    setUniqueTypes(demoNFTs.length)
    setPlantsCreated(2)
  }, [])

  useEffect(() => {
    if (!isConnected) {
      setDemoData()
    }
  }, [isConnected, setDemoData])

  const fetchBackendData = useCallback(async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8282/api/v1/users/${address}/tokens`)
      if (response.ok) {
        const tokens: BackendToken[] = await response.json()
        
        setTotalNFTs(tokens.length)
        
        const uniqueNames = new Set(tokens.map(token => token.name))
        setUniqueTypes(uniqueNames.size)
        
        const plantTokens = tokens.filter(token => token.token_type === 'erc1155')
        setPlantsCreated(plantTokens.length)
        
        const tokenGroups = tokens.reduce((groups, token) => {
          const name = token.name || `NFT Type ${token.token_id}`
          if (!groups[name]) {
            groups[name] = []
          }
          groups[name].push(token)
          return groups
        }, {} as Record<string, BackendToken[]>)
        
        const nftData: NFT[] = Object.entries(tokenGroups).map(([name, tokens], index) => ({
          id: index + 1,
          name: name,
          emoji: getEmojiForNFT(name),
          quantity: tokens.length,
          rarity: getRarityForNFT(name, tokens.length)
        }))
        
        setNfts(nftData)
        setTokens(tokens) // Store the raw tokens for the enhanced cards
      } else {
        console.error('Failed to fetch backend data')
        setDemoData()
      }
    } catch (error) {
      console.error('Error fetching backend data:', error)
      setDemoData()
    } finally {
      setLoading(false)
    }
  }, [address, setDemoData, getEmojiForNFT, getRarityForNFT])

  const handleTokenClick = useCallback((token: BackendToken) => {
    setSelectedToken(token)
    setShowDetailModal(true)
  }, [])

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false)
    setSelectedToken(null)
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      fetchBackendData()
    }
  }, [isConnected, address, fetchBackendData])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  if (!isConnected) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="w-full max-w-md">
          <div className="card">
            <div className="card-content">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔌</div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600">Choose your preferred wallet to access your NFT collection</p>
              </div>
              <div className="space-y-4">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className="btn btn-outline w-full"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {connector.name === 'MetaMask' ? '🦊' : 
                         connector.name === 'WalletConnect' ? '🔗' : 
                         connector.name === 'Coinbase Wallet' ? '🔵' : '💳'}
                      </div>
                      <span className="font-semibold">{connector.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
    >
      {!isConnected ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
            <button 
              onClick={() => connect({ connector: connectors[0] })}
              className="btn btn-primary"
              type="button"
            >
              Connect
            </button>
          </div>
        </div>
      ) : (
        <>
          <AppNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalNFTs={totalNFTs}
            uniqueTypes={uniqueTypes}
            plantsCreated={plantsCreated}
          />
          <div className="flex-grow w-full max-w-7xl mx-auto px-2 py-4">
            <AnimatePresence mode="wait">
              {activeTab === 'collection' && (
                <motion.div
                  key="collection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <BasicGrid
                    nfts={tokens.map(token => ({
                      tokenId: BigInt(token.token_id),
                      nftType: {
                        id: Number(token.token_id),
                        name: token.name || `NFT Type ${token.token_id}`,
                        description: `A ${token.token_type} token`,
                        energyType: 'Solar' as const,
                        rarity: getRarityForNFT(token.name || '', 1) as any,
                        image: `nft-${token.token_id}.png`
                      },
                      quantity: 1,
                      lastUpdated: new Date()
                    }))}
                    onNFTSelect={(nft) => {
                      const token = tokens.find(t => String(t.token_id) === String(nft.tokenId))
                      if (token) handleTokenClick(token)
                    }}
                  />
                </motion.div>
              )}
              {activeTab === 'trading' && (
                <motion.div
                  key="trading"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <TradingInterface
                    userTokens={tokens}
                    onTradeComplete={fetchBackendData}
                  />
                </motion.div>
              )}
              {activeTab === 'plants' && (
                <motion.div
                  key="plants"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4"
                >
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🌱</div>
                    <h2 className="text-xl font-semibold mb-2">Energy Plants</h2>
                    <p className="text-gray-600">Create and manage your energy plants</p>
                    <button 
                      className="btn btn-primary mt-4"
                      onClick={() => plantToken.createPlant([BigInt(1), BigInt(2), BigInt(3)], BigInt(1000))}
                      disabled={plantToken.isLoading}
                      type="button"
                    >
                      {plantToken.isLoading ? 'Creating...' : 'Create Energy Plant'}
                    </button>
                  </div>
                </motion.div>
              )}
              {activeTab === 'quests' && (
                <motion.div
                  key="quests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4"
                >
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">⚡</div>
                    <h2 className="text-xl font-semibold mb-2">Energy Quests</h2>
                    <p className="text-gray-600">Complete quests to earn more NFTs</p>
                    <button 
                      className="btn btn-primary mt-4"
                      onClick={() => questNFT.purchasePackage()}
                      disabled={questNFT.isLoading}
                      type="button"
                    >
                      {questNFT.isLoading ? 'Purchasing...' : 'Purchase Weekly Package'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
      <TokenDetailModal
        token={selectedToken}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
    </motion.div>
  )
}